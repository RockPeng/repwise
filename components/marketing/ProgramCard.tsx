import Image from "next/image";
import Link from "next/link";
import type { Program } from "@/lib/data";
import { trainerById } from "@/lib/data";
import { money } from "@/lib/format";
import { Chamfer } from "@/components/ui/Chamfer";
import { Stars } from "@/components/ui/Progress";

/**
 * A programme on the marketplace.
 *
 * The cover is a chamfered frame and the text below it is set on a hairline
 * rule rather than inside a card, so a row of these reads as a shelf of
 * covers rather than a grid of boxes.
 */
export function ProgramCard({
  program,
  headingLevel = "h3",
}: {
  program: Program;
  headingLevel?: "h2" | "h3";
}) {
  const trainer = trainerById(program.trainerId);
  const Heading = headingLevel;

  return (
    <article className="group flex flex-col">
      <Link href={`/programs/${program.id}`} className="block">
        <Chamfer
          cut={24}
          accent
          className="aspect-[4/3] overflow-hidden bg-surface-2"
        >
          <Image
            src={program.cover}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
          />
        </Chamfer>
      </Link>

      <div className="mt-4 flex items-center gap-2 text-[13px] text-ink-3">
        <span>{program.difficulty}</span>
        <span aria-hidden="true" className="text-line-2">
          /
        </span>
        <span>{program.durationWeeks} weeks</span>
      </div>

      <Heading className="mt-1.5 font-display text-[19px] font-bold tracking-[-0.02em] text-ink">
        <Link
          href={`/programs/${program.id}`}
          className="transition-colors hover:text-accent"
        >
          {program.title}
        </Link>
      </Heading>

      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-2">
        {program.summary}
      </p>

      <div className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] text-ink-2">{trainer.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-3">
            <Stars value={program.rating} size={12} />
            {program.rating.toFixed(1)}
            <span aria-hidden="true" className="text-line-2">
              /
            </span>
            {program.studentCount.toLocaleString("en-US")} students
          </p>
        </div>
        <p className="tnum shrink-0 font-display text-[17px] font-bold tracking-tight text-ink">
          {money(program.priceCents)}
        </p>
      </div>
    </article>
  );
}
