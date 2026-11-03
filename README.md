# Habits

A simple habit tracker built with Next.js. No accounts, no backend, no database —
habits and check-offs are stored in your browser's `localStorage`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Using it

- Type a habit name and press **Add** (or Enter).
- Click a cell in the grid to check off that habit for that day. Click again to undo.
- The grid shows the last 14 days. Today's column is highlighted.
- Use the **×** next to a habit name to delete it.
- Use the theme button in the header to switch between **System**, **Light**, and **Dark**.

Your data is saved automatically in the browser under the `habits.v1` key.
Clearing site data clears your habits.

## Project layout

| Path                      | Responsibility                                       |
| ------------------------- | ---------------------------------------------------- |
| `app/page.tsx`            | Composition root. Renders the tracker.               |
| `lib/store.ts`            | External store — hydration, mutations, persistence.  |
| `lib/storage.ts`          | The only module that touches `localStorage`.         |
| `lib/dates.ts`            | Pure date helpers (local-time day keys).             |
| `lib/theme.ts`            | Theme store — preference, persistence, OS sync.      |
| `components/HabitForm`    | Add-habit input.                                     |
| `components/HabitGrid`    | Habits × days grid.                                  |
| `components/HabitRow`     | One habit's row of day cells.                        |
| `components/ThemeToggle`  | The light/dark/system switch.                        |
| `components/InlineScript` | Inline script that survives React's script handling. |

The design is documented in
[`docs/superpowers/specs/2026-11-03-habit-tracker-design.md`](docs/superpowers/specs/2026-11-03-habit-tracker-design.md).

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

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**, **Tailwind CSS v4**.
- **Storage:** `localStorage` only. Data is not synced across devices. The `storage`
  event keeps multiple open tabs in sync.
- **Hydration:** the store is read via `useSyncExternalStore`, so the server renders
  a loading placeholder and the client renders the grid after hydration — no
  markup mismatch.
- **Failure handling:** `localStorage` access is wrapped in try/catch. In private
  browsing or on a quota error, the app degrades to an in-memory store instead of
  crashing.
- **Dates:** day keys are local-time `yyyy-mm-dd` strings, so a habit checked off
  late at night belongs to the day you checked it off.
- **Theming:** the theme toggle cycles **System → Light → Dark → System** and the
  choice is stored under the `theme.v1` key. The stored *preference* is written
  to `<html data-theme>`; CSS resolves `system` against `prefers-color-scheme`,
  so the OS preference is honoured with no JavaScript and updates live if the
  OS changes. Tailwind's `dark:` variant is redefined against the same
  attribute (see `globals.css`), and an inline script in the root layout
  applies the stored theme before the first paint, so there is no flash of the
  wrong mode.

## Testing

```bash
npm test
```

Covers date math (month/year/leap-day boundaries), storage round-trips and
corrupt-data fallback, grid interactions, theme resolution and persistence, and
an end-to-end page test covering add, toggle, delete, and persistence.
