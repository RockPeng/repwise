import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import InlineScript from "@/components/InlineScript";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

/**
 * Archivo carries a width axis. Pushed wide it gives headlines the flat,
 * set-in-a-row feel of sportswear type; Inter handles everything that has to
 * be read rather than looked at.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FitCoach — train with a coach who watches the numbers",
    template: "%s · FitCoach",
  },
  description:
    "Find a coach, buy their programme, book a private session. Every lesson, every rep and every week tracked in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="system"
      suppressHydrationWarning
      className={`${archivo.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/*
          Applies the stored theme before the browser paints, so a dark-theme
          user never sees a flash of light mode. See the "preventing flash
          before hydration" guide in the Next.js docs.
        */}
        <InlineScript html={THEME_INIT_SCRIPT} />
      </head>
      <body className="min-h-full bg-surface-0 font-sans text-ink">{children}</body>
    </html>
  );
}
