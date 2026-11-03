"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChevronDown, Play } from "lucide-react";
import type { LESSON_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { formatDuration } from "@/lib/format";
import { lessonHref, courseHref } from "@/lib/routes";

type LessonPageData = NonNullable<LESSON_BY_SLUG_QUERY_RESULT>;
type Course = NonNullable<LessonPageData["course"]>;
type CourseModule = NonNullable<Course["modules"]>[number];

export function LessonSidebar({
  course,
  activeLessonId,
  activeModuleIndex,
}: {
  course: Course;
  activeLessonId: string;
  activeModuleIndex: number;
}) {
  const modules = course.modules ?? [];
  const activeModule = modules[activeModuleIndex];
  const [openModuleKey, setOpenModuleKey] = useState<string | null>(
    activeModule?._key ?? null,
  );
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <aside className="vertex-lesson-sidebar" aria-label="Course curriculum">
      <button
        className="vertex-lesson-sidebar__mobile-toggle"
        type="button"
        aria-expanded={mobileExpanded}
        onClick={() => setMobileExpanded((expanded) => !expanded)}
      >
        Course content
        <ChevronDown
          className={mobileExpanded ? "is-expanded" : undefined}
          size={16}
          aria-hidden="true"
        />
      </button>
      <div
        className={`vertex-lesson-sidebar__content${mobileExpanded ? " is-mobile-expanded" : ""}`}
      >
        {course.slug && (
          <Link className="vertex-lesson-sidebar__back" href={courseHref(course.slug)}>
            <ArrowLeft size={15} aria-hidden="true" />
            Back to course
          </Link>
        )}
        <div className="vertex-lesson-sidebar__course">
          <div className="vertex-lesson-sidebar__course-image">
            {course.coverImage?.asset?.url ? (
              <Image
                src={course.coverImage.asset.url}
                alt={course.coverImage.alt ?? ""}
                fill
                sizes="48px"
                unoptimized
              />
            ) : (
              <span aria-hidden="true">{course.title?.charAt(0) ?? "C"}</span>
            )}
          </div>
          <div className="vertex-lesson-sidebar__course-copy">
            <strong>{course.title}</strong>
            <span>Not started</span>
            <div className="vertex-lesson-sidebar__progress" aria-label="0% complete">
              <span />
            </div>
          </div>
        </div>
        <div className="vertex-lesson-sidebar__module-heading">
          <span>
            {activeModuleIndex >= 0
              ? `Module ${activeModuleIndex + 1} of ${modules.length}`
              : `${modules.length} modules`}
          </span>
          <ChevronDown size={16} aria-hidden="true" />
        </div>
        <div className="vertex-lesson-sidebar__modules">
          {modules.map((module: CourseModule, moduleIndex) => {
            const lessons = module.lessons ?? [];
            const expanded = openModuleKey === module._key;
            const moduleId = `lesson-module-${module._key}`;
            const duration = formatDuration(module.durationSeconds);

            return (
              <section className="vertex-lesson-module" key={module._key}>
                <button
                  className={`vertex-lesson-module__toggle${expanded ? " is-active" : ""}`}
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={moduleId}
                  onClick={() =>
                    setOpenModuleKey((current) =>
                      current === module._key ? null : module._key,
                    )
                  }
                >
                  <span className="vertex-lesson-module__number" aria-hidden="true">
                    {moduleIndex + 1}
                  </span>
                  <span className="vertex-lesson-module__copy">
                    <span className="vertex-lesson-module__title">{module.title}</span>
                    {duration && (
                      <span className="vertex-lesson-module__duration">{duration}</span>
                    )}
                  </span>
                  <ChevronDown
                    className={expanded ? "is-expanded" : undefined}
                    size={15}
                    aria-hidden="true"
                  />
                </button>
                <div className="vertex-lesson-module__lessons" id={moduleId} hidden={!expanded}>
                  {lessons.map((lesson, lessonIndex) => {
                    const current = lesson._id === activeLessonId;
                    const lessonDuration = formatDuration(lesson.duration);
                    const label = lesson.title ?? `Lesson ${moduleIndex + 1}.${lessonIndex + 1}`;

                    return (
                      <div
                        className={`vertex-lesson-sidebar__lesson${current ? " is-current" : ""}`}
                        key={lesson._key}
                      >
                        <span className="vertex-lesson-sidebar__lesson-marker" aria-hidden="true" />
                        <div className="vertex-lesson-sidebar__lesson-copy">
                          {lesson.slug ? (
                            <Link
                              href={lessonHref(lesson.slug)}
                              aria-current={current ? "page" : undefined}
                            >
                              {label}
                            </Link>
                          ) : (
                            <span>{label}</span>
                          )}
                          {current && <span className="vertex-lesson-sidebar__now">Now playing</span>}
                          {lessonDuration && (
                            <span className="vertex-lesson-sidebar__lesson-duration">
                              {lessonDuration}
                            </span>
                          )}
                        </div>
                        {current && (
                          <span className="vertex-lesson-sidebar__play" aria-hidden="true">
                            <Play size={10} fill="currentColor" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
