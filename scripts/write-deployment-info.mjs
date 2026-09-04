import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const commit = process.env.DEPLOYMENT_COMMIT ?? "";
const deploymentType = process.env.DEPLOYMENT_TYPE ?? "";
const workflowRunId = process.env.GITHUB_RUN_ID ?? "";
const outputDirectory = process.env.DEPLOYMENT_OUTPUT_DIRECTORY ?? "dist";

if (!/^[0-9a-f]{40}$/i.test(commit)) {
  throw new Error(
    "DEPLOYMENT_COMMIT must be an exact 40-character commit SHA.",
  );
}

if (!new Set(["preview", "production", "rollback"]).has(deploymentType)) {
  throw new Error("DEPLOYMENT_TYPE must be preview, production, or rollback.");
}

if (!/^\d+$/.test(workflowRunId)) {
  throw new Error("GITHUB_RUN_ID must contain only digits.");
}

const deployedAt = new Date();
const deploymentInfo = {
  schema_version: 1,
  content_commit: commit.toLowerCase(),
  content_commit_short: commit.slice(0, 7).toLowerCase(),
  deployment_type: deploymentType,
  workflow_run_id: workflowRunId,
  deployed_at_utc: deployedAt.toISOString(),
  deployed_at_central: new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "full",
    timeStyle: "long",
  }).format(deployedAt),
};

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "deployment-info.json"),
  `${JSON.stringify(deploymentInfo, null, 2)}\n`,
  "utf8",
);

console.log("Generated deployment-info.json.");
