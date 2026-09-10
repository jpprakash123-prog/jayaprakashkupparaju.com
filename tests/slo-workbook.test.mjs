import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workbookSource = readFileSync(
  "infrastructure/monitoring/slo-workbook.json",
  "utf8",
);
const workbook = JSON.parse(workbookSource);
const bicep = readFileSync(
  "infrastructure/monitoring/slo-workbook.bicep",
  "utf8",
);
const queries = workbook.items.filter((item) => item.type === 3);

test("SLO workbook has the expected operational views", () => {
  assert.equal(workbook.version, "Notebook/1.0");
  assert.equal(queries.length, 5);
  assert.match(workbookSource, /Measurement coverage/);
  assert.match(workbookSource, /SLO evaluation/);
  assert.match(workbookSource, /Latency percentiles/);
  assert.match(workbookSource, /Availability error budget/);
  assert.match(workbookSource, /Observed daily availability/);
});

test("SLO workbook treats missing telemetry as unknown", () => {
  assert.match(workbookSource, /UNKNOWN — no observations/);
  assert.match(workbookSource, /Missing observations are \*\*unknown/);
  assert.doesNotMatch(workbookSource, /no observations.{0,40}100%/i);
});

test("SLO workbook is isolated from existing monitoring resources", () => {
  assert.match(bicep, /workspaces@2023-09-01' existing/);
  assert.match(bicep, /loadTextContent\('slo-workbook\.json'\)/);
  assert.match(bicep, /__WORKSPACE_RESOURCE_ID__/);
  assert.doesNotMatch(bicep, /Microsoft\.Insights\/webTests/);
  assert.doesNotMatch(bicep, /Microsoft\.Insights\/actionGroups/);
  assert.doesNotMatch(bicep, /roleAssignments/);
});
