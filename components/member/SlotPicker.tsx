"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * The slot picker.
 *
 * A client component because it holds one piece of state: which slot is
 * selected. Everything it renders — the days, the times, the price — is
 * passed in from the server page so the boundary stays clean.
 *
 * The shape follows the rest of the product: an accent fill for the thing
 * you have chosen, a hairline outline for the things you have not, and a
 * flat, struck-through chip for the ones that are already gone.
 */

export type PickerDay = {
  /** A stable key for the day, the date string. */
  key: string;
  /** The weekday, three letters. */
  day: string;
  /** The date, for example `12 Nov`. */
  date: string;
};

export type PickerSlot = {
  id: string;
  /** The date the slot falls on, matching a day's key. */
  date: string;
  time: string;
  status: "open" | "booked" | "blocked";
  clientName?: string;
};

export function SlotPicker({
  days,
  slots,
  durationLabel,
  priceLabel,
  coachName,
}: {
  days: PickerDay[];
  slots: PickerSlot[];
  /** Already formatted, for example `50 min`. */
  durationLabel: string;
  /** Already formatted, for example `$95`. */
  priceLabel: string;
  coachName: string;
}) {
  const [dayKey, setDayKey] = useState(days[0]?.key ?? "");
  const [slotId, setSlotId] = useState<string | null>(null);

  const daySlots = slots.filter((slot) => slot.date === dayKey);
  const selected = slots.find((slot) => slot.id === slotId) ?? null;

  function chooseDay(key: string) {
    setDayKey(key);
    setSlotId(null);
  }

  return (
    <div className="rounded-panel border border-line bg-surface-1 p-5 sm:p-6">
      <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
        Pick a time
      </h2>

      {/* The days. */}
      <div className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
        {days.map((day) => {
          const active = day.key === dayKey;
          const open = slots.some(
            (slot) => slot.date === day.key && slot.status === "open",
          );

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => chooseDay(day.key)}
              aria-pressed={active}
              className={`flex shrink-0 flex-col items-center rounded-field border px-3 py-2 transition-colors ${
                active
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-surface-1 hover:border-line-2"
              }`}
            >
              <span
                className={`text-[13px] font-semibold ${
                  active ? "text-accent" : "text-ink"
                }`}
              >
                {day.day}
              </span>
              <span className="tnum mt-0.5 text-[12px] text-ink-3">
                {day.date}
              </span>
              <span
                aria-hidden="true"
                className={`mt-1.5 h-1 w-1 rounded-full ${
                  open ? "bg-accent" : "bg-line-2"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* The times on the chosen day. */}
      <div className="mt-6">
        {daySlots.length === 0 ? (
          <p className="text-[14px] leading-relaxed text-ink-3">
            {coachName} is not taking sessions on this day. Try another one.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {daySlots.map((slot) => {
              const taken = slot.status !== "open";
              const active = slot.id === slotId;

              return (
                <li key={slot.id}>
                  <button
                    type="button"
                    disabled={taken}
                    onClick={() => setSlotId(slot.id)}
                    aria-pressed={active}
                    className={`flex w-full flex-col items-center gap-0.5 rounded-field border px-3 py-2.5 transition-colors ${
                      active
                        ? "border-accent bg-accent text-accent-ink"
                        : taken
                          ? "cursor-not-allowed border-line bg-surface-2 text-ink-3"
                          : "border-line-2 text-ink hover:border-accent/60 hover:bg-surface-2"
                    }`}
                  >
                    <span className="tnum text-[14px] font-medium">
                      {slot.time}
                    </span>
                    <span className="text-[11px] opacity-80">
                      {taken ? "Taken" : "Open"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* The summary and the commitment. */}
      <div className="mt-6 border-t border-line pt-5">
        <p className="text-[14px] text-ink-2">
          <span className="tnum">{durationLabel}</span>
          <span aria-hidden="true" className="mx-2 text-line-2">
            ·
          </span>
          Video call
          <span aria-hidden="true" className="mx-2 text-line-2">
            ·
          </span>
          <span className="tnum font-semibold text-ink">{priceLabel}</span>
        </p>

        {selected ? (
          <p className="mt-2 flex items-center gap-2 text-[13px] text-accent">
            <Icon name="calendar" size={14} />
            <span className="tnum">
              {selected.date}, {selected.time}
            </span>
          </p>
        ) : (
          <p className="mt-2 text-[13px] text-ink-3">
            Choose a time and it goes in both calendars.
          </p>
        )}

        <div className="mt-4">
          <Button className="w-full" size="lg" icon="check" disabled={!selected}>
            Book session
          </Button>
        </div>
      </div>
    </div>
  );
}
