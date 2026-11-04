import Image from "next/image";
import Link from "next/link";
import type { Trainer } from "@/lib/data";
import { money } from "@/lib/format";
import { Chamfer } from "@/components/ui/Chamfer";
import { Stars } from "@/components/ui/Progress";
import { Icon } from "@/components/ui/Icon";

/**
 * A coach on the marketplace.
 *
 * The portrait is a chamfered square, cropped hard, because the face is the
 * product here — a rounded rectangle with a name under it reads like a
 * directory listing.
 */
export function CoachCard({
  trainer,
  headingLevel = "h3",
}: {
  trainer: Trainer;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <article className="group flex flex-col">
      <Link href={`/trainers/${trainer.id}`} className="block">
        <Chamfer
          cut={20}
          accent
          className="aspect-square overflow-hidden bg-surface-2"
        >
          <Image
            src={trainer.image}
            alt={`${trainer.name}, ${trainer.specialties.join(", ")} coach`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
          />
        </Chamfer>
      </Link>

      <Heading className="mt-4 font-display text-[18px] font-bold tracking-[-0.02em] text-ink">
        <Link
          href={`/trainers/${trainer.id}`}
          className="transition-colors hover:text-accent"
        >
          {trainer.name}
        </Link>
      </Heading>

      <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
        {trainer.headline}
      </p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {trainer.specialties.map((specialty) => (
          <li
            key={specialty}
            className="rounded-full border border-line px-2.5 py-[3px] text-[12px] text-ink-3"
          >
            {specialty}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-3 text-[13px]">
        <span className="flex items-center gap-1.5 text-ink-2">
          <Stars value={trainer.rating} size={13} />
          <span className="tnum">{trainer.rating.toFixed(1)}</span>
          <span className="text-ink-3">({trainer.reviewCount})</span>
        </span>
        <span className="tnum flex items-center gap-1.5 text-ink-2">
          <Icon name="timer" size={14} className="text-ink-3" />
          {money(trainer.sessionPriceCents)} / session
        </span>
      </div>
    </article>
  );
}
