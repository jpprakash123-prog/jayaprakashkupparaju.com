import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const deploymentWorkflow = readFileSync(
  ".github/workflows/azure-static-web-apps.yml",
  "utf8",
);
const rollbackWorkflow = readFileSync(
  ".github/workflows/emergency-rollback.yml",
  "utf8",
);

test("RUM configuration is limited to the protected production job", () => {
  const productionStart = deploymentWorkflow.indexOf("  deploy_production:");
  const previewSection = deploymentWorkflow.slice(0, productionStart);
  const productionSection = deploymentWorkflow.slice(productionStart);

  assert.ok(productionStart > 0);
  assert.doesNotMatch(previewSection, /RUM_CONNECTION_STRING/);
  assert.match(productionSection, /environment: PROD/);
  assert.match(productionSection, /RUM_REQUIRED: "true"/);
  assert.match(
    productionSection,
    /secrets\.APPLICATIONINSIGHTS_CONNECTION_STRING/,
  );
  assert.match(productionSection, /date -u -d '\+2 hours'/);
});

test("emergency rollback keeps browser telemetry disabled", () => {
  assert.doesNotMatch(rollbackWorkflow, /RUM_CONNECTION_STRING/);
  assert.doesNotMatch(rollbackWorkflow, /RUM_REQUIRED/);
});
