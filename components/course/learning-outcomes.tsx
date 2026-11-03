import {
  BookOpen,
  Code2,
  Database,
  Gauge,
  Layers3,
  Network,
  Puzzle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { COURSE_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

type Course = NonNullable<COURSE_BY_SLUG_QUERY_RESULT>;
type LearningOutcome = NonNullable<Course["learningOutcomes"]>[number];

const outcomeIcons: Record<string, LucideIcon> = {
  BookOpen,
  Code2,
  Database,
  Gauge,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
  code: Code2,
  gauge: Gauge,
  layers: Layers3,
  puzzle: Puzzle,
  rocket: Rocket,
  shield: ShieldCheck,
  sparkles: Sparkles,
  workflow: Workflow,
};

export function LearningOutcomes({
  outcomes,
}: {
  outcomes: LearningOutcome[];
}) {
  return (
    <section
      className="vertex-learning-outcomes"
      aria-labelledby="learning-outcomes-heading"
    >
      <h2 id="learning-outcomes-heading">What you’ll learn</h2>
      <div className="vertex-learning-outcomes__grid">
        {outcomes.map((outcome) => {
          const Icon = outcomeIcons[outcome.icon ?? ""] ?? Sparkles;
          return (
            <article
              className="vertex-learning-outcome"
              key={outcome._key}
            >
              <Icon size={48} aria-hidden="true" />
              <div>
                {outcome.title && <h3>{outcome.title}</h3>}
                {outcome.description && <p>{outcome.description}</p>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
