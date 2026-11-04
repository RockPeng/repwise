import type { ReactNode } from "react";

/**
 * A small tag.
 *
 * Tones carry meaning, not decoration: accent for live and paid, warn for
 * waiting on money, danger for anything that has gone wrong. Sentence case
 * throughout — tracked-out capitals are a template tell, and they are also
 * harder to read at this size.
 */

type Tone = "neutral" | "accent" | "warn" | "danger" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-2 border-transparent",
  accent: "bg-accent-soft text-accent border-transparent",
  warn: "bg-warn-soft text-warn border-transparent",
  danger: "bg-danger-soft text-danger border-transparent",
  outline: "border border-line text-ink-3",
};

export function Badge({
  tone = "neutral",
  icon,
  children,
  className = "",
}: {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[12px] font-medium leading-5 ${tones[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

/**
 * A status dot. Used where a badge would be too heavy — next to a name, in a
 * table cell — and it inherits the accent so "live" reads at a glance.
 */
export function Dot({
  tone = "accent",
  pulse = false,
  className = "",
}: {
  tone?: "accent" | "warn" | "danger" | "muted";
  pulse?: boolean;
  className?: string;
}) {
  const colors = {
    accent: "bg-accent",
    warn: "bg-warn",
    danger: "bg-danger",
    muted: "bg-ink-3",
  };

  return (
    <span
      aria-hidden="true"
      className={`inline-block size-[7px] shrink-0 rounded-full ${colors[tone]} ${
        pulse ? "motion-safe:animate-pulse" : ""
      } ${className}`}
    />
  );
}
