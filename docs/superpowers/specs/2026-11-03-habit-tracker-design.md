# Habit Tracker — Design

Date: 2026-11-03
Status: approved (verbal approval in chat, 2026-11-03)

## Purpose

A simple habit tracker. The user adds habits, checks them off each day, and sees
the last two weeks at a glance. No accounts, no backend, no database.

## Constraints

- Data persists in `localStorage` only. Not synced across devices.
- Daily habits only — no per-weekday scheduling.
- Boolean check-off only — no counts, targets, or streaks beyond a today summary.
- Single user.

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4.
Vitest + React Testing Library for tests.

## Data model

One localStorage key, `habits.v1`, holding a JSON `Store`:

```ts
type Habit = {
  id: string;
  name: string;
  createdAt: string; // ISO timestamp
};

type CheckIns = Record<string, string[]>; // habitId -> ISO yyyy-mm-dd dates

type Store = {
  habits: Habit[];
  checkIns: CheckIns;
};
```

A habit's check-in dates live in a flat array under its id. Flat dates (rather than
a nested `{date: boolean}` map) keep the serialized form small and make "is this
day done" a cheap `includes`.

## Architecture

```
app/page.tsx          client page; owns state, hydrates from storage, renders tracker
components/HabitForm.tsx   add-habit input
components/HabitGrid.tsx   habits x days grid, delegates rows
components/HabitRow.tsx    one habit row: name, day cells, delete
lib/storage.ts        loadStore / saveStore / toggleCheckIn
lib/dates.ts          todayKey / lastNDays / formatDayLabel
```

Each unit has one job:

- `lib/dates.ts` — pure date math, no React, no storage. Given a reference date it
  produces the ordered list of day keys to render and the labels for each.
- `lib/storage.ts` — the only module that touches `localStorage`. Encapsulates
  parse/serialize and the toggle operation.
- `components/*` — presentational. They receive data and callbacks; they never
  read storage directly.
- `app/page.tsx` — the composition root. The only place that holds state.

## Data flow

```
user clicks a cell
  -> page.tsx toggleCheckIn handler
  -> new Store state (immutable update)
  -> saveStore(newState) writes to localStorage
  -> re-render
```

On mount, `loadStore()` hydrates state once. Because `localStorage` is unavailable
during SSR, the page renders a loading state until hydration completes.

## Error handling

`localStorage` access throws in private-browsing modes and when the quota is
exhausted. `storage.ts` wraps every access in try/catch and degrades to an
in-memory store so the app stays usable instead of white-screening. Corrupt or
unparseable JSON falls back to an empty store rather than crashing. The
in-memory fallback means a write failure loses data on reload, but never blocks
the user mid-session.

## UI

- Header: app name and a "today" summary ("2 of 3 done today").
- Add-habit form: text input plus submit button.
- Grid: one row per habit, one column per day. Default window is the last 14
  days; the header row scrolls horizontally with the body so day labels stay
  aligned.
- A cell is a toggle button: filled when done, empty when not. Today is
  highlighted. Days before a habit was created are shown dimmed and disabled.
- Each habit row has a delete control.
- Responsive: below `sm`, the grid scrolls horizontally; the habit-name column
  stays fixed while the day columns scroll.

A theme toggle in the header cycles **System → Light → Dark → System**. The
choice is stored under the `theme.v1` key and written to `<html data-theme>`.
Tailwind's `dark:` variant is redefined against that attribute, and CSS
resolves `system` against `prefers-color-scheme` — so the OS preference is
honoured with no JavaScript, and an OS change is picked up live. An inline
script in the root layout applies the stored theme before the first paint, so
there is no flash of the wrong mode.

## Testing

Vitest + React Testing Library, jsdom environment.

- `lib/dates.test.ts` — `todayKey` format; `lastNDays` ordering, length, and
  correct crossing of a month boundary.
- `lib/storage.test.ts` — round-trip through a mocked `localStorage`; corrupt
  JSON falls back to an empty store; `toggleCheckIn` adds and removes a date.
- `components/HabitGrid.test.tsx` — clicking a cell calls back with the right
  habit and day.

## Out of scope

Streak history, reminders and notifications, data export, multiple users,
weekly/monthly calendar views, habit reordering, archived habits.
