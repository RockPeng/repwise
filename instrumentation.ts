import { logs } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

function createLoggerProvider() {
  const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (process.env.NODE_ENV === "development") {
    if (!posthogToken) {
      throw new Error(
        "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      );
    }

    if (!posthogHost) {
      throw new Error(
        "NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured",
      );
    }
  }

  if (!posthogToken || !posthogHost) {
    return null;
  }

  return new LoggerProvider({
    resource: resourceFromAttributes({
      "service.name": "learning-platform",
      "deployment.environment": process.env.NODE_ENV,
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL("/i/v1/logs", posthogHost).toString(),
          headers: {
            Authorization: `Bearer ${posthogToken}`,
            "Content-Type": "application/json",
          },
        }),
      }),
    ],
  });
}

export const posthogLoggerProvider = createLoggerProvider();

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && posthogLoggerProvider) {
    logs.setGlobalLoggerProvider(posthogLoggerProvider);
  }
}
