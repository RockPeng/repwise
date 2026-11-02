import 'server-only'

function assertValue(value: string | undefined, errorMessage: string): string {
  if (!value) {
    throw new Error(errorMessage)
  }

  return value
}

export const token = assertValue(
  process.env.SANITY_API_READ_TOKEN,
  'Missing environment variable: SANITY_API_READ_TOKEN'
)
