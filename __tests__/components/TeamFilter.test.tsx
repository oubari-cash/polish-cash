import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TeamFilter } from "@/components/TeamFilter";

const TEAMS = ["All", "Banking", "P2P", "Trust", "Moneybot"];

describe("TeamFilter", () => {
  it("renders all team buttons", () => {
    render(<TeamFilter teams={TEAMS} active="All" onChange={() => {}} />);
    for (const team of TEAMS) {
      expect(screen.getByText(team)).toBeInTheDocument();
    }
  });

  it("calls onChange when a team is clicked", async () => {
    const onChange = vi.fn();
    render(<TeamFilter teams={TEAMS} active="All" onChange={onChange} />);
    await userEvent.click(screen.getByText("Banking"));
    expect(onChange).toHaveBeenCalledWith("Banking");
  });

  it("marks the active filter with aria-pressed", () => {
    render(<TeamFilter teams={TEAMS} active="P2P" onChange={() => {}} />);
    const activeBtn = screen.getByText("P2P");
    const inactiveBtn = screen.getByText("All");
    expect(activeBtn).toHaveAttribute("aria-pressed", "true");
    expect(inactiveBtn).toHaveAttribute("aria-pressed", "false");
  });
});
