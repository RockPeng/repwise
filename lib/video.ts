export type VideoProvider = "youtube" | "vimeo" | "bunny";

type VideoIdentity =
  | { provider: "youtube"; id: string }
  | { provider: "vimeo"; id: string; hash?: string }
  | { provider: "bunny"; libraryId: string; videoId: string };

function isHost(hostname: string, domain: string) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function parseVideoIdentity(value: string): VideoIdentity | null {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") {
    return null;
  }

  const hostname = url.hostname.toLowerCase();

  if (
    isHost(hostname, "youtube.com") ||
    isHost(hostname, "youtube-nocookie.com") ||
    hostname === "youtu.be"
  ) {
    const segments = url.pathname.split("/").filter(Boolean);
    const id =
      hostname === "youtu.be"
        ? segments[0]
        : url.searchParams.get("v") ??
          (["embed", "shorts", "live"].includes(segments[0] ?? "")
            ? segments[1]
            : undefined);

    return id && /^[A-Za-z0-9_-]{11}$/.test(id)
      ? { provider: "youtube", id }
      : null;
  }

  if (isHost(hostname, "vimeo.com")) {
    const segments = url.pathname.split("/").filter(Boolean);
    const videoSegment = segments.indexOf("video");
    const id = videoSegment >= 0 ? segments[videoSegment + 1] : segments[0];
    const hash =
      url.searchParams.get("h") ??
      (videoSegment < 0 && /^\d+$/.test(id ?? "") ? segments[1] : undefined);

    return id && /^\d+$/.test(id) && (!hash || /^[A-Za-z0-9]+$/.test(hash))
      ? { provider: "vimeo", id, hash }
      : null;
  }

  if (isHost(hostname, "mediadelivery.net")) {
    const segments = url.pathname.split("/").filter(Boolean);
    const embedIndex = segments.indexOf("embed");
    const libraryId = embedIndex >= 0 ? segments[embedIndex + 1] : undefined;
    const videoId = embedIndex >= 0 ? segments[embedIndex + 2] : undefined;

    return libraryId &&
      videoId &&
      /^[A-Za-z0-9_-]+$/.test(libraryId) &&
      /^[A-Za-z0-9_-]+$/.test(videoId)
      ? { provider: "bunny", libraryId, videoId }
      : null;
  }

  return null;
}

export function buildVideoEmbedUrl(
  value: string,
  startSeconds: number,
  autoplay: boolean,
): { provider: VideoProvider; src: string } | null {
  const identity = parseVideoIdentity(value);

  if (!identity) {
    return null;
  }

  const start = Number.isSafeInteger(startSeconds) ? Math.max(0, startSeconds) : 0;
  const autoplayParam = autoplay ? "1" : undefined;

  if (identity.provider === "youtube") {
    const params = new URLSearchParams({ controls: "1", rel: "0" });
    if (autoplayParam) params.set("autoplay", autoplayParam);
    if (start > 0) params.set("start", String(start));

    return {
      provider: identity.provider,
      src: `https://www.youtube-nocookie.com/embed/${identity.id}?${params.toString()}`,
    };
  }

  if (identity.provider === "vimeo") {
    const params = new URLSearchParams();
    if (identity.hash) params.set("h", identity.hash);
    if (autoplayParam) params.set("autoplay", autoplayParam);
    const query = params.toString();
    const time = start > 0 ? `#t=${start}s` : "";

    return {
      provider: identity.provider,
      src: `https://player.vimeo.com/video/${identity.id}${query ? `?${query}` : ""}${time}`,
    };
  }

  const params = new URLSearchParams();
  if (autoplayParam) params.set("autoplay", autoplayParam);
  if (start > 0) params.set("t", String(start));

  return {
    provider: identity.provider,
    src: `https://iframe.mediadelivery.net/embed/${identity.libraryId}/${identity.videoId}${params.size ? `?${params.toString()}` : ""}`,
  };
}
