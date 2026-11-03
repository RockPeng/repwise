/**
 * An inline `<script>` that survives React's script handling.
 *
 * React warns in development when a component renders a `<script>` tag, and
 * it will not execute a script it inserts through a DOM update. Setting
 * `type="text/plain"` on the client keeps React from trying to run it —
 * the script has already run during HTML parsing on a hard navigation, and
 * on a soft navigation the client component that owns the state has already
 * rendered the correct value.
 *
 * See the "preventing flash before hydration" guide in the Next.js docs.
 */
export default function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
