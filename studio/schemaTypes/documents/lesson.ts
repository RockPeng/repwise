import { PlayIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

const allowedVideoHosts = [
  'youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
  'vimeo.com',
  'mediadelivery.net',
  'b-cdn.net',
  'bunnycdn.com',
]

function isSupportedVideoHost(hostname: string): boolean {
  return allowedVideoHosts.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`)
  )
}

export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Use a YouTube, Vimeo, or Bunny embed URL over HTTPS.',
      validation: (rule) =>
        rule.required().uri({ scheme: ['https'] }).custom((value) => {
          if (!value) {
            return true
          }

          try {
            const hostname = new URL(value).hostname.toLowerCase()
            return isSupportedVideoHost(hostname)
              ? true
              : 'Use a YouTube, Vimeo, or Bunny video URL.'
          } catch {
            return 'Enter a valid HTTPS video URL.'
          }
        }),
    }),
    defineField({
      name: 'thumbnail',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'duration',
      type: 'number',
      description: 'Duration in seconds.',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'freePreview',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      type: 'number',
      description: 'Display-only enrollment count.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'notes',
      type: 'blockContent',
    }),
    defineField({
      name: 'keyPoints',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'proTip',
      type: 'text',
    }),
    defineField({
      name: 'resources',
      type: 'array',
      of: [defineArrayMember({ type: 'resource' })],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'duration',
      media: 'thumbnail',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: typeof subtitle === 'number' ? `${subtitle} seconds` : undefined,
        media,
      }
    },
  },
})
