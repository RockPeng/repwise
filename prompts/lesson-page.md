# Implementation prompt: Lesson page

## Goal

Implement `/lessons/[slug]` to match the attached `vertex-lesson.png` design, using real lesson and
course data from the seeded Sanity dataset. Playback must remain on the lesson page in the provider's
own embed. The page is read-only.

The reference content is illustrative: the checked-in seed currently contains 10 courses with 4
modules and 12 lessons apiece. Render the actual seeded titles, counts, notes, resource links, and
curriculum positions instead of hardcoding the screenshot's sample values.

## Skills and framework guidance read

- `AGENTS.md`: screenshot-first UI, responsive sidebar, server-only Sanity reads, public browsing,
  provider embeds (not a custom player), lesson/course relationship, Notes and progress constraints,
  and required checks.
- `sanity-best-practices`: Next.js and GROQ integration references, plus Portable Text rendering.
- Installed Next.js 16 docs: `page.md` (async `params`/`searchParams`, server pages, request-time
  query behavior), `dynamic-routes.md` (dynamic params and static params generation), and
  `keeping-pages-static.md` (Suspense boundaries around request-time data with Cache Components).

## Code and data inspected

- `sanity/lib/queries.ts`: `LESSON_BY_SLUG_QUERY` already fetches lesson fields and finds the
  containing course by reverse reference. Add the course cover and level plus each module's derived
  duration for this page. `LESSON_SLUGS_QUERY` is available for static params.
- `sanity/lib/fetch.ts`, `client.ts`, and `token.ts`: use the existing server-only cached fetch
  boundary and lesson/course cache tags; never pass a Sanity client or token to the browser.
- `sanity.types.ts` and `studio/sanity.cli.ts`: regenerate query result types using the Studio's
  TypeGen script; do not hand-edit generated output.
- `studio/schemaTypes/documents/lesson.ts` and `objects/blockContent.ts`: lessons have a provider
  URL, image, duration, optional Portable Text notes, key points, pro tip, and typed resources.
  Video URLs are restricted to YouTube, Vimeo, and Bunny hosts.
- `scripts/seed/seed.ndjson` and `scripts/seed/videos.json`: 120 lessons across 10 courses; the
  checked-in lesson URLs are YouTube watch URLs and seeded lessons include real notes/key points.
  The first seed route is
  `/lessons/nextjs-app-router-in-depth-file-system-routing`.
- `app/courses/[slug]/page.tsx`, `components/course/course-content.tsx`, shared layout/navigation/UI,
  `lib/format.ts`, `lib/routes.ts`, `lib/posthog-client.ts`, and `app/globals.css`: follow current
  server-page, navigation, analytics, token, and styling patterns.
- `package.json` and `package-lock.json`: `@portabletext/react` is not a root dependency; add it
  directly through the package manager for typed Portable Text rendering. Do not add a typography
  plugin or other dependency.
- No lesson route, lesson progress backend, or lesson-specific analytics currently exists. Do not
  add progress writes or infer completion percentages; show a neutral not-started/zero-progress
  state.

## Implementation decisions

1. Reproduce the reference's desktop structure: shared header, curriculum sidebar, lesson header,
   video, content/notes tabs, overview, key points, optional tip/resources, and previous/next footer.
   At narrow widths, collapse the sidebar into an accessible disclosure, stack the resource cards
   and footer, and prevent horizontal overflow.
2. Derive module and lesson numbers, current module, and adjacent lessons from the ordered course
   modules. The course is obtained from the existing reverse-reference query, not a new lesson
   parent field.
3. Use the first normal Portable Text paragraph as the short header summary and omit that same
   block from the Overview to avoid duplication. Render the remaining notes with `@portabletext/react`
   and typed, design-matched renderers.
4. Render the Sanity thumbnail as a poster with an accessible play control. On activation, replace
   it with a safely constructed provider iframe; never build a custom player or navigate off-site.
   Support provider URL forms allowed by the schema and parse them into validated embed URLs. Accept
   an optional `?t=<seconds>` value, validate and clamp it to lesson duration, then apply the
   provider's start parameter. Read `searchParams` only in a child under `<Suspense>` so Cache
   Components can prerender the lesson shell. Do not force autoplay on initial page load.
5. Keep bookmark and Notes tab presentational; Notes has a simple empty state. There is no progress
   store, so never claim lessons are completed. Record only the lesson-view and video-play analytics
   events through the existing PostHog helper.
6. If optional content is absent, omit its section. An unsupported or invalid provider URL must show
   an explicit unavailable state rather than constructing an iframe from untrusted input. If the
   lesson has no parent course, retain the lesson content and omit curriculum-dependent UI.

## Expected files

- `sanity/lib/queries.ts` — extend the lesson query with parent course fields and module durations.
- `sanity.types.ts` — regenerate using Studio TypeGen; do not edit by hand.
- `app/lessons/[slug]/page.tsx` — server route, data fetch, metadata, static params, derived
  curriculum navigation, and start-seconds parsing.
- `components/lesson/` — focused components for sidebar, lesson heading, provider video, tabs,
  Portable Text/overview, key points and tip, resource cards, and previous/next navigation.
- `app/globals.css` — lesson-specific styles matching the supplied reference and responsive behavior.
- `lib/video.ts`, `lib/routes.ts`, `lib/lesson-content.ts`, and `lib/safe-url.ts` — validated provider
  embeds, optional lesson start URL, note summary extraction, and HTTPS link validation.
- `package.json` and `package-lock.json` — add `@portabletext/react` as a direct dependency.

Do not change Studio schemas, seeded documents, authentication, progress storage, search, or unrelated
pages/components.

## Security and behavior requirements

- Sanity fetching and credentials stay server-only. Browser components receive only serializable
  content values.
- Construct iframe URLs only from a successfully parsed, supported provider URL and validated ID;
  include an iframe title, provider controls, lazy loading, and a restrictive referrer policy.
- Render external resources only for valid HTTPS URLs and open them safely with
  `rel="noopener noreferrer"`.
- Treat `?t=` as untrusted input: accept a non-negative integer, clamp it to the lesson duration,
  and never reflect raw query text into HTML.
- Keep all content read-only. Bookmark, Notes, and progress visuals must not imply persistence.
- Use the supplied image as the visual source of truth; reuse existing shared components and theme
  tokens where they fit.

## Acceptance criteria

1. The seeded route
   `/lessons/nextjs-app-router-in-depth-file-system-routing` renders its Sanity title, summary,
   duration, actual course level/student count where available, notes, key points, tip, resource,
   module/lesson position, and neighboring lessons.
2. The current module is expanded in the sidebar and the current lesson is visibly identified. The
   back-to-course and adjacent lesson links resolve to existing routes.
3. The video poster is shown initially. Activating play loads the provider's own player in place;
   playback does not navigate away. A valid `?t=120` link applies the provider's start parameter.
4. Unknown lesson slugs return the existing 404. Missing optional fields and invalid video URLs
   produce safe, intentional UI states.
5. Tabs work with pointer and keyboard; accordion and disclosure states are keyboard accessible and
   expose their expanded/selected state to assistive technology.
6. The supplied 1024px reference is matched on desktop; at 375px the layout remains usable without
   horizontal scrolling.
7. TypeScript, lint, and production build pass; generated Sanity types agree with the extended query.

## Checks and manual verification

After approval, update the root dependency with the package manager, then run:

1. `npm --prefix studio run typegen`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run build`
5. `npm run dev`, then perform these manual checks:
   - Open the seeded route and compare it with `design/vertex-lesson.png`.
   - Play the video and verify playback stays embedded on the lesson page.
   - Open the same lesson with `?t=120` and verify the provider receives the start time.
   - Expand/collapse modules, change tabs, and navigate to previous/next lessons.
   - Resize to 375px and verify the disclosure layout and absence of horizontal overflow.
   - Open an unknown slug and verify the 404 state.

## Implementation verification notes

- Studio TypeGen, `npm run typecheck`, `npm run lint`, and `npm run build` all pass. The lesson route
  is partially prerendered, with only the timestamp-dependent player streamed behind Suspense.
- The production route was opened against seeded content. The mobile disclosure and Notes tab work;
  an unknown slug returns 404; the seeded poster loads directly from Sanity; and clicking play
  constructs the expected YouTube embed URL with `start=120`.
- The integrated browser's YouTube iframe reported that its media codec is unavailable, so actual
  playback could not be verified in that browser. The player loaded on-page and receives the
  provider start time; verify playback in a browser with supported media codecs.
- Next's image optimizer rejected the seeded Sanity asset URL with `url parameter is not allowed`,
  while the public asset itself returned successfully. The small Sanity images use `unoptimized` so
  their public CDN URLs render directly.
- `npm run dev` could not start because Next.js reported an existing dev-server lock for this
  workspace. Browser verification used `next start` against the successful production build and did
  not stop or modify the existing process.
