const MAX_EXERCISE_DURATION_MS = 2 * 60 * 60 * 1000;
const CLOCK_SKEW_ALLOWANCE_MS = 5 * 60 * 1000;

export function sanitizeUrl(
  value,
  baseUrl = "https://jayaprakashkupparaju.com",
) {
  try {
    const url = new URL(value, baseUrl);
    return `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
}

export function sanitizeTelemetryText(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(/https?:\/\/[^\s)\]"']+/g, (candidate) => {
    return sanitizeUrl(candidate) ?? "[invalid-url]";
  });
}

export function sanitizeTelemetryEnvelope(envelope) {
  const baseData = envelope.baseData;

  if (baseData?.uri) {
    baseData.uri = sanitizeUrl(baseData.uri);
  }
  if (baseData?.refUri) {
    baseData.refUri = sanitizeUrl(baseData.refUri);
  }
  if (baseData?.message) {
    baseData.message = sanitizeTelemetryText(baseData.message);
  }

  if (Array.isArray(baseData?.exceptions)) {
    for (const exception of baseData.exceptions) {
      exception.message = sanitizeTelemetryText(exception.message);
      exception.stack = sanitizeTelemetryText(exception.stack);
    }
  }

  if (envelope.ext?.user) {
    delete envelope.ext.user.id;
    delete envelope.ext.user.authId;
    delete envelope.ext.user.localId;
  }

  const tags = envelope.tags;
  if (tags && !Array.isArray(tags)) {
    delete tags["ai.user.id"];
    delete tags["ai.user.authUserId"];
    delete tags["ai.user.accountId"];
  }

  return true;
}

export function createRumBuildConfig(environment, now = new Date()) {
  const connectionString = environment.RUM_CONNECTION_STRING?.trim() ?? "";
  const cutoffUtc = environment.RUM_CUTOFF_UTC?.trim() ?? "";
  const required = environment.RUM_REQUIRED === "true";

  if (!connectionString && !cutoffUtc && !required) {
    return Object.freeze({ enabled: false });
  }

  if (!connectionString.includes("InstrumentationKey=")) {
    throw new Error("RUM_CONNECTION_STRING is missing or malformed.");
  }

  const cutoffTime = Date.parse(cutoffUtc);
  if (!Number.isFinite(cutoffTime)) {
    throw new Error("RUM_CUTOFF_UTC must be a valid ISO 8601 timestamp.");
  }

  const remainingMs = cutoffTime - now.getTime();
  if (remainingMs <= 0) {
    throw new Error("RUM_CUTOFF_UTC must be in the future.");
  }

  if (remainingMs > MAX_EXERCISE_DURATION_MS + CLOCK_SKEW_ALLOWANCE_MS) {
    throw new Error(
      "RUM_CUTOFF_UTC cannot exceed the two-hour exercise window.",
    );
  }

  return Object.freeze({
    enabled: true,
    connectionString,
    cutoffUtc: new Date(cutoffTime).toISOString(),
    samplingPercentage: 10,
  });
}

export { MAX_EXERCISE_DURATION_MS };
