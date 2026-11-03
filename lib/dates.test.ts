import { describe, expect, it } from "vitest";
import {
  formatDayOfMonth,
  formatFullDate,
  formatWeekday,
  fromDayKey,
  lastNDays,
  toDayKey,
  todayKey,
} from "./dates";

describe("toDayKey", () => {
  it("formats a date as yyyy-mm-dd with zero padding", () => {
    expect(toDayKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("uses local time, not UTC", () => {
    // A late-evening local date can already be the next day in UTC.
    const late = new Date(2026, 10, 3, 23, 30);
    expect(toDayKey(late)).toBe("2026-11-03");
  });
});

describe("todayKey", () => {
  it("matches toDayKey of the given moment", () => {
    const now = new Date(2026, 6, 14, 9, 15);
    expect(todayKey(now)).toBe("2026-07-14");
  });
});

describe("lastNDays", () => {
  it("returns the requested number of days, oldest first", () => {
    const now = new Date(2026, 6, 14, 12, 0);
    const days = lastNDays(5, now);

    expect(days).toEqual([
      "2026-07-10",
      "2026-07-11",
      "2026-07-12",
      "2026-07-13",
      "2026-07-14",
    ]);
  });

  it("ends with today", () => {
    const now = new Date(2026, 6, 14, 12, 0);
    expect(lastNDays(10, now).at(-1)).toBe("2026-07-14");
  });

  it("crosses a month boundary correctly", () => {
    const now = new Date(2026, 2, 2, 12, 0);
    const days = lastNDays(4, now);

    expect(days).toEqual([
      "2026-02-27",
      "2026-02-28",
      "2026-03-01",
      "2026-03-02",
    ]);
  });

  it("crosses a year boundary correctly", () => {
    const now = new Date(2026, 0, 2, 12, 0);
    const days = lastNDays(4, now);

    expect(days).toEqual([
      "2025-12-30",
      "2025-12-31",
      "2026-01-01",
      "2026-01-02",
    ]);
  });

  it("handles a leap day", () => {
    const now = new Date(2028, 1, 29, 12, 0);
    expect(lastNDays(3, now)).toEqual([
      "2028-02-27",
      "2028-02-28",
      "2028-02-29",
    ]);
  });
});

describe("fromDayKey", () => {
  it("parses back to the same local date", () => {
    const date = fromDayKey("2026-11-03");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(10);
    expect(date.getDate()).toBe(3);
  });

  it("round-trips with toDayKey", () => {
    expect(toDayKey(fromDayKey("2026-02-28"))).toBe("2026-02-28");
  });
});

describe("formatting", () => {
  it("formats the weekday", () => {
    // 2026-11-03 is a Tuesday.
    expect(formatWeekday("2026-11-03")).toBe("Tue");
  });

  it("formats the weekday in English regardless of browser locale", () => {
    // The label must not depend on the machine's locale setting.
    expect(formatWeekday("2026-11-02")).toBe("Mon");
  });

  it("formats the day of the month", () => {
    expect(formatDayOfMonth("2026-11-03")).toBe("3");
  });

  it("formats a full date containing the day and month", () => {
    const label = formatFullDate("2026-11-03");
    expect(label).toContain("Nov");
    expect(label).toContain("3");
  });

  it("formats a full date in English regardless of browser locale", () => {
    expect(formatFullDate("2026-11-03")).toBe("Tue, Nov 3, 2026");
  });
});
