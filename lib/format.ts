/**
 * Formatting helpers shared across the whole product.
 *
 * Every figure in the product is money, time or a count, so all three get a
 * single place that decides how they read. Money is stored in cents
 * everywhere — never in floats — so the values line up in a column without
 * drift.
 */

/** Formats a cent amount as US dollars. `123456` becomes `$1,235`. */
export function money(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Formats a cent amount with cents, for balances and payouts where the
 * fraction is the point.
 */
export function moneyExact(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** A compact dollar figure for headline stats: `$12.4k`, `$1.2M`. */
export function moneyCompact(cents: number): string {
  const value = cents / 100;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${Math.round(value)}`;
}

/** Formats a duration in seconds as `18 min` or `1 hr 12 min`. */
export function duration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

/** Formats a duration in minutes as `45 min` or `1 hr`. */
export function minutes(value: number): string {
  if (value < 60) return `${value} min`;
  const hours = Math.floor(value / 60);
  const rest = value % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

/** Two-letter initials for an avatar fallback. */
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** A rating with one decimal: `4.9`. */
export function rating(value: number): string {
  return value.toFixed(1);
}

/** Joins a list the way a person would read it: `a, b and c`. */
export function list(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
