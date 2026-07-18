import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "src", "generated");
const outFile = join(outDir, "version.json");

function safeExec(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

// 从环境变量或 git 获取基本信息
const branch =
  process.env.CF_PAGES_BRANCH ||
  process.env.GIT_BRANCH ||
  process.env.BRANCH ||
  safeExec("git rev-parse --abbrev-ref HEAD") ||
  "unknown";

const fullHash =
  process.env.CF_PAGES_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  safeExec("git rev-parse HEAD") ||
  "";

const shortHash = fullHash.slice(0, 7) || "unknown";

// 从 GitHub API 获取分支的 commit 数
async function getCommitCount(owner, repo, branch) {
  const headers = { "User-Agent": "stellar-build", Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1&sha=${branch}`;
  const res = await fetch(url, { headers });
  if (!res.ok) return null;

  const linkHeader = res.headers.get("Link");
  if (!linkHeader) return 1; // 没有分页 = 只有 1 个 commit

  // Link: <...?page=N>; rel="last"
  const match = linkHeader.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return match ? parseInt(match[1], 10) : 1;
}

// 从 GitHub API 获取最近 tag
async function getLatestTag(owner, repo) {
  const headers = { "User-Agent": "stellar-build", Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/tags?per_page=1`, { headers });
  if (!res.ok) return null;
  const tags = await res.json();
  return tags[0]?.name || null;
}

// 解析远程仓库
const remote = safeExec("git config --get remote.origin.url");
const match = remote.match(/github\.com[:/](.+?)\/(.+?)(?:\.git)?$/);

async function main() {
  let commitCount = 1;
  let tag = null;

  if (match) {
    const [, owner, repo] = match;
    commitCount = (await getCommitCount(owner, repo, branch)) || 1;
    if (branch === "main" || branch === "master") {
      tag = await getLatestTag(owner, repo);
    }
  }

  let version;
  let isDev;
  if (branch === "main" || branch === "master") {
    isDev = false;
    version = tag || `1.0.0-${commitCount}-g${shortHash}`;
  } else {
    isDev = true;
    version = `dev-${commitCount}-${shortHash}`;
  }

  const data = {
    version,
    branch,
    shortHash,
    fullHash,
    commitCount,
    isDev,
    buildTime: new Date().toISOString(),
  };

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify(data, null, 2) + "\n", "utf-8");

  console.log(`✓ ${version} (${branch}, ${commitCount} commits)`);
}

main().catch((err) => {
  console.error("generate-version error:", err.message);
  const fallback = {
    version: `dev-1-${shortHash}`,
    branch,
    shortHash,
    fullHash,
    commitCount: 1,
    isDev: true,
    buildTime: new Date().toISOString(),
  };
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify(fallback, null, 2) + "\n", "utf-8");
  process.exit(0);
});
