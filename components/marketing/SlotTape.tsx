import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Dot } from "@/components/ui/Badge";

/**
 * The slot tape.
 *
 * A coach's week is the most concrete thing the marketplace has to offer, so
 * it gets a first-class object rather than a paragraph about it. Each chip is
 * one bookable session: the time is the loudest thing on it, because that is
 * what people scan for.
 */
export type SlotChip = {
  id: string;
  time: string;
  day: string;
  date: string;
  coach: string;
  avatar: string;
  href: string;
};

export function SlotTape({
  slots,
  label = "Next available",
  className = "",
}: {
  slots: SlotChip[];
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center ${className}`}>
      <div className="flex shrink-0 items-center gap-2">
        <Dot tone="accent" pulse />
        <span className="text-[13px] font-medium text-ink-2">{label}</span>
      </div>

      <ul className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {slots.map((slot) => (
          <li key={slot.id}>
            <Link
              href={slot.href}
              className="group flex items-center gap-3 rounded-field border border-line bg-surface-1 py-2 pl-2 pr-4 transition-colors hover:border-accent/60 hover:bg-surface-2"
            >
              <Avatar name={slot.coach} src={slot.avatar} size={30} />
              <span className="flex flex-col leading-tight">
                <span className="tnum font-display text-[14px] font-bold tracking-tight text-ink transition-colors group-hover:text-accent">
                  {slot.time}
                </span>
                <span className="text-[11px] text-ink-3">
                  {slot.day} · {slot.coach.split(" ")[0]}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
