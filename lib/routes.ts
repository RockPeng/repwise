export const coursesHref = "/courses";

export function courseHref(slug: string) {
  return `${coursesHref}/${encodeURIComponent(slug)}`;
}

export function lessonHref(slug: string, startSeconds?: number) {
  const path = `/lessons/${encodeURIComponent(slug)}`;

  if (
    startSeconds === undefined ||
    !Number.isSafeInteger(startSeconds) ||
    startSeconds < 0
  ) {
    return path;
  }

  return `${path}?t=${startSeconds}`;
}
