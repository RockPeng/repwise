import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

/**
 * A section heading.
 *
 * The title is set in the display face at a size that changes with the
 * section's importance, and the supporting line sits directly under it in
 * body text. There is no eyebrow label above the title — the heading says
 * what the section is, and a label above it would only say it again.
 */
export function SectionHead({
  title,
  body,
  action,
  id,
  className = "",
}: {
  title: string;
  body?: string;
  action?: { label: string; href: string };
  id?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-6 ${className}`}>
      <div className="max-w-2xl">
        <h2
          id={id}
          className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink"
        >
          {title}
        </h2>
        {body ? (
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-2">
            {body}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="group inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-accent"
        >
          {action.label}
          <Icon
            name="arrow-right"
            size={16}
            className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </div>
  );
}
