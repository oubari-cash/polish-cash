import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FixCard } from "@/components/FixCard";
import type { Fix } from "@/types";

const textFix: Fix = {
  id: 1,
  title: "Balance card corner radius inconsistent",
  team: "Banking",
  pr: "#4798",
  date: "Mar 28",
  author: "@sarar",
  before: { label: "8px radius" },
  after: { label: "12px radius" },
  component: "BalanceCard.swift",
};

const imageFix: Fix = {
  id: 2,
  title: "Borrow access bottom sheet uses dark mode",
  team: "Banking",
  pr: "#4821",
  date: "Apr 2",
  author: "@juanm",
  before: { label: "Dark mode sheet", image: "/screenshots/before-borrow.png" },
  after: { label: "Light mode sheet", image: "/screenshots/after-borrow.png" },
  component: "BorrowAccessSheet.swift",
};

describe("FixCard", () => {
  it("renders title, author, and team", () => {
    render(<FixCard fix={textFix} />);
    expect(screen.getByText(textFix.title)).toBeInTheDocument();
    expect(screen.getByText(textFix.author)).toBeInTheDocument();
    expect(screen.getByText(textFix.team)).toBeInTheDocument();
  });

  it("renders text-based before/after for fixes without images", () => {
    render(<FixCard fix={textFix} />);
    expect(screen.getByText("Before")).toBeInTheDocument();
    expect(screen.getByText("After")).toBeInTheDocument();
    expect(screen.getByText("8px radius")).toBeInTheDocument();
    expect(screen.getByText("12px radius")).toBeInTheDocument();
  });

  it("renders image-based before/after for fixes with screenshots", () => {
    render(<FixCard fix={imageFix} />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(2);
  });

  it("renders component name and PR number", () => {
    render(<FixCard fix={textFix} />);
    expect(screen.getByText(textFix.component)).toBeInTheDocument();
    expect(screen.getByText(textFix.pr)).toBeInTheDocument();
  });
});
