import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard } from "@/components/cards/course-card";
import { PageFrame } from "@/components/layout/page-frame";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { formatDuration, formatLevel } from "@/lib/format";
import { courseHref } from "@/lib/routes";
import { CACHE_TAGS, sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { COURSES_LIST_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "All Courses",
  description: "Explore all courses available on Vertex.",
};

export default async function CoursesPage() {
  const allCourses = await sanityFetch({
    query: COURSES_LIST_QUERY,
    tags: [CACHE_TAGS.course, CACHE_TAGS.lesson],
  });
  const courses = allCourses.filter(
    (course): course is typeof course & { slug: string; title: string } =>
      Boolean(course.slug && course.title),
  );

  return (
    <PageFrame>
      <SiteHeader />
      <main className="vertex-course-page">
        <Breadcrumbs
          className="vertex-course-page__breadcrumbs"
          items={[{ label: "All Courses" }]}
        />
        <section aria-labelledby="courses-heading">
          <div className="vertex-home-courses__heading">
            <h1
              className="font-display text-[28px] leading-[1.25] font-bold tracking-[-0.04em] text-[#111]"
              id="courses-heading"
            >
              All Courses
            </h1>
            <p className="text-small text-neutral-500">
              {courses.length} {courses.length === 1 ? "course" : "courses"}
            </p>
          </div>
          {courses.length > 0 ? (
            <div className="vertex-home-courses__grid">
              {courses.map((course) => {
                const image = course.coverImage;
                const imageUrl =
                  image?.asset?._id &&
                  urlFor(image).width(144).height(144).fit("crop").url();

                return (
                  <Link
                    className="vertex-home-courses__card-link"
                    href={courseHref(course.slug)}
                    key={course._id}
                  >
                    <CourseCard
                      title={course.title}
                      description={course.summary}
                      level={formatLevel(course.level)}
                      duration={formatDuration(course.durationSeconds)}
                      modules={course.moduleCount}
                      logo={
                        imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={image?.alt ?? ""}
                            width={144}
                            height={144}
                            unoptimized
                          />
                        ) : undefined
                      }
                      layout="stacked"
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-body text-neutral-500">No courses are available yet.</p>
          )}
        </section>
      </main>
    </PageFrame>
  );
}
