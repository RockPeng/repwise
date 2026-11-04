import Link from "next/link";
import { Wordmark } from "./SiteHeader";
import { Icon, type IconName } from "@/components/ui/Icon";

const columns: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Marketplace",
    links: [
      { label: "Programmes", href: "/programs/stronger-in-12" },
      { label: "Coaches", href: "/trainers" },
      { label: "1:1 sessions", href: "/#sessions" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Become a coach", href: "/trainer" },
      { label: "Coach handbook", href: "/trainer" },
      { label: "Careers", href: "/#about" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help centre", href: "/#about" },
      { label: "Contact us", href: "/#about" },
      { label: "Privacy", href: "/#about" },
      { label: "Terms of service", href: "/#about" },
    ],
  },
];

const social: { name: string; icon: IconName }[] = [
  { name: "Instagram", icon: "grid" },
  { name: "YouTube", icon: "play" },
  { name: "TikTok", icon: "bolt" },
  { name: "X", icon: "x" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-1">
      <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Wordmark />
            <p className="mt-4 text-sm leading-relaxed text-ink-2">
              A coach, a plan, and the numbers to prove it. Find a personal
              trainer, follow their programme, book a private session.
            </p>
            <p className="mt-6 text-[13px] font-medium tracking-wide text-ink-3">
              #StrongerEveryday
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="font-display text-[13px] font-bold tracking-tight text-ink">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-2 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-ink-3">
            © 2026 FitCoach. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {social.map((item) => (
              <a
                key={item.name}
                href="#"
                aria-label={item.name}
                className="inline-flex size-9 items-center justify-center rounded-full border border-line text-ink-3 transition-colors hover:border-line-2 hover:text-ink"
              >
                <Icon name={item.icon} size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
