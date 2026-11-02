import type { ReactNode } from "react";
import { BarChart3, Clock3, Layers3 } from "lucide-react";
import { Card } from "@/components/ui/card";

type CourseCardProps = {
  title: string;
  description?: string | null;
  level?: string | null;
  duration?: string | null;
  modules?: number | null;
  logo?: ReactNode;
  layout?: "row" | "stacked";
};

export function CourseCard({
  title,
  description,
  level,
  duration,
  modules,
  logo,
  layout = "row",
}: CourseCardProps) {
  return (
    <Card
      className={`vertex-learning-card vertex-course-card vertex-course-card--${layout}`}
    >
      <div className="vertex-course-card__identity">
        <div className="vertex-course-card__tile" aria-hidden="true">
          {logo ?? "N"}
        </div>
        <div className="vertex-course-card__copy">
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
      </div>
      {(level || duration || modules != null) && (
        <div className="vertex-card-meta">
          {level && (
            <span>
              <BarChart3 size={14} aria-hidden="true" />
              {level}
            </span>
          )}
          {duration && (
            <span>
              <Clock3 size={14} aria-hidden="true" />
              {duration}
            </span>
          )}
          {modules != null && (
            <span>
              <Layers3 size={14} aria-hidden="true" />
              {modules} {modules === 1 ? "module" : "modules"}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
