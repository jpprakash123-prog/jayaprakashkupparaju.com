import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createRumBuildConfig,
  sanitizeTelemetryEnvelope,
  sanitizeTelemetryText,
  sanitizeUrl,
} from "../src/rum-policy.mjs";

const fixedNow = new Date("2026-09-10T20:00:00.000Z");

test("RUM is disabled by default", () => {
  assert.deepEqual(createRumBuildConfig({}, fixedNow), { enabled: false });
});

test("RUM accepts a privacy-controlled two-hour production exercise", () => {
  const config = createRumBuildConfig(
    {
      RUM_REQUIRED: "true",
      RUM_CONNECTION_STRING: "InstrumentationKey=example",
      RUM_CUTOFF_UTC: "2026-09-10T22:00:00.000Z",
    },
    fixedNow,
  );

  assert.equal(config.enabled, true);
  assert.equal(config.samplingPercentage, 10);
  assert.equal(config.cutoffUtc, "2026-09-10T22:00:00.000Z");
});

test("RUM rejects expired and excessive exercise windows", () => {
  const base = {
    RUM_REQUIRED: "true",
    RUM_CONNECTION_STRING: "InstrumentationKey=example",
  };

  assert.throws(
    () =>
      createRumBuildConfig(
        { ...base, RUM_CUTOFF_UTC: "2026-09-10T19:59:59.000Z" },
        fixedNow,
      ),
    /future/,
  );
  assert.throws(
    () =>
      createRumBuildConfig(
        { ...base, RUM_CUTOFF_UTC: "2026-09-11T00:30:00.000Z" },
        fixedNow,
      ),
    /two-hour/,
  );
});

test("RUM removes URL query strings and fragments", () => {
  assert.equal(
    sanitizeUrl("https://example.com/path?email=private#section"),
    "https://example.com/path",
  );
  assert.equal(
    sanitizeTelemetryText(
      "Failed at https://example.com/path?email=private#section",
    ),
    "Failed at https://example.com/path",
  );
});

test("RUM removes user identity fields from telemetry envelopes", () => {
  const envelope = {
    baseData: {
      uri: "https://example.com/path?email=private#section",
      refUri: "https://referrer.example/from?token=private",
    },
    ext: { user: { id: "visitor", authId: "person", localId: "browser" } },
    tags: {
      "ai.user.id": "visitor",
      "ai.user.authUserId": "person",
      "ai.user.accountId": "account",
    },
  };

  assert.equal(sanitizeTelemetryEnvelope(envelope), true);
  assert.equal(envelope.baseData.uri, "https://example.com/path");
  assert.equal(envelope.baseData.refUri, "https://referrer.example/from");
  assert.deepEqual(envelope.ext.user, {});
  assert.deepEqual(envelope.tags, {});
});

test("browser policy disables identity persistence and dependency tracking", () => {
  const source = readFileSync("src/rum.js", "utf8");

  assert.match(source, /disableCookiesUsage: true/);
  assert.match(source, /isStorageUseDisabled: true/);
  assert.match(source, /disableAjaxTracking: true/);
  assert.match(source, /disableFetchTracking: true/);
  assert.doesNotMatch(source, /setAuthenticatedUserContext/);
  assert.doesNotMatch(source, /ClickAnalytics/);
});
