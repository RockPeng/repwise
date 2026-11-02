"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { capturePostHogEvent } from "@/lib/posthog-client";

export function AuthControls() {
  return (
    <>
      <Show when="signed-out">
        <div className="vertex-auth-controls">
          <SignInButton mode="redirect">
            <button
              className="vertex-auth-button vertex-auth-button--secondary"
              type="button"
              onClick={() =>
                capturePostHogEvent("auth_sign_in_clicked", {
                  source: "site_header",
                })
              }
            >
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="redirect">
            <button
              className="vertex-auth-button vertex-auth-button--primary"
              type="button"
              onClick={() =>
                capturePostHogEvent("auth_sign_up_clicked", {
                  source: "site_header",
                })
              }
            >
              Sign up
            </button>
          </SignUpButton>
        </div>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}
