import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Chamfer } from "@/components/ui/Chamfer";
import { Dot } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { ProgramCard } from "@/components/marketing/ProgramCard";
import { CoachCard } from "@/components/marketing/CoachCard";
import { SectionHead } from "@/components/marketing/SectionHead";
import { SlotTape, type SlotChip } from "@/components/marketing/SlotTape";
import { CallFrame } from "@/components/session/CallFrame";
import {
  howItWorks,
  marketplaceStats,
  member,
  programs,
  testimonials,
  trainers,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "FitCoach — train with a coach who watches the numbers",
  description:
    "Find a personal trainer, buy their programme, book a private session. Every lesson, every rep and every week tracked in one place.",
};

/** The next bookable sessions, as shown on the homepage tape. */
const openSlots: SlotChip[] = [
  {
    id: "t1",
    time: "7:00am",
    day: "Mon",
    date: "10 Nov",
    coach: "Maya Okafor",
    avatar: trainers[0].avatar,
    href: "/book/maya-okafor",
  },
  {
    id: "t2",
    time: "8:00am",
    day: "Tue",
    date: "11 Nov",
    coach: "Maya Okafor",
    avatar: trainers[0].avatar,
    href: "/book/maya-okafor",
  },
  {
    id: "t3",
    time: "6:30pm",
    day: "Tue",
    date: "11 Nov",
    coach: "Diego Ramirez",
    avatar: trainers[1].avatar,
    href: "/book/diego-ramirez",
  },
  {
    id: "t4",
    time: "4:30pm",
    day: "Thu",
    date: "12 Nov",
    coach: "Maya Okafor",
    avatar: trainers[0].avatar,
    href: "/book/maya-okafor",
  },
  {
    id: "t5",
    time: "9:00am",
    day: "Wed",
    date: "12 Nov",
    coach: "Hanna Lindqvist",
    avatar: trainers[2].avatar,
    href: "/book/hanna-lindqvist",
  },
  {
    id: "t6",
    time: "6:00pm",
    day: "Fri",
    date: "14 Nov",
    coach: "Tom Weaver",
    avatar: trainers[5].avatar,
    href: "/book/tom-weaver",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <SlotStrip />
      <Stats />
      <Programmes />
      <Coaches />
      <HowItWorks />
      <Sessions />
      <Testimonials />
      <CoachCallToAction />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0 opacity-60"
        style={{
          maskImage:
            "radial-gradient(120% 90% at 15% 0%, black 0%, transparent 65%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 15% 0%, black 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-16 lg:pb-20 lg:pt-20">
        <div className="max-w-xl">
          <p className="flex items-center gap-2.5 text-[13px] font-medium text-ink-2">
            <Dot tone="accent" pulse />
            14 coaches have open slots this week
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.6rem,6vw,4.6rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink stretch-wide text-balance">
            A coach, a plan, and the numbers to prove it.
          </h1>

          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-2">
            Buy a programme from a coach you trust, book a private session with
            the same person, and watch the weeks add up. Every set logged,
            every lesson tracked, every coach one message away.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/trainers" size="lg" icon="arrow-right">
              Browse coaches
            </ButtonLink>
            <ButtonLink
              href="#how-it-works"
              variant="secondary"
              size="lg"
              icon="play"
            >
              See how it works
            </ButtonLink>
          </div>
        </div>

        <Chamfer
          cut={56}
          accent
          className="aspect-[4/5] w-full overflow-hidden bg-surface-2 lg:aspect-[3/4]"
        >
          <Image
            src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=85"
            alt="An athlete mid-set in a dark gym"
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
        </Chamfer>
      </div>
    </section>
  );
}

function SlotStrip() {
  return (
    <section className="border-b border-line bg-surface-1">
      <div className="mx-auto max-w-[1240px] px-5 py-5 sm:px-8">
        <SlotTape slots={openSlots} label="Next available sessions" />
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-7 py-10 sm:grid-cols-4 sm:gap-x-0 sm:py-12">
          {marketplaceStats.map((stat, index) => (
            <li
              key={stat.label}
              className={
                index > 0
                  ? "sm:border-l sm:border-line sm:pl-7"
                  : undefined
              }
            >
              <p className="tnum font-display text-[clamp(1.75rem,3.4vw,2.25rem)] font-extrabold leading-none tracking-[-0.03em] text-ink">
                {stat.value}
              </p>
              <p className="mt-2 text-[13px] text-ink-3">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Programmes() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-24">
      <SectionHead
        title="Programmes that come with a coach attached"
        body="Every programme is written by a working coach, and that coach answers your messages for the whole run. No PDF, no forum, no ghosting after week four."
        action={{ label: "See all programmes", href: "/programs/stronger-in-12" }}
      />

      <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {programs.slice(0, 4).map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </section>
  );
}

function Coaches() {
  return (
    <section className="border-y border-line bg-surface-1">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-24">
        <SectionHead
          title="Coaches, not influencers"
          body="Every coach sets their own price, their own hours and their own programmes. You can see all of it — rating, specialism, what a session costs — before you pay anyone."
          action={{ label: "Browse all coaches", href: "/trainers" }}
        />

        <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.slice(0, 4).map((trainer) => (
            <CoachCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-24">
      <SectionHead
        title="Four steps, and you are training"
        body="Nothing between you and the work. No contracts, no minimum terms, no calls to a call centre."
      />

      <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {howItWorks.map((step, index) => (
          <li key={step.title} className="border-t border-line pt-5">
            <p className="tnum font-display text-[13px] font-bold tracking-[0.12em] text-accent">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 font-display text-[19px] font-bold tracking-[-0.02em] text-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Sessions() {
  return (
    <section id="sessions" className="border-y border-line bg-surface-1">
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-24">
        <div>
          <p className="text-[13px] font-medium text-accent">
            One-to-one sessions
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            When the week goes sideways, talk to the person who wrote the plan.
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-ink-2">
            Book a session with your coach and it runs in the browser — video,
            screen share for your lift, and the notes sent straight to your
            programme. Coaches answer within a day, and most answer sooner.
          </p>

          <ul className="mt-8 space-y-3.5">
            {[
              {
                icon: "calendar" as const,
                title: "Slots that match your week",
                body: "Coaches publish the hours they actually work. Pick one, pay, and it is in both calendars.",
              },
              {
                icon: "video" as const,
                title: "Video, screen share, no download",
                body: "Runs in the browser with the call set up the moment you arrive.",
              },
              {
                icon: "notebook" as const,
                title: "Notes that change the programme",
                body: "Whatever you cover goes into the next week of training before you train it.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-field border border-line bg-surface-2 text-accent">
                  <Icon name={item.icon} size={17} />
                </span>
                <div>
                  <p className="font-display text-[15px] font-bold tracking-tight text-ink">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <ButtonLink href="/trainers" variant="secondary" icon="arrow-right">
              Find a coach with open slots
            </ButtonLink>
          </div>
        </div>

        <CallFrame
          coach={trainers[0].name}
          coachImage={trainers[0].image}
          memberName={member.name}
          memberAvatar={member.avatar}
        />
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-24">
      <SectionHead
        title="The part that actually worked"
        body="Three people, three programmes, three very different reasons for staying."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex flex-col border-t border-line pt-6"
          >
            <blockquote className="flex-1 text-[16px] leading-relaxed text-ink">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <Avatar
                name={testimonial.name}
                src={testimonial.avatar}
                size={40}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">
                  {testimonial.name}
                </p>
                <p className="text-[13px] text-ink-3">{testimonial.detail}</p>
              </div>
              <span className="tnum ml-auto shrink-0 rounded-full border border-accent/40 bg-accent-soft px-2.5 py-1 text-[12px] font-medium text-accent">
                {testimonial.result}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function CoachCallToAction() {
  return (
    <section className="border-t border-line bg-surface-1">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
        <div className="relative overflow-hidden rounded-panel border border-line bg-surface-2 px-6 py-14 sm:px-12 lg:px-16">
          <div
            aria-hidden="true"
            className="grid-lines pointer-events-none absolute inset-0 opacity-40"
          />

          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[13px] font-medium text-accent">
                For coaches
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
                Sell programmes, book sessions, get paid every week.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-2">
                Set your own price for a session. Write a programme once and
                sell it as many times as you like. You keep 80% of everything,
                and the money lands in your account, not ours.
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-4">
              <ButtonLink href="/trainer" size="lg" icon="arrow-right">
                Start coaching on FitCoach
              </ButtonLink>
              <p className="tnum text-[13px] text-ink-3">
                1,240 coaches · programmes from $59
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
