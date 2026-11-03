"use client";

import { formatDayOfMonth, formatFullDate, formatWeekday } from "@/lib/dates";
import type { Habit } from "@/lib/storage";

type HabitRowProps = {
  habit: Habit;
  /** Day keys to render, oldest first. */
  days: string[];
  /** Day keys this habit is checked off for. */
  doneDates: string[];
  today: string;
  onToggle: (habitId: string, dayKey: string) => void;
  onDelete: (habitId: string) => void;
};

/**
 * One habit's row: its name, a toggleable cell per day, and a delete control.
 *
 * Days before the habit existed are disabled and dimmed — you cannot have
 * checked off a habit that did not exist yet.
 */
export default function HabitRow({
  habit,
  days,
  doneDates,
  today,
  onToggle,
  onDelete,
}: HabitRowProps) {
  const createdDay = habit.createdAt.slice(0, 10);
  const doneSet = new Set(doneDates);

  return (
    <div className="flex items-center gap-3 border-b border-neutral-200 py-2 last:border-b-0 dark:border-neutral-800">
      <div className="flex min-w-32 flex-1 items-center gap-2 pr-2">
        <span className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {habit.name}
        </span>
        <button
          type="button"
          onClick={() => onDelete(habit.id)}
          aria-label={`Delete ${habit.name}`}
          className="rounded p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 3l8 8M11 3l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex gap-1.5">
        {days.map((day) => {
          const isDone = doneSet.has(day);
          const isToday = day === today;
          const isFuture = day > today;
          const existed = day >= createdDay;

          return (
            <button
              key={day}
              type="button"
              onClick={() => onToggle(habit.id, day)}
              disabled={!existed || isFuture}
              aria-label={`${day} (${formatFullDate(day)}): ${habit.name} ${
                isDone ? "done" : "not done"
              }`}
              aria-pressed={isDone}
              title={formatFullDate(day)}
              className={[
                "flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg border text-[10px] leading-none transition",
                isDone
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-neutral-300 bg-white text-neutral-500 hover:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-400",
                isToday && !isDone
                  ? "ring-2 ring-neutral-900/30 dark:ring-neutral-100/30"
                  : "",
                !existed || isFuture ? "cursor-not-allowed opacity-25" : "",
              ].join(" ")}
            >
              <span className="text-[9px] uppercase opacity-70">
                {formatWeekday(day)}
              </span>
              <span className="mt-0.5 font-medium">
                {formatDayOfMonth(day)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
