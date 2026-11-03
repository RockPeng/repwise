import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChartDecoration } from "@/components/home/chart-decoration";
import { CourseContent } from "@/components/course/course-content";
import { CourseHero } from "@/components/course/course-hero";
import { CourseProgressBar } from "@/components/course/course-progress-bar";
import { LearningOutcomes } from "@/components/course/learning-outcomes";
import { PageFrame } from "@/components/layout/page-frame";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { CACHE_TAGS, sanityFetch } from "@/sanity/lib/fetch";
import {
  COURSE_BY_SLUG_QUERY,
  COURSE_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { courseHref, lessonHref, coursesHref } from "@/lib/routes";

async function getCourse(slug: string) {
  return sanityFetch({
    query: COURSE_BY_SLUG_QUERY,
    params: { slug },
    tags: [CACHE_TAGS.course, CACHE_TAGS.lesson],
  });
}

export async function generateStaticParams() {
  const courses = await sanityFetch({
    query: COURSE_SLUGS_QUERY,
    tags: [CACHE_TAGS.course],
  });

  return courses.flatMap(({ slug }) => (slug ? [{ slug }] : []));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    return { title: "Course not found" };
  }

  return {
    title: course.title,
    description: course.summary ?? undefined,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    notFound();
  }

  const modules = course.modules ?? [];
  const firstLessonSlug = modules[0]?.lessons?.[0]?.slug;
  const resumeHref = firstLessonSlug
    ? lessonHref(firstLessonSlug)
    : undefined;
  const outcomes = (course.learningOutcomes ?? []).filter(
    (outcome) => outcome.title && outcome.description,
  );

  return (
    <PageFrame>
      <SiteHeader />
      <main className="vertex-course-page">
        <Breadcrumbs
          className="vertex-course-page__breadcrumbs"
          items={[
            { label: "All Courses", href: coursesHref },
            { label: course.title ?? "Course", href: course.slug ? courseHref(course.slug) : undefined },
          ]}
        />
        <CourseHero
          course={{
            title: course.title ?? "",
            summary: course.summary,
            coverImage: course.coverImage,
            level: course.level,
            popular: course.popular,
            studentCount: course.studentCount,
            moduleCount: course.moduleCount,
            durationSeconds: course.durationSeconds,
          }}
          resumeHref={resumeHref}
        />
        {outcomes.length > 0 && <LearningOutcomes outcomes={outcomes} />}
        <CourseContent
          modules={modules}
          moduleCount={course.moduleCount}
          durationSeconds={course.durationSeconds}
        />
        <CourseProgressBar resumeHref={resumeHref} />
        <div className="vertex-course-page__decoration">
          <ChartDecoration />
        </div>
      </main>
    </PageFrame>
  );
}
