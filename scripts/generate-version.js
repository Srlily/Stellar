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

// 优先从环境变量读取（CI/CD 注入），回退到 git 命令
const branch =
  process.env.CF_PAGES_BRANCH ||
  process.env.GIT_BRANCH ||
  process.env.BRANCH ||
  safeExec("git rev-parse --abbrev-ref HEAD") ||
  "unknown";

// CF Pages / Vercel / Netlify 通用环境变量
const shortHash =
  process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ||
  process.env.COMMIT_REF?.slice(0, 7) ||
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
  process.env.GITHUB_SHA?.slice(0, 7) ||
  safeExec("git rev-parse --short HEAD") ||
  "unknown";

// commit 数：在浅克隆下可能不准，做个保底
let commitCount =
  parseInt(safeExec("git rev-list --count HEAD") || "0", 10);

if (!commitCount || commitCount < 1) {
  // 尝试用环境变量或默认值
  commitCount = parseInt(process.env.COMMIT_COUNT || "0", 10) || 1;
}

const commitTime =
  process.env.CF_PAGES_COMMIT_SHORT_SHA || // CF Pages 没时间
  safeExec("git log -1 --format=%cd --date=short");

let version;
let isDev;

if (branch === "main" || branch === "master") {
  isDev = false;
  const tag = safeExec("git describe --tags --abbrev=0");
  version = tag || `1.0.0-${commitCount}-g${shortHash}`;
} else {
  isDev = true;
  version = `dev-${commitCount}-${shortHash}`;
}

const data = {
  version,
  branch,
  shortHash,
  commitCount,
  commitTime,
  isDev,
  buildTime: new Date().toISOString(),
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(data, null, 2) + "\n", "utf-8");

console.log(`✓ Generated ${outFile}: ${version} (${branch})`);
