/**
 * The app's external store.
 *
 * React state is the wrong tool for reading `localStorage`: the value lives
 * outside React, so it must be hydrated *after* the first render. The
 * idiomatic React 19 way to do that is `useSyncExternalStore` — the store
 * exposes `subscribe` / `getSnapshot` / `getServerSnapshot`, and React
 * handles the server-render -> client-hydrate transition without a
 * setState-in-effect cascade.
 *
 * The server snapshot is a distinct "not hydrated yet" value, so the server
 * renders a loading placeholder and the client renders the real grid after
 * hydration — no markup mismatch.
 */

import { todayKey } from "./dates";
import {
  addHabit as addHabitToStore,
  emptyStore,
  loadStore,
  removeHabit as removeHabitFromStore,
  saveStore,
  toggleCheckIn as toggleCheckInInStore,
  type Store,
} from "./storage";

export type AppState = {
  /** False until the store has been read from localStorage on the client. */
  hydrated: boolean;
  store: Store;
  /** The current day key, in the user's local timezone. */
  today: string;
};

const SERVER_STATE: AppState = {
  hydrated: false,
  store: emptyStore(),
  today: "",
};

let current: AppState = SERVER_STATE;
const listeners = new Set<() => void>();
let midnightTimer: ReturnType<typeof setTimeout> | undefined;
let storageListenerAttached = false;

function notify() {
  for (const listener of listeners) listener();
}

/**
 * Reads the persisted state. Idempotent — the first call hydrates, later
 * calls return the same cached object so `useSyncExternalStore` sees a stable
 * snapshot.
 */
export function getSnapshot(): AppState {
  if (!current.hydrated) {
    current = {
      hydrated: true,
      store: loadStore(),
      today: todayKey(),
    };
    attachStorageListener();
    scheduleMidnightRefresh();
  }
  return current;
}

/** The value React uses during SSR and the hydration pass. */
export function getServerSnapshot(): AppState {
  return SERVER_STATE;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function commit(store: Store) {
  saveStore(store);
  current = { ...current, store };
  notify();
}

/** Checks off / unchecks a habit for a day. */
export function toggleCheckIn(habitId: string, dayKey: string): void {
  commit(toggleCheckInInStore(current.store, habitId, dayKey));
}

/** Adds a habit with the given name. */
export function addHabit(name: string): void {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `habit-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  commit(addHabitToStore(current.store, name, id, new Date().toISOString()));
}

/** Deletes a habit and its check-ins. */
export function removeHabit(habitId: string): void {
  commit(removeHabitFromStore(current.store, habitId));
}

/**
 * Re-reads storage when another tab changes it, keeping open tabs in sync.
 * The `storage` event only fires in *other* tabs, so the tab that made the
 * change is not affected.
 */
function attachStorageListener() {
  if (storageListenerAttached || typeof window === "undefined") return;
  storageListenerAttached = true;
  window.addEventListener("storage", () => {
    current = { ...current, store: loadStore() };
    notify();
  });
}

/**
 * Rolls `today` over at midnight so a tab left open overnight doesn't keep
 * pointing at yesterday.
 */
function scheduleMidnightRefresh() {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    5,
  );
  midnightTimer = setTimeout(() => {
    const next = todayKey();
    if (next !== current.today) {
      current = { ...current, today: next };
      notify();
    }
    scheduleMidnightRefresh();
  }, midnight.getTime() - now.getTime());
}

/**
 * Resets the module singleton. Exists for tests, where each case needs a
 * fresh hydration; it has no effect on the running app.
 */
export function resetStore(): void {
  current = SERVER_STATE;
  if (midnightTimer !== undefined) {
    clearTimeout(midnightTimer);
    midnightTimer = undefined;
  }
  storageListenerAttached = false;
}
