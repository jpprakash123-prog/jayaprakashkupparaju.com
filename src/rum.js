import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { sanitizeTelemetryEnvelope, sanitizeUrl } from "./rum-policy.mjs";

const config = globalThis.__PERSONAL_SITE_RUM__;

if (config?.enabled === true) {
  const cutoffTime = Date.parse(config.cutoffUtc);
  const remainingMs = cutoffTime - Date.now();

  if (Number.isFinite(remainingMs) && remainingMs > 0) {
    const appInsights = new ApplicationInsights({
      config: {
        connectionString: config.connectionString,
        samplingPercentage: config.samplingPercentage,
        disableCookiesUsage: true,
        isStorageUseDisabled: true,
        enableSessionStorageBuffer: false,
        disableAjaxTracking: true,
        disableFetchTracking: true,
        enableAutoRouteTracking: false,
        enableUnhandledPromiseRejectionTracking: true,
      },
    });

    appInsights.loadAppInsights();

    appInsights.addTelemetryInitializer(sanitizeTelemetryEnvelope);

    appInsights.trackPageView({
      name: document.title,
      uri: sanitizeUrl(globalThis.location.href),
    });

    globalThis.setTimeout(() => {
      appInsights.unload(false);
    }, remainingMs);
  }
}
