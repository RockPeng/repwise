import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'

const studioDirectory = fileURLToPath(new URL('../', import.meta.url))
const repoDirectory = fileURLToPath(new URL('../../', import.meta.url))

function readEnvFile(path) {
  try {
    return dotenv.parse(readFileSync(path))
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {}
    }

    throw error
  }
}

const studioEnv = readEnvFile(`${studioDirectory}.env`)
const webEnv = readEnvFile(`${repoDirectory}.env.local`)
const projectId =
  studioEnv.SANITY_STUDIO_PROJECT_ID || webEnv.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = studioEnv.SANITY_STUDIO_DATASET || webEnv.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error(
    'Configure SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET in studio/.env, or set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in the repository .env.local.'
  )
}

const env = {
  ...process.env,
  SANITY_STUDIO_PROJECT_ID: projectId,
  SANITY_STUDIO_DATASET: dataset,
}
delete env.SANITY_API_READ_TOKEN
const sanityCli = `${studioDirectory}node_modules/sanity/bin/sanity`
const [command, ...args] = process.argv.slice(2)

function runSanity(args) {
  const result = spawnSync(process.execPath, [sanityCli, ...args], {
    cwd: studioDirectory,
    env,
    stdio: 'inherit',
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (command === 'typegen') {
  runSanity(['schemas', 'extract', '--path', 'schema.json'])
  runSanity(['typegen', 'generate'])
} else if (command) {
  runSanity([command, ...args])
} else {
  throw new Error('Provide a Sanity CLI command.')
}
