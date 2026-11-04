import { Dot } from "@/components/ui/Badge";

/**
 * A figure in the console.
 *
 * Three parts, in this order: what the number is, the number, and how it
 * moved. The movement is a dot in the direction colour plus the comparison
 * written out — never a coloured percentage, because colour on text is the
 * one thing this palette cannot afford.
 *
 * No border around the tile. A row of tiles is separated by a hairline
 * between the columns, the way the marketing stats row does it.
 */
export function StatTile({
  label,
  value,
  delta,
  tone = "accent",
  valueClassName = "",
}: {
  label: string;
  value: string;
  /** The comparison, in words: "18% vs October". */
  delta: string;
  tone?: "accent" | "warn" | "danger" | "muted";
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-[13px] text-ink-3">{label}</p>
      <p
        className={`tnum mt-2 font-display text-[1.9rem] font-extrabold leading-none tracking-[-0.03em] text-ink ${valueClassName}`}
      >
        {value}
      </p>
      <p className="mt-3 flex items-center gap-2 text-[13px] text-ink-2">
        <Dot tone={tone} />
        <span>{delta}</span>
      </p>
    </div>
  );
}
