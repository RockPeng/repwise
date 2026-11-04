# FitCoach — Personal Training & Coaching Marketplace — Design

Date: 2026-11-03
Status: approved (spec approved in chat, 2026-11-03)
Supersedes: nothing. Replaces the habit tracker app in this repo.
Working name: **FitCoach** (placeholder — rename freely)

## Purpose

A full-stack marketplace where people find personal trainers, buy workout programs,
watch video lessons, chat with their trainer and book private one-on-one coaching
sessions. Trainers get a dashboard for their clients, their programs and their
earnings.

The deliverable is a **1–2 hour YouTube tutorial** — build-along format, vertical
slices, with every integration real (test mode where a sandbox is required). The
scope rule is the **"thinnest real slice"**: nothing is mocked, but polish, edge cases
and non-happy-path variants that won't show on camera are deliberately left out.

## Constraints

- All accounts (Neon, Stripe, Stream, ImageKit, Sentry, Cloudways) are provisioned
  with test credentials.
- Single Cloudways Node instance. No Redis, no queue, no cron, no workers.
- Demo scale: hundreds of users.
- No email service. Notifications are in-app only.
- No admin role, no reviews, no subscriptions, no groups in v1.
- Self-hosted on Cloudways — not Vercel. This drives the caching model, the DB driver
  and the proxy configuration.

## Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router, React 19, TypeScript, Turbopack | next 16.4.4, react 19.3.0 |
| Styling | Tailwind CSS v4 + shadcn/ui, custom premium theme, dark mode | tailwindcss 4 |
| Database | Neon Postgres (Launch/Scale plan) | — |
| ORM | Drizzle ORM, `pg` Pool via `drizzle-orm/node-postgres` | drizzle-orm 0.45.x (stable, **not** the 1.0 RC) |
| Auth | Managed Better Auth — `@neon/auth` | 0.8.2 |
| Real-time | SSE route handlers (`text/event-stream`) | — |
| Payments | Stripe Checkout + Connect Express (destination charges) | stripe 23.1.0, API `2026-10-28.endive` |
| Chat | `stream-chat-react` + `stream-chat` | 14.14.1 (pin `^14.14.1`), 9.54.4 |
| Video | `@stream-io/video-react-sdk` | 1.45.1 (v2 is beta — not used) |
| Media | `@imagekit/next` + `@imagekit/nodejs` | 2.1.6, 7.14.0 |
| Monitoring | Sentry — errors + performance monitoring + source maps | — |
| Hosting | Cloudways (Node.js app), `next start` behind nginx | Node 22/24 |
| Tests | Vitest + React Testing Library, Playwright | — |

### Reusable from the previous app

`lib/theme.ts` (theme store over `useSyncExternalStore`, server snapshot `"system"`),
`components/InlineScript.tsx` (no-flash-before-hydration script) and the `dark:`
variant redefined against `<html data-theme>` in `app/globals.css` carry over as-is.
The new premium theme layers on top of that mechanism.

## Users & scope

**Members** browse trainers and programs, purchase a program, watch lessons and track
progress, chat with a trainer, book and pay for 1:1 coaching sessions.
**Trainers** have a public profile, a program catalog, their own pricing, weekly
availability rules, a connected Stripe account, and a dashboard for clients, programs
and earnings.

| Flow | Real | Deliberately out of v1 |
|---|---|---|
| Marketplace → buy → watch | Trainer directory, trainer profile, program page, Stripe Checkout, ImageKit HLS player, purchase + progress tracking | Search/filters, reviews, wishlists, bundles |
| Chat + 1:1 video call | Stream chat with reactions/replies/threads, Stream 1:1 video call launched from a conversation | Attachments, typing indicators, read receipts, calling from the messages list |
| Book a session + pay | Weekly availability rules → materialized slot rows → member picks a slot → Stripe Checkout → booking in both dashboards | Calendar sync, timezone conversion, rescheduling, accept/decline, availability exceptions |
| Trainer dashboard | Client list, program CRUD, lesson upload, availability rules, earnings totals, Connect onboarding, real Stripe balance + payout history | Tax reporting, commission statements, coupons, in-app refunds |

## Data model

Managed Better Auth owns the `neon_auth` schema (`user`, `session`, `account`,
`verification`); we never touch those tables. Everything below keys off `user_id`.

### Identity
- **`profiles`** — `user_id` PK → neon auth users, `display_name`, `avatar_url`,
  `role` (`member` | `trainer`), `created_at`
- **`trainer_profiles`** — `user_id` PK → profiles, `headline`, `bio`, `specialties`
  (text[]), `location`, `years_experience`, `session_price_cents`,
  `session_duration_min`, `platform_fee_bps` (default 2000 = 20%),
  `stripe_account_id`, `stripe_charges_enabled`, `stripe_payouts_enabled`, `created_at`

### Catalog
- **`programs`** — `id` uuid PK, `trainer_id` FK, `title`, `slug` unique, `summary`,
  `description`, `cover_image_url`, `price_cents`, `difficulty`, `duration_weeks`,
  `status` (`draft` | `published`), timestamps
- **`program_modules`** — `id`, `program_id` FK (cascade), `title`, `position`
- **`lessons`** — `id`, `module_id` FK (cascade), `title`, `description`,
  `imagekit_file_id`, `imagekit_url`, `duration_sec`, `position`, `is_preview`

### Commerce
- **`orders`** — `id`, `user_id`, `program_id`, `trainer_id`, `amount_cents`,
  `platform_fee_cents`, `trainer_net_cents`, `stripe_checkout_session_id` unique,
  `stripe_payment_intent_id`, `status` (`pending`|`paid`|`refunded`|`failed`), `paid_at`
- **`enrollments`** — `id`, `user_id`, `program_id`, `order_id` FK, unique(user_id, program_id).
  Access is deliberately separate from money so v2 subscriptions can grant access
  without an order.
- **`lesson_progress`** — `id`, `enrollment_id` FK, `lesson_id` FK, `completed`,
  `last_position_sec`, updated_at, unique(enrollment_id, lesson_id)

### Coaching
- **`availability_rules`** — `id`, `trainer_id`, `weekday` (0–6), `start_time`,
  `end_time`, `duration_min`, `active`
- **`slots`** — `id`, `trainer_id`, `starts_at`, `ends_at`, `status`
  (`open`|`booked`|`blocked`), unique(trainer_id, starts_at) ← the double-booking guard
- **`bookings`** — `id`, `slot_id` FK unique, `user_id`, `trainer_id`, `status`
  (`pending_payment`|`confirmed`|`completed`|`cancelled`), `price_cents`,
  `stripe_checkout_session_id` unique, timestamps

### Messaging, notifications, infrastructure
- **`conversations`** — `id`, `stream_channel_id` unique, `member_user_id`, `trainer_id`,
  `program_id` nullable, `last_message_at`. **Metadata only** — Stream owns the messages.
- **`notifications`** — `id`, `user_id`, `type`, `title`, `body`, `link`, `read_at`, `created_at`
- **`stripe_events`** — `id` (Stripe event id) PK, `type`, `processed_at` ← webhook idempotency

### Earnings — computed, not stored

Aggregated from `orders` + `bookings`: `gross = SUM(amount_cents)`,
`platform_fee = SUM(platform_fee_cents)`, `net = gross − fee`. A `charge.refunded`
webhook flips `orders.status` to `refunded`, so the aggregates self-correct. The
trainer's Payouts page additionally shows the **real** Connect account balance and
payout history from Stripe — the honest integration proof, and the best on-camera
moment in the app.

### v2 headroom (explicitly not blocked)

Reviews & ratings, subscriptions/memberships, client workout logging, group cohorts.
`enrollments` (separate from `orders`), `trainer_profiles.platform_fee_bps`,
`conversations.program_id` and the `notifications` table all leave room for these
without a breaking migration.

## Pages & routing

```
app/(marketing)/page.tsx                  /                      SEO
app/(marketing)/trainers/page.tsx         /trainers              SEO
app/(marketing)/trainers/[id]/page.tsx    /trainers/[id]         SEO
app/(marketing)/programs/[id]/page.tsx    /programs/[id]         SEO
app/(auth)/login/page.tsx                 /login
app/(auth)/signup/page.tsx                /signup
app/(member)/dashboard/page.tsx           /dashboard
app/(member)/learn/[programId]/page.tsx   /learn/[programId]
app/(member)/messages/page.tsx            /messages
app/(member)/messages/[id]/page.tsx       /messages/[id]          chat + video call
app/(member)/book/[trainerId]/page.tsx    /book/[trainerId]
app/(checkout)/success/page.tsx           /checkout/success
app/(trainer)/trainer/page.tsx            /trainer                overview + earnings
app/(trainer)/trainer/clients/page.tsx    /trainer/clients
app/(trainer)/trainer/programs/page.tsx   /trainer/programs
app/(trainer)/trainer/programs/new/page.tsx
app/(trainer)/trainer/programs/[id]/page.tsx
app/(trainer)/trainer/schedule/page.tsx   /trainer/schedule       availability rules
app/(trainer)/trainer/earnings/page.tsx   /trainer/earnings
app/(trainer)/trainer/payouts/page.tsx    /trainer/payouts        Connect onboarding + balance
app/api/webhooks/stripe/route.ts
app/api/imagekit/upload-token/route.ts
app/api/stream/token/route.ts
app/api/live/route.ts                      (SSE: text/event-stream, topic-scoped, auth-checked)
proxy.ts                                   (route protection only)
```

Route groups keep the member and trainer layouts separate — different nav, different
guards, no runtime role branching inside a shared layout.

**Auth model.** `proxy.ts` redirects unauthenticated requests for `/dashboard`,
`/learn/*`, `/messages/*`, `/book/*`, `/trainer/*` to `/login`. Server Actions and route
handlers re-check auth themselves: a Server Action is a POST to the page route, so a
proxy matcher that excludes a path also skips that path's Server Actions.

## Frontend / backend architecture

- **Server Components** for all data reads. A server-only data layer (`lib/server/*`)
  holds the Drizzle queries; everything above it in `lib/` is pure, testable logic.
- **Server Actions** for all mutations: profile, program CRUD, lesson finalize, availability
  rules, slot booking, cancellation, Connect onboarding, lesson progress. `useActionState`
  for form state and validation errors.
- **Route Handlers** only for: Stripe webhooks, the ImageKit signed-upload token, the
  Stream token, and the SSE stream. Nothing else.
- **Client Components** only where interactivity demands it: chat, video call, slot
  picker, theme toggle, toasts.
- **Real-time.** `/api/live` opens a `text/event-stream`, re-runs a scope-checked query
  every ~5s, and pushes a snapshot only when it changed. The client swaps state in place
  — no `router.refresh()`, so the dashboard doesn't re-render the whole tree. Sends
  `Cache-Control: private, no-store` and a `: ping` comment every ~25s so proxies don't
  close the connection.
- **Caching — classic Next 16 model.** `cacheComponents` is **off** (see below), so we
  use `export const dynamic`, `revalidatePath`, `revalidateTag(tag, 'max')`, and
  `fetch` with `cache: 'force-cache'`. `use cache` is not used.

### Next.js 16 constraints that shape the code

1. **Cache Components is opted out.** `next.config.ts` drops `cacheComponents: true` and
   `partialPrefetching: true` (`partialPrefetching` throws at config validation without
   `cacheComponents`). With it on, `export const dynamic` / `revalidate` /
   `dynamicParams` / `fetchCache` are removed, `export const runtime` is unsupported,
   reading `cookies()` outside a Suspense boundary is a build error, and synchronous IO
   (`Math.random()`, `new Date()`) fails prerender. An auth-gated marketplace is mostly
   request-time; the classic model is lower-friction.
2. **`middleware.ts` → `proxy.ts`** at project root, export named `proxy`, Node runtime
   only (Edge unsupported; the `runtime` config throws). `revalidatePath`/`revalidateTag`
   cannot be called in proxy. `@neon/auth` ships `auth.middleware()` shaped for this.
3. **Server Actions bypass the proxy matcher** — never rely on proxy for authz.
4. **`await` is mandatory** for `cookies()`, `headers()`, `params`, `searchParams`.
   Use the global `PageProps<'/route'>` / `RouteContext<'/route'>` helpers.
5. **`revalidateTag` takes a second argument** — `revalidateTag('programs', 'max')`.
   `updateTag(tag)` (read-your-writes, Server Actions only) and `refresh()` are new.
6. **`next/video` does not exist in 16** — ImageKit's own components are the path.
7. **`next/image`**: `images.qualities` defaults to `[75]` — a `quality={90}` request
   returns 400. `images.domains` is deprecated → `images.remotePatterns`.
8. **Turbopack is the default for `next dev` *and* `next build`** — a custom `webpack`
   key in `next.config.ts` breaks the build. Sentry's plugin must not inject one.
9. **Server Actions need matching `Origin` / `X-Forwarded-Host`** on Cloudways nginx.
   `experimental.serverActions.allowedOrigins` is the fallback.
10. `serverExternalPackages` does not auto-include `stripe` or `@neondatabase/serverless`
    — add explicitly.
11. Node 20.9+; `next lint` removed; `next build` prints no size metrics; `next dev` and
    `next build` use separate output dirs.

## Integrations

| Service | Owns | Never does |
|---|---|---|
| **Neon Postgres** | All app data, auth sessions, earnings source of truth | — |
| **Managed Better Auth (`@neon/auth`)** | Sign-up/sign-in, session cookies, password hashing | No app-role logic (that lives in `profiles`) |
| **SSE route handlers** | Live dashboard counters, slot availability, toasts | Not a message store — Stream owns messages |
| **Stripe** | Program + session payments, Connect accounts, balances, payouts | No card data touches our servers |
| **Stream** | Messages, reactions, threads, 1:1 calls | Not our source of truth for orders/bookings |
| **ImageKit** | Avatars, covers, lesson video + HLS delivery | Not the chat/video-call transport |
| **Sentry** | Error capture, performance traces, source maps | Not a product feature |

### Stripe

Program purchase and session booking share one shape — a Checkout Session created
server-side with `payment_intent_data.transfer_data.destination = trainer.stripe_account_id`
and `payment_intent_data.application_fee_amount = round(amount × platform_fee_bps / 10000)`.
Stripe's own guidance is destination charges for Express accounts; separate charges and
transfers add a transfer step we don't need (and can't use for multi-destination, which
isn't our case).

**Connect Express onboarding.** `type: 'express'` on `POST /v1/accounts` is **deprecated**;
use the `controller.*` shape:

```ts
const account = await stripe.accounts.create({
  controller: {
    fees: { payer: "application" },
    losses: { payments: "application" },
    stripe_dashboard: { type: "express" },
  },
  capabilities: { transfers: { requested: true } },
  business_profile: { url: "https://..." },
});
```

`stripe_dashboard.type` is immutable after creation. Then `accountLinks.create()` with
`type: "account_onboarding"`, `collection_options: { fields: "eventually_due" }`,
`refresh_url` and `return_url` (HTTPS in live mode). The link URL is **single-use and
expires in minutes** — never email or message it (link-preview bots consume it).
`return_url` means "the trainer exited the flow", **not** "onboarding is complete", and
carries no state; completion is determined by `requirements.currently_due` and/or the
`account.updated` webhook. `account_update` links are not allowed for Express accounts.

**Webhooks** — one route at `/api/webhooks/stripe`, signature-verified, idempotent on
the Stripe event id via `stripe_events`. Handle: `checkout.session.completed`,
`payment_intent.succeeded` (the authoritative "order paid" signal),
`charge.refunded`, `account.updated`, `payout.paid` / `payout.failed`. Read the **raw
body** (`await req.text()`) — parsing JSON first breaks verification. Return 2xx
immediately and process after. Two webhook endpoints are required: `@self` for platform
charges/transfers and `@accounts` for connected-account lifecycle events.

Refunds against a destination charge need `reverse_transfer: true` (plus
`refund_application_fee: true` when refunding the fee). If the connected account's
balance is insufficient the refund **errors** rather than going pending.

### Stream

Server mints a user token in `/api/stream/token`:
`StreamChat.getInstance(apiKey, secret).createToken(userId, exp)`. **Always set an
expiry** — tokens are valid forever by default — and hand the client a **token provider
function**, not a static string, so the SDK can refresh it on expiry and reconnect. The
same token works for Chat *and* Video.

**There is no "DM channel type."** The built-in types are `messaging`, `agent`,
`livestream`, `team`, `gaming`, `commerce` — so a 1:1 conversation is a `messaging`
channel with two members. We create it with an **explicit channel id** (`conv_<uuid>`
from our own `conversations` row), not the distinct/hash pattern, so the channel can be
joined to our Postgres row and rejoined later. Use `channel.watch()` (get-or-create +
subscribe) rather than `create()` when opening an existing conversation.

Client side: `useCreateChatClient({ apiKey, tokenOrProvider, userData })`. Don't hand-roll
`connectUser`/`disconnectUser` (React 19 StrictMode double-mount breaks it) and never
call `client.disconnectUser()` on unmount — use `channel.stopWatching()`.

Styles: `import "stream-chat-react/dist/css/index.css"` (+ `emoji-picker.css`). Do **not**
install `@stream-io/stream-chat-css` — frozen since Dec 2025. v14 removed the `theme`
prop; theming is CSS variables plus `WithComponents` overrides on top of the shipped
stylesheet.

v14 renames that break older tutorials: `MessageInput` → `MessageComposer`,
`MessageInputFlat` → `MessageComposerUI`, `ChannelPreview` → `ChannelListItem`,
`ReactionsListModal` → `MessageReactionsDetail`, `reaction_counts` → `reaction_groups`.
`ThreadInput` was removed — scope a thread composer with a nested `WithComponents`
override of `MessageComposerUI`. Reactions and threads are otherwise built in:
`channel.sendReaction()`, `channel.sendMessage({ parent_id })`.

**Video calls.** `@stream-io/video-react-sdk` v1.45.1 (the package is *not*
`stream-video-react`; v2 is beta with breaking component renames). Call type `default`,
with the **booking id as the call id** so a recurring session reuses one call. Create
server-side or via `call.getOrCreate({ data: { members, custom, ring, notify } })`.
Components: `StreamVideo`, `StreamCall`, `CallControls`, `ParticipantView`,
`SpeakerLayout`, `CallParticipantsList` (not `CallParticipantsView`), `RingingCall`,
`DeviceSettings`. Don't re-implement `ParticipantView` — it carries low-level
subscription logic; use its override props instead.

TURN is **managed by Stream and included** (no add-on, no extra fee), but the client's
firewall must allow UDP 46884–60999, UDP/TCP 3478, TCP 443 and the domains
`*.stream-io-video.com`, `*.stream-io-api.com`, `*.getstream.io`. Every account gets
$100/month of free video usage; a participant with camera and mic **off** is metered as
a cheap livestream viewer, which matters if we build a waiting room.

### ImageKit

Upload is server-signed and browser-direct: the server calls
`client.helper.getAuthenticationParameters()` (HMAC-SHA1 of `token + expire`, keyed by the
private key) and returns `{ token, expire, signature, publicKey }`; the browser calls
`upload()` from `@imagekit/next` straight to ImageKit. **No video bytes pass through our
server**, so the 1 MB Server Action body limit is irrelevant.

Components come from `@imagekit/next`: `ImageKitProvider`, `Image` (a drop-in for
`next/image`), `Video` (a thin wrapper over the HTML `<video>` element — it is **not** a
player and provides no HLS/ABR on its own). `Image` ignores any custom `loader` prop and
requires a relative `src`, not an imported file.

**HLS**: point the player at ImageKit's CDN manifest —
`https://ik.imagekit.io/<id>/path.mp4/ik-master.m3u8?tr=sr-240_360_480_720_1080`.
**The first request returns `202 Accepted`** while ImageKit transcodes in the background
— the player must retry, or the lesson shows a black rectangle. Use native `<video>`
plus `hls.js` (Safari plays HLS natively). **Do not proxy the manifest through a Next.js
route**: the manifest references relative segment URLs, so a proxy must rewrite and
re-serve every `.ts` segment, doubles egress and still burns ImageKit bandwidth. Use
ImageKit **signed URLs** for private files instead. (`@imagekit/video-player` is beta and
React-≤18-only — not an option here.)

**Free-tier limits** (ImageKit uses separate meters, not a unified credit pool):
bandwidth 20 GB/mo, storage 3 GB, video uploads 100 MB, 500 video units. These are
**hard stops** — delivery and uploads stop rather than degrade. A 1080p lesson video
exceeds the 100 MB upload cap, so real lesson content needs the **Lite plan ($9/mo)**.
ImageKit never watermarks media, so no plan is needed for that.

## Background work

- **Stripe webhooks** — the only background job. Handlers are idempotent (keyed on the
  Stripe event id) and retry-safe; a non-2xx response makes Stripe retry.
- **Slot materialization** — `ensureSlots(trainerId, days)` generates concrete slot rows
  from availability rules, called when rules change and lazily on booking-page load to
  top up the horizon. No cron.
- **No queue, no cron, no workers.**

## Forms & uploads

React Hook Form + zod for validation, surfaced through `useActionState`. Server Actions
re-validate every input; client validation is convenience only. ImageKit uploads follow
the token → direct upload → Server Action flow, and the action validates the returned
file id against the ImageKit API before persisting. Field-level errors come back from the
action; whole-action failures surface as a toast. Duplicate submissions are prevented by
disabling the submit button while pending and by the unique constraint on
`slots(trainer_id, starts_at)`.

## Security & privacy

- Secrets are server-only env vars. `STRIPE_SECRET_KEY`, `STREAM_API_SECRET`,
  `IMAGEKIT_PRIVATE_KEY`, `DATABASE_URL` and the Sentry DSN are never `NEXT_PUBLIC_*`.
- Stripe webhook signatures verified with `stripe.webhooks.constructEvent`.
- Every Server Action and route handler checks auth **and** authorization — a member may
  only fetch lessons for an enrollment they own; a trainer may only edit their own
  programs.
- The ImageKit upload-token endpoint requires an authenticated trainer.
- Rate limiting: a small in-memory limiter on the booking, upload-token and stream-token
  endpoints. Adequate at demo scale; a real launch needs Redis-backed limits.
- Account deletion cascades the member's enrollments, progress, bookings and
  conversations. Refunds are initiated in the Stripe dashboard; the `charge.refunded`
  webhook adjusts earnings.

## SEO & web

Metadata API on the four public routes: title, description, Open Graph, canonical.
Authenticated routes are `noindex`. No sitemap.xml, no JSON-LD, no dynamic OG image
generation in v1. No PWA, no i18n. Browsers: Chrome/Edge/Firefox 111+, Safari 16.4+.

## Environments & deployment

| Env | Database | Stripe | Stream | ImageKit | Sentry |
|---|---|---|---|---|---|
| Local | Neon dev branch | test mode + Stripe CLI | app | real | dev |
| Prod | Neon primary | test mode | app | real | prod |

**Cloudways** — Node 22 or 24 (Next 16 needs 20.9+), npm, root `./`, build command
`npm run build`, start command `npm run start`. Do **not** use `output: 'standalone'` —
it's for Docker, and `next start` needs no manual `public/` + `.next/static` copy step.
nginx must send `proxy_set_header Host $host;` **and**
`proxy_set_header X-Forwarded-Host $host;` (Server Actions abort if `Origin` ≠
`x-forwarded-host`), plus `proxy_buffering off;` for App Router streaming and SSE. If
nginx can't be edited, set `experimental.serverActions.allowedOrigins`. Environment
variables live in the Cloudways panel marked sensitive; changing a `NEXT_PUBLIC_*` var
requires a rebuild. Stripe webhook endpoint: `https://<domain>/api/webhooks/stripe`.
Locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and
`stripe listen --forward-connect-to localhost:4242/webhook` for Connect events. Single
instance — no `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`, no Redis cache handler.

### Environment variables

```
DATABASE_URL=                      # Neon POOLED URL (app traffic)
DATABASE_URL_UNPOOLED=             # Neon direct URL (drizzle-kit push / migrations)
NEON_AUTH_BASE_URL=                # e.g. http://localhost:3000
NEON_AUTH_COOKIE_SECRET=           # >= 32 chars
NEXT_PUBLIC_APP_URL=
STRIPE_SECRET_KEY=                 # sk_test_...
STRIPE_WEBHOOK_SECRET=             # whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STREAM_API_KEY=                    # public key
STREAM_API_SECRET=                 # server-only
NEXT_PUBLIC_STREAM_API_KEY=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=              # server-only
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT= # https://ik.imagekit.io/<id>
SENTRY_DSN=                        # server-only
NEXT_PUBLIC_SENTRY_DSN=
```

## Performance & scale

Demo scale: hundreds of users, one instance. No Redis, no queue, no CDN beyond
ImageKit's. The `pg` Pool uses the pooled URL; migrations use the unpooled URL
(PgBouncer blocks DDL in transaction mode). Public pages are static-revalidated hourly;
authenticated pages are dynamic. ImageKit serves all media, so video never touches the
app server.

## Observability

Sentry with error capture, performance monitoring (traces for slow routes and slow DB
queries) and source maps uploaded on build. The Sentry Next.js integration must not
inject a `webpack` key into `next.config.ts` — Turbopack builds would fail. No uptime
monitor and no custom alerting; Stripe webhook failures surface through Sentry.

## Testing

**Vitest (unit)** — the logic worth protecting:
- `lib/slots.ts` — availability rules → slot generation; weekday/DST edges; no overlap;
  backfill horizon
- `lib/fees.ts` — platform fee split and rounding
- `lib/earnings.ts` — gross/fee/net aggregation; refunds reduce totals
- `lib/stripe-webhooks.ts` — signature rejection, idempotent replay, each event type
- `lib/access.ts` — enrollment/ownership authorization rules
- `lib/progress.ts` — lesson completion rules

**Playwright (smoke)** — one happy path per flow: signup → browse trainers → buy a
program with test card `4242 4242 4242 4242` → watch a lesson → send a chat message →
book and pay for a session → see the booking and updated earnings in the trainer
dashboard.

**Done means:** `npm run build` clean, `npm test` green, Playwright smoke green, all six
integrations exercised against test credentials, `npm run lint` clean, no `TODO`s in
shipped flows, and a README with setup steps and a demo script.

## Assumptions

1. **"Real payouts" = test mode.** A genuine Stripe Connect integration with Express
   onboarding, `application_fee_amount` and transfers to a connected account, but no
   actual money moves — Stripe test mode has no real bank rails.
2. **Audience** is intermediate Next.js developers comfortable with Server Actions and
   the Stripe/Stream SDKs.
3. **"FitCoach"** is a placeholder name.
4. **One trainer owns each program** — no platform-owned or co-authored programs.
5. **No email service.** Notifications are in-app only, pushed over SSE and persisted in
   `notifications`.
6. **Refunds are initiated in the Stripe dashboard**, not in-app; the refund webhook
   adjusts trainer earnings.
7. **Self-serve trainer onboarding** — any signed-in user becomes a trainer, no approval
   queue. Seeded demo trainers make the marketplace look populated.
8. **Booking cancellation** marks the booking cancelled with no automatic refund (see #6).
9. **No availability exceptions** — trainers add/remove weekly rules only.
10. **Slot horizon is 21 days**, topped up on demand.
11. **Caching is the classic Next 16 model**; Cache Components and `use cache` are
    deliberately unused.
12. **In-memory rate limiting** is sufficient at demo scale.
13. **One Stripe product per checkout** — no coupons, tiers or bundles.
14. **Stream chat is client-side** (the SDK is a client library); messages are never
    mirrored into Postgres.
15. **`@neon/auth` is pre-1.0 (0.8.2)** — pin the version and re-read the docs on upgrade.
16. **Email verification is off by default** in Managed Better Auth, so signup → signin
    needs no inbox step.
17. **Neon is on a paid Launch/Scale plan** — Free auto-suspends after 5 minutes and that
    cannot be disabled, which would freeze a demo.
18. **Drizzle stays on stable `0.45.x`** — the 1.0 RC's ESM/peer-dep overhaul isn't worth
    the churn in a tutorial.
19. **ImageKit Lite ($9/mo)** is assumed for real lesson video, since the free plan caps
    uploads at 100 MB with a hard stop.

## Open risks

1. **Time.** Four real flows plus Connect onboarding, webhooks, SSE and ImageKit uploads
   is comfortably more than 1–2 hours of *build* time. Mitigated by building in vertical
   slices so a partial build stays demoable.
2. **Turbopack + third-party SDKs.** Stream, ImageKit and Sentry aren't documented for
   Turbopack builds. If `next build` breaks, the fallback is `next build --webpack` — not
   silently downgrading the app.
3. **Cloudways nginx.** Missing `X-Forwarded-Host` breaks every Server Action with a
   confusing error; `allowedOrigins` is the backup.
4. **Stream video calls need TURN.** It is managed and included, but restrictive
   corporate/school firewalls still break calls — a bad demo risk. Verify on the
   recording machine and network.
5. **Stripe Connect + destination charges** means every sale needs the trainer's connected
   account. A member buying from a trainer who hasn't onboarded must be blocked with a
   clear message.
6. **`@neon/auth` maturity.** v0.8.2 is pre-1.0, so the API can shift. It declares
   `next >= 16.0.0` as a peer dependency, so Next 16 is supported — verify the App
   Router setup against the current docs during implementation.
7. **Stream Chat v15 RC is already published** (`15.0.0-rc.3`). We pin `^14.14.1`; if v15
   ships before recording, the v14 component renames need revisiting.
8. **Stripe `type: 'express'` is deprecated** in favour of `controller.*`, and Accounts v2
   is GA — hosted onboarding now uses it, though v1 remains required for payout settings
   and the recipient service agreement. Use v1 `controller.*` for v1.
9. **SSE behind Cloudways nginx** needs `proxy_buffering off;` and a raised proxy read
   timeout — a 60s timeout kills the stream mid-demo.
10. **ImageKit free-tier hard stops.** 100 MB per video upload and 20 GB/month bandwidth
    are stops, not degradations. Decide on Lite before seeding.
11. **`pg` Pool vs restarts.** The Pool reconnects on checkout, but a long SSE stream
    dies on a Cloudways process restart and must reconnect client-side.
12. **HLS manifests return `202` on first request.** ImageKit transcodes in the
    background; the player must retry or the lesson shows a black rectangle. Verify in
    the seed step, not on camera day.
13. **Refund reversals need balance.** `reverse_transfer: true` fails outright if the
    connected account can't cover it, so trainer earnings can drift from Stripe's
    balance. The dashboard shows both, so the discrepancy is visible rather than hidden.
14. **Stream 1:1 channel + program link.** If group messaging or cohorts arrive later, the
    `conversations` table's single `trainer_id` shape changes.

## Implementation order

Vertical slices, so each step leaves the app demoable:

0. Tooling: Next 16 config (opt out of Cache Components), Tailwind v4, shadcn/ui, premium
   theme on top of the existing `lib/theme.ts` mechanism
1. Schema + Drizzle + Neon connection + `@neon/auth` wiring
2. Auth flows + `proxy.ts` + role-aware layouts
3. Slice A: marketplace → program purchase → lesson playback
4. Slice B: trainer dashboard (programs, lessons, availability, earnings)
5. Slice C: Stream chat + 1:1 video call
6. Slice D: session booking + payment
7. Slice E: Stripe Connect onboarding + payouts page
8. SSE live updates + in-app notifications
9. Sentry, SEO, seed script with real ImageKit uploads, README, Playwright smoke,
   Cloudways deploy
