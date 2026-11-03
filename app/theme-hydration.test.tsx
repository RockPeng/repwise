import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { act } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { THEME_INIT_SCRIPT, THEME_STORAGE_KEY, resetTheme } from "@/lib/theme";

/**
 * The theme must survive hydration intact.
 *
 * The inline script in the root layout applies the stored theme before the
 * browser paints. Hydration must not then overwrite it with the *server's*
 * default — otherwise a user who chose light on a dark OS would see the page
 * flip to dark for a frame.
 *
 * The attribute carries the preference, not the resolved appearance, so the
 * correct assertion is that the stored preference survives — never that a
 * particular colour was applied.
 */
describe("theme hydration", () => {
  let appliedThemes: (string | null)[];

  beforeEach(() => {
    appliedThemes = [];
    document.documentElement.removeAttribute("data-theme");

    const original = document.documentElement.setAttribute.bind(
      document.documentElement,
    );
    vi.spyOn(document.documentElement, "setAttribute").mockImplementation(
      (name: string, value: string) => {
        if (name === "data-theme") appliedThemes.push(value);
        original(name, value);
      },
    );
  });

  afterEach(() => {
    resetTheme();
    vi.restoreAllMocks();
  });

  /** Runs the inline script, then hydrates, and reports what was applied. */
  async function hydrateWithStoredTheme(stored: string) {
    window.localStorage.setItem(THEME_STORAGE_KEY, stored);

    // The inline script runs during HTML parsing, before the first paint.
    new Function(THEME_INIT_SCRIPT)();
    appliedThemes.length = 0;

    const html = renderToString(<ThemeToggle />);
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    await act(async () => {
      hydrateRoot(container, <ThemeToggle />);
    });

    return appliedThemes;
  }

  it("keeps an explicit light choice", async () => {
    const applied = await hydrateWithStoredTheme("light");

    expect(applied).not.toContain("system");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("keeps an explicit dark choice", async () => {
    const applied = await hydrateWithStoredTheme("dark");

    expect(applied).not.toContain("system");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("keeps the system preference for CSS to resolve", async () => {
    const applied = await hydrateWithStoredTheme("system");

    expect(applied).not.toContain("light");
    expect(applied).not.toContain("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("system");
  });

  it("does not consult the OS preference in JavaScript", async () => {
    const matchMedia = vi.fn(() => ({ matches: true }));
    vi.stubGlobal("matchMedia", matchMedia);

    await hydrateWithStoredTheme("system");

    expect(matchMedia).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
