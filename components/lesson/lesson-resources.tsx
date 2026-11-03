import {
  BookOpen,
  ExternalLink,
  FileCode2,
  FileText,
  FolderGit2,
  Link2,
  Presentation,
} from "lucide-react";
import type { LESSON_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { safeExternalUrl } from "@/lib/safe-url";

type Resource = NonNullable<NonNullable<LESSON_BY_SLUG_QUERY_RESULT>["resources"]>[number];

const resourceIcons = {
  code: FileCode2,
  link: Link2,
  pdf: FileText,
  repo: FolderGit2,
  slides: Presentation,
} as const;

export function LessonResources({ resources }: { resources: Resource[] | null }) {
  const visibleResources = (resources ?? []).filter((resource) => resource.title);

  if (visibleResources.length === 0) {
    return null;
  }

  return (
    <section className="vertex-lesson-resources" aria-labelledby="lesson-resources-heading">
      <h2 id="lesson-resources-heading">Resources</h2>
      <div className="vertex-lesson-resources__grid">
        {visibleResources.map((resource) => {
          const Icon = resourceIcons[resource.type ?? "link"] ?? BookOpen;
          const href = safeExternalUrl(resource.url);
          const content = (
            <>
              <span className="vertex-lesson-resource__icon">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="vertex-lesson-resource__copy">
                <strong>{resource.title}</strong>
                {resource.description && <span>{resource.description}</span>}
              </span>
              {href && <ExternalLink size={14} aria-hidden="true" />}
            </>
          );

          return href ? (
            <a
              className="vertex-lesson-resource"
              href={href}
              key={resource._key}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${resource.title} in a new tab`}
            >
              {content}
            </a>
          ) : (
            <div className="vertex-lesson-resource" key={resource._key}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
