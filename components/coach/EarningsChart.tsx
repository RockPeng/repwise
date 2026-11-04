"use client";

import { useState } from "react";
import { money } from "@/lib/format";

/**
 * Monthly net earnings.
 *
 * Hand-built: columns are divs with an inline height, because a chart
 * library would bring its own colours, its own padding and its own idea of
 * what a tooltip looks like. The rules the rest of the product follows apply
 * here too — the marks carry the accent, the text wears text tokens, and
 * the value is only written on the tallest column.
 *
 * The last month is a partial month, so it is drawn at 45% and says so.
 */
export function EarningsChart({
  data,
}: {
  data: { month: string; netCents: number }[];
}) {
  const [active, setActive] = useState<number | null>(null);

  const max = Math.max(...data.map((point) => point.netCents));
  const peak = data.reduce(
    (best, point, index) =>
      point.netCents > data[best].netCents ? index : best,
    0,
  );
  const partial = data.length - 1;

  return (
    <figure>
      <figcaption className="sr-only">
        Net earnings by month from {data[0].month} to {data[data.length - 1].month}.
        The tallest column is {data[peak].month} at {money(data[peak].netCents)}.
        {data[partial].month} is a partial month, four days in.
      </figcaption>

      <div className="relative pt-7">
        {/* Gridlines sit behind the columns. */}
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-x-0 top-0 border-t border-line" />
          <div className="absolute inset-x-0 top-1/3 border-t border-line" />
          <div className="absolute inset-x-0 top-2/3 border-t border-line" />
          <div className="absolute inset-x-0 bottom-0 border-t border-line" />
        </div>

        <div className="relative h-[190px]">
          <div className="absolute inset-0 flex items-end">
            {data.map((point, index) => {
              const height = (point.netCents / max) * 100;
              const isPartial = index === partial;

              return (
                <div
                  key={point.month}
                  className="relative flex h-full flex-1 items-end justify-center"
                >
                  {active === index ? (
                    <span
                      role="tooltip"
                      className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-field border border-line bg-surface-2 px-2.5 py-1.5 text-[12px] leading-none text-ink"
                    >
                      <span className="text-ink-3">{point.month}</span>{" "}
                      <span className="tnum text-ink">{money(point.netCents)}</span>
                    </span>
                  ) : null}

                  {index === peak && active !== index ? (
                    <span className="tnum absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap text-[12px] leading-none text-ink">
                      {money(point.netCents)}
                    </span>
                  ) : null}

                  <span
                    tabIndex={0}
                    role="img"
                    aria-label={`${point.month}: ${money(point.netCents)} net`}
                    onMouseEnter={() => setActive(index)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(index)}
                    onBlur={() => setActive(null)}
                    className="block w-full max-w-[24px] rounded-t-[4px] bg-accent"
                    style={{
                      height: `${height}%`,
                      opacity: isPartial ? 0.45 : 1,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-2.5 flex">
          {data.map((point, index) => (
            <p
              key={point.month}
              className="flex-1 text-center text-[13px] text-ink-3"
            >
              {point.month}
              {index === partial ? (
                <span className="sr-only"> (partial month)</span>
              ) : null}
            </p>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[12px] text-ink-3">
        * {data[partial].month} is four days in.
      </p>

      <table className="sr-only">
        <caption>Net earnings by month</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Net earnings</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.month}>
              <th scope="row">{point.month}</th>
              <td>{money(point.netCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
