# FitCoach — UI specification

The design system for the FitCoach marketplace, written out so every route
in the product is built from the same parts. This file is the reference: if a
page needs something that is not here, add it here first.

---

## 1. The idea

FitCoach is a marketplace for personal training. Members buy a programme
written by a coach, book private sessions with that coach, and track their
progress. Coaches write programmes, coach clients and get paid.

Two audiences, one product. The design has to make a member feel like they
have a coach and a coach feel like they have a business.

**The signature is the cut corner.** Media frames — photography, covers,
avatars, the video call — are chamfered rather than rounded. It is the one
shape that carries across every screen, and it is what stops a page of
coaches and programmes from reading as a grid of interchangeable cards.

**The accent is spent, not sprayed.** One saturated green exists in the
product. It marks the live, the actionable and the paid for. Amber and red
appear only where money is waiting or something has gone wrong.

---

## 2. Colour

Semantic tokens only. A component says `bg-surface-1`, never a hex and never
a `dark:` variant — the theme attribute swaps the token and everything
follows.

### Dark (the default expression of the brand)

| Token | Value | Used for |
|---|---|---|
| `--surface-0` | `#0a0c0b` | Page background |
| `--surface-1` | `#101513` | Panels, the console rail |
| `--surface-2` | `#18201d` | Raised: inputs, chips, hover |
| `--line` | `#232b28` | Hairlines |
| `--line-2` | `#36413c` | Stronger borders, icon buttons |
| `--ink` | `#eef4f0` | Primary text |
| `--ink-2` | `#98a7a0` | Secondary text |
| `--ink-3` | `#64716b` | Metadata, labels |
| `--accent` | `#3ce08a` | Brand, links, live state, primary fill |
| `--accent-ink` | `#04160c` | Text on an accent fill |
| `--accent-soft` | `rgba(60,224,138,.12)` | Tinted backgrounds |
| `--warn` | `#e8a33d` | Pending, awaiting payment |
| `--danger` | `#e5533d` | Refunded, cancelled, destructive |

### Light

| Token | Value |
|---|---|
| `--surface-0` | `#eff3f1` |
| `--surface-1` | `#ffffff` |
| `--surface-2` | `#e6ece8` |
| `--line` | `#d7dfda` |
| `--line-2` | `#b4c1ba` |
| `--ink` | `#0a1210` |
| `--ink-2` | `#47574f` |
| `--ink-3` | `#74847c` |
| `--accent` | `#0a7d43` (text) / `--accent-solid` `#16b364` (fill) |
| `--warn` | `#8f620e` |
| `--danger` | `#b13825` |

The theme is a preference stored on `<html data-theme>` and resolved by CSS.
`system` follows the OS. Do not add `dark:` variants to new components.

---

## 3. Type

Two families, loaded in `app/layout.tsx`.

- **Archivo** (`font-display`) — headlines, numbers, names. It carries a
  width axis: `stretch-wide` (112) for display type, `stretch-tight` (88) for
  condensed numerals. Weight 700–800 for headings, never lighter.
- **Inter** (`font-sans`) — everything that is read rather than looked at.
  Body copy is 15–17px with `leading-relaxed`; metadata is 13px in `--ink-3`.

All figures that sit in a column are `tnum` (tabular numerals).

Headline sizes: `clamp(1.75rem, 3.4vw, 2.5rem)` for a section head,
`clamp(1.6rem, 3vw, 2.1rem)` for a page head, `clamp(2.6rem, 6vw, 4.6rem)`
for the hero.

### House rules

- No all-caps labels. Sentence case everywhere, including badges.
- No middle-dot separated meta strings. Use a slash (`Strength / 12 weeks`)
  or separate cells.
- One accent word in a headline is a template tell. Colour a *rule*, a dot
  or a whole element instead.
- Arrows on links are used sparingly — once per section, on the "see all"
  action.
- Labels go above the thing they label in tables, never inside a pill that
  sits where a value should be.

---

## 4. Shape, space and rules

- Radii: media frames `0` (they are chamfered), panels `12px`
  (`rounded-panel`), fields and chips `10px` (`rounded-field`), buttons and
  badges are pills (`rounded-full`).
- No drop shadows. Depth comes from `--surface-2` against `--surface-1` and
  from hairlines.
- Sections are separated by `border-line`, not by gaps alone.
- Page gutters: `px-5 sm:px-8` on marketing pages, `px-5 sm:px-8 lg:px-10`
  in the app.
- Marketing content is capped at `max-w-[1240px]`; the member app at
  `max-w-[1080px]`; the console at `max-w-[1180px]`.

---

## 5. Components

All in `components/ui/` unless stated. Every one is a server component unless
marked otherwise.

### `<Icon name size className strokeWidth />`

24×24 grid, 1.6 stroke, `currentColor`, `aria-hidden`.

Names: `arrow-right` `arrow-up-right` `arrow-up` `arrow-down` `chevron-down`
`chevron-right` `chevron-left` `check` `x` `plus` `minus` `search` `play`
`calendar` `clock` `user` `users` `message` `video` `phone` `mic` `mic-off`
`bell` `dumbbell` `heart` `activity` `trending` `chart` `wallet` `card`
`sliders` `target` `flame` `timer` `award` `map-pin` `refresh` `download`
`filter` `mail` `lock` `eye` `edit` `copy` `external-link` `log-out` `menu`
`grid` `list` `send` `layers` `notebook` `ticket` `bolt` `sparkle` `star`
`shield` `square-check` `dollar` `percent` `more-horizontal` `globe`
`bookmark`.

### `<Button>` / `<ButtonLink>`

`<Button variant size icon iconAfter>` → a `<button>`.
`<ButtonLink href variant size icon iconAfter>` → a `next/link`.

- `variant`: `primary` (accent fill) · `secondary` (line) · `ghost` ·
  `danger`
- `size`: `sm` (h-8) · `md` (h-10) · `lg` (h-12)

The label names the action: "Book session", "Buy programme", "Save changes".

### `<Badge tone icon>` and `<Dot tone pulse />`

`tone`: `neutral` · `accent` · `warn` · `danger` · `outline`.
`Dot` tone: `accent` · `warn` · `danger` · `muted`.

### `<Avatar name src size ring />`

Round, initials underneath the image as a fallback.

### `<Chamfer cut side accent className>`

The cut-corner frame. `cut` in pixels (default 28), `side` is `bl` or `tl`,
`accent` draws a 2px accent line along the diagonal. `className` lands on the
outer element — put the aspect ratio there.

```tsx
<Chamfer cut={24} accent className="aspect-[4/3] overflow-hidden bg-surface-2">
  <Image src={cover} alt="" fill sizes="…" className="object-cover" />
</Chamfer>
```

### `<Progress value label>` and `<Stars value size />`

`Progress` is a 3px square-ended gauge. `Stars` renders a fractional rating.

### `<PageHeader title description actions>` — `components/app/PageHeader.tsx`

The header of a page inside the application shell.

### Marketing pieces

- `<ProgramCard program headingLevel>` — `components/marketing/ProgramCard.tsx`
- `<CoachCard trainer headingLevel>` — `components/marketing/CoachCard.tsx`
- `<SectionHead title body action>` — `components/marketing/SectionHead.tsx`
- `<SlotTape slots label>` — `components/marketing/SlotTape.tsx`
- `<CallFrame coach coachImage memberName memberAvatar elapsed>` —
  `components/session/CallFrame.tsx`

---

## 6. Data

`lib/data.ts` holds every row the UI renders. There is no database and no
API. Money is in **cents**. Dates are **pre-formatted strings**, so a server
render and a client hydration always agree.

Exports: `trainers` `trainerById` `programs` `programById`
`programsByTrainer` `member` `enrollments` `conversations` `messages`
`clients` `bookings` `availabilityRules` `slots` `earnings` `payouts`
`earningsByMonth` `weekLoad` `notifications` `specialties` `testimonials`
`howItWorks` `marketplaceStats` `currentTrainer`.

Formatting helpers live in `lib/format.ts`: `money` `moneyExact`
`moneyCompact` `duration` `minutes` `initials` `rating` `list`.

---

## 7. Routes

```
/                              marketing home
/trainers                      coach directory
/trainers/[id]                 coach profile
/programs/[id]                 programme page
/login  /signup                authentication
/checkout/success              post-payment confirmation
/dashboard                     member home
/learn/[programId]             lesson player
/messages  /messages/[id]      conversations, chat + video call
/book/[trainerId]              session booking
/trainer                       coach overview
/trainer/clients               client list
/trainer/programs              programme catalogue
/trainer/programs/new          create a programme
/trainer/programs/[id]         edit a programme
/trainer/schedule              availability rules
/trainer/earnings              earnings ledger
/trainer/payouts               Connect status, balance, payouts
```

Route groups: `(marketing)` `(auth)` `(member)` `(checkout)` `(trainer)`.
The shells are already written — do not add a layout to a group that has
one.

---

## 8. Rules for building pages

1. **No authentication, no database, no payments.** Every page reads from
   `lib/data.ts`. Buttons that would transact are rendered as buttons and
   link nowhere, or link to the page that would follow.
2. **Server Components by default.** Add `"use client"` only for genuine
   interactivity (a slot picker, a message composer, a tab strip). Client
   components must not import `lib/data.ts` values that change per request —
   the demo data is static, so this is safe today, but keep the boundary.
3. **Next 16 conventions.** `params` and `searchParams` are Promises — await
   them. Use `PageProps<'/route'>` where the route is known.
4. **Images** come from `images.unsplash.com`; `next.config.ts` already
   allows that host. Always pass `sizes`. Use `preload` (not `priority`) for
   the hero.
5. **Every page** needs `export const metadata` with a real title and
   description. Authenticated routes are `noindex`.
6. **Accessibility**: one `<h1>` per page, sensible heading order, visible
   focus (already global), `alt` text on meaningful images and `alt=""`
   on decorative ones, and `aria-label` on icon-only buttons.
7. **Responsive**: every page works at 360px. The app shell collapses its
   rail to a scrolling row under 1024px.
