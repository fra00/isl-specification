import { renderHook, act } from "../bin/node_modules/@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../bin/dungeon-use-visibility-calc", () => ({
  useVisibilityCalc: vi.fn(),
}));

import { useVisibilityCalc } from "../bin/dungeon-use-visibility-calc";
import { useTraps } from "../bin/dungeon-use-traps";

describe("useTraps", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("tracks visibility, activation and registration state for traps", () => {
    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn(() => []),
    });
    const { result } = renderHook(() =>
      useTraps({
        gameSession: {},
        visibilityMap: {},
        areMonstersVisible: false,
      }),
    );

    expect(result.current.checkTrapActivation({ tipo: 1 }, 1, 1)).toBe(true);
    expect(result.current.isTrapVisible(1, 1)).toBe(false);

    act(() => {
      result.current.registerTriggeredTrap(1, 1, 2);
    });

    expect(result.current.isTrapVisible(1, 1)).toBe(true);
    expect(result.current.checkTrapActivation({ tipo: 2 }, 1, 1)).toBe(true);
    expect(result.current.getTriggeredTraps()).toEqual([
      { x: 1, y: 1, tipo: 2, status: "TRIGGERED" },
    ]);
  });

  it("supports trap search and both disarm outcomes", () => {
    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn(() => [
        { x: 2, y: 2 },
        { x: 4, y: 4 },
      ]),
    });
    const onNotify = vi.fn();
    const onActionDone = vi.fn();
    const onFail = vi.fn();

    const { result } = renderHook(() =>
      useTraps({
        gameSession: {
          currentTurn: 1,
          heroes: [{ turnOrder: 1, x: 1, y: 1 }],
          currentMap: {
            grid: [
              { x: 2, y: 2, trpl: { tipo: 2 } },
              { x: 4, y: 4, trpl: { tipo: 0 } },
            ],
          },
        },
        visibilityMap: {},
        areMonstersVisible: false,
        onNotify,
        onActionDone,
      }),
    );

    act(() => {
      result.current.searchTraps();
    });
    expect(onNotify).toHaveBeenCalledWith(
      "Attenzione! Hai individuato delle trappole!",
    );
    expect(result.current.getTriggeredTraps()[0]).toMatchObject({
      x: 2,
      y: 2,
      status: "DETECTED",
    });

    vi.spyOn(Math, "random").mockReturnValueOnce(0.1);
    act(() => {
      result.current.attemptDisarmTrap(2, 2, true, onFail);
    });
    expect(result.current.getTriggeredTraps()[0].status).toBe("DISARMED");
    expect(result.current.isTrapVisible(2, 2)).toBe(false);

    act(() => {
      result.current.registerTriggeredTrap(5, 5, 3);
    });
    expect(
      result.current
        .getTriggeredTraps()
        .find((trap) => trap.x === 5 && trap.y === 5).status,
    ).toBe("TRIGGERED");

    act(() => {
      result.current.attemptDisarmTrap(8, 8, false, onFail);
    });
    expect(onNotify).toHaveBeenCalledWith(
      "Non c'è una trappola disarmabile qui.",
    );
  });

  it("keeps a failed adjacent disarm retryable on later turns", () => {
    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn(() => [
        { x: 2, y: 1 },
        { x: 4, y: 4 },
      ]),
    });
    const onNotify = vi.fn();
    const onActionDone = vi.fn();
    const onFail = vi.fn();

    const { result } = renderHook(() =>
      useTraps({
        gameSession: {
          currentTurn: 1,
          heroes: [{ turnOrder: 1, x: 2, y: 2 }],
          currentMap: {
            grid: [
              { x: 2, y: 1, trpl: { tipo: 2 } },
              { x: 4, y: 4, trpl: { tipo: 3 } },
            ],
          },
        },
        visibilityMap: {},
        areMonstersVisible: false,
        onNotify,
        onActionDone,
      }),
    );

    act(() => {
      result.current.searchTraps();
    });

    expect(result.current.getAdjacentDisarmableTrap(2, 2)).toMatchObject({
      x: 2,
      y: 1,
      status: "DETECTED",
    });

    vi.spyOn(Math, "random").mockReturnValueOnce(0.99);
    act(() => {
      result.current.disarmAdjacentTrap(2, 2, true, onFail);
    });

    expect(result.current.getAdjacentDisarmableTrap(2, 2)).toMatchObject({
      x: 2,
      y: 1,
      status: "TRIGGERED",
    });
    expect(result.current.checkTrapActivation({ tipo: 2 }, 2, 1)).toBe(true);
    expect(onFail).toHaveBeenCalledTimes(1);

    vi.spyOn(Math, "random").mockReturnValueOnce(0.2);
    act(() => {
      result.current.disarmAdjacentTrap(2, 2, true, onFail);
    });

    expect(result.current.getAdjacentDisarmableTrap(2, 2)).toBeNull();
    expect(
      result.current
        .getTriggeredTraps()
        .find((trap) => trap.x === 2 && trap.y === 1)?.status,
    ).toBe("DISARMED");
    expect(
      result.current
        .getTriggeredTraps()
        .find((trap) => trap.x === 4 && trap.y === 4)?.status,
    ).toBe("DETECTED");
    expect(onFail).toHaveBeenCalledTimes(1);
  });

  it("blocks searching when monsters are visible", () => {
    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn(() => []),
    });
    const onNotify = vi.fn();
    const { result } = renderHook(() =>
      useTraps({
        gameSession: {},
        visibilityMap: {},
        areMonstersVisible: true,
        onNotify,
      }),
    );
    act(() => {
      result.current.searchTraps();
    });
    expect(onNotify).toHaveBeenCalledWith(
      "Non puoi cercare trappole con mostri vicini!",
    );
  });

  it("prioritizes mission scripts for event 4 over normal trap discovery", () => {
    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn(() => [{ x: 2, y: 2 }]),
    });
    const onActionDone = vi.fn();
    const onForceTurnEnd = vi.fn();
    const sessionManager = {
      executeMissionScripts: vi.fn(() => ({
        handled: true,
        session: null,
        notifications: [],
        revealPoints: [],
        effects: { forceFinishTurn: true },
      })),
    };

    const { result } = renderHook(() =>
      useTraps({
        gameSession: {
          currentTurn: 1,
          heroes: [{ turnOrder: 1, x: 1, y: 1 }],
          currentMap: {
            grid: [{ x: 2, y: 2, trpl: { tipo: 2 } }],
          },
        },
        visibilityMap: {},
        areMonstersVisible: false,
        onNotify: vi.fn(),
        onActionDone,
        onForceTurnEnd,
        sessionManager,
      }),
    );

    act(() => {
      result.current.searchTraps();
    });

    expect(sessionManager.executeMissionScripts).toHaveBeenCalledWith(expect.objectContaining({ eventType: 4 }));
    expect(result.current.getTriggeredTraps()).toEqual([]);
    expect(onForceTurnEnd).toHaveBeenCalledTimes(1);
    expect(onActionDone).not.toHaveBeenCalled();
  });
});
