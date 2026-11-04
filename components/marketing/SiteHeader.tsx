import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";

/**
 * The wordmark.
 *
 * A chamfered accent block, then the name set wide and tight in the display
 * face. The block is the same cut-corner shape used for every media frame in
 * the product, so the mark reads as part of the system rather than a logo
 * bolted on top of it.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className="chamfer-tl block size-3.5 bg-accent"
        style={{ "--cut": "5px" } as React.CSSProperties}
      />
      <span className="font-display text-[17px] font-extrabold tracking-[-0.03em] text-ink">
        FitCoach
      </span>
    </span>
  );
}

const nav = [
  { href: "/programs/stronger-in-12", label: "Programmes" },
  { href: "/trainers", label: "Coaches" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#sessions", label: "1:1 sessions" },
  { href: "/trainer", label: "For coaches" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface-0/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="shrink-0">
          <Wordmark />
          <span className="sr-only">FitCoach home</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14px] text-ink-2 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Link
            href="/login"
            className="hidden h-9 items-center rounded-full px-4 text-sm text-ink-2 transition-colors hover:text-ink sm:inline-flex"
          >
            Log in
          </Link>
          <ButtonLink href="/signup" size="sm" className="px-4">
            Get started
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
