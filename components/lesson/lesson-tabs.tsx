"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { capturePostHogEvent } from "@/lib/posthog-client";

type Tab = "content" | "notes";

export function LessonTabs({
  lessonSlug,
  children,
}: {
  lessonSlug: string;
  children: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    capturePostHogEvent("lesson_viewed", { lesson_slug: lessonSlug });
  }, [lessonSlug]);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const nextIndex = currentIndex === 0 ? 1 : 0;
    setActiveTab(nextIndex === 0 ? "content" : "notes");
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="vertex-lesson-tabs">
      <div className="vertex-lesson-tabs__list" role="tablist" aria-label="Lesson sections">
        <button
          ref={(element) => {
            tabRefs.current[0] = element;
          }}
          id="lesson-content-tab"
          className={activeTab === "content" ? "is-active" : undefined}
          type="button"
          role="tab"
          aria-selected={activeTab === "content"}
          aria-controls="lesson-content-panel"
          tabIndex={activeTab === "content" ? 0 : -1}
          onClick={() => setActiveTab("content")}
          onKeyDown={(event) => onTabKeyDown(event, 0)}
        >
          Lesson Content
        </button>
        <button
          ref={(element) => {
            tabRefs.current[1] = element;
          }}
          id="lesson-notes-tab"
          className={activeTab === "notes" ? "is-active" : undefined}
          type="button"
          role="tab"
          aria-selected={activeTab === "notes"}
          aria-controls="lesson-notes-panel"
          tabIndex={activeTab === "notes" ? 0 : -1}
          onClick={() => setActiveTab("notes")}
          onKeyDown={(event) => onTabKeyDown(event, 1)}
        >
          Notes
        </button>
      </div>
      <section
        id="lesson-content-panel"
        className="vertex-lesson-tabs__panel"
        role="tabpanel"
        aria-labelledby="lesson-content-tab"
        tabIndex={0}
        hidden={activeTab !== "content"}
      >
        {children}
      </section>
      <section
        id="lesson-notes-panel"
        className="vertex-lesson-tabs__panel vertex-lesson-tabs__notes"
        role="tabpanel"
        aria-labelledby="lesson-notes-tab"
        tabIndex={0}
        hidden={activeTab !== "notes"}
      >
        <h2>Notes</h2>
        <p>Your notes live here soon.</p>
      </section>
    </div>
  );
}
