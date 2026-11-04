import Link from "next/link";
import { Wordmark } from "@/components/marketing/SiteHeader";

/**
 * The checkout shell.
 *
 * Deliberately the quietest shell in the product: a thin bar, the mark, and
 * a way to ask a human a question. No navigation, no footer, nothing to
 * click away to — the person who just paid should have one obvious next
 * step and no other.
 */
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[900px] flex-col gap-2 px-5 py-4 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-0">
          <Link href="/" className="inline-flex w-fit shrink-0">
            <Wordmark />
            <span className="sr-only">FitCoach home</span>
          </Link>

          <a
            href="mailto:help@fitcoach.example"
            className="text-[13px] text-ink-2 transition-colors hover:text-ink"
          >
            Questions? help@fitcoach.example
          </a>
        </div>
      </header>

      <main className="flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto w-full max-w-[900px]">{children}</div>
      </main>
    </div>
  );
}
