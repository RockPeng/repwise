import Link from "next/link";
import { Sidebar, UserChip, type NavItem } from "@/components/app/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Badge, Dot } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { currentTrainer } from "@/lib/data";

const nav: NavItem[] = [
  { href: "/trainer", label: "Overview", icon: "grid" },
  { href: "/trainer/clients", label: "Clients", icon: "users", badge: "6" },
  { href: "/trainer/programs", label: "Programmes", icon: "layers" },
  { href: "/trainer/schedule", label: "Schedule", icon: "calendar" },
  { href: "/trainer/earnings", label: "Earnings", icon: "trending" },
  { href: "/trainer/payouts", label: "Payouts", icon: "wallet" },
];

/**
 * The coach console.
 *
 * A different posture from the member area: denser, with the money and the
 * status of the account always within one click. The rail is solid rather
 * than transparent and the rows are ruled, because this is a work tool
 * rather than something you scroll through.
 */
export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <Sidebar
        items={nav}
        tone="coach"
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
          <>
            <div className="px-2">
              <Badge tone="accent" icon={<Dot tone="accent" />}>
                Payouts enabled
              </Badge>
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <UserChip
                name={currentTrainer.name}
                meta="Coach"
                avatar={currentTrainer.avatar}
              />
            </div>
          </>
        }
      />

      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-[1180px]">{children}</div>
      </main>
    </div>
  );
}
