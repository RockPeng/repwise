import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { act } from "react";
import Home from "./(marketing)/page";
import MarketingLayout from "./(marketing)/layout";
import { THEME_STORAGE_KEY, resetTheme } from "@/lib/theme";

/**
 * Verifies the server-rendered markup matches the first client render, so
 * React does not report a hydration mismatch.
 *
 * The homepage is the page most likely to break: it renders dates, prices
 * and counts, and every one of those has to be identical on the server and
 * on the client or React will throw away the markup and re-render it.
 */
describe("hydration", () => {
  afterEach(() => {
    resetTheme();
    vi.restoreAllMocks();
  });

  it("hydrates without a mismatch", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const html = renderToString(
      <MarketingLayout>
        <Home />
      </MarketingLayout>,
    );
    expect(html).toContain("A coach, a plan");

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    await act(async () => {
      hydrateRoot(
        container,
        <MarketingLayout>
          <Home />
        </MarketingLayout>,
      );
    });

    const mismatch = consoleError.mock.calls.some((call) =>
      String(call[0]).includes("hydrat"),
    );
    expect(mismatch).toBe(false);

    consoleError.mockRestore();
  });

  it("keeps the stored theme across hydration", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    const html = renderToString(
      <MarketingLayout>
        <Home />
      </MarketingLayout>,
    );
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    await act(async () => {
      hydrateRoot(
        container,
        <MarketingLayout>
          <Home />
        </MarketingLayout>,
      );
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
