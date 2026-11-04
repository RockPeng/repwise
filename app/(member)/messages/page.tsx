import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/app/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Dot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { conversations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Messages · FitCoach",
  description:
    "Every conversation you have with the coaches you buy programmes and sessions from.",
  robots: { index: false, follow: false },
};

export default function MessagesPage() {
  return (
    <div>
      <PageHeader
        title="Messages"
        description="Talk to the coaches writing your programmes and running your sessions."
        actions={<Button icon="plus">New message</Button>}
      />

      <div className="mt-6">
        <div className="relative">
          <Icon
            name="search"
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
          />
          <label htmlFor="search-conversations" className="sr-only">
            Search conversations
          </label>
          <input
            id="search-conversations"
            type="search"
            placeholder="Search coaches and messages"
            className="h-11 w-full rounded-field border border-line bg-surface-1 pl-10 pr-4 text-[14px] text-ink placeholder:text-ink-3"
          />
        </div>
      </div>

      <ul className="mt-6 border-t border-line">
        {conversations.map((conversation) => (
          <li key={conversation.id} className="border-b border-line">
            <Link
              href={`/messages/${conversation.id}`}
              className="-mx-3 flex items-start gap-3.5 rounded-field px-3 py-4 transition-colors hover:bg-surface-1"
            >
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

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="truncate font-display text-[15px] font-bold tracking-[-0.01em] text-ink">
                    {conversation.name}
                  </span>
                  <span className="tnum shrink-0 text-[12px] text-ink-3">
                    {conversation.lastMessageAt}
                  </span>
                </span>

                <span className="mt-0.5 block text-[12px] text-ink-3">
                  {conversation.role}
                </span>

                <span className="mt-1.5 line-clamp-2 block text-[14px] leading-relaxed text-ink-2">
                  {conversation.lastMessage}
                </span>

                {conversation.programTitle ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-ink-3">
                    <Icon name="layers" size={13} />
                    {conversation.programTitle}
                  </span>
                ) : null}
              </span>

              {conversation.unread > 0 ? (
                <span className="tnum mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-ink">
                  {conversation.unread}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
