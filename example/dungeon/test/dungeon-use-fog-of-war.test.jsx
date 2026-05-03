import { renderHook, act } from "../bin/node_modules/@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../bin/dungeon-use-visibility-calc", () => ({
  useVisibilityCalc: vi.fn(),
}));

import { useVisibilityCalc } from "../bin/dungeon-use-visibility-calc";
import { useFogOfWar } from "../bin/dungeon-use-fog-of-war";

describe("useFogOfWar", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes fog on initialization and reveals hero visibility when requested", () => {
    const gameSession = {
      isHeroOrderConfirmed: true,
      currentTurn: 1,
      heroes: [
        { turnOrder: 1, x: 1, y: 1 },
        { turnOrder: 2, x: 3, y: 3 },
      ],
    };
    const staticVisibilityMap = {
      data: [
        { x: 1, y: 1, fog: true },
        { x: 2, y: 1 },
        { x: 3, y: 3, fog: true },
      ],
    };

    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn((x) =>
        x === 1
          ? [
              { x: 1, y: 1 },
              { x: 2, y: 1 },
            ]
          : [{ x: 3, y: 3 }],
      ),
    });

    const { result } = renderHook(() =>
      useFogOfWar({ gameSession, staticVisibilityMap }),
    );

    expect(
      result.current.fogVisibilityMap.data.every(
        (cell) => typeof cell.fog === "boolean",
      ),
    ).toBe(true);

    act(() => {
      result.current.revealInitialVisibility();
    });
    expect(
      result.current.fogVisibilityMap.data.find(
        (cell) => cell.x === 2 && cell.y === 1,
      ).fog,
    ).toBe(false);

    act(() => {
      result.current.revealFromPoint(3, 3);
    });
    expect(
      result.current.fogVisibilityMap.data.find(
        (cell) => cell.x === 3 && cell.y === 3,
      ).fog,
    ).toBe(false);
  });

  it("returns null map when no static visibility map exists", () => {
    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn(() => []),
    });
    const gameSession = {};
    const staticVisibilityMap = null;
    const { result } = renderHook(() =>
      useFogOfWar({ gameSession, staticVisibilityMap }),
    );
    expect(result.current.fogVisibilityMap).toBeNull();
    expect(result.current.calculateFog()).toBeNull();
  });
});
