import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { RoleChoice } from "@/components/auth/RoleChoice";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Join FitCoach as a member or as a coach. One account for the programme you buy, the coach you book and the numbers you track.",
  robots: { index: false, follow: false },
};

/** The field treatment, shared by every form on the site. */
const field =
  "h-11 w-full rounded-field border border-line bg-surface-1 px-4 text-[15px] text-ink placeholder:text-ink-3 focus:border-accent";

export default function SignupPage() {
  return (
    <div>
      <h1 className="font-display text-[clamp(1.6rem,3vw,2.1rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">
        Create your account.
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
        One account for the programme you buy, the coach you book and the
        numbers you track.
      </p>

      <AuthForm className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-[13px] text-ink-2"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Alex Moreau"
            className={field}
          />
        </div>

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
            autoComplete="new-password"
            placeholder="At least 10 characters"
            className={field}
          />
        </div>

        <RoleChoice />

        <label
          htmlFor="terms"
          className="flex cursor-pointer items-start gap-2.5 pt-1 text-[13px] leading-relaxed text-ink-2"
        >
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="mt-[2px] size-4 shrink-0 accent-accent"
          />
          I agree to the terms of service and privacy policy.
        </label>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Create account
        </Button>
      </AuthForm>

      <p className="mt-8 text-[14px] text-ink-2">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-accent transition-colors hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
