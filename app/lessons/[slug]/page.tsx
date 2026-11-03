import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LessonFooterNav } from "@/components/lesson/lesson-footer-nav";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LessonOverview } from "@/components/lesson/lesson-overview";
import { LessonResources } from "@/components/lesson/lesson-resources";
import { LessonSidebar } from "@/components/lesson/lesson-sidebar";
import { LessonTabs } from "@/components/lesson/lesson-tabs";
import { LessonVideo } from "@/components/lesson/lesson-video";
import { PageFrame } from "@/components/layout/page-frame";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { courseHref, coursesHref } from "@/lib/routes";
import { prepareLessonNotes } from "@/lib/lesson-content";
import { CACHE_TAGS, sanityFetch } from "@/sanity/lib/fetch";
import {
  LESSON_BY_SLUG_QUERY,
  LESSON_SLUGS_QUERY,
} from "@/sanity/lib/queries";

async function getLesson(slug: string) {
  return sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug },
    tags: [CACHE_TAGS.lesson, CACHE_TAGS.course],
  });
}

function getStartSeconds(value: string | string[] | undefined, duration: number | null) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return 0;
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    return 0;
  }

  return duration != null && Number.isFinite(duration) && duration > 0
    ? Math.min(parsed, duration)
    : parsed;
}

async function LessonVideoFromSearchParams({
  searchParams,
  duration,
  videoUrl,
  title,
  posterUrl,
  posterAlt,
}: {
  searchParams: Promise<{ t?: string | string[] }>;
  duration: number | null;
  videoUrl: string | null;
  title: string;
  posterUrl: string | null;
  posterAlt: string | null;
}) {
  const { t } = await searchParams;

  return (
    <LessonVideo
      videoUrl={videoUrl}
      title={title}
      posterUrl={posterUrl}
      posterAlt={posterAlt}
      startSeconds={getStartSeconds(t, duration)}
    />
  );
}

export async function generateStaticParams() {
  const lessons = await sanityFetch({
    query: LESSON_SLUGS_QUERY,
    tags: [CACHE_TAGS.lesson],
  });

  return lessons.flatMap(({ slug }) => (slug ? [{ slug }] : []));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLesson(slug);

  if (!lesson) {
    return { title: "Lesson not found" };
  }

  const { summary } = prepareLessonNotes(lesson.notes, lesson.keyPoints);

  return {
    title: lesson.title ?? "Lesson",
    description: summary ?? undefined,
  };
}

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string | string[] }>;
}) {
  const { slug } = await params;
  const lesson = await getLesson(slug);

  if (!lesson) {
    notFound();
  }

  const course = lesson.course;
  const modules = course?.modules ?? [];
  const curriculum = modules.flatMap((module, moduleIndex) =>
    (module.lessons ?? []).map((item, lessonIndex) => ({
      id: item._id,
      slug: item.slug,
      title: item.title,
      duration: item.duration,
      moduleIndex,
      lessonIndex,
      moduleTitle: module.title,
    })),
  );
  const currentIndex = curriculum.findIndex((item) => item.id === lesson._id);
  const current = currentIndex >= 0 ? curriculum[currentIndex] : null;
  const previous = currentIndex > 0 ? curriculum[currentIndex - 1] : null;
  const next = currentIndex >= 0 ? curriculum[currentIndex + 1] : null;
  const lessonLabel = current
    ? `${current.moduleIndex + 1}.${current.lessonIndex + 1}`
    : undefined;
  const { summary, overviewNotes } = prepareLessonNotes(lesson.notes, lesson.keyPoints);
  const videoProps = {
    videoUrl: lesson.videoUrl,
    title: lesson.title ?? "Lesson video",
    posterUrl: lesson.thumbnail?.asset?.url ?? null,
    posterAlt: lesson.thumbnail?.alt ?? null,
  };
  const breadcrumbs = [
    { label: "All Courses", href: coursesHref },
    ...(course?.title
      ? [
          {
            label: course.title,
            href: course.slug ? courseHref(course.slug) : undefined,
          },
        ]
      : []),
    ...(current?.moduleTitle ? [{ label: current.moduleTitle }] : []),
    { label: lesson.title ?? "Lesson" },
  ];

  return (
    <PageFrame>
      <div className="vertex-lesson-shell">
        <SiteHeader />
        <main
          className={`vertex-lesson-layout${course && current ? "" : " vertex-lesson-layout--standalone"}`}
        >
          {course && current && (
            <LessonSidebar
              key={lesson._id}
              course={course}
              activeLessonId={lesson._id}
              activeModuleIndex={current.moduleIndex}
            />
          )}
          <div className="vertex-lesson-main">
            <Breadcrumbs
              className="vertex-lesson-main__breadcrumbs"
              items={breadcrumbs}
            />
            <LessonHeader
              title={lesson.title ?? "Lesson"}
              label={lessonLabel}
              summary={summary ?? undefined}
              duration={lesson.duration}
              level={course?.level ?? null}
              studentCount={lesson.studentCount}
            />
            <Suspense fallback={<LessonVideo {...videoProps} startSeconds={0} />}>
              <LessonVideoFromSearchParams
                {...videoProps}
                duration={lesson.duration}
                searchParams={searchParams}
              />
            </Suspense>
            <LessonTabs lessonSlug={lesson.slug ?? slug}>
              <LessonOverview
                notes={overviewNotes}
                keyPoints={lesson.keyPoints}
                proTip={lesson.proTip}
              />
              <LessonResources resources={lesson.resources} />
            </LessonTabs>
          </div>
          <LessonFooterNav
            previous={
              previous?.slug && previous.title
                ? {
                    slug: previous.slug,
                    title: previous.title,
                    duration: previous.duration,
                  }
                : null
            }
            next={
              next?.slug && next.title
                ? {
                    slug: next.slug,
                    title: next.title,
                    duration: next.duration,
                  }
                : null
            }
          />
        </main>
      </div>
    </PageFrame>
  );
}
