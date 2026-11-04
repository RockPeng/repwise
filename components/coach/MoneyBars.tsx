import { money } from "@/lib/format";

/**
 * Where the money came from.
 *
 * Two categories, one measure, one colour. The identity comes from the row
 * label, not from a hue, so both bars are the same accent and the eye only
 * has to read the label to know what it is looking at.
 */
export function MoneyBars({
  rows,
}: {
  rows: { label: string; cents: number }[];
}) {
  const total = rows.reduce((sum, row) => sum + row.cents, 0);
  const max = Math.max(...rows.map((row) => row.cents), 1);

  return (
    <ul className="space-y-4">
      {rows.map((row) => {
        const share = total > 0 ? Math.round((row.cents / total) * 100) : 0;

        return (
          <li
            key={row.label}
            className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)_auto] items-center gap-4"
          >
            <span className="text-[13px] text-ink-2">{row.label}</span>

            <span className="block h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <span
                className="block h-2 rounded-full bg-accent"
                style={{ width: `${(row.cents / max) * 100}%` }}
              />
            </span>

            <span className="tnum flex items-baseline gap-2 text-[13px] text-ink">
              {money(row.cents)}
              <span className="text-ink-3">{share}%</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
