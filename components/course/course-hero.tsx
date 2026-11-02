import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Clock3,
  Layers3,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import type { COURSE_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { formatCount, formatDuration, formatLevel } from "@/lib/format";
import { CourseBookmark } from "./course-bookmark";

type Course = NonNullable<COURSE_BY_SLUG_QUERY_RESULT>;

type CourseHeroProps = {
  course: Pick<
    Course,
    | "title"
    | "summary"
    | "coverImage"
    | "level"
    | "popular"
    | "studentCount"
    | "moduleCount"
    | "durationSeconds"
  >;
  resumeHref?: string;
};

export function CourseHero({ course, resumeHref }: CourseHeroProps) {
  const duration = formatDuration(course.durationSeconds);
  const level = formatLevel(course.level);
  const studentCount = formatCount(course.studentCount);
  const image = course.coverImage;
  const imageUrl =
    image?.asset?._id &&
    urlFor(image).width(560).height(656).fit("crop").url();

  return (
    <section className="vertex-course-hero" aria-labelledby="course-title">
      <div className="vertex-course-hero__cover">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={image.alt ?? ""}
            width={560}
            height={656}
            sizes="(max-width: 700px) 100vw, 280px"
            unoptimized
            priority
          />
        )}
      </div>
      <div className="vertex-course-hero__details">
        {course.popular && <Badge variant="popular" />}
        <h1 id="course-title">{course.title}</h1>
        {course.summary && <p className="vertex-course-hero__summary">{course.summary}</p>}
        <div className="vertex-course-hero__meta">
          {level && (
            <span>
              <BarChart3 size={16} aria-hidden="true" />
              {level}
            </span>
          )}
          {duration && (
            <span>
              <Clock3 size={16} aria-hidden="true" />
              {duration}
            </span>
          )}
          {course.moduleCount != null && (
            <span>
              <Layers3 size={16} aria-hidden="true" />
              {course.moduleCount} modules
            </span>
          )}
          {studentCount && (
            <span>
              <UsersRound size={16} aria-hidden="true" />
              {studentCount} students
            </span>
          )}
        </div>
        <div className="vertex-course-hero__actions">
          {resumeHref && (
            <Link
              href={resumeHref}
              className={cn(
                "vertex-button",
                buttonClasses.primary,
                "vertex-button--xl",
                "vertex-course-hero__continue",
              )}
            >
              Continue Learning
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          )}
          <CourseBookmark />
        </div>
      </div>
    </section>
  );
}
