import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Chamfer } from "@/components/ui/Chamfer";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Progress";
import { programById, trainerById } from "@/lib/data";
import { duration, money } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const program = programById(id);

  return {
    title: `${program.title} — FitCoach`,
    description: program.summary,
  };
}

/**
 * A programme page.
 *
 * The curriculum is the argument: it is what proves the coach has done this
 * before. The purchase card sits beside it and stays put while the reader
 * scrolls the syllabus.
 */
export default async function ProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = programById(id);
  const trainer = trainerById(program.trainerId);

  const lessons = program.modules.flatMap((module) => module.lessons);
  const totalSeconds = lessons.reduce((sum, lesson) => sum + lesson.durationSec, 0);
  const preview = lessons.find((lesson) => lesson.preview);

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 pb-14 pt-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-16 lg:pb-20">
          <div className="flex flex-col justify-center">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[13px] text-ink-3"
            >
              <Link href="/" className="transition-colors hover:text-ink">
                FitCoach
              </Link>
              <Icon name="chevron-right" size={13} />
              <Link
                href="/trainers"
                className="transition-colors hover:text-ink"
              >
                Programmes
              </Link>
            </nav>

            <h1 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-[1] tracking-[-0.035em] text-ink stretch-wide text-balance">
              {program.title}
            </h1>

            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-2">
              {program.summary}
            </p>

            <Link
              href={`/trainers/${trainer.id}`}
              className="mt-6 inline-flex items-center gap-3 self-start rounded-field border border-line py-2 pl-2 pr-4 transition-colors hover:border-line-2"
            >
              <Avatar name={trainer.name} src={trainer.avatar} size={36} />
              <span className="leading-tight">
                <span className="block text-[14px] font-medium text-ink">
                  {trainer.name}
                </span>
                <span className="block text-[12px] text-ink-3">
                  {trainer.specialties[0]}
                </span>
              </span>
            </Link>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-4">
              {[
                { label: "Length", value: `${program.durationWeeks} weeks` },
                {
                  label: "Difficulty",
                  value: program.difficulty,
                },
                {
                  label: "Lessons",
                  value: `${lessons.length} · ${duration(totalSeconds)}`,
                },
                {
                  label: "Students",
                  value: program.studentCount.toLocaleString("en-US"),
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[13px] text-ink-3">{stat.label}</dt>
                  <dd className="tnum mt-1 font-display text-[16px] font-bold tracking-tight text-ink">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="mt-7 flex flex-wrap gap-2">
              {program.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line px-3 py-1.5 text-[13px] text-ink-2"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <Chamfer
            cut={48}
            accent
            className="aspect-[4/3] w-full overflow-hidden bg-surface-2 lg:aspect-[4/3]"
          >
            <Image
              src={program.cover}
              alt=""
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </Chamfer>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.4fr)] lg:gap-16">
        <div>
          <h2 className="font-display text-[clamp(1.5rem,2.6vw,1.9rem)] font-extrabold tracking-[-0.03em] text-ink">
            What you get
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-[1.75] text-ink-2">
            {program.description}
          </p>

          <div className="mt-12 flex items-end justify-between gap-6 border-b border-line pb-4">
            <h2 className="font-display text-[clamp(1.5rem,2.6vw,1.9rem)] font-extrabold tracking-[-0.03em] text-ink">
              The curriculum
            </h2>
            <p className="tnum text-[13px] text-ink-3">
              {program.modules.length} modules · {lessons.length} lessons
            </p>
          </div>

          <ol className="mt-2">
            {program.modules.map((module, moduleIndex) => (
              <li key={module.id} className="border-b border-line py-7">
                <div className="flex items-baseline gap-3">
                  <span className="tnum text-[13px] font-bold text-accent">
                    {String(moduleIndex + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
                    {module.title}
                  </h3>
                </div>

                <ul className="mt-4 space-y-3">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-ink-3">
                        <Icon name="play" size={11} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-[15px] text-ink">{lesson.title}</span>
                          {lesson.preview ? (
                            <Badge tone="accent">Free preview</Badge>
                          ) : null}
                        </span>
                        <span className="tnum mt-0.5 block text-[13px] text-ink-3">
                          {duration(lesson.durationSec)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="mt-12 border-t border-line pt-10">
            <h2 className="font-display text-[clamp(1.5rem,2.6vw,1.9rem)] font-extrabold tracking-[-0.03em] text-ink">
              Common questions
            </h2>
            <dl className="mt-6 space-y-6">
              {[
                {
                  q: "How long do I keep access?",
                  a: "Forever. The programme sits in your account and every update to it appears there too — you are not renting a login.",
                },
                {
                  q: "What if the programme is not right for me?",
                  a: `Message ${trainer.name.split(" ")[0]} before you buy. If it is a poor fit, they will say so and point you somewhere better.`,
                },
                {
                  q: "Do I need gym equipment?",
                  a: "The programme lists what it needs before you buy. Anything that can be done at home is marked.",
                },
                {
                  q: "Can I message my coach afterwards?",
                  a: "Yes, and it is the point. Messages stay open for the whole run, and a fortnightly session is included if you want one.",
                },
              ].map((item) => (
                <div key={item.q}>
                  <dt className="font-display text-[15px] font-bold tracking-tight text-ink">
                    {item.q}
                  </dt>
                  <dd className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-2">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-panel border border-line bg-surface-1 p-6">
            <div className="flex items-end justify-between gap-4">
              <p className="tnum font-display text-[2.25rem] font-extrabold leading-none tracking-[-0.03em] text-ink">
                {money(program.priceCents)}
              </p>
              <p className="pb-1 text-[13px] text-ink-3">One payment</p>
            </div>

            <ul className="mt-6 space-y-3 border-t border-line pt-5 text-[14px] text-ink-2">
              <li className="flex gap-3">
                <Icon
                  name="check"
                  size={17}
                  className="mt-0.5 shrink-0 text-accent"
                />
                {lessons.length} video lessons, in {program.modules.length} modules
              </li>
              <li className="flex gap-3">
                <Icon
                  name="check"
                  size={17}
                  className="mt-0.5 shrink-0 text-accent"
                />
                Progress tracking on every lesson
              </li>
              <li className="flex gap-3">
                <Icon
                  name="check"
                  size={17}
                  className="mt-0.5 shrink-0 text-accent"
                />
                Messages with {trainer.name.split(" ")[0]} for the whole run
              </li>
              <li className="flex gap-3">
                <Icon
                  name="check"
                  size={17}
                  className="mt-0.5 shrink-0 text-accent"
                />
                Every future update to the programme
              </li>
            </ul>

            <ButtonLink href="/checkout/success" className="mt-6 w-full">
              Buy programme
            </ButtonLink>

            {preview ? (
              <Link
                href="/learn/stronger-in-12"
                className="mt-4 flex items-center gap-2.5 text-[13px] text-ink-2 transition-colors hover:text-accent"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full border border-line text-ink-3">
                  <Icon name="play" size={12} />
                </span>
                Watch “{preview.title}” free
              </Link>
            ) : null}

            <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <Stars value={program.rating} size={14} />
              <p className="tnum text-[13px] text-ink-2">
                {program.rating.toFixed(1)} from {program.reviewCount} reviews
              </p>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
