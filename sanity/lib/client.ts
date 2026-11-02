import 'server-only'

import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../env'
import { token } from './token'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})
