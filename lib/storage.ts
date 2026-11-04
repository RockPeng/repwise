/**
 * The only module that touches localStorage.
 *
 * Every access is wrapped in try/catch: localStorage throws in private
 * browsing modes and when the quota is exhausted, and an unhandled throw here
 * would white-screen the app. On failure we degrade to an in-memory store so
 * the session stays usable — the tradeoff is that writes lost on failure do
 * not survive a reload.
 *
 * At the moment the only setting is the theme, but the module is written as a
 * general key/value store because that is the shape a preference needs.
 */

/** Reads a raw setting value. */
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

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}
