"use client";

import { useState } from "react";
import { BarChart3, Bookmark, BookmarkCheck, Clock3, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCount, formatDuration, formatLevel } from "@/lib/format";

export function LessonHeader({
  title,
  label,
  summary,
  duration,
  level,
  studentCount,
}: {
  title: string;
  label?: string;
  summary?: string;
  duration: number | null;
  level: string | null;
  studentCount: number | null;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const durationLabel = formatDuration(duration);
  const levelLabel = formatLevel(level);
  const studentsLabel = formatCount(studentCount);

  return (
    <header className="vertex-lesson-header">
      {label && <Badge variant="lesson">{`Lesson ${label}`}</Badge>}
      <div className="vertex-lesson-header__title-row">
        <h1>{title}</h1>
        <button
          className="vertex-lesson-header__bookmark"
          type="button"
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark lesson"}
          aria-pressed={bookmarked}
          onClick={() => setBookmarked((value) => !value)}
        >
          {bookmarked ? (
            <BookmarkCheck size={19} aria-hidden="true" />
          ) : (
            <Bookmark size={19} aria-hidden="true" />
          )}
        </button>
      </div>
      {summary && <p className="vertex-lesson-header__summary">{summary}</p>}
      <div className="vertex-lesson-header__meta">
        {durationLabel && (
          <span>
            <Clock3 size={15} aria-hidden="true" />
            {durationLabel}
          </span>
        )}
        {levelLabel && (
          <span>
            <BarChart3 size={15} aria-hidden="true" />
            {levelLabel}
          </span>
        )}
        {studentsLabel && (
          <span>
            <UsersRound size={15} aria-hidden="true" />
            {studentsLabel} students
          </span>
        )}
      </div>
    </header>
  );
}
