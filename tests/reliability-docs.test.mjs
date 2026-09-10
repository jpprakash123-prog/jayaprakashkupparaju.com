import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const slo = readFileSync("docs/slo.md", "utf8");
const policy = readFileSync("docs/error-budget-policy.md", "utf8");

test("SLO documentation defines measurable initial objectives", () => {
  assert.match(slo, /Availability \|.*99\.9%/);
  assert.match(slo, /Latency \|.*95%/);
  assert.match(slo, /Synthetic error rate \|.*1%/);
  assert.match(slo, /AppAvailabilityResults/);
  assert.match(slo, /LatencyCompliancePercent/);
  assert.match(slo, /SyntheticErrorRatePercent/);
});

test("SLO documentation records evidence and its limitations", () => {
  assert.match(slo, /Valid checks \| 10/);
  assert.match(slo, /Latency compliance \| 70%/);
  assert.match(slo, /cannot prove a\s+continuous 30-day SLO/);
  assert.match(slo, /no evidence, not 100% reliability/);
});

test("error-budget policy connects reliability to release decisions", () => {
  assert.match(policy, /43 minutes and 12 seconds/);
  assert.match(policy, /Stop nonessential production releases/);
  assert.match(policy, /production approval gate/);
  assert.match(policy, /annual Azure project budget remains less than \$10 USD/);
});
