import "server-only";

import { SeverityNumber, type AnyValueMap } from "@opentelemetry/api-logs";
import { posthogLoggerProvider } from "@/instrumentation";

const logger = posthogLoggerProvider?.getLogger("learning-platform-content");

export async function logContentOperation({
  body,
  severityNumber = SeverityNumber.INFO,
  attributes,
}: {
  body: string;
  severityNumber?: SeverityNumber;
  attributes: AnyValueMap;
}) {
  if (!logger || !posthogLoggerProvider) {
    return;
  }

  logger.emit({
    body,
    severityNumber,
    attributes,
  });
  await posthogLoggerProvider.forceFlush();
}

export { SeverityNumber };
