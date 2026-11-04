"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import {
  type Theme,
  applyStoredTheme,
  getServerTheme,
  getTheme,
  nextTheme,
  setTheme,
  subscribe,
} from "@/lib/theme";

/**
 * The theme switch: one button that cycles System -> Light -> Dark -> System.
 *
 * The icon shows the current *preference*, so the button doubles as a readout
 * of the selected mode rather than just an action. `system` shows a monitor,
 * because the appearance in that mode is decided by the OS.
 *
 * The theme is read from `localStorage` via `useSyncExternalStore`, so the
 * server and the hydration pass agree on `system` and the real value arrives
 * on the next render — no markup mismatch.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  // Re-apply the stored theme after React resets `<html>`'s attributes on the
  // dev Strict Mode remount. This reads storage rather than the rendered
  // value, so it can never overwrite an explicit choice with the server's
  // default. A no-op in production.
  useLayoutEffect(() => {
    applyStoredTheme();
  }, []);

  function handleClick() {
    setTheme(nextTheme(theme));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Theme: ${theme}`}
      title={`Theme: ${theme}`}
      className={`inline-flex size-9 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-2 hover:text-ink ${className}`}
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}

/** An icon representing the current theme. */
function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "light") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06M12.95 12.95l-1.06-1.06M4.11 4.11 3.05 3.05"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (theme === "dark") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M13.5 9.6A6 6 0 016.4 2.5a6 6 0 107.1 7.1z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="1.75"
        y="2.75"
        width="12.5"
        height="8.5"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5.5 14h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
