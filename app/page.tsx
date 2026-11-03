import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { CourseCard } from "@/components/cards/course-card";
import { ChartDecoration } from "@/components/home/chart-decoration";
import { Hero } from "@/components/home/hero";
import { PageFrame } from "@/components/layout/page-frame";
import { SiteHeader } from "@/components/layout/site-header";
import { courseHref } from "@/lib/routes";
import { formatDuration, formatLevel } from "@/lib/format";
import { CACHE_TAGS, sanityFetch } from "@/sanity/lib/fetch";
import { COURSES_LIST_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export default async function Home() {
  const allCourses = await sanityFetch({
    query: COURSES_LIST_QUERY,
    tags: [CACHE_TAGS.course, CACHE_TAGS.lesson],
  });
  const courses = allCourses
    .filter(
      (course): course is typeof course & { slug: string; title: string } =>
        Boolean(course.slug && course.title),
    )
    .slice(0, 3);

  return (
    <PageFrame>
      <SiteHeader />
      <main>
        <Hero />
        <section className="vertex-home-courses" id="courses" aria-labelledby="courses-heading">
          <div className="vertex-home-courses__inner">
            <div className="vertex-home-courses__heading">
              <h2 id="courses-heading">All Courses</h2>
              <Link href="/courses" className="vertex-home-courses__view-all">
                View all courses <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
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
            <div className="vertex-home-note">
              <span className="vertex-home-note__rule" aria-hidden="true" />
              <Star size={20} aria-hidden="true" />
              <p>New courses and lessons added every week.</p>
              <span className="vertex-home-note__rule" aria-hidden="true" />
            </div>
          </div>
          <ChartDecoration />
        </section>
      </main>
    </PageFrame>
  );
}
