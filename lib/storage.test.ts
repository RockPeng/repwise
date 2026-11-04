import { describe, expect, it, vi } from "vitest";
import { readSetting, writeSetting } from "./storage";

describe("settings storage", () => {
  it("round-trips a value", () => {
    expect(writeSetting("test.key", "value")).toBe(true);
    expect(readSetting("test.key")).toBe("value");
  });

  it("returns null for a missing key", () => {
    expect(readSetting("test.missing")).toBeNull();
  });

  it("does not throw when the quota is exhausted", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(
      () => {
        throw new DOMException("QuotaExceededError");
      },
    );

    expect(writeSetting("test.key", "value")).toBe(false);

    setItem.mockRestore();
  });
});
