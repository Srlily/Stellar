import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "src", "generated");
const OUTPUT_FILE = join(OUTPUT_DIR, "version.json");

// ---------- shell helpers ----------

function exec(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function execGit(...args) {
  return exec(`git ${args.join(" ")}`);
}

// ---------- env / git readers ----------

function readBranch() {
  return (
    process.env.CF_PAGES_BRANCH ||
    process.env.GIT_BRANCH ||
    execGit("rev-parse", "--abbrev-ref", "HEAD") ||
    "unknown"
  );
}

function readCommitHash() {
  const hash =
    process.env.CF_PAGES_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    execGit("rev-parse", "HEAD");
  return hash || "";
}

function parseRepo(remoteUrl) {
  if (!remoteUrl) return null;
  const m = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
  return m ? { owner: m[1], repo: m[2] } : null;
}

// ---------- github api ----------

function githubHeaders() {
  const headers = {
    "User-Agent": "stellar-build",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchLatestTag(owner, repo) {
  try {
    const res = await fetchWithTimeout(
      `https://api.github.com/repos/${owner}/${repo}/tags?per_page=1`,
      { headers: githubHeaders() }
    );
    if (!res.ok) return null;
    const tags = await res.json();
    return tags[0]?.name ?? null;
  } catch {
    return null;
  }
}

// ---------- version builders ----------

function buildDevVersion(shortHash) {
  return `dev-${shortHash}`;
}

function buildMainVersion(tag, shortHash) {
  return tag || `1.0.0-${shortHash}`;
}

// ---------- pipeline ----------

async function generate() {
  const branch = readBranch();
  const fullHash = readCommitHash();
  const shortHash = fullHash.slice(0, 7) || "unknown";

  const isMain = branch === "main" || branch === "master";
  const repo = parseRepo(execGit("config", "--get", "remote.origin.url"));
  const tag = isMain && repo ? await fetchLatestTag(repo.owner, repo.repo) : null;

  const version = isMain ? buildMainVersion(tag, shortHash) : buildDevVersion(shortHash);

  return {
    version,
    branch,
    shortHash,
    fullHash,
    isDev: !isMain,
    buildTime: new Date().toISOString(),
  };
}

function writeVersionFile(data) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function fallbackData() {
  return {
    version: `dev-unknown`,
    branch: readBranch(),
    shortHash: readCommitHash().slice(0, 7) || "unknown",
    fullHash: readCommitHash(),
    isDev: true,
    buildTime: new Date().toISOString(),
  };
}

// ---------- entry ----------

main()
  .then((data) => {
    writeVersionFile(data);
    console.log(`✓ ${data.version} (${data.branch})`);
  })
  .catch((err) => {
    console.error("generate-version failed:", err.message);
    writeVersionFile(fallbackData());
    process.exit(0); // 不阻塞构建
  });

async function main() {
  return generate();
}
