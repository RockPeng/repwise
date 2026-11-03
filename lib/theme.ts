/**
 * The theme store.
 *
 * The theme is a client-only preference: it lives in `localStorage` and is
 * read *after* the first render. React state is the wrong tool for reading
 * `localStorage` for the same reason it is in `lib/store.ts` — the value must
 * be hydrated after the first render — so the store exposes `subscribe` /
 * `getTheme` / `getServerTheme` for `useSyncExternalStore`.
 *
 * The server snapshot is always `system`, so the server and the hydration
 * pass render the same markup. The real value arrives on the next render.
 *
 * The theme is written to `<html data-theme="...">` as the *preference*, not
 * as a resolved appearance. Resolving `system` against the OS is left to CSS
 * (`prefers-color-scheme` in `globals.css`), which keeps three promises:
 *
 * - The OS preference is honoured with no JavaScript at all, so a user whose
 *   browser blocks scripts still gets the right colours.
 * - The inline script that applies the stored theme before the first paint
 *   stays in sync with what CSS would do — both read the same attribute.
 * - A change to the OS preference is picked up by the media query for free.
 */

import { readSetting, writeSetting } from "./storage";

/** A theme preference: an explicit choice, or `system` to follow the OS. */
export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme.v1";

/** The order the toggle cycles through. */
export const THEME_CYCLE: Theme[] = ["system", "light", "dark"];

/** The theme the server renders with. */
const SERVER_THEME: Theme = "system";

let current: Theme | null = null;
const listeners = new Set<() => void>();
let storageHandler: ((event: StorageEvent) => void) | null = null;

function notify() {
  for (const listener of listeners) listener();
}

/**
 * The next theme in the cycle. `system` -> `light` -> `dark` -> `system`.
 */
export function nextTheme(theme: Theme): Theme {
  const index = THEME_CYCLE.indexOf(theme);
  if (index === -1) return THEME_CYCLE[0];
  return THEME_CYCLE[(index + 1) % THEME_CYCLE.length];
}

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Reads the stored preference.
 *
 * Anything unrecognised — including a missing value — falls back to
 * `system`, which follows the OS.
 */
function readStoredTheme(): Theme {
  const raw = readSetting(THEME_STORAGE_KEY);
  return isTheme(raw) ? raw : SERVER_THEME;
}

/**
 * Writes the theme to the document element.
 *
 * `data-theme` is what the CSS keys off, and what the Tailwind `dark:`
 * variant is redefined against in `globals.css`.
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

/**
 * Applies the *stored* preference to the document element.
 *
 * This is the one function that is safe to call at any time — including
 * during hydration. It reads what is actually in storage rather than what
 * React rendered, so it can never overwrite an explicit choice with the
 * server's default.
 */
export function applyStoredTheme(): void {
  applyTheme(readStoredTheme());
}

/**
 * The current theme, read from `localStorage` on first use.
 *
 * Idempotent — later calls return the cached value so `useSyncExternalStore`
 * sees a stable snapshot.
 */
export function getTheme(): Theme {
  if (current === null) {
    current = readStoredTheme();
  }
  attachStorageListener();
  return current;
}

/** The value React uses during SSR and the hydration pass. */
export function getServerTheme(): Theme {
  return SERVER_THEME;
}

/** Subscribes to theme changes. */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Sets the theme, persists it, and applies it to the document element.
 */
export function setTheme(theme: Theme): void {
  current = theme;
  writeSetting(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
  notify();
}

/**
 * Re-reads the theme when another tab changes it, keeping open tabs in sync.
 * The `storage` event only fires in *other* tabs, so the tab that made the
 * change is not affected.
 */
function attachStorageListener() {
  if (storageHandler !== null || typeof window === "undefined") return;
  storageHandler = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    const next = isTheme(event.newValue) ? event.newValue : SERVER_THEME;
    if (next === current) return;
    current = next;
    applyTheme(next);
    notify();
  };
  window.addEventListener("storage", storageHandler);
}

/**
 * Resets the module singleton. Exists for tests; it has no effect on the
 * running app.
 */
export function resetTheme(): void {
  current = null;
  if (storageHandler !== null && typeof window !== "undefined") {
    window.removeEventListener("storage", storageHandler);
  }
  storageHandler = null;
}

/**
 * A script that applies the stored theme before the browser paints.
 *
 * The server renders a default theme, but the user's real preference lives in
 * `localStorage`, which the server cannot read. Without this the page would
 * paint in the default theme and then flip — a flash of the wrong mode. This
 * runs synchronously during HTML parsing, before the first paint.
 *
 * It writes the *preference* verbatim, exactly as CSS expects it, so the
 * script and the stylesheet can never disagree about what `system` means.
 *
 * It is also evaluated in tests, so it must not rely on anything beyond
 * `document` and `localStorage`.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t!=="light"&&t!=="dark"&&t!=="system")t="system";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","system")}})();`;
