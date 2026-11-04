import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Avatar } from "@/components/ui/Avatar";
import { Dot } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Chamfer } from "@/components/ui/Chamfer";
import { Icon } from "@/components/ui/Icon";
import { Progress } from "@/components/ui/Progress";
import { CallFrame } from "@/components/session/CallFrame";
import {
  conversations,
  enrollments,
  member,
  messages,
  programs,
  trainers,
  type Conversation,
  type Message,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Conversation · FitCoach",
  description:
    "Your messages with a coach, the session they have booked, and the programme you are running.",
  robots: { index: false, follow: false },
};

const attachmentIcon = {
  program: "layers",
  slot: "calendar",
  video: "video",
} as const;

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation =
    conversations.find((item) => item.id === id) ?? conversations[0];

  const thread = messages[conversation.id] ?? [];
  const groups = groupByAuthor(thread);
  const slotAttachment = [...thread]
    .reverse()
    .find((message) => message.attachment?.kind === "slot")?.attachment;

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-10">
      <div className="min-w-0">
        <header className="flex flex-wrap items-center gap-3 border-b border-line pb-5">
          <span className="relative shrink-0">
            <Avatar
              name={conversation.name}
              src={conversation.avatar}
              size={44}
            />
            {conversation.online ? (
              <span className="absolute -bottom-0.5 -right-0.5 flex size-3 items-center justify-center rounded-full bg-surface-0">
                <Dot tone="accent" />
              </span>
            ) : null}
          </span>

          <div className="min-w-0">
            <h1 className="font-display text-[19px] font-bold leading-tight tracking-[-0.02em] text-ink">
              {conversation.name}
            </h1>
            <p className="mt-0.5 text-[13px] text-ink-3">{conversation.role}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button icon="video">Start a video call</Button>
            <Button
              variant="secondary"
              icon="more-horizontal"
              aria-label="More options"
              className="px-3"
            >
              <span className="sr-only">More options</span>
            </Button>
          </div>
        </header>

        <NextCall
          coach={conversation}
          slotTitle={slotAttachment?.title}
          slotDetail={slotAttachment?.detail}
        />

        <div className="mt-6 space-y-5">
          {groups.map((group) => (
            <MessageGroup key={group.key} group={group} />
          ))}
        </div>

        <Composer />
      </div>

      <aside className="hidden xl:block">
        <ContextPanel
          conversation={conversation}
          slotTitle={slotAttachment?.title}
        />
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type Group = {
  key: string;
  author: "me" | "them";
  items: Message[];
};

/** Consecutive messages from the same person are one group. */
function groupByAuthor(thread: Message[]): Group[] {
  const groups: Group[] = [];

  for (const message of thread) {
    const last = groups[groups.length - 1];
    if (last && last.author === message.author) {
      last.items.push(message);
    } else {
      groups.push({
        key: `${message.author}-${groups.length}`,
        author: message.author,
        items: [message],
      });
    }
  }

  return groups;
}

function MessageGroup({ group }: { group: Group }) {
  const mine = group.author === "me";

  return (
    <div className={mine ? "flex justify-end" : "flex justify-start"}>
      <div className={mine ? "max-w-[85%] sm:max-w-[78%]" : "max-w-[85%] sm:max-w-[78%]"}>
        {group.items.map((message) => (
          <div
            key={message.id}
            className={`mb-1.5 rounded-panel px-4 py-3 last:mb-0 ${
              mine
                ? "rounded-br-md bg-accent-soft text-accent-ink"
                : "rounded-bl-md bg-surface-2 text-ink"
            }`}
          >
            <p className="text-[14px] leading-relaxed">{message.text}</p>

            {message.attachment ? (
              <div className="mt-2.5 flex items-start gap-3 rounded-field border border-line bg-surface-1 p-3">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-field bg-surface-2 text-accent">
                  <Icon
                    name={attachmentIcon[message.attachment.kind]}
                    size={16}
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-ink">
                    {message.attachment.title}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-3">
                    {message.attachment.detail}
                  </span>
                </span>
              </div>
            ) : null}
          </div>
        ))}

        <p
          className={`mt-1 text-[12px] text-ink-3 ${
            mine ? "text-right" : "text-left"
          }`}
        >
          {group.items[group.items.length - 1].time}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function NextCall({
  coach,
  slotTitle,
  slotDetail,
}: {
  coach: Conversation;
  slotTitle?: string;
  slotDetail?: string;
}) {
  return (
    <section className="mt-6 rounded-panel border border-line bg-surface-1 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-[15px] font-bold tracking-[-0.02em] text-ink">
            {slotTitle ? "Your next call" : "Start a call"}
          </h2>
          <p className="mt-1 text-[13px] text-ink-3">
            {slotTitle
              ? `${slotTitle} / ${slotDetail ?? "Video call"}`
              : `A private video session with ${coach.name}.`}
          </p>
        </div>
        <Button size="sm" icon="video">
          Join call
        </Button>
      </div>

      <div className="mt-4 max-w-[260px]">
        <CallFrame
          coach={coach.name}
          coachImage={coach.avatar}
          memberName={member.name}
          memberAvatar={member.avatar}
          elapsed="00:00"
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ContextPanel({
  conversation,
  slotTitle,
}: {
  conversation: Conversation;
  slotTitle?: string;
}) {
  const coach = trainers.find((item) => item.name === conversation.name);
  const program = programs.find(
    (item) => item.title === conversation.programTitle,
  );
  const enrollment = program
    ? enrollments.find((item) => item.programId === program.id)
    : undefined;
  const portrait = coach?.image ?? conversation.avatar;

  return (
    <div className="space-y-5">
      <section className="rounded-panel border border-line bg-surface-1 p-5">
        <Chamfer
          cut={20}
          accent
          className="aspect-square w-full overflow-hidden bg-surface-2"
        >
          <Image
            src={portrait}
            alt={coach ? `${coach.name}, your coach` : conversation.name}
            fill
            sizes="240px"
            className="object-cover"
          />
        </Chamfer>

        <h2 className="mt-4 font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
          {conversation.name}
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
          {coach ? coach.headline : conversation.role}
        </p>
      </section>

      {program ? (
        <section className="rounded-panel border border-line bg-surface-1 p-5">
          <h2 className="font-display text-[15px] font-bold tracking-[-0.02em] text-ink">
            Your programme
          </h2>

          <Link
            href={`/learn/${program.id}`}
            className="mt-2 block text-[14px] font-medium text-ink transition-colors hover:text-accent"
          >
            {program.title}
          </Link>

          <div className="mt-3">
            <Progress
              value={enrollment?.progress ?? 0}
              label={`${program.title} progress`}
            />
            <p className="mt-2 flex items-center gap-2 text-[13px] text-ink-3">
              <span className="tnum">
                {enrollment?.lessonsDone ?? 0} of{" "}
                {enrollment?.lessonsTotal ?? 0} lessons
              </span>
              <span aria-hidden="true" className="text-line-2">
                /
              </span>
              <span className="tnum">{enrollment?.progress ?? 0}%</span>
            </p>
          </div>
        </section>
      ) : (
        <section className="rounded-panel border border-line bg-surface-1 p-5">
          <h2 className="font-display text-[15px] font-bold tracking-[-0.02em] text-ink">
            About {coach ? coach.name.split(" ")[0] : "them"}
          </h2>

          {coach ? (
            <>
              <dl className="mt-3 space-y-2 text-[13px]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink-3">Location</dt>
                  <dd className="text-ink-2">{coach.location}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink-3">Experience</dt>
                  <dd className="tnum text-ink-2">{coach.yearsExperience} years</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink-3">Replies</dt>
                  <dd className="text-ink-2">{coach.responds}</dd>
                </div>
              </dl>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {coach.specialties.map((specialty) => (
                  <li
                    key={specialty}
                    className="rounded-full border border-line px-2.5 py-[3px] text-[12px] text-ink-3"
                  >
                    {specialty}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
              {conversation.role}
            </p>
          )}
        </section>
      )}

      <section className="rounded-panel border border-line bg-surface-1 p-5">
        <h2 className="font-display text-[15px] font-bold tracking-[-0.02em] text-ink">
          Next session
        </h2>
        <p className="mt-2 text-[14px] font-medium text-ink">
          {slotTitle ?? "Nothing booked yet"}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
          {member.sessionsThisMonth} sessions this month, all of them with{" "}
          {conversation.name}.
        </p>

        <div className="mt-4">
          <ButtonLink
            href={`/book/${coach?.id ?? "maya-okafor"}`}
            variant="secondary"
            className="w-full"
          >
            Book a session
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Composer() {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 rounded-field border border-line bg-surface-1 p-1.5">
        <label htmlFor="composer" className="sr-only">
          Write a message
        </label>
        <input
          id="composer"
          type="text"
          placeholder="Write a message"
          className="h-9 min-w-0 flex-1 bg-transparent px-2.5 text-[14px] text-ink placeholder:text-ink-3 focus:outline-none"
        />
        <Button
          variant="ghost"
          size="sm"
          icon="copy"
          aria-label="Attach a file"
          className="px-2.5"
        >
          <span className="sr-only">Attach a file</span>
        </Button>
        <Button size="sm" icon="send">
          Send
        </Button>
      </div>
    </div>
  );
}
