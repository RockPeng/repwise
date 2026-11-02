export const coursesHref = "/courses";

export function courseHref(slug: string) {
  return `${coursesHref}/${encodeURIComponent(slug)}`;
}

export function lessonHref(slug: string) {
  return `/lessons/${encodeURIComponent(slug)}`;
}
