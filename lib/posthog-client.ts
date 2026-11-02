import posthog from "posthog-js";

export function capturePostHogEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | null>,
) {
  if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
    posthog.capture(eventName, properties);
  }
}
