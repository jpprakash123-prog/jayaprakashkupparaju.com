import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const generatorPath = path.join(
  repositoryRoot,
  "scripts",
  "write-deployment-info.mjs",
);
const validCommit = "0123456789abcdef0123456789abcdef01234567";

test("deployment metadata identifies the deployed content", async () => {
  const outputDirectory = await mkdtemp(
    path.join(tmpdir(), "deployment-info-test-"),
  );

  try {
    execFileSync(process.execPath, [generatorPath], {
      cwd: repositoryRoot,
      env: {
        ...process.env,
        DEPLOYMENT_COMMIT: validCommit,
        DEPLOYMENT_TYPE: "rollback",
        DEPLOYMENT_OUTPUT_DIRECTORY: outputDirectory,
        GITHUB_RUN_ID: "123456789",
      },
      stdio: "pipe",
    });

    const deploymentInfo = JSON.parse(
      await readFile(
        path.join(outputDirectory, "deployment-info.json"),
        "utf8",
      ),
    );

    assert.equal(deploymentInfo.schema_version, 1);
    assert.equal(deploymentInfo.content_commit, validCommit);
    assert.equal(deploymentInfo.content_commit_short, validCommit.slice(0, 7));
    assert.equal(deploymentInfo.deployment_type, "rollback");
    assert.equal(deploymentInfo.workflow_run_id, "123456789");
    assert.match(deploymentInfo.deployed_at_utc, /^\d{4}-\d{2}-\d{2}T/);
    assert.match(deploymentInfo.deployed_at_central, /^[A-Za-z]+,.* C[DS]T$/);
  } finally {
    await rm(outputDirectory, { recursive: true, force: true });
  }
});

test("deployment metadata rejects a malformed commit", () => {
  assert.throws(() =>
    execFileSync(process.execPath, [generatorPath], {
      cwd: repositoryRoot,
      env: {
        ...process.env,
        DEPLOYMENT_COMMIT: "not-a-commit",
        DEPLOYMENT_TYPE: "production",
        DEPLOYMENT_OUTPUT_DIRECTORY: tmpdir(),
        GITHUB_RUN_ID: "123456789",
      },
      stdio: "pipe",
    }),
  );
});
