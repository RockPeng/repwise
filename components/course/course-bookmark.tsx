"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { capturePostHogEvent } from "@/lib/posthog-client";

export function CourseBookmark() {
  const [bookmarked, setBookmarked] = useState(false);
  const Icon = bookmarked ? BookmarkCheck : Bookmark;

  const toggleBookmark = () => {
    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);
    capturePostHogEvent("course_bookmark_toggled", {
      bookmarked: nextBookmarked,
    });
  };

  return (
    <button
      className="vertex-course-hero__bookmark"
      type="button"
      aria-pressed={bookmarked}
      onClick={toggleBookmark}
    >
      <Icon size={18} aria-hidden="true" />
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
