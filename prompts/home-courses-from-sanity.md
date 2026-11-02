# Implementation prompt: Fetch homepage courses from Sanity

## Goal

Replace the homepage's hardcoded course cards with the first three courses from the seeded Sanity
dataset. Preserve the existing homepage layout and card styling; populate only the card content from
real documents and ensure each card links to its matching course detail page.

## Skills and docs read

- `sanity-best-practices` — server-side Sanity integration and GROQ query usage.
- `AGENTS.md` — §3 reference-led UI and reuse, §5 server-only Sanity boundary, §7 grounded content,
  §12 private dataset/token rules, and §13 checks.
- `node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md` — fetch Sanity data
  inside an async Server Component.
- `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` — use the existing
  `sanityFetch` cache helper with Cache Components enabled.
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` — remote image rendering.

## Code inspected

- `app/page.tsx` — currently hardcodes three unrelated courses, imports brand marks, and links every
  card to `/courses` instead of its detail page.
- `sanity/lib/queries.ts` — `COURSES_LIST_QUERY` already returns slug, summary, level, cover image,
  module count, and duration, ordered by popular first and title second.
- `sanity/lib/fetch.ts` — server-only `sanityFetch` supports cache tags. Use
  `tags: [CACHE_TAGS.course, CACHE_TAGS.lesson]`.
- `components/cards/course-card.tsx` — existing stacked card accepts a ReactNode logo but currently
  requires non-null description, level, duration, and module count.
- `components/brand/course-marks.tsx` — still used elsewhere in the design system and must not be
  removed.
- `lib/format.ts` — `formatDuration` and `formatLevel` safely handle null values.
- `lib/routes.ts` — `courseHref(slug)` creates the correct `/courses/<slug>` link.
- `app/globals.css` — existing three-column course-card styles and responsive behavior should remain
  unchanged.
- `sanity.types.ts` — generated `COURSES_LIST_QUERY_RESULT` describes the existing projection.
- `next.config.ts` and the course page — Sanity CDN images use `next/image` with `unoptimized`
  because the development network's proxy can resolve the CDN to a private IP, which the Next.js
  optimizer correctly rejects.

## Decisions and assumptions

1. Keep three cards to match the existing homepage composition and supplied reference; select the
   first three from the Sanity query's popular-first, title-ascending order.
2. Display the Sanity course cover in the existing 72px tile, cropped to a square with `urlFor`,
   `next/image`, and `unoptimized`. Keep the existing fallback if a course has no cover.
3. Keep the existing `CourseCard` design. Make data-backed description and metadata optional so
   absent Sanity values are omitted rather than replaced with invented content.
4. Filter out courses missing a usable slug or title. An empty query result leaves the section and
   other homepage content intact with an empty card grid.
5. Leave the Sanity query, seed, visual styles, home hero, and design-system brand marks unchanged.

## Files to touch

- `app/page.tsx` — fetch and render the first three Sanity courses; remove placeholder data and
  unused brand-mark imports.
- `components/cards/course-card.tsx` — support missing optional Sanity fields without rendering
  empty or invented metadata.
- This prompt file records the implementation decisions and test plan.

## Requirements

- Keep the homepage a server component and call `sanityFetch` with `COURSES_LIST_QUERY` and the
  course/lesson cache tags.
- Do not add a client-side fetch, API route, or Sanity credential to the browser.
- Map title, summary, cover image, level, duration, and module count from each returned course.
- Link each card with `courseHref(course.slug)` so it opens that course's detail page.
- Keep the existing three-card layout, section heading, "View all courses" link, and surrounding
  homepage content unchanged.
- Use the stored image alt value. Do not remove `CourseMark`; it remains used on other surfaces.

## Security considerations

- All Sanity access remains inside the server component using the existing server-only fetch layer.
- Do not expose the read token or any additional project configuration to the browser.
- Render only Sanity-provided content and perform no writes.

## Acceptance criteria

1. The homepage cards show actual seeded Sanity courses, not the previous hardcoded examples.
2. Card title, description, cover, level, duration, and module count match each Sanity document.
3. Each card navigates to its own `/courses/<slug>` page.
4. The design and responsive card layout remain unchanged.
5. TypeScript and lint pass; a production build succeeds.

## Checks to run

From the repository root:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Start the app and confirm the homepage cards render from the seeded dataset.

## Manual test steps

1. Open `/` and check each visible card's title and metadata against Sanity.
2. Confirm the cover images load and the three-card layout is unchanged.
3. Click each card and verify it opens the matching course detail page.
4. Confirm the hero and "View all courses" link still render as before.
