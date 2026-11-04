"use client";

import type { ReactNode } from "react";

/**
 * A form that does not go anywhere.
 *
 * FitCoach has no auth backend yet, so the login and signup forms are real
 * forms — real inputs, real labels, a real submit button — but submitting
 * them must not navigate anywhere or put a password into the URL as a query
 * string. This wrapper keeps the markup on the server and stops the
 * submission in the browser.
 */
export function AuthForm({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <form
      className={className}
      noValidate
      onSubmit={(event) => event.preventDefault()}
    >
      {children}
    </form>
  );
}
