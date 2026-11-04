import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { CoachCard } from "@/components/marketing/CoachCard";
import { SectionHead } from "@/components/marketing/SectionHead";
import { Icon } from "@/components/ui/Icon";
import { specialties, trainers } from "@/lib/data";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Coaches — FitCoach",
  description:
    "Browse personal trainers on FitCoach. Every coach sets their own price, their own hours and their own programmes.",
};

/**
 * The coach directory.
 *
 * Filters are visual only in this build, so they are rendered as a single
 * row above the grid rather than as a sidebar — when they work, they will
 * narrow this row, and the layout already has room for it.
 */
export default function TrainersPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1240px] px-5 pb-12 pt-14 sm:px-8 lg:pb-16 lg:pt-20">
          <p className="text-[13px] font-medium text-accent">
            Showing {trainers.length} of 1,240 coaches
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.75rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink stretch-wide text-balance">
            Find the coach whose method you can actually follow.
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-2">
            Every coach here works with people full time. Read what they
            specialise in, what a session costs and what they have done for
            other people, then book a slot.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-medium text-accent">
              All coaches
            </span>
            {specialties.map((specialty) => (
              <span
                key={specialty}
                className="rounded-full border border-line px-3 py-1.5 text-[13px] text-ink-2 transition-colors hover:border-line-2 hover:text-ink"
              >
                {specialty}
              </span>
            ))}
          </div>

          <label className="flex h-10 items-center gap-2.5 rounded-field border border-line bg-surface-1 px-3.5 text-ink-3 focus-within:border-accent lg:w-72">
            <Icon name="search" size={16} />
            <input
              type="search"
              placeholder="Search by name or specialism"
              aria-label="Search coaches"
              className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-3"
            />
          </label>
        </div>

        <div className="grid gap-x-7 gap-y-14 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer) => (
            <CoachCard key={trainer.id} trainer={trainer} headingLevel="h2" />
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface-1">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.1rem)] font-extrabold tracking-[-0.03em] text-ink">
              Sessions start at {money(7500)} and run 45 minutes.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
              Most coaches answer within a day. Book a slot, pay, and it is in
              both calendars — no emails, no chasing.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <ButtonLink href="/trainers" icon="arrow-right">
              Browse coaches
            </ButtonLink>
            <ButtonLink href="/signup" variant="secondary">
              Create an account
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
