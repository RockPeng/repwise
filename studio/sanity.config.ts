import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { schema } from './schemaTypes'
import { structure } from './structure'

function assertValue(value: string | undefined, variable: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${variable}`)
  }

  return value
}

const projectId = assertValue(
  process.env.SANITY_STUDIO_PROJECT_ID,
  'SANITY_STUDIO_PROJECT_ID'
)
const dataset = assertValue(process.env.SANITY_STUDIO_DATASET, 'SANITY_STUDIO_DATASET')

export default defineConfig({
  name: 'vertex',
  title: 'Vertex',
  projectId,
  dataset,
  basePath: '/',
  schema,
  plugins: [structureTool({ structure }), visionTool()],
})
