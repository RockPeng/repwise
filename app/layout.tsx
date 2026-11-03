import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { PostHogIdentity } from "@/components/analytics/posthog-identity";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vertex | Intelligent Learning",
  description: "Find the exact lessons you need across all your courses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <PostHogIdentity />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}