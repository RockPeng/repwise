import { earnings, type Program } from "@/lib/data";

/**
 * The little facts the console needs about a programme that the data does
 * not carry: whether it is live, when it went live, and what it has earned.
 */

export type ProgrammeStatus = "published" | "draft";

const statusById: Record<string, ProgrammeStatus> = {
  "stronger-in-12": "published",
  "return-to-training": "published",
};

const publishedAt: Record<string, string> = {
  "stronger-in-12": "14 Aug 2026",
  "return-to-training": "2 Nov 2026",
};

/** Whether a programme is live on the marketplace. */
export function programmeStatus(id: string): ProgrammeStatus {
  return statusById[id] ?? "draft";
}

/** The date a programme went live, in words. */
export function programmePublishedAt(id: string): string {
  return publishedAt[id] ?? "Not published yet";
}

/**
 * Net revenue earned from a programme: the sales of the programme itself
 * plus the 1:1 sessions booked under it, after the platform fee. Refunded
 * entries are excluded.
 */
export function programmeRevenue(program: Program): number {
  return earnings
    .filter(
      (entry) =>
        entry.status !== "refunded" && entry.detail.includes(program.title),
    )
    .reduce((total, entry) => total + entry.netCents, 0);
}
