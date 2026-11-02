"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { COURSE_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { formatDuration } from "@/lib/format";
import { lessonHref } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";

type Course = NonNullable<COURSE_BY_SLUG_QUERY_RESULT>;
type CourseModule = NonNullable<Course["modules"]>[number];

export function CourseContent({
  modules,
  moduleCount,
  durationSeconds,
}: {
  modules: CourseModule[];
  moduleCount: number | null;
  durationSeconds: number | null;
}) {
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visibleModules = showAll ? modules : modules.slice(0, 6);
  const duration = formatDuration(durationSeconds);

  return (
    <section className="vertex-course-content" aria-labelledby="course-content-heading">
      <div className="vertex-course-content__heading">
        <h2 id="course-content-heading">Course Content</h2>
        <p>
          {moduleCount != null && <span>{moduleCount} modules</span>}
          {moduleCount != null && duration && <span aria-hidden="true">·</span>}
          {duration && <span>{duration}</span>}
        </p>
      </div>
      <div className="vertex-course-content__list">
        {visibleModules.map((module, index) => {
          const expanded = openModule === module._key;
          const lessons = module.lessons ?? [];
          const moduleDuration = formatDuration(module.durationSeconds);
          const panelId = `course-module-${module._key}`;

          return (
            <article className="vertex-course-module" key={module._key}>
              <button
                className="vertex-course-module__toggle"
                type="button"
                aria-label={module.title ?? `Module ${index + 1}`}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() =>
                  setOpenModule((current) =>
                    current === module._key ? null : module._key,
                  )
                }
              >
                <span className="vertex-course-module__number" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="vertex-course-module__copy">
                  {module.title && <span className="vertex-course-module__title">{module.title}</span>}
                  {module.summary && (
                    <span className="vertex-course-module__summary">{module.summary}</span>
                  )}
                </span>
                {moduleDuration && (
                  <span className="vertex-course-module__duration">{moduleDuration}</span>
                )}
                <ChevronDown
                  className={expanded ? "is-expanded" : undefined}
                  size={18}
                  aria-hidden="true"
                />
              </button>
              <div
                className="vertex-course-module__lessons"
                id={panelId}
                hidden={!expanded}
              >
                {lessons.map((lesson, lessonIndex) => (
                  <div className="vertex-course-lesson" key={lesson._key}>
                    <span className="vertex-course-lesson__number" aria-hidden="true">
                      {index + 1}.{lessonIndex + 1}
                    </span>
                    <div className="vertex-course-lesson__copy">
                      {lesson.slug && lesson.title ? (
                        <Link href={lessonHref(lesson.slug)}>{lesson.title}</Link>
                      ) : (
                        lesson.title && <span>{lesson.title}</span>
                      )}
                      {lesson.freePreview && (
                        <Badge variant="lesson">Free preview</Badge>
                      )}
                    </div>
                    {formatDuration(lesson.duration) && (
                      <span className="vertex-course-lesson__duration">
                        {formatDuration(lesson.duration)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
      {modules.length > 6 && (
        <button
          className="vertex-course-content__show-all"
          type="button"
          onClick={() => setShowAll((current) => !current)}
        >
          {showAll ? "Show fewer modules" : `Show all ${modules.length} modules`}
          <ChevronDown
            className={showAll ? "is-expanded" : undefined}
            size={18}
            aria-hidden="true"
          />
        </button>
      )}
    </section>
  );
}
