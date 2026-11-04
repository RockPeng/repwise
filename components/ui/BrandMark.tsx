/**
 * Brand marks for the third-party sign-in buttons.
 *
 * These are the only filled glyphs in the product, and they are the only
 * place a colour that is not ours appears — a sign-in button that does not
 * look like the provider is a sign-in button people distrust.
 */

export function GoogleMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.29a12 12 0 0 0 0 10.74l3.98-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.63l3.98 3.1C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

export function AppleMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.36 12.94c.03 3.05 2.68 4.07 2.71 4.09-.02.07-.42 1.45-1.4 2.87-.84 1.23-1.72 2.45-3.1 2.48-1.36.02-1.79-.8-3.34-.8-1.55 0-2.04.78-3.31.83-1.33.05-2.34-1.33-3.19-2.55-1.73-2.5-3.05-7.07-1.28-10.15.89-1.53 2.47-2.5 4.19-2.53 1.31-.02 2.54.88 3.34.88.8 0 2.3-1.09 3.87-.93.66.03 2.51.27 3.7 2-.1.06-2.21 1.29-2.19 3.8zM13.9 4.6c.71-.86 1.19-2.06 1.06-3.25-1.02.04-2.26.68-3 1.54-.66.76-1.24 1.99-1.08 3.16 1.14.09 2.31-.58 3.02-1.45z"
      />
    </svg>
  );
}
