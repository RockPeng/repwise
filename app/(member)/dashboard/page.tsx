import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/app/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Dot } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Chamfer } from "@/components/ui/Chamfer";
import { Icon } from "@/components/ui/Icon";
import { Progress } from "@/components/ui/Progress";
import {
  conversations,
  enrollments,
  member,
  notifications,
  programById,
  trainerById,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Dashboard · FitCoach",
  description:
    "Your programmes, the next session with your coach, and anything waiting on you.",
  robots: { index: false, follow: false },
};

type DayState = "done" | "planned" | "rest";

/** The member's week, Monday to Sunday. */
const week: { day: string; date: string; state: DayState }[] = [
  { day: "Mon", date: "9", state: "done" },
  { day: "Tue", date: "10", state: "done" },
  { day: "Wed", date: "11", state: "rest" },
  { day: "Thu", date: "12", state: "planned" },
  { day: "Fri", date: "13", state: "planned" },
  { day: "Sat", date: "14", state: "rest" },
  { day: "Sun", date: "15", state: "rest" },
];

/** Today, inside the demo week. */
const today = "9";

const marker: Record<DayState, string> = {
  done: "bg-accent",
  planned: "border border-ink-3",
  rest: "bg-surface-2",
};

/** The notification kinds that mean something is moving. */
function notificationTone(kind: (typeof notifications)[number]["kind"]) {
  if (kind === "sale" || kind === "booking") return "accent" as const;
  if (kind === "message") return "warn" as const;
  return "muted" as const;
}

export default function DashboardPage() {
  const primary = enrollments[0];
  const primaryProgram = programById(primary.programId);
  const primaryCoach = trainerById(primaryProgram.trainerId);

  const recent = conversations.slice(0, 2);
  const orderedNotifications = [...notifications].sort(
    (a, b) => Number(a.read) - Number(b.read),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome back, Alex."
        description="Stronger in 12 is 68% done and your next session with Maya is on Thursday."
        actions={
          <ButtonLink
            href="/book/maya-okafor"
            variant="secondary"
            icon="calendar"
          >
            Book a session
          </ButtonLink>
        }
      />

      <ContinueTraining
        program={primaryProgram}
        coach={primaryCoach}
        progress={primary.progress}
        lessonsDone={primary.lessonsDone}
        lessonsTotal={primary.lessonsTotal}
        lastLesson={primary.lastLesson}
      />

      <ThisWeek />

      <div className="grid gap-8 lg:grid-cols-2">
        <NextSession />
        <RecentMessages conversations={recent} />
      </div>

      <Programmes />

      <Notifications items={orderedNotifications} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ContinueTraining({
  program,
  coach,
  progress,
  lessonsDone,
  lessonsTotal,
  lastLesson,
}: {
  program: ReturnType<typeof programById>;
  coach: ReturnType<typeof trainerById>;
  progress: number;
  lessonsDone: number;
  lessonsTotal: number;
  lastLesson: string;
}) {
  return (
    <section className="overflow-hidden rounded-panel border border-line bg-surface-1">
      <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_196px] lg:gap-8">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-accent">Continue training</p>

          <h2 className="mt-2 font-display text-[clamp(1.4rem,2.6vw,1.9rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">
            {program.title}
          </h2>

          <div className="mt-3 flex items-center gap-2.5">
            <Avatar name={coach.name} src={coach.avatar} size={30} />
            <p className="text-[13px] text-ink-2">{coach.name}</p>
          </div>

          <div className="mt-6">
            <Progress value={progress} label="Programme progress" />
            <p className="mt-2 flex items-center gap-2 text-[13px] text-ink-3">
              <span className="tnum">
                {lessonsDone} of {lessonsTotal} lessons
              </span>
              <span aria-hidden="true" className="text-line-2">
                /
              </span>
              <span className="tnum">{progress}% complete</span>
            </p>
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <p className="text-[13px] text-ink-3">Up next</p>
            <p className="mt-1.5 font-display text-[17px] font-bold leading-snug tracking-[-0.02em] text-ink">
              {lastLesson}
            </p>
          </div>

          <div className="mt-6">
            <ButtonLink href={`/learn/${program.id}`} icon="play">
              Resume lesson
            </ButtonLink>
          </div>
        </div>

        <div className="order-first lg:order-last">
          <Chamfer
            cut={20}
            accent
            className="mx-auto aspect-square w-full max-w-[220px] overflow-hidden bg-surface-2 lg:max-w-none"
          >
            <Image
              src={coach.image}
              alt={`${coach.name}, your coach`}
              fill
              sizes="(max-width: 1024px) 220px, 196px"
              className="object-cover"
            />
          </Chamfer>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ThisWeek() {
  return (
    <section className="rounded-panel border border-line bg-surface-1">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
            This week
          </h2>
          <p className="text-[13px] text-ink-3">9–15 November</p>
        </div>
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-ink-2">
          <Icon name="flame" size={15} className="text-accent" />
          {member.streakWeeks} weeks in a row
        </p>
      </div>

      <ol className="grid grid-cols-7 divide-x divide-line">
        {week.map((day) => {
          const isToday = day.date === today;
          return (
            <li
              key={day.day}
              aria-current={isToday ? "date" : undefined}
              className="px-1 py-4 text-center sm:px-2"
            >
              <p
                className={`text-[11px] font-medium ${
                  isToday ? "text-accent" : "text-ink-3"
                }`}
              >
                {day.day}
              </p>
              <span
                aria-hidden="true"
                className={`mx-auto mt-2.5 block size-2.5 ${marker[day.state]}`}
              />
              <p
                className={`tnum mt-2 text-[11px] ${
                  isToday ? "font-semibold text-ink" : "text-ink-3"
                }`}
              >
                {day.date}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function NextSession() {
  const coach = trainerById("maya-okafor");

  return (
    <section className="rounded-panel border border-line bg-surface-1 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
          Next session
        </h2>
        <p className="flex items-center gap-1.5 text-[13px] text-ink-2">
          <Icon name="clock" size={14} className="text-ink-3" />
          in 3 days
        </p>
      </div>

      <p className="mt-4 font-display text-[19px] font-bold leading-snug tracking-[-0.02em] text-ink">
        Thu 12 Nov, 4:30pm
      </p>
      <p className="mt-1.5 text-[13px] text-ink-3">
        50 minutes · Video call · Stronger in 12
      </p>

      <div className="mt-5 flex items-center gap-2.5 border-t border-line pt-4">
        <Avatar name={coach.name} src={coach.avatar} size={30} />
        <p className="text-[13px] text-ink-2">{coach.name}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button variant="secondary" icon="video">
          Join call
        </Button>
        <Link
          href="/messages/conv-maya"
          className="text-[13px] font-medium text-ink-2 transition-colors hover:text-accent"
        >
          Reschedule
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function RecentMessages({
  conversations: list,
}: {
  conversations: typeof conversations;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
          Recent messages
        </h2>
        <Link
          href="/messages"
          className="text-[13px] font-medium text-ink-2 transition-colors hover:text-accent"
        >
          All messages
        </Link>
      </div>

      <ul className="mt-4 divide-y divide-line border-y border-line">
        {list.map((conversation) => (
          <li key={conversation.id}>
            <Link
              href={`/messages/${conversation.id}`}
              className="-mx-2 flex items-start gap-3.5 rounded-field px-2 py-4 transition-colors hover:bg-surface-1"
            >
              <Avatar
                name={conversation.name}
                src={conversation.avatar}
                size={40}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate font-display text-[15px] font-bold tracking-[-0.01em] text-ink">
                    {conversation.name}
                  </p>
                  <span className="tnum shrink-0 text-[12px] text-ink-3">
                    {conversation.lastMessageAt}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-ink-2">
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread > 0 ? (
                <span className="tnum mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-ink">
                  {conversation.unread}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Programmes() {
  return (
    <section>
      <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
        Your programmes
      </h2>

      <ul className="mt-4 divide-y divide-line border-y border-line">
        {enrollments.map((enrollment) => {
          const program = programById(enrollment.programId);
          const coach = trainerById(program.trainerId);

          return (
            <li key={enrollment.id}>
              <Link
                href={`/learn/${program.id}`}
                className="-mx-2 flex items-center gap-4 rounded-field px-2 py-4 transition-colors hover:bg-surface-1"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate font-display text-[15px] font-bold tracking-[-0.01em] text-ink">
                      {program.title}
                    </p>
                    <span className="tnum shrink-0 text-[13px] font-medium text-ink-2">
                      {enrollment.progress}%
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <Progress
                      value={enrollment.progress}
                      label={`${program.title} progress`}
                    />
                  </div>

                  <p className="mt-2 text-[13px] text-ink-3">
                    {enrollment.lessonsDone} of {enrollment.lessonsTotal} lessons /
                    coach {coach.name}
                  </p>
                </div>

                <Icon
                  name="chevron-right"
                  size={16}
                  className="shrink-0 text-ink-3"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Notifications({
  items,
}: {
  items: typeof notifications;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
          Notifications
        </h2>
        <span className="tnum text-[13px] text-ink-3">
          {items.filter((item) => !item.read).length} unread
        </span>
      </div>

      <ul className="mt-4 divide-y divide-line border-y border-line">
        {items.slice(0, 4).map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 py-3.5"
          >
            <span className="mt-2">
              <Dot tone={notificationTone(item.kind)} />
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
  );
}
