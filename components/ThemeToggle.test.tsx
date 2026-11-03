import { afterEach, describe, expect, it, vi } from "vitest";
import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";
import { THEME_STORAGE_KEY, resetTheme } from "@/lib/theme";

afterEach(() => {
  resetTheme();
  vi.unstubAllGlobals();
});

describe("ThemeToggle", () => {
  it("shows the current theme", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: /theme: dark/i }),
    ).toBeInTheDocument();
  });

  it("defaults to the system theme when nothing is stored", () => {
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: /theme: system/i }),
    ).toBeInTheDocument();
  });

  it("cycles from system to light when clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    expect(
      screen.getByRole("button", { name: /theme: light/i }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("cycles from light to dark when clicked", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    expect(
      screen.getByRole("button", { name: /theme: dark/i }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("cycles from dark back to system when clicked", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    expect(
      screen.getByRole("button", { name: /theme: system/i }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("system");
  });

  it("applies the new theme to the document element", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("re-applies the theme after a Strict Mode remount", () => {
    // React's dev Strict Mode remounts components and resets <html> to only
    // the attributes it manages from JSX, wiping the theme. The layout
    // effect must put it back.
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    render(
      <StrictMode>
        <ThemeToggle />
      </StrictMode>,
    );

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
