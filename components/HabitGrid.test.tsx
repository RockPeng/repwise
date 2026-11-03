import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HabitGrid from "./HabitGrid";
import type { Habit } from "@/lib/storage";

const habit: Habit = {
  id: "h1",
  name: "Read",
  createdAt: "2026-10-01T09:00:00.000Z",
};

const days = ["2026-11-02", "2026-11-03"];

function renderGrid(overrides: Partial<React.ComponentProps<typeof HabitGrid>> = {}) {
  const props = {
    habits: [habit],
    checkIns: { h1: [] as string[] },
    days,
    today: "2026-11-03",
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    ...overrides,
  };
  render(<HabitGrid {...props} />);
  return props;
}

describe("HabitGrid", () => {
  it("shows an empty state when there are no habits", () => {
    renderGrid({ habits: [] });
    expect(screen.getByText(/no habits yet/i)).toBeInTheDocument();
  });

  it("renders a cell for every habit and day", () => {
    renderGrid();
    expect(screen.getAllByRole("button")).toHaveLength(
      days.length + 1, // day cells plus the delete button
    );
  });

  it("calls onToggle with the habit id and the clicked day", async () => {
    const user = userEvent.setup();
    const { onToggle } = renderGrid();

    await user.click(screen.getByLabelText(/2026-11-02/));

    expect(onToggle).toHaveBeenCalledWith("h1", "2026-11-02");
  });

  it("marks a checked-off day as pressed", () => {
    renderGrid({ checkIns: { h1: ["2026-11-02"] } });
    expect(screen.getByLabelText(/2026-11-02/)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByLabelText(/2026-11-03/)).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onDelete when the delete button is pressed", async () => {
    const user = userEvent.setup();
    const { onDelete } = renderGrid();

    await user.click(screen.getByLabelText("Delete Read"));

    expect(onDelete).toHaveBeenCalledWith("h1");
  });

  it("disables days before the habit was created", () => {
    const oldHabit: Habit = {
      id: "h2",
      name: "New",
      createdAt: "2026-11-03T09:00:00.000Z",
    };
    renderGrid({ habits: [oldHabit] });

    expect(screen.getByLabelText(/2026-11-02/)).toBeDisabled();
    expect(screen.getByLabelText(/2026-11-03/)).not.toBeDisabled();
  });
});
