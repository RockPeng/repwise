import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  THEME_CYCLE,
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
  applyStoredTheme,
  applyTheme,
  getServerTheme,
  getTheme,
  nextTheme,
  resetTheme,
  setTheme,
  subscribe,
} from "./theme";

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
});

afterEach(() => {
  resetTheme();
  vi.restoreAllMocks();
});

describe("nextTheme", () => {
  it("cycles system to light", () => {
    expect(nextTheme("system")).toBe("light");
  });

  it("cycles light to dark", () => {
    expect(nextTheme("light")).toBe("dark");
  });

  it("cycles dark back to system", () => {
    expect(nextTheme("dark")).toBe("system");
  });

  it("cycles through every theme and returns to the start", () => {
    let theme = THEME_CYCLE[0];
    for (let i = 0; i < THEME_CYCLE.length; i += 1) {
      theme = nextTheme(theme);
    }
    expect(theme).toBe(THEME_CYCLE[0]);
  });
});

describe("getTheme", () => {
  it("defaults to system when nothing is stored", () => {
    expect(getTheme()).toBe("system");
  });

  it("falls back to system when the stored value is invalid", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "chartreuse");
    expect(getTheme()).toBe("system");
  });

  it("reads the stored preference", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(getTheme()).toBe("dark");
  });
});

describe("getServerTheme", () => {
  it("returns system so the server and the hydration pass agree", () => {
    expect(getServerTheme()).toBe("system");
  });
});

describe("applyTheme", () => {
  it("writes the preference to the document element", () => {
    applyTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("writes system verbatim, leaving the resolution to CSS", () => {
    applyTheme("system");
    expect(document.documentElement.getAttribute("data-theme")).toBe("system");
  });
});

describe("applyStoredTheme", () => {
  it("applies the stored preference", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    applyStoredTheme();

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("applies system when nothing is stored", () => {
    applyStoredTheme();
    expect(document.documentElement.getAttribute("data-theme")).toBe("system");
  });
});

describe("setTheme", () => {
  it("persists the chosen theme", () => {
    setTheme("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("applies the theme to the document element", () => {
    setTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("switches back to light", () => {
    setTheme("dark");
    setTheme("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("notifies subscribers", () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    setTheme("dark");

    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });

  it("keeps working when localStorage is unavailable", () => {
    const getItem = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("denied");
      });
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("denied");
      });

    expect(() => setTheme("dark")).not.toThrow();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    getItem.mockRestore();
    setItem.mockRestore();
  });
});

describe("cross-tab sync", () => {
  it("adopts a theme set in another tab", () => {
    getTheme();
    const listener = vi.fn();
    subscribe(listener);

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: THEME_STORAGE_KEY,
        newValue: "dark",
      }),
    );

    expect(getTheme()).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(listener).toHaveBeenCalled();
  });

  it("ignores storage events for other keys", () => {
    getTheme();

    window.dispatchEvent(
      new StorageEvent("storage", { key: "habits.v1", newValue: "[]" }),
    );

    expect(getTheme()).toBe("system");
  });

  it("falls back to system when another tab clears the theme", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    getTheme();

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: THEME_STORAGE_KEY,
        newValue: null,
      }),
    );

    expect(getTheme()).toBe("system");
  });
});

describe("THEME_INIT_SCRIPT", () => {
  it("sets data-theme to dark before paint when dark is stored", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    new Function(THEME_INIT_SCRIPT)();

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("sets data-theme to light before paint when light is stored", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");

    new Function(THEME_INIT_SCRIPT)();

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("leaves system for CSS to resolve", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "system");

    new Function(THEME_INIT_SCRIPT)();

    expect(document.documentElement.getAttribute("data-theme")).toBe("system");
  });

  it("falls back to system when localStorage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });

    new Function(THEME_INIT_SCRIPT)();

    expect(document.documentElement.getAttribute("data-theme")).toBe("system");
  });
});
