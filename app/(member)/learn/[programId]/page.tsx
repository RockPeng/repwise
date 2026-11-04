import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chamfer } from "@/components/ui/Chamfer";
import { Icon } from "@/components/ui/Icon";
import { Progress } from "@/components/ui/Progress";
import {
  enrollments,
  programById,
  trainerById,
  type Lesson,
  type Program,
} from "@/lib/data";
import { duration } from "@/lib/format";

export const metadata: Metadata = {
  title: "Your programme · FitCoach",
  description:
    "Watch the lessons of your programme, keep your notes in one place and ask your coach a question.",
  robots: { index: false, follow: false },
};

export default async function LearnPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;
  const program = programById(programId);
  const coach = trainerById(program.trainerId);
  const enrollment = enrollments.find((e) => e.programId === program.id);

  const lessons = program.modules.flatMap((module) => module.lessons);
  const currentId = enrollment?.lastLessonId ?? lessons[0]?.id;
  const currentIndex = Math.max(
    0,
    lessons.findIndex((lesson) => lesson.id === currentId),
  );
  const current = lessons[currentIndex] ?? lessons[0];
  const next = lessons[currentIndex + 1];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10">
      <LessonRail
        program={program}
        currentId={current.id}
        currentIndex={currentIndex}
        progress={enrollment?.progress ?? 0}
        lessonsDone={enrollment?.lessonsDone ?? 0}
        lessonsTotal={enrollment?.lessonsTotal ?? lessons.length}
      />

      <div className="min-w-0">
        <Player lesson={current} />

        <div className="mt-6">
          <h1 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">
            {current.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">
            {current.description}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button icon="check">Mark complete</Button>
          {next ? (
            <Button variant="secondary" icon="arrow-right" iconAfter>
              Next lesson
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" icon="notebook">
            Add a note
          </Button>
        </div>

        <Notes />

        <AskCoach
          coachName={coach.name}
          coachAvatar={coach.avatar}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function LessonRail({
  program,
  currentId,
  currentIndex,
  progress,
  lessonsDone,
  lessonsTotal,
}: {
  program: Program;
  currentId: string;
  currentIndex: number;
  progress: number;
  lessonsDone: number;
  lessonsTotal: number;
}) {
  /** The flat position of every lesson, so a status can be worked out. */
  const position = new Map<string, number>();
  program.modules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      position.set(lesson.id, position.size);
    });
  });

  return (
    <aside className="min-w-0">
      <div className="rounded-panel border border-line bg-surface-1 p-5">
        <h2 className="font-display text-[17px] font-bold leading-snug tracking-[-0.02em] text-ink">
          {program.title}
        </h2>

        <div className="mt-4">
          <Progress value={progress} label="Programme progress" />
          <p className="mt-2 flex items-center gap-2 text-[13px] text-ink-3">
            <span className="tnum">
              {lessonsDone} of {lessonsTotal} lessons
            </span>
            <span aria-hidden="true" className="text-line-2">
              /
            </span>
            <span className="tnum">{progress}%</span>
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {program.modules.map((module) => (
          <section key={module.id}>
            <h3 className="text-[13px] font-semibold text-ink-2">
              {module.title}
            </h3>

            <ul className="mt-2 space-y-0.5">
              {module.lessons.map((lesson) => {
                const index = position.get(lesson.id) ?? 0;
                const status =
                  index < currentIndex
                    ? "done"
                    : lesson.id === currentId
                      ? "current"
                      : "todo";

                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/learn/${program.id}`}
                      aria-current={status === "current" ? "true" : undefined}
                      className={`flex items-start gap-3 rounded-field px-2 py-2 transition-colors hover:bg-surface-1 ${
                        status === "current" ? "bg-surface-2" : ""
                      }`}
                    >
                      <LessonMarker status={status} />
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-[13px] leading-snug ${
                            status === "current"
                              ? "font-semibold text-ink"
                              : status === "done"
                                ? "text-ink-2"
                                : "text-ink-3"
                          }`}
                        >
                          {lesson.title}
                        </span>
                        <span className="tnum mt-0.5 block text-[12px] text-ink-3">
                          {duration(lesson.durationSec)}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}

function LessonMarker({
  status,
}: {
  status: "done" | "current" | "todo";
}) {
  if (status === "done") {
    return (
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink"
      >
        <Icon name="check" size={12} strokeWidth={2.4} />
      </span>
    );
  }

  if (status === "current") {
    return (
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 border-accent bg-accent-soft"
      >
        <span className="size-1.5 rounded-[2px] bg-accent" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border border-line-2"
    />
  );
}

/* ------------------------------------------------------------------ */

function Player({ lesson }: { lesson: Lesson }) {
  return (
    <Chamfer
      cut={32}
      accent
      className="aspect-video w-full overflow-hidden bg-surface-2"
    >
      <Image
        src={lesson.image}
        alt={`Still from the lesson “${lesson.title}”`}
        fill
        sizes="(max-width: 1024px) 100vw, 720px"
        className="object-cover"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-black/30"
      />

      <button
        type="button"
        aria-label={`Play “${lesson.title}”`}
        className="absolute left-1/2 top-1/2 inline-flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-ink transition-transform duration-150 hover:scale-[1.06] motion-safe:active:scale-95"
      >
        <Icon name="play" size={24} />
      </button>

      <p className="absolute bottom-4 left-5 max-w-[70%] font-display text-[15px] font-bold leading-snug tracking-[-0.02em] text-white/90">
        {lesson.title}
      </p>
    </Chamfer>
  );
}

/* ------------------------------------------------------------------ */

function Notes() {
  return (
    <section className="mt-8 rounded-panel border border-line bg-surface-1 p-5">
      <h2 className="font-display text-[15px] font-bold tracking-[-0.02em] text-ink">
        Notes
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-3">
        No notes on this lesson yet.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function AskCoach({
  coachName,
  coachAvatar,
}: {
  coachName: string;
  coachAvatar: string;
}) {
  return (
    <section className="mt-6 rounded-panel border border-line bg-surface-1 p-5">
      <div className="flex items-center gap-3">
        <Avatar name={coachName} src={coachAvatar} size={34} />
        <div className="min-w-0">
          <h2 className="font-display text-[15px] font-bold tracking-[-0.02em] text-ink">
            Ask your coach
          </h2>
          <p className="text-[12px] text-ink-3">{coachName} answers within a day</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="ask-coach">
          Ask {coachName} a question
        </label>
        <input
          id="ask-coach"
          type="text"
          placeholder={`Ask ${coachName.split(" ")[0]} a question about this lesson`}
          className="h-10 min-w-0 flex-1 rounded-field border border-line bg-surface-2 px-3.5 text-[14px] text-ink placeholder:text-ink-3"
        />
        <Button icon="send" iconAfter>
          Send
        </Button>
      </div>
    </section>
  );
}
