import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import type { ClientParams } from '@sanity/client'
import { logContentOperation, SeverityNumber } from '@/lib/posthog-logger'
import { client } from './client'

const DEFAULT_REVALIDATE_SECONDS = 60 * 60

export const CACHE_TAGS = {
  course: 'sanity:course',
  lesson: 'sanity:lesson',
  instructor: 'sanity:instructor',
  category: 'sanity:category',
} as const

export async function sanityFetch<const QueryString extends string>({
  query,
  params,
  tags = [],
  revalidate,
}: {
  query: QueryString
  params?: ClientParams<QueryString>
  tags?: string[]
  revalidate?: number | false
}) {
  'use cache'

  if (tags.length > 0) {
    cacheTag(...tags)
  }

  const revalidateSeconds = revalidate ?? (tags.length > 0 ? false : DEFAULT_REVALIDATE_SECONDS)

  if (revalidateSeconds === false) {
    cacheLife('max')
  } else {
    if (!Number.isInteger(revalidateSeconds) || revalidateSeconds < 1) {
      throw new RangeError('Sanity revalidate must be a positive integer or false')
    }

    cacheLife({
      revalidate: revalidateSeconds,
      expire: revalidateSeconds * 2,
    })
  }

  const startedAt = Date.now()

  try {
    const result = await client.fetch(query, params ?? {})
    await logContentOperation({
      body: 'content fetch completed',
      attributes: {
        event: 'content.fetch',
        status: 'success',
        duration_ms: Date.now() - startedAt,
        cache_tag_count: tags.length,
        cache_policy: revalidateSeconds === false ? 'persistent' : 'revalidate',
      },
    })
    return result
  } catch (error) {
    await logContentOperation({
      body: 'content fetch completed',
      severityNumber: SeverityNumber.ERROR,
      attributes: {
        event: 'content.fetch',
        status: 'failed',
        duration_ms: Date.now() - startedAt,
        cache_tag_count: tags.length,
        error_type: error instanceof Error ? error.name : 'UnknownError',
      },
    })
    throw error
  }
}
