import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { act } from "react";
import Home from "./page";

/**
 * Verifies the server-rendered markup matches the first client render, so
 * React does not report a hydration mismatch. The store is read from
 * localStorage, which is only available on the client — the server snapshot
 * must therefore render the same loading placeholder the client renders on
 * its hydration pass.
 */
describe("hydration", () => {
  it("hydrates without a mismatch", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const html = renderToString(<Home />);
    expect(html).toContain("Loading…");

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    await act(async () => {
      hydrateRoot(container, <Home />);
    });

    const mismatch = consoleError.mock.calls.some((call) =>
      String(call[0]).includes("hydrat"),
    );
    expect(mismatch).toBe(false);

    consoleError.mockRestore();
  });
});
