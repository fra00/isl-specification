import {
  act,
  cleanup,
  render,
  screen,
} from "../bin/node_modules/@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DungeonNotification from "../bin/dungeon-notification";

describe("DungeonNotification", () => {
  afterEach(() => {
    try {
      vi.runOnlyPendingTimers();
    } catch {
      // No fake timers were active for this test.
    }
    vi.useRealTimers();
    cleanup();
  });

  it("renders nothing when no message is present", () => {
    const { container } = render(<DungeonNotification message="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders alerts and closes them after the configured duration", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(
      <DungeonNotification
        message="Treasure found"
        duration={50}
        onClose={onClose}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Treasure found");
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(onClose).toHaveBeenCalled();
  });
});
