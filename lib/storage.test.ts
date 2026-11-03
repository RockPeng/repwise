import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addHabit,
  emptyStore,
  loadStore,
  removeHabit,
  saveStore,
  STORAGE_KEY,
  toggleCheckIn,
  type Store,
} from "./storage";

const habit = { id: "h1", name: "Read", createdAt: "2026-11-01T09:00:00.000Z" };

describe("loadStore / saveStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns an empty store when nothing is saved", () => {
    expect(loadStore()).toEqual({ habits: [], checkIns: {} });
  });

  it("round-trips a store through localStorage", () => {
    const store: Store = {
      habits: [habit],
      checkIns: { h1: ["2026-11-01", "2026-11-02"] },
    };

    expect(saveStore(store)).toBe(true);
    expect(loadStore()).toEqual(store);
  });

  it("falls back to an empty store when the saved JSON is corrupt", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not valid json");
    expect(loadStore()).toEqual(emptyStore());
  });

  it("falls back to an empty store when the saved JSON has the wrong shape", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ nope: true }));
    expect(loadStore()).toEqual(emptyStore());
  });

  it("returns false when the write throws", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(saveStore({ habits: [], checkIns: {} })).toBe(false);
    spy.mockRestore();
  });

  it("still reads from an in-memory copy after a failed write", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    const store: Store = { habits: [habit], checkIns: { h1: [] } };
    saveStore(store);

    spy.mockRestore();
    expect(loadStore()).toEqual(store);
  });
});

describe("toggleCheckIn", () => {
  const base: Store = { habits: [habit], checkIns: { h1: [] } };

  it("adds a date that was not checked off", () => {
    const next = toggleCheckIn(base, "h1", "2026-11-03");
    expect(next.checkIns.h1).toEqual(["2026-11-03"]);
  });

  it("removes a date that was already checked off", () => {
    const start: Store = { habits: [habit], checkIns: { h1: ["2026-11-03"] } };
    const next = toggleCheckIn(start, "h1", "2026-11-03");
    expect(next.checkIns.h1).toEqual([]);
  });

  it("keeps dates sorted", () => {
    const start: Store = { habits: [habit], checkIns: { h1: ["2026-11-01"] } };
    const next = toggleCheckIn(start, "h1", "2026-11-03");
    expect(next.checkIns.h1).toEqual(["2026-11-01", "2026-11-03"]);
  });

  it("does not mutate the input store", () => {
    const start: Store = { habits: [habit], checkIns: { h1: [] } };
    toggleCheckIn(start, "h1", "2026-11-03");
    expect(start.checkIns.h1).toEqual([]);
  });

  it("leaves other habits untouched", () => {
    const start: Store = {
      habits: [habit, { id: "h2", name: "Run", createdAt: habit.createdAt }],
      checkIns: { h1: [], h2: ["2026-11-02"] },
    };
    const next = toggleCheckIn(start, "h1", "2026-11-03");
    expect(next.checkIns.h2).toEqual(["2026-11-02"]);
  });
});

describe("addHabit / removeHabit", () => {
  it("adds a habit with an empty check-in list", () => {
    const next = addHabit(emptyStore(), "Read", "h1", "2026-11-01T09:00:00.000Z");
    expect(next.habits).toEqual([habit]);
    expect(next.checkIns.h1).toEqual([]);
  });

  it("removes a habit along with its check-ins", () => {
    const start: Store = { habits: [habit], checkIns: { h1: ["2026-11-01"] } };
    const next = removeHabit(start, "h1");

    expect(next.habits).toEqual([]);
    expect(next.checkIns).toEqual({});
  });
});
