import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to FitCoach to pick up your programme, your coach and your next session.",
  robots: { index: false, follow: false },
};

/** The field treatment, shared by every form on the site. */
const field =
  "h-11 w-full rounded-field border border-line bg-surface-1 px-4 text-[15px] text-ink placeholder:text-ink-3 focus:border-accent";

export default function LoginPage() {
  return (
    <div>
      <h1 className="font-display text-[clamp(1.6rem,3vw,2.1rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">
        Welcome back.
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
        Pick up where you left off — your programme, your coach and your next
        session.
      </p>

      <AuthForm className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[13px] text-ink-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={field}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-[13px] text-ink-2"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            className={field}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-1">
          <label
            htmlFor="remember"
            className="inline-flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-2"
          >
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="size-4 shrink-0 accent-accent"
            />
            Remember me
          </label>

          {/* There is no password-reset route yet, so this is a button
              rather than a link that would 404. */}
          <button
            type="button"
            className="text-[13px] text-accent transition-colors hover:underline"
          >
            Forgot your password?
          </button>
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Log in
        </Button>
      </AuthForm>

      <div className="my-8 flex items-center gap-4">
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
        <span className="text-[13px] text-ink-3">or</span>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="secondary" size="lg" icon="globe" className="w-full">
          Continue with Google
        </Button>
        <Button variant="secondary" size="lg" icon="sparkle" className="w-full">
          Continue with Apple
        </Button>
      </div>

      <p className="mt-8 text-[14px] text-ink-2">
        New to FitCoach?{" "}
        <Link
          href="/signup"
          className="font-medium text-accent transition-colors hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
