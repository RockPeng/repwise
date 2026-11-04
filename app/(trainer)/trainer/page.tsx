import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Dot } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { EarningsChart } from "@/components/coach/EarningsChart";
import { StatTile } from "@/components/coach/StatTile";
import { WeekBar } from "@/components/coach/WeekBar";
import { programmeRevenue } from "@/components/coach/programmes";
import {
  bookings,
  clients,
  earnings,
  earningsByMonth,
  notifications,
  programsByTrainer,
  weekLoad,
} from "@/lib/data";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Overview — FitCoach",
  description:
    "Your coaching business at a glance: what you earned, who is waiting on you, and what is booked this week.",
  robots: { index: false, follow: false },
};

/** The tone of the dot next to an activity line. */
function activityTone(kind: (typeof notifications)[number]["kind"]) {
  if (kind === "sale" || kind === "booking") return "accent" as const;
  if (kind === "message") return "warn" as const;
  return "muted" as const;
}

export default function TrainerOverviewPage() {
  const activeClients = clients.filter((client) => client.status === "active").length;
  const sessionsThisWeek = weekLoad.reduce(
    (total, day) => total + day.sessions,
    0,
  );
  const programmeSales = earnings.filter(
    (entry) =>
      entry.source === "Programme sale" && entry.date.includes("Nov"),
  ).length;
  const todaysBookings = bookings.filter((booking) => booking.day === "Tue 11");
  const programmes = programsByTrainer("maya-okafor");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Your coaching business at a glance."
        actions={
          <ButtonLink href="/trainer/programs/new" icon="plus">
            New programme
          </ButtonLink>
        }
      />

      {/* The four figures ------------------------------------------- */}
      <ul className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-0">
        <li className="border-t border-line pt-5 sm:border-t-0 sm:pt-0">
          <StatTile
            label="Net earnings this month"
            value={money(earningsByMonth[5].netCents)}
            delta="+18% vs October"
            tone="accent"
          />
        </li>
        <li className="border-t border-line pt-5 sm:border-l sm:border-line sm:pl-6 sm:pt-0">
          <StatTile
            label="Active clients"
            value={String(activeClients)}
            delta="2 new this month"
            tone="accent"
          />
        </li>
        <li className="border-t border-line pt-5 sm:border-t-0 sm:pt-0 lg:border-l lg:border-line lg:pl-6">
          <StatTile
            label="Sessions this week"
            value={String(sessionsThisWeek)}
            delta="4 more than last week"
            tone="accent"
          />
        </li>
        <li className="border-t border-line pt-5 sm:border-l sm:border-line sm:pl-6 sm:pt-0">
          <StatTile
            label="Programme sales this month"
            value={String(programmeSales)}
            delta="1 refunded"
            tone="warn"
          />
        </li>
      </ul>

      {/* The chart and the week -------------------------------------- */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <section className="rounded-panel border border-line bg-surface-1">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-4">
            <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
              Net earnings
            </h2>
            <Link
              href="/trainer/earnings"
              className="text-[13px] font-medium text-ink-2 transition-colors hover:text-accent"
            >
              All earnings
            </Link>
          </div>
          <div className="px-5 py-5">
            <EarningsChart
              data={earningsByMonth.map((month) => ({
                month: month.month,
                netCents: month.netCents,
              }))}
            />
          </div>
        </section>

        <WeekBar />
      </div>

      {/* Today's sessions -------------------------------------------- */}
      <section className="rounded-panel border border-line bg-surface-1">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
            Today&rsquo;s sessions
          </h2>
          <p className="text-[13px] text-ink-3">Tuesday 11 November</p>
        </div>

        <ul className="divide-y divide-line">
          {todaysBookings.map((booking) => (
            <li
              key={booking.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4"
            >
              <span className="tnum w-[68px] font-display text-[15px] font-bold tracking-[-0.01em] text-ink">
                {booking.time}
              </span>

              <Avatar
                name={booking.clientName}
                src={booking.clientAvatar}
                size={34}
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-ink">
                  {booking.clientName}
                </p>
                <p className="mt-0.5 text-[13px] text-ink-3">
                  {booking.durationMin} min · Video call
                </p>
              </div>

              <span className="tnum text-[15px] font-medium text-ink">
                {money(booking.priceCents)}
              </span>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" icon="video">
                  Start call
                </Button>
                <button
                  type="button"
                  aria-label={`More options for the session with ${booking.clientName}`}
                  className="inline-flex size-8 items-center justify-center rounded-full border border-line text-ink-3 transition-colors hover:border-line-2 hover:text-ink"
                >
                  <Icon name="more-horizontal" size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Activity and programmes ------------------------------------- */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
              Recent activity
            </h2>
          </div>

          <ul className="mt-4 divide-y divide-line border-y border-line">
            {notifications.map((item) => (
              <li key={item.id} className="flex items-start gap-3 py-3.5">
                <span className="mt-2">
                  <Dot tone={activityTone(item.kind)} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-ink-3">
                    {item.body}
                  </p>
                </div>
                <span className="tnum shrink-0 text-[12px] text-ink-3">
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
              Your programmes
            </h2>
            <Link
              href="/trainer/programs"
              className="text-[13px] font-medium text-ink-2 transition-colors hover:text-accent"
            >
              All programmes
            </Link>
          </div>

          <ul className="mt-4 divide-y divide-line border-y border-line">
            {programmes.map((program) => (
              <li key={program.id} className="py-3.5">
                <Link
                  href={`/trainer/programs/${program.id}`}
                  className="block transition-colors hover:text-accent"
                >
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="font-display text-[15px] font-bold tracking-[-0.01em] text-ink">
                      {program.title}
                    </span>
                    <span className="tnum text-[13px] text-ink-3">
                      {program.studentCount.toLocaleString("en-US")} students
                    </span>
                  </span>

                  <span className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[13px] text-ink-3">
                    <span className="tnum text-ink">{money(program.priceCents)}</span>
                    <span className="tnum">
                      {money(programmeRevenue(program))} earned
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
