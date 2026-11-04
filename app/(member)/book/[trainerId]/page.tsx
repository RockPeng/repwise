import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Chamfer } from "@/components/ui/Chamfer";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Progress";
import { SlotPicker, type PickerDay } from "@/components/member/SlotPicker";
import { bookings, slots, trainerById } from "@/lib/data";
import { minutes, money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Book a session · FitCoach",
  description:
    "Choose a slot with your coach and book a private video session in the browser.",
  robots: { index: false, follow: false },
};

/**
 * The seven days the picker offers. The dates are pre-formatted strings, the
 * same way the rest of the demo data is, so the server render and the client
 * hydration agree on every character.
 */
const week: PickerDay[] = [
  { key: "10 Nov", day: "Mon", date: "10 Nov" },
  { key: "11 Nov", day: "Tue", date: "11 Nov" },
  { key: "12 Nov", day: "Wed", date: "12 Nov" },
  { key: "13 Nov", day: "Thu", date: "13 Nov" },
  { key: "14 Nov", day: "Fri", date: "14 Nov" },
  { key: "15 Nov", day: "Sat", date: "15 Nov" },
  { key: "16 Nov", day: "Sun", date: "16 Nov" },
];

export default async function BookPage({
  params,
}: {
  params: Promise<{ trainerId: string }>;
}) {
  const { trainerId } = await params;
  const trainer = trainerById(trainerId);

  const coachSlots = slots.map((slot) => ({
    id: slot.id,
    date: slot.date,
    time: slot.time,
    status: slot.status,
    clientName: slot.clientName,
  }));

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-14">
        <div className="min-w-0">
          <Chamfer
            cut={28}
            accent
            className="aspect-[4/5] w-full overflow-hidden bg-surface-2"
          >
            <Image
              src={trainer.image}
              alt={`${trainer.name}, ${trainer.specialties.join(", ")} coach`}
              fill
              sizes="(max-width: 1024px) 100vw, 380px"
              className="object-cover"
            />
          </Chamfer>

          <h1 className="mt-6 font-display text-[clamp(1.6rem,3vw,2.1rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink">
            {trainer.name}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
            {trainer.headline}
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {trainer.specialties.map((specialty) => (
              <li key={specialty}>
                <Badge tone="outline">{specialty}</Badge>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 text-[13px] text-ink-2">
            <span className="flex items-center gap-1.5">
              <Stars value={trainer.rating} size={14} />
              <span className="tnum font-medium text-ink">
                {trainer.rating.toFixed(1)}
              </span>
              <span className="text-ink-3">({trainer.reviewCount} reviews)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="map-pin" size={14} className="text-ink-3" />
              {trainer.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="award" size={14} className="text-ink-3" />
              <span className="tnum">{trainer.yearsExperience} years</span>{" "}
              coaching
            </span>
          </div>

          <section className="mt-7">
            <h2 className="font-display text-[15px] font-bold tracking-[-0.02em] text-ink">
              What a session covers
            </h2>
            <ul className="mt-3 space-y-2.5">
              {[
                `${minutes(trainer.sessionDurationMin)} of one-to-one coaching, on a video call`,
                "The call runs in the browser, so you train from your own floor",
                "The notes go into your programme before your next session",
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-[14px] leading-relaxed text-ink-2">
                  <Icon
                    name="check"
                    size={15}
                    className="mt-1 shrink-0 text-accent"
                    strokeWidth={2.2}
                  />
                  {line}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="min-w-0">
          <SlotPicker
            days={week}
            slots={coachSlots}
            durationLabel={minutes(trainer.sessionDurationMin)}
            priceLabel={money(trainer.sessionPriceCents)}
            coachName={trainer.name}
          />

          <section className="mt-8 rounded-panel border border-line bg-surface-1 p-5 sm:p-6">
            <h2 className="font-display text-[15px] font-bold tracking-[-0.02em] text-ink">
              What happens next
            </h2>
            <ol className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-ink-2">
              <li className="flex gap-2.5">
                <span className="tnum shrink-0 font-display text-[13px] font-bold text-accent">
                  01
                </span>
                You pay now, and the money goes to {trainer.name.split(" ")[0]}{" "}
                once the session is done.
              </li>
              <li className="flex gap-2.5">
                <span className="tnum shrink-0 font-display text-[13px] font-bold text-accent">
                  02
                </span>
                You get a confirmation straight away, and a reminder the day
                before.
              </li>
              <li className="flex gap-2.5">
                <span className="tnum shrink-0 font-display text-[13px] font-bold text-accent">
                  03
                </span>
                The session lands in both calendars — yours and your coach’s.
              </li>
            </ol>
          </section>

          <section className="mt-8">
            <h2 className="font-display text-[15px] font-bold tracking-[-0.02em] text-ink">
              Your sessions
            </h2>

            <ul className="mt-3 divide-y divide-line border-y border-line">
              {bookings
                .filter((booking) => booking.status !== "cancelled")
                .slice(0, 3)
                .map((booking) => (
                  <li
                    key={booking.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-3.5"
                  >
                    <span className="tnum font-display text-[14px] font-semibold text-ink">
                      {booking.when}
                    </span>
                    <span className="text-[13px] text-ink-3">
                      {minutes(booking.durationMin)}
                    </span>
                    <Badge
                      tone={
                        booking.status === "confirmed" ? "accent" : "neutral"
                      }
                      className="ml-auto"
                    >
                      {booking.status === "confirmed"
                        ? "Confirmed"
                        : booking.status === "completed"
                          ? "Completed"
                          : "Awaiting payment"}
                    </Badge>
                  </li>
                ))}
            </ul>

            <p className="mt-4 text-[13px] leading-relaxed text-ink-3">
              Sessions you have booked are also in your{" "}
              <Link
                href="/messages"
                className="font-medium text-ink-2 underline decoration-line-2 underline-offset-4 transition-colors hover:text-accent"
              >
                messages
              </Link>{" "}
              with your coach.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
