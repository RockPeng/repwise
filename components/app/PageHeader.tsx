import type { ReactNode } from "react";

/**
 * The header of a page inside the application.
 *
 * One level of heading, a line that says what the page is for, and the
 * actions on the right. Everything in the app shell is left-aligned and
 * tight — the display face is used once, at the top, and then the page
 * settles into body text and data.
 */
export function PageHeader({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4 border-b border-line pb-6">
      <div className="min-w-0">
        <h1 className="font-display text-[clamp(1.6rem,3vw,2.1rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-2">
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
