import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Lightbulb, CircleCheck } from "lucide-react";
import type { BlockContent } from "@/sanity.types";
import { safeExternalUrl } from "@/lib/safe-url";
import { urlFor } from "@/sanity/lib/image";

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h3>{children}</h3>,
    h3: ({ children }) => <h4>{children}</h4>,
    h4: ({ children }) => <h5>{children}</h5>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = safeExternalUrl(value?.href);
      return href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <>{children}</>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  types: {
    image: ({ value }) => {
      const src = urlFor(value).width(960).url();
      return (
        <figure>
          <Image
            src={src}
            alt={value.alt ?? ""}
            width={960}
            height={600}
            sizes="(max-width: 700px) 100vw, 70vw"
            unoptimized
          />
        </figure>
      );
    },
  },
};

export function LessonOverview({
 notes,
 keyPoints,
 proTip,
}: {
 notes: BlockContent | null;
  keyPoints: Array<string> | null;
  proTip: string | null;
}) {
  return (
    <div className="vertex-lesson-overview">
      {notes && notes.length > 0 && (
        <section className="vertex-lesson-overview__notes" aria-labelledby="lesson-overview-heading">
          <h2 id="lesson-overview-heading">Overview</h2>
          <PortableText value={notes} components={portableTextComponents} />
        </section>
      )}
      {keyPoints && keyPoints.length > 0 && (
        <section className="vertex-lesson-key-points" aria-labelledby="lesson-key-points-heading">
          <h3 id="lesson-key-points-heading">In this lesson you will:</h3>
          <ul>
            {keyPoints.map((point, index) => (
              <li key={`${point}-${index}`}>
                <CircleCheck size={16} aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {proTip && (
        <aside className="vertex-lesson-pro-tip">
          <Lightbulb className="vertex-lesson-pro-tip__icon" size={21} aria-hidden="true" />
          <div>
            <h3>Pro Tip</h3>
            <p>{proTip}</p>
          </div>
        </aside>
      )}
    </div>
  );
}
