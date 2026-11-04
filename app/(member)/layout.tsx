import Link from "next/link";
import { Sidebar, UserChip, type NavItem } from "@/components/app/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Icon } from "@/components/ui/Icon";
import { member } from "@/lib/data";

const nav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/learn/stronger-in-12", label: "My programme", icon: "dumbbell" },
  { href: "/messages", label: "Messages", icon: "message", badge: "2" },
  { href: "/book/maya-okafor", label: "Book a session", icon: "calendar" },
];

/**
 * The member area.
 *
 * A quiet rail and a lot of white space. A member is using this on a phone
 * between sets, so the navigation is four things and the page content is
 * wide and legible.
 */
export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <Sidebar
        items={nav}
        tone="member"
        header={
          <>
            <ThemeToggle />
            <Link
              href="/login"
              aria-label="Log out"
              title="Log out"
              className="inline-flex size-9 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-2 hover:text-ink"
            >
              <Icon name="log-out" size={16} />
            </Link>
          </>
        }
        footer={
          <UserChip name={member.name} meta="Member" avatar={member.avatar} />
        }
      />

      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-[1080px]">{children}</div>
      </main>
    </div>
  );
}
