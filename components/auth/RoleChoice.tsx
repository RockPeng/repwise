"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * The role choice.
 *
 * FitCoach is a two-sided marketplace, so the very first decision a new
 * account makes is which side of it they are on. It is a pair of buttons
 * rather than a radio pair because the cards carry a description and a
 * marker, and a radio group would hide one of those behind a dot.
 *
 * The selection is a chamfered accent block in the corner of the chosen
 * card, next to an accent border — the same cut-corner language the media
 * frames use.
 */

type Role = {
  id: string;
  title: string;
  body: string;
  icon: IconName;
};

const roles: Role[] = [
  {
    id: "member",
    title: "I want a coach",
    body: "Find a trainer, follow their programme, book private sessions",
    icon: "user",
  },
  {
    id: "coach",
    title: "I want to coach",
    body: "Sell programmes, take bookings, get paid weekly",
    icon: "users",
  },
];

export function RoleChoice() {
  const [role, setRole] = useState(roles[0].id);

  return (
    <div>
      <p className="mb-2 text-[13px] text-ink-2">How will you use FitCoach?</p>

      <input type="hidden" name="role" value={role} />

      <div className="grid gap-3">
        {roles.map((option) => {
          const selected = option.id === role;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setRole(option.id)}
              className={`flex w-full items-start gap-3.5 rounded-field border p-4 text-left transition-colors ${
                selected
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-surface-1 hover:border-line-2 hover:bg-surface-2"
              }`}
            >
              {/* The marker. The space is reserved either way so the two
                  cards do not jump when the selection changes. */}
              <span aria-hidden="true" className="mt-[3px] block size-3.5 shrink-0">
                {selected ? (
                  <span
                    className="chamfer-tl block size-full bg-accent"
                    style={{ "--cut": "5px" } as React.CSSProperties}
                  />
                ) : null}
              </span>

              <span className="min-w-0">
                <span className="flex items-center gap-2 font-display text-[15px] font-bold tracking-[-0.01em] text-ink">
                  <Icon name={option.icon} size={16} className="text-accent" />
                  {option.title}
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-ink-2">
                  {option.body}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
