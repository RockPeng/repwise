"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

export function CourseBookmark() {
  const [bookmarked, setBookmarked] = useState(false);
  const Icon = bookmarked ? BookmarkCheck : Bookmark;

  return (
    <button
      className="vertex-course-hero__bookmark"
      type="button"
      aria-pressed={bookmarked}
      onClick={() => setBookmarked((current) => !current)}
    >
      <Icon size={18} aria-hidden="true" />
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
