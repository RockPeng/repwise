"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { Wordmark } from "@/components/marketing/SiteHeader";

/**
 * The application sidebar.
 *
 * Two audiences share the product but not the posture: a member is a
 * consumer, a coach is running a business. The member's nav is a set of
 * quiet pills; the coach's is a dense list with a rule down the left edge
 * and a hard marker on the active row. Same tokens, same type, different
 * manners.
 *
 * The desktop rail and the mobile bar are the same navigation rendered twice
 * — once as a column, once as a scrolling row — so the active state can
 * never disagree between them.
 */
export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  /** A count or status shown on the right of the row. */
  badge?: string;
};

export function Sidebar({
  items,
  tone = "member",
  header,
  footer,
}: {
  items: NavItem[];
  tone?: "member" | "coach";
  /** Shown next to the wordmark on small screens. */
  header?: ReactNode;
  /** Shown at the foot of the desktop rail. */
  footer?: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: a fixed rail. */}
      <aside
        className={`sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-line lg:flex ${
          tone === "coach" ? "bg-surface-1" : "bg-surface-0"
        }`}
      >
        <div className="flex h-16 items-center px-5">
          <Link href="/" aria-label="FitCoach home">
            <Wordmark />
          </Link>
        </div>

        <nav className="flex-1 px-3 py-2">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <NavRow
                  item={item}
                  active={isActive(pathname, item.href)}
                  tone={tone}
                />
              </li>
            ))}
          </ul>
        </nav>

        {footer ? (
          <div className="border-t border-line px-3 py-4">{footer}</div>
        ) : null}
      </aside>

      {/* Mobile: a scrollable row under the brand. */}
      <div className="sticky top-0 z-40 border-b border-line bg-surface-0/90 backdrop-blur-md lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" aria-label="FitCoach home">
            <Wordmark />
          </Link>
          {header ? (
            <div className="flex items-center gap-2">{header}</div>
          ) : null}
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
          {items.map((item) => (
            <NavRow
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
              tone={tone}
              compact
            />
          ))}
        </nav>
      </div>
    </>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/trainer" || href === "/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavRow({
  item,
  active,
  tone,
  compact = false,
}: {
  item: NavItem;
  active: boolean;
  tone: "member" | "coach";
  compact?: boolean;
}) {
  // The mobile row is always the pill treatment — a left rule reads as a
  // mistake in a horizontal strip.
  if (tone === "coach" && !compact) {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={`relative flex items-center gap-3 border-l-2 px-3 py-2 text-sm transition-colors ${
          active
            ? "border-accent bg-surface-2 font-medium text-ink"
            : "border-transparent text-ink-2 hover:bg-surface-2 hover:text-ink"
        }`}
      >
        <Icon name={item.icon} size={17} className={active ? "text-accent" : ""} />
        <span className="whitespace-nowrap">{item.label}</span>
        {item.badge ? (
          <span className="tnum ml-auto text-[12px] text-ink-3">{item.badge}</span>
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-full px-3.5 py-2 text-sm transition-colors ${
        active
          ? "bg-accent-soft font-medium text-accent"
          : "text-ink-2 hover:bg-surface-2 hover:text-ink"
      } ${compact ? "shrink-0" : ""}`}
    >
      <Icon name={item.icon} size={17} />
      <span className="whitespace-nowrap">{item.label}</span>
      {item.badge ? (
        <span className="tnum ml-auto rounded-full bg-accent-solid px-1.5 text-[11px] font-semibold text-accent-ink">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

/**
 * The user chip at the foot of the sidebar.
 */
export function UserChip({
  name,
  meta,
  avatar,
}: {
  name: string;
  meta: string;
  avatar?: string;
}) {
  return (
    <Link
      href="#"
      className="flex items-center gap-3 rounded-field px-2 py-2 transition-colors hover:bg-surface-2"
    >
      <Avatar name={name} src={avatar} size={32} />
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[13px] font-medium text-ink">
          {name}
        </span>
        <span className="block truncate text-[12px] text-ink-3">{meta}</span>
      </span>
    </Link>
  );
}
