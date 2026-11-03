"use client";

import { useMemo, useSyncExternalStore } from "react";
import HabitForm from "@/components/HabitForm";
import HabitGrid from "@/components/HabitGrid";
import { lastNDays } from "@/lib/dates";
import {
  addHabit,
  getServerSnapshot,
  getSnapshot,
  removeHabit,
  subscribe,
  toggleCheckIn,
} from "@/lib/store";

const DAY_WINDOW = 14;

export default function Home() {
  const { hydrated, store, today } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const days = useMemo(
    () => (today ? lastNDays(DAY_WINDOW, new Date(`${today}T00:00:00`)) : []),
    [today],
  );

  const doneToday = useMemo(() => {
    if (!hydrated) return 0;
    return store.habits.filter((habit) =>
      (store.checkIns[habit.id] ?? []).includes(today),
    ).length;
  }, [hydrated, store, today]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Habits
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Check off each day. Last {DAY_WINDOW} days shown.
          </p>
        </div>
        {hydrated && store.habits.length > 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {doneToday} of {store.habits.length}
            </span>{" "}
            done today
          </p>
        )}
      </header>

      <HabitForm onAdd={addHabit} />

      {!hydrated ? (
        <div className="rounded-xl border border-neutral-200 px-6 py-12 text-center text-sm text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
          Loading…
        </div>
      ) : (
        <HabitGrid
          habits={store.habits}
          checkIns={store.checkIns}
          days={days}
          today={today}
          onToggle={toggleCheckIn}
          onDelete={removeHabit}
        />
      )}
    </main>
  );
}
