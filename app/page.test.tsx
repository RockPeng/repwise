import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";
import { loadStore, STORAGE_KEY } from "@/lib/storage";
import { todayKey } from "@/lib/dates";

describe("Home page", () => {
  it("renders habits loaded from localStorage", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        habits: [{ id: "h1", name: "Read", createdAt: "2020-01-01T00:00:00.000Z" }],
        checkIns: {},
      }),
    );

    render(<Home />);

    expect(await screen.findByText("Read")).toBeInTheDocument();
  });

  it("adds a habit and persists it", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await screen.findByText(/no habits yet/i);

    await user.type(screen.getByLabelText("Habit name"), "Meditate");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByText("Meditate")).toBeInTheDocument();

    await waitFor(() => {
      const persisted = loadStore();
      expect(persisted.habits.map((h) => h.name)).toEqual(["Meditate"]);
    });
  });

  it("toggles a check-in and persists it", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        habits: [{ id: "h1", name: "Read", createdAt: "2020-01-01T00:00:00.000Z" }],
        checkIns: {},
      }),
    );

    render(<Home />);
    // The grid shows one cell per day, so match the specific day key.
    const today = todayKey();
    const cell = await screen.findByRole("button", {
      name: new RegExp(`^${today} .*: Read not done$`),
    });

    await user.click(cell);

    await waitFor(() => {
      const persisted = loadStore();
      expect(persisted.checkIns.h1).toEqual([today]);
    });
  });

  it("deletes a habit and removes it from storage", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        habits: [{ id: "h1", name: "Read", createdAt: "2020-01-01T00:00:00.000Z" }],
        checkIns: { h1: ["2026-11-01"] },
      }),
    );

    render(<Home />);
    await screen.findByText("Read");

    await user.click(screen.getByLabelText("Delete Read"));

    await waitFor(() => {
      const persisted = loadStore();
      expect(persisted.habits).toHaveLength(0);
      expect(persisted.checkIns.h1).toBeUndefined();
    });
  });
});
