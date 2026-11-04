# FitCoach

A personal-training marketplace: members buy a programme written by a coach,
book private one-to-one sessions with that coach, and track their progress.
Coaches write programmes, run their client list, and get paid.

**This repository is the UI build.** Every screen is real and every page is
laid out and styled, but the data is hardcoded in `lib/data.ts` — there is no
authentication, no database, no Stripe, no Stream and no ImageKit yet. The
shapes mirror the schema in [`plan.md`](plan.md) (money in cents, dates as
pre-formatted strings) so the real query layer can be dropped in behind them
later without reshaping a component.

The design system is written out in
[`design/UI-SPEC.md`](design/UI-SPEC.md).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are needed. Images are fetched from Unsplash and
Google Fonts is self-hosted at build time, so the first build needs a network
connection.

## The demo script

A walk through every screen, in the order a person would meet them.

| # | Route | What it is |
| --- | --- | --- |
| 1 | `/` | The marketing home — hero, live slot tape, programmes, coaches, how it works, 1:1 sessions, testimonials |
| 2 | `/trainers` | The coach directory, with specialism filters |
| 3 | `/trainers/maya-okafor` | A coach's profile — credentials, their programmes, the session price |
| 4 | `/programs/stronger-in-12` | A programme page — syllabus, what is included, the purchase card |
| 5 | `/signup` | Sign-up, including the "I want a coach / I want to coach" choice |
| 6 | `/login` | Sign-in |
| 7 | `/checkout/success` | What a completed purchase looks like |
| 8 | `/dashboard` | The member's home — continue training, next session, the week, messages, notifications |
| 9 | `/learn/stronger-in-12` | The lesson player — module rail, video frame, notes, ask-your-coach |
| 10 | `/messages` · `/messages/conv-maya` | Conversations, then a thread with attachments and a video call |
| 11 | `/book/maya-okafor` | The booking page — pick a slot, see the price, confirm |
| 12 | `/trainer` | The coach console — earnings, this week's load, today's sessions, activity |
| 13 | `/trainer/clients` | The client list, with progress and lifetime value |
| 14 | `/trainer/programs` · `/trainer/programs/new` · `/trainer/programs/stronger-in-12` | The programme catalogue, the create form, the editor |
| 15 | `/trainer/schedule` | Availability rules and the bookable slot grid |
| 16 | `/trainer/earnings` | The earnings chart and the ledger |
| 17 | `/trainer/payouts` | Connect status, balance and payout history |

The theme toggle in the header cycles **System → Light → Dark**. Dark is the
default expression of the brand; light is a full second theme rather than an
inversion, and both are built from the same semantic tokens.

## Project layout

| Path | Responsibility |
| --- | --- |
| `app/(marketing)/` | Public pages — home, coach directory, coach profile, programme page |
| `app/(auth)/` | Sign in and sign up |
| `app/(checkout)/` | Post-purchase confirmation |
| `app/(member)/` | The member's app — dashboard, lesson player, messages, booking |
| `app/(trainer)/` | The coach's console — overview, clients, programmes, schedule, earnings, payouts |
| `app/globals.css` | Design tokens, the theme mechanism, and the custom utilities |
| `components/ui/` | The primitives: icon set, button, badge, avatar, chamfer, progress |
| `components/app/` | The application shell — sidebar, page header |
| `components/marketing/`, `components/session/` | Marketing cards and the video-call frame |
| `lib/data.ts` | Every row the UI renders |
| `lib/format.ts` | Money, duration and count formatting |
| `lib/theme.ts` | The theme store — preference, persistence, OS sync |

## Scripts

```bash
npm run dev        # start the dev server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm test           # Vitest (single run)
npm run test:watch # Vitest in watch mode
```

## Tech notes

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**,
  **Tailwind CSS v4**. Cache Components is deliberately off — see `plan.md`
  for why — so the classic `dynamic` / `revalidate` model applies.
- **Route groups** keep the member and coach layouts separate: different
  navigation, different posture, no runtime role branching inside a shared
  layout.
- **Theming** is a preference stored under `theme.v1` and written to
  `<html data-theme>`. CSS resolves `system` against `prefers-color-scheme`, so
  the OS preference is honoured with no JavaScript and updates live. An inline
  script in the root layout applies it before the first paint, so there is no
  flash of the wrong mode.
- **Tokens, not variants.** Every colour is a semantic token
  (`--surface-1`, `--ink-2`, `--accent`), so a component needs no `dark:`
  variant and the two themes cannot drift apart.
- **The chamfer.** Media frames are cut-cornered rather than rounded, and
  that one shape carries across photography, avatars and the video call. It
  is what stops the marketplace reading as a grid of interchangeable cards.
- **Money is in cents** everywhere and is formatted through `lib/format.ts`.
  **Dates are pre-formatted strings**, so a server render and a client
  hydration always produce identical text.
- **Images** come from `images.unsplash.com`, allowlisted in
  `next.config.ts`.

## Testing

```bash
npm test
```

Covers the theme store and its hydration behaviour, `localStorage` access
under a quota error, and a hydration test that renders the homepage to string,
hydrates it, and asserts React reports no mismatch.

## What is not built yet

Everything in `plan.md` that needs a credential: authentication
(`@neon/auth`), the Drizzle schema and Neon connection, Stripe Checkout and
Connect, Stream chat and video calls, ImageKit uploads and HLS delivery,
SSE live updates, and the seed script. The screens for all of them exist and
are navigable.
