# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this learning platform. Session Replay, Error Tracking, and Support are enabled, and health, error, and support signal sources now feed the Self-driving inbox as data arrives.

Fresh scouts and Replay Vision scanners start being picked up within about 30 minutes. Findings will appear in the [Self-driving inbox](https://us.posthog.com/project/703824/inbox).

## AI data processing

Approved.

## GitHub

Connected before this setup run. No GitHub Issues responder was enabled because no external issue-tracker source was selected.

## Products enabled

| Product | Status | Notes |
| --- | --- | --- |
| Session Replay | enabled | Browser initialization has no `disable_session_recording` override. There are no recordings yet, so scanners are armed for future sessions. |
| Error Tracking | enabled | Browser initialization has `capture_exceptions: true`. |
| Support (Conversations) | enabled | A channel must still be connected before support tickets can arrive. |

## Signal sources

| Signal source | Action | Notes |
| --- | --- | --- |
| `health_checks` / `health_issue` | enabled | Reports actionable instrumentation and configuration health issues. |
| `error_tracking` / `issue_created` | enabled | Reports new error issues. |
| `error_tracking` / `issue_reopened` | enabled | Reports returning error issues. |
| `error_tracking` / `issue_spiking` | enabled | Reports emerging error spikes. |
| `conversations` / `ticket` | enabled | Dormant until an inbound Support channel is connected. |
| Scout gate | on by default | No opt-out row exists, so scout reports can reach the inbox. |
| Session Replay source | skipped by design | Replay Vision scanners are the only configured route for replay findings. |
| Logs | skipped | No evidence that the Logs product is in use. |
| Endpoints | skipped | Endpoint availability could not be verified with this connection. |

## Connected tools

No optional external tools were selected. GitHub Issues, Linear, Jira, Sentry, and Zendesk were not enabled as responders.

## Scout troop

### Enabled

| Scout | What it watches |
| --- | --- |
| `signals-scout-general` | Cross-product patterns and surfaces without a specialist. |
| `signals-scout-product-analytics` | Learner engagement flows and conversion changes. |
| `signals-scout-web-analytics` | Web traffic, attribution, and landing-page health. |
| `signals-scout-observability-gaps` | Important event activity without insight, dashboard, or alert coverage. |
| `signals-scout-inbox-validation` | Operational follow-up checks on resolved Self-driving reports; kept on by the system outside the troop ceiling. |

### Disabled

The following 24 built-in scouts remain disabled because their surfaces are not among the project's evidenced primary surfaces, are routed through another configured path, or lack evidence of current use:

- Routed elsewhere: `signals-scout-error-tracking` (native Error Tracking source) and `signals-scout-session-replay` (Replay Vision scanners).
- No current evidence of use: `signals-scout-ai-observability`, `signals-scout-apm`, `signals-scout-conversations`, `signals-scout-csp-violations`, `signals-scout-customer-analytics`, `signals-scout-data-pipelines`, `signals-scout-data-warehouse`, `signals-scout-experiments`, `signals-scout-feature-flags`, `signals-scout-insight-alerts`, `signals-scout-logs`, `signals-scout-mcp-tool-calls`, `signals-scout-revenue-analytics`, `signals-scout-skills-store`, `signals-scout-surveys`, `signals-scout-tasks`, `signals-scout-web-vitals`, and `signals-scout-workflows`.
- Not selected for the focused baseline: `signals-scout-anomaly-detection`, `signals-scout-pr-follow-up`, `signals-scout-replay-vision`, and `signals-scout-unused-features`.

**Capacity and budget:** 100 maximum runs per day, 0 used today, 100 remaining; the project can enable up to 250 scouts. One operational scout consumes a slot, leaving 249 non-operational slots available. The configured troop uses four active non-operational scouts.

> Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.

## Custom scouts

No custom scouts were created. A course-discovery monitor was proposed to watch for learners exploring course modules but failing to select lessons; it was declined.

The core course discovery-to-lesson-selection flow is watchable from `components/course/course-content.tsx`, but the custom check was not authorized. Authentication clicks and course bookmarks were considered but ruled out because the current event contract does not include a corresponding successful outcome, so they do not yet provide a reliable signal-versus-noise discriminator.

If a future custom scout becomes noisy, set `emit: false` on its config in PostHog to keep it running in dry-run mode without writing to the inbox.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes qualifying observations to the inbox. These are the only components in this setup that spend Replay Vision quota. Findings arrive at half weight and require independent corroboration before promotion into a report.

| Scanner | Status | Watches | Query scope | Sampling | Estimated monthly spend |
| --- | --- | --- | --- | --- | --- |
| Course learning flow breakage | created | Visible breakage while learners browse courses, open a course, reveal lessons, and select a lesson. | URLs containing `/courses`; this is the app's course-catalog and course-detail learning flow. | 50% | 0 observations / 0 credits at current traffic. |
| Learning flow frustration | created | Clear visible struggle while learners navigate the learning experience. | Sessions containing `$rageclick` only; intentionally separate from the URL-scoped monitor. | 100% | 0 observations / 0 credits at current traffic. |

Replay Vision has 2,500 credits available for the current period and is not exhausted. There are no recordings yet, so both scanners are armed and begin working as soon as replay sessions arrive. Rate early scanner observations in Replay Vision with thumbs-up or thumbs-down and a short note to improve their prompts.

## Follow-ups

- [ ] Configure `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in a real project environment file. The client code reads these variables, but neither is currently set in the repository environment; browser events and recordings cannot arrive until they are configured.
- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog. The Support responder is enabled and will begin reporting tickets automatically once the channel receives them.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Scout runs draw from the project's daily budget, and findings cluster into reports in the Self-driving inbox. Immediately actionable findings can begin coding tasks.

## Files modified or created

- Created `posthog-self-driving-report.md`.
- No existing application source files were modified.
