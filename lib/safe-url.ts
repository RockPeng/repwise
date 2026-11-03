export function safeExternalUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname ? url.href : null;
  } catch {
    return null;
  }
}
