import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const trackedFiles = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean);

const patterns = [
  [
    "private key",
    new RegExp("-----BEGIN " + "(?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
  ],
  ["GitHub token", /\bgh[opusr]_[A-Za-z0-9_]{20,}\b/],
  ["email address", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i],
  [
    "credential assignment",
    /\b(?:password|passwd|client[_-]?secret|api[_-]?key|deployment[_-]?token)\s*[:=]\s*["']?(?!<|\$\{\{)[A-Za-z0-9+/_.-]{12,}/i,
  ],
  [
    "Azure Storage connection string",
    /DefaultEndpointsProtocol=https?;AccountName=[^;]+;AccountKey=[^;]+/i,
  ],
];

const findings = [];

for (const file of trackedFiles) {
  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  if (content.includes("\0")) continue;

  for (const [label, pattern] of patterns) {
    // Lockfiles can contain public package-maintainer metadata from the npm
    // registry. Continue scanning them for credentials, but do not treat those
    // upstream contact addresses as repository-owned personal information.
    if (label === "email address" && file.endsWith("package-lock.json")) {
      continue;
    }

    if (pattern.test(content)) findings.push(`${file}: possible ${label}`);
  }
}

if (findings.length > 0) {
  console.error("Sensitive-data check failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Sensitive-data check passed.");
