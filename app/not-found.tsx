import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * The 404.
 *
 * The page says what happened and offers the two things someone who landed
 * here actually wants: the coaches, and the programmes.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1240px] flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
      <span className="chamfer-tl block size-4 bg-accent" style={{ "--cut": "6px" } as React.CSSProperties} />

      <p className="tnum mt-8 font-display text-[13px] font-bold tracking-[0.14em] text-accent">
        404
      </p>
      <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1] tracking-[-0.035em] text-ink stretch-wide">
        This page never existed.
      </h1>
      <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-2">
        The link is broken or the programme has been taken down. The coaches
        and their programmes are still where you left them.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/trainers" icon="arrow-right">
          Browse coaches
        </ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Back to the start
        </ButtonLink>
      </div>

      <Link
        href="/dashboard"
        className="mt-10 inline-flex items-center gap-2 text-[13px] text-ink-3 transition-colors hover:text-ink"
      >
        <Icon name="grid" size={14} />
        Go to your dashboard
      </Link>
    </div>
  );
}
