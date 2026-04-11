import {
  fireEvent,
  render,
  screen,
} from "../bin/node_modules/@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MissionCard from "../bin/mission-card";

describe("MissionCard", () => {
  it("renders null for missing mission", () => {
    const { container } = render(<MissionCard mission={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders an available mission and calls onSelect on click or keyboard", () => {
    const onSelect = vi.fn();
    render(
      <MissionCard
        mission={{ ordine: 3, titolo: "Quest" }}
        index={2}
        status="AVAILABLE"
        onSelect={onSelect}
      />,
    );
    const [cardButton, actionButton] = screen.getAllByRole("button");
    fireEvent.click(actionButton);
    fireEvent.keyDown(cardButton, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it("renders locked missions as non-interactive", () => {
    const onSelect = vi.fn();
    render(
      <MissionCard
        mission={{ ordine: 1, titolo: "Locked Quest" }}
        status="LOCKED"
        onSelect={onSelect}
      />,
    );
    const actionButton = screen.getByText("Locked").closest("button");
    const cardButton = screen.getByRole("button", { name: /locked quest/i });
    expect(actionButton).toBeDisabled();
    fireEvent.click(cardButton);
    fireEvent.keyDown(cardButton, { key: " " });
    expect(onSelect).not.toHaveBeenCalled();
  });
});
