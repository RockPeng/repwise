"use client";

import { formatDayOfMonth, formatFullDate, formatWeekday } from "@/lib/dates";
import type { Habit } from "@/lib/storage";
import HabitRow from "./HabitRow";

type HabitGridProps = {
  habits: Habit[];
  /** Map of habit id -> checked-off day keys. */
  checkIns: Record<string, string[]>;
  days: string[];
  today: string;
  onToggle: (habitId: string, dayKey: string) => void;
  onDelete: (habitId: string) => void;
};

/**
 * The tracker grid: a sticky header row of day labels above one row per habit.
 *
 * The header and body scroll horizontally together, so day labels stay aligned
 * with their cells. The habit-name column stays put while days scroll.
 */
export default function HabitGrid({
  habits,
  checkIns,
  days,
  today,
  onToggle,
  onDelete,
}: HabitGridProps) {
  if (habits.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        No habits yet. Add one above to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="min-w-max">
        <div className="flex items-center gap-3 border-b border-neutral-200 py-2 dark:border-neutral-800">
          <div className="min-w-32 flex-1 pr-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Habit
          </div>
          <div className="flex gap-1.5">
            {days.map((day) => (
              <div
                key={day}
                title={formatFullDate(day)}
                className={[
                  "flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg text-[10px] leading-none",
                  day === today
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "text-neutral-500 dark:text-neutral-400",
                ].join(" ")}
              >
                <span className="text-[9px] uppercase opacity-70">
                  {formatWeekday(day)}
                </span>
                <span className="mt-0.5 font-medium">
                  {formatDayOfMonth(day)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-3">
          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              days={days}
              doneDates={checkIns[habit.id] ?? []}
              today={today}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
