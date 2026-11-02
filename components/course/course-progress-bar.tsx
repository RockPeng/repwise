import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

export function CourseProgressBar({
  percentComplete = 0,
  resumeHref,
}: {
  percentComplete?: number;
  resumeHref?: string;
}) {
  const progress = Math.min(100, Math.max(0, percentComplete));

  return (
    <aside className="vertex-course-progress" aria-label="Course progress">
      <div className="vertex-course-progress__status">
        <span>Your Progress</span>
        <strong>{progress === 0 ? "Not started" : `${progress}% complete`}</strong>
      </div>
      <ProgressBar
        className="vertex-course-progress__bar"
        value={progress}
        label="Course progress"
      />
      {resumeHref && (
        <Link
          href={resumeHref}
          className={cn(
            "vertex-button",
            buttonClasses.primary,
            "vertex-button--xl",
            "vertex-course-progress__continue",
          )}
        >
          Continue Learning
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      )}
    </aside>
  );
}
