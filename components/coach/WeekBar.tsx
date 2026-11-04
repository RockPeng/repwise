import { weekLoad } from "@/lib/data";

/**
 * The week bar.
 *
 * The console's signature element: seven rows, one per day, with the load
 * drawn as a gauge rather than printed as a table. A day with no sessions
 * gets an empty hairline and an em dash, so an empty day reads as empty
 * rather than as zero.
 */
export function WeekBar({ load = weekLoad }: { load?: typeof weekLoad }) {
  const busiest = Math.max(...load.map((day) => day.sessions), 1);
  const sessions = load.reduce((total, day) => total + day.sessions, 0);
  const minutes = load.reduce((total, day) => total + day.minutes, 0);

  return (
    <section className="rounded-panel border border-line bg-surface-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-5 py-4">
        <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
          This week&rsquo;s load
        </h2>
        <p className="tnum text-[13px] text-ink-3">
          {sessions} sessions / {minutes} min
        </p>
      </div>

      <ul className="px-5 py-4">
        {load.map((day) => (
          <li
            key={day.day}
            className="grid grid-cols-[40px_minmax(0,1fr)_56px] items-center gap-3 py-1.5"
          >
            <span className="text-[13px] text-ink-3">{day.day}</span>

            {day.sessions > 0 ? (
              <span className="block h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <span
                  className="block h-2 rounded-full bg-accent"
                  style={{ width: `${(day.sessions / busiest) * 100}%` }}
                />
              </span>
            ) : (
              <span aria-hidden="true" className="block h-px w-full bg-line" />
            )}

            <span className="tnum text-right text-[13px] text-ink">
              {day.sessions > 0 ? day.sessions : "—"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
