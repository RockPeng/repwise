# Implementation prompt: All Courses page

## Goal

Implement `/courses` as a simple, read-only catalog of courses from Sanity. The home page already
links there and the course detail page already uses it as its breadcrumb destination.

## Skills and guidance read

- `AGENTS.md` — reuse existing UI, keep Sanity reads server-side, and keep the feature scoped.
- `sanity-best-practices` — Next.js App Router integration and GROQ query practices.
- Before coding, read the current Next.js guide under `node_modules/next/dist/docs/` for the
  App Router page, metadata, and data-fetching patterns.

## Code inspected

- `app/page.tsx` — existing Sanity fetch, stacked card markup, image rendering, and responsive grid.
- `app/courses/[slug]/page.tsx` — page frame, site header, course-page container, and breadcrumb.
- `components/cards/course-card.tsx` — existing stacked card component.
- `components/nav/breadcrumbs.tsx` — current-page breadcrumb behavior.
- `sanity/lib/queries.ts` — `COURSES_LIST_QUERY` already returns course details and is ordered
  popular-first, then by title.
- `sanity/lib/fetch.ts` — server-only `sanityFetch` and course/lesson cache tags.
- `sanity/lib/image.ts`, `lib/format.ts`, and `lib/routes.ts` — existing image, metadata-formatting,
  and course-link helpers.
- `app/globals.css` — existing stacked card and responsive catalog-grid styles.

## Decisions and assumptions

1. Keep the scope to the new catalog route. Do not refactor the home page or extract a shared grid.
2. Display every returned course that has both a title and slug; do not add filters, search, sorting,
   or pagination.
3. Reuse the current stacked `CourseCard`, Sanity cover image treatment, and responsive grid styles.
4. Include a short heading, course count, breadcrumb, and empty state. Do not introduce new visual
   patterns or additional components.
5. Add page metadata. Leave Sanity queries, schemas, seed data, and existing pages unchanged.

## Files expected to change

- `app/courses/page.tsx` — new server-rendered catalog page.
- `prompts/courses-catalog.md` — this approved implementation scope.

## Requirements

- Fetch with `sanityFetch`, `COURSES_LIST_QUERY`, and
  `tags: [CACHE_TAGS.course, CACHE_TAGS.lesson]`.
- Render course title, summary, image, level, duration, and module count when available.
- Link each card to its matching route with `courseHref`.
- Show `All Courses` as the current breadcrumb item, not as a link to itself.
- Show a concise empty state if no renderable courses are returned.
- Preserve keyboard focus visibility and mobile-friendly grid behavior using existing styles.

## Security considerations

- Keep all Sanity access on the server through the existing `sanityFetch` helper.
- Do not add a browser-side fetch, API route, or write operation.
- Do not expose Sanity tokens or private configuration.

## Acceptance criteria

1. `/courses` renders all renderable courses returned by the existing Sanity query.
2. Course cards show available Sanity content and navigate to their matching detail page.
3. The existing homepage and course detail page remain unchanged.
4. The page has a useful title and description and handles an empty result.
5. Type check, lint, and production build pass.

## Checks

From the repository root, run `npm run typecheck`, `npm run lint`, and `npm run build`.

## Manual test steps

1. Open `/courses` and confirm all catalog cards appear.
2. Open a card and use its breadcrumb to return to `/courses`.
3. Open `/` and follow “View all courses” to the catalog.
4. Check a narrow viewport for horizontal overflow.
