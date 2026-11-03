import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatDuration } from "@/lib/format";
import { lessonHref } from "@/lib/routes";

type NeighboringLesson = {
  slug: string;
  title: string;
  duration: number | null;
};

export function LessonFooterNav({
  previous,
  next,
}: {
  previous: NeighboringLesson | null;
  next: NeighboringLesson | null;
}) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav className="vertex-lesson-footer" aria-label="Course lesson navigation">
      {previous ? (
        <Link className="vertex-lesson-footer__previous" href={lessonHref(previous.slug)}>
          <span className="vertex-lesson-footer__button">
            <ArrowLeft size={16} aria-hidden="true" />
            Previous Lesson
          </span>
          <span className="vertex-lesson-footer__lesson-copy">
            <strong>{previous.title}</strong>
            {formatDuration(previous.duration) && <span>{formatDuration(previous.duration)}</span>}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="vertex-lesson-footer__next" href={lessonHref(next.slug)}>
          <span className="vertex-lesson-footer__lesson-copy">
            <strong>{next.title}</strong>
            {formatDuration(next.duration) && <span>{formatDuration(next.duration)}</span>}
          </span>
          <span className="vertex-lesson-footer__button is-primary">
            Next Lesson
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
