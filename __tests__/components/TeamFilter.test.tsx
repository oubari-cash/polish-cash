import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TeamFilter } from "@/components/TeamFilter";

const TEAMS = ["Banking", "P2P", "Trust", "Moneybot"];

const searchProps = {
  searchQuery: "",
  onSearchClick: () => {},
  onClearSearch: () => {},
};

describe("TeamFilter", () => {
  it("renders team buttons", () => {
    render(<TeamFilter teams={TEAMS} active={null} onChange={() => {}} {...searchProps} />);
    for (const team of TEAMS) {
      expect(screen.getByText(team)).toBeInTheDocument();
    }
  });

  it("calls onChange when a team is clicked", async () => {
    const onChange = vi.fn();
    render(<TeamFilter teams={TEAMS} active={null} onChange={onChange} {...searchProps} />);
    await userEvent.click(screen.getByText("Banking"));
    expect(onChange).toHaveBeenCalledWith("Banking");
  });

  it("marks the active filter with aria-pressed", () => {
    render(<TeamFilter teams={TEAMS} active="P2P" onChange={() => {}} {...searchProps} />);
    const activeBtn = screen.getByText("P2P");
    const inactiveBtn = screen.getByText("Banking");
    expect(activeBtn).toHaveAttribute("aria-pressed", "true");
    expect(inactiveBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("shows no pill pressed when active is null", () => {
    render(<TeamFilter teams={TEAMS} active={null} onChange={() => {}} {...searchProps} />);
    for (const team of TEAMS) {
      expect(screen.getByText(team)).toHaveAttribute("aria-pressed", "false");
    }
  });

  it("shows search chip and clear when query is active", () => {
    const onClear = vi.fn();
    render(
      <TeamFilter
        teams={TEAMS}
        active={null}
        onChange={() => {}}
        searchQuery="design system"
        onSearchClick={() => {}}
        onClearSearch={onClear}
      />
    );
    expect(screen.getByRole("group", { name: /active search/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
  });
});
