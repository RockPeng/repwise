/**
 * The only module that touches localStorage.
 *
 * Every access is wrapped in try/catch: localStorage throws in private
 * browsing modes and when the quota is exhausted, and an unhandled throw here
 * would white-screen the app. On failure we degrade to an in-memory store so
 * the session stays usable — the tradeoff is that writes lost on failure do
 * not survive a reload.
 */

export type Habit = {
  id: string;
  name: string;
  /** ISO timestamp of when the habit was created. */
  createdAt: string;
};

/** Map of habit id -> the day keys (yyyy-mm-dd) checked off for that habit. */
export type CheckIns = Record<string, string[]>;

export type Store = {
  habits: Habit[];
  checkIns: CheckIns;
};

export const STORAGE_KEY = "habits.v1";

export const EMPTY_STORE: Store = { habits: [], checkIns: {} };

/** In-memory fallback used when localStorage is unavailable. */
let memoryFallback: Store | null = null;

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/** An empty store, used as the fallback for unreadable or corrupt data. */
export function emptyStore(): Store {
  return { habits: [], checkIns: {} };
}

/**
 * Reads a raw setting value.
 *
 * Returns null when the value is absent or storage is unavailable, so callers
 * cannot tell the two apart — for a setting, both mean "no preference".
 */
export function readSetting(key: string): string | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Writes a raw setting value.
 *
 * Returns false when the write failed (quota exceeded, private mode). The
 * value is still applied in memory by the caller, so the session stays usable
 * even though the choice will not survive a reload.
 */
export function writeSetting(key: string, value: string): boolean {
  const storage = getStorage();
  if (!storage) return false;

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function isValidStore(value: unknown): value is Store {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<Store>;
  if (!Array.isArray(candidate.habits)) return false;
  if (typeof candidate.checkIns !== "object" || candidate.checkIns === null) {
    return false;
  }
  return candidate.habits.every(
    (habit) =>
      typeof habit?.id === "string" && typeof habit?.name === "string",
  );
}

/**
 * Reads the store from localStorage.
 * Returns an empty store if nothing is saved, the data is corrupt, or
 * localStorage is unavailable.
 */
export function loadStore(): Store {
  const storage = getStorage();
  if (!storage) return memoryFallback ? structuredClone(memoryFallback) : emptyStore();

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return memoryFallback ? structuredClone(memoryFallback) : emptyStore();

    const parsed: unknown = JSON.parse(raw);
    if (!isValidStore(parsed)) return emptyStore();

    return parsed;
  } catch {
    return emptyStore();
  }
}

/**
 * Writes the store to localStorage.
 * Returns false if the write failed (quota exceeded, private mode).
 */
export function saveStore(store: Store): boolean {
  memoryFallback = store;
  const storage = getStorage();
  if (!storage) return false;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

/**
 * Toggles a habit's check-off for a single day.
 * Returns a new store; the input is not mutated.
 */
export function toggleCheckIn(
  store: Store,
  habitId: string,
  dayKey: string,
): Store {
  const existing = store.checkIns[habitId] ?? [];
  const isDone = existing.includes(dayKey);

  const nextDates = isDone
    ? existing.filter((date) => date !== dayKey)
    : [...existing, dayKey].sort();

  return {
    ...store,
    checkIns: { ...store.checkIns, [habitId]: nextDates },
  };
}

/**
 * Adds a habit to the store and returns a new store.
 */
export function addHabit(
  store: Store,
  name: string,
  id: string,
  createdAt: string,
): Store {
  const habit: Habit = { id, name, createdAt };
  return {
    habits: [...store.habits, habit],
    checkIns: { ...store.checkIns, [id]: store.checkIns[id] ?? [] },
  };
}

/**
 * Removes a habit and its check-ins from the store, returning a new store.
 */
export function removeHabit(store: Store, habitId: string): Store {
  const checkIns = { ...store.checkIns };
  delete checkIns[habitId];
  return {
    habits: store.habits.filter((habit) => habit.id !== habitId),
    checkIns,
  };
}
