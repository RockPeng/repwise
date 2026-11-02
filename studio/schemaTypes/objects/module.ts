import { BookIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const module = defineType({
  name: 'module',
  title: 'Module',
  type: 'object',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
    }),
    defineField({
      name: 'lessons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'lesson' }],
        }),
      ],
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      lessons: 'lessons',
    },
    prepare({ title, lessons }) {
      const lessonCount = Array.isArray(lessons) ? lessons.length : 0
      return {
        title,
        subtitle: `${lessonCount} ${lessonCount === 1 ? 'lesson' : 'lessons'}`,
      }
    },
  },
})
