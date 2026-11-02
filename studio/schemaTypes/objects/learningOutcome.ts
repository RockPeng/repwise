import { BulbOutlineIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

const outcomeIcons = [
  'BookOpen',
  'Code2',
  'Database',
  'Gauge',
  'Network',
  'Rocket',
  'ShieldCheck',
  'Sparkles',
  'Terminal',
  'Workflow',
  'Zap',
]

export const learningOutcome = defineType({
  name: 'learningOutcome',
  title: 'Learning outcome',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'icon',
      type: 'string',
      options: {
        list: outcomeIcons.map((value) => ({ title: value, value })),
      },
      initialValue: 'BookOpen',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
