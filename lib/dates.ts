/**
 * Date helpers. Pure functions only — no React, no storage.
 *
 * All day keys are ISO `yyyy-mm-dd` strings in the user's local timezone.
 * Local (not UTC) is deliberate: a habit checked off "today" at 11pm must
 * not belong to tomorrow just because UTC has already rolled over.
 */

/** Formats a Date as an ISO `yyyy-mm-dd` key in local time. */
export function toDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today's day key in local time. */
export function todayKey(now: Date = new Date()): string {
  return toDayKey(now);
}

/** Locale used for all user-facing date labels. */
const LOCALE = "en-US";

/**
 * The last `count` day keys, oldest first, ending with today.
 *
 * Uses local midnight arithmetic so the result crosses month and year
 * boundaries correctly regardless of the length of a month.
 */
export function lastNDays(count: number, now: Date = new Date()): string[] {
  const days: string[] = [];
  for (let offset = count - 1; offset >= 0; offset--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    days.push(toDayKey(date));
  }
  return days;
}

/** Parses a `yyyy-mm-dd` key back into a local Date at midnight. */
export function fromDayKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Short weekday label for a day key, e.g. "Mon".
 *
 * The locale is pinned to "en-US" so the grid reads consistently regardless of
 * the browser's locale and so tests are deterministic.
 */
export function formatWeekday(key: string): string {
  return fromDayKey(key).toLocaleDateString(LOCALE, { weekday: "short" });
}

/**
 * Day-of-month label for a day key, e.g. "14".
 */
export function formatDayOfMonth(key: string): string {
  return String(fromDayKey(key).getDate());
}

/**
 * A longer label used for accessibility, e.g. "Mon, Nov 14, 2026".
 */
export function formatFullDate(key: string): string {
  return fromDayKey(key).toLocaleDateString(LOCALE, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
