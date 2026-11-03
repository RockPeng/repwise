"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { capturePostHogEvent } from "@/lib/posthog-client";
import { buildVideoEmbedUrl } from "@/lib/video";

export function LessonVideo({
  videoUrl,
  title,
  posterUrl,
  posterAlt,
  startSeconds,
}: {
  videoUrl: string | null;
  title: string;
  posterUrl: string | null;
  posterAlt: string | null;
  startSeconds: number;
}) {
  const [playing, setPlaying] = useState(false);
  const embed = videoUrl
    ? buildVideoEmbedUrl(videoUrl, startSeconds, true)
    : null;

  return (
    <div className="vertex-lesson-video">
      {playing && embed ? (
        <iframe
          src={embed.src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <div className="vertex-lesson-video__poster">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={posterAlt ?? ""}
              fill
              sizes="(max-width: 700px) 100vw, 70vw"
              priority
              unoptimized
            />
          ) : (
            <div className="vertex-lesson-video__poster-fallback" aria-hidden="true" />
          )}
          {embed ? (
            <button
              className="vertex-lesson-video__play"
              type="button"
              aria-label={`Play ${title}`}
              onClick={() => {
                setPlaying(true);
                capturePostHogEvent("video_played", {
                  video_provider: embed.provider,
                  start_seconds: startSeconds,
                });
              }}
            >
              <Play size={27} fill="currentColor" aria-hidden="true" />
            </button>
          ) : (
            <p className="vertex-lesson-video__unavailable">Video unavailable</p>
          )}
        </div>
      )}
    </div>
  );
}
