# Vertex

Vertex is a learning platform built with Next.js and Sanity. The web app reads published
content through a server-only Sanity client; the independently deployable Sanity Studio lives in
`studio/`.

## Web app

Copy `.env.example` to `.env.local` and set the Sanity project ID, dataset, and Viewer read token.
The read token must remain server-only and must not use a `NEXT_PUBLIC_` prefix.

```bash
npm run dev
```

## Sanity Studio

The Studio uses `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` from `studio/.env` when
provided. Otherwise, its npm scripts reuse `NEXT_PUBLIC_SANITY_PROJECT_ID` and
`NEXT_PUBLIC_SANITY_DATASET` from the web app's `.env.local`. No web API token is passed to the
Studio. If neither file has these values, copy `studio/.env.example` to `studio/.env` and set them.
Run these commands from `studio/`:

```bash
npm install
npm run dev
```

Run `npm run typegen` from `studio/` after changing schemas or GROQ queries to regenerate
`sanity.types.ts` in the repository root.
