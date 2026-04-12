import { renderHook, act } from "../bin/node_modules/@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../bin/dungeon-use-visibility-calc", () => ({
  useVisibilityCalc: vi.fn(),
}));

import { useVisibilityCalc } from "../bin/dungeon-use-visibility-calc";
import { useTreasureSearch } from "../bin/dungeon-use-treasure";

describe("useTreasureSearch", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("adds a found treasure only after boundary persistence succeeds", () => {
    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn(() => [{ x: 2, y: 2 }]),
    });
    const onNotify = vi.fn();
    const onActionDone = vi.fn();
    const sessionManager = {
      executeMissionScripts: vi.fn(() => ({
        handled: false,
        session: null,
        notifications: [],
        revealPoints: [],
        effects: {},
      })),
      collectTreasureAtCell: vi.fn(() => true),
      drawTreasureCard: vi.fn(),
      applyTreasureCardEffect: vi.fn(),
    };

    const { result } = renderHook(() =>
      useTreasureSearch({
        gameSession: {
          currentTurn: 1,
          heroes: [{ turnOrder: 1, heroId: 4, x: 1, y: 1 }],
          monsters: [],
          treasureDeck: [],
          currentMap: {
            grid: [{ x: 2, y: 2, tes: { mon: 100, ogg: 0, arma: 0, trp: 0 } }],
          },
        },
        visibilityMap: {},
        onNotify,
        onActionDone,
        onForceTurnEnd: vi.fn(),
        sessionManager,
        onTreasureCardDrawn: vi.fn(),
        onWanderingMonster: vi.fn(),
      }),
    );

    act(() => {
      result.current.searchTreasure();
    });

    expect(sessionManager.collectTreasureAtCell).toHaveBeenCalledWith(4, 2, 2);
    expect(result.current.getFoundTreasures()).toEqual([
      { x: 2, y: 2, img: "tesoro.jpg" },
    ]);
    expect(onActionDone).toHaveBeenCalled();
  });

  it("reports persistence failures and falls back to deck drawing only when no static treasure is found", () => {
    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn(() => [{ x: 2, y: 2 }]),
    });
    const onNotify = vi.fn();
    const onTreasureCardDrawn = vi.fn();

    const failed = renderHook(() =>
      useTreasureSearch({
        gameSession: {
          currentTurn: 1,
          heroes: [{ turnOrder: 1, heroId: 4, x: 1, y: 1 }],
          monsters: [],
          treasureDeck: [{ id: 9 }],
          currentMap: {
            grid: [{ x: 2, y: 2, tes: { mon: 1, ogg: 0, arma: 0, trp: 0 } }],
          },
        },
        visibilityMap: {},
        onNotify,
        onActionDone: vi.fn(),
        onForceTurnEnd: vi.fn(),
        sessionManager: {
          collectTreasureAtCell: vi.fn(() => false),
          drawTreasureCard: vi.fn(),
          applyTreasureCardEffect: vi.fn(),
        },
        onTreasureCardDrawn,
        onWanderingMonster: vi.fn(),
      }),
    );

    act(() => {
      failed.result.current.searchTreasure();
    });
    expect(onNotify).toHaveBeenCalledWith(
      "Errore durante la raccolta del tesoro.",
    );
    expect(onTreasureCardDrawn).not.toHaveBeenCalled();

    const card = { id: 3, azione: "aggiungi_oro" };
    const deckManager = {
      collectTreasureAtCell: vi.fn(() => false),
      drawTreasureCard: vi.fn(() => card),
      applyTreasureCardEffect: vi.fn(),
    };
    const drawn = renderHook(() =>
      useTreasureSearch({
        gameSession: {
          currentTurn: 1,
          heroes: [{ turnOrder: 1, heroId: 4, x: 1, y: 1 }],
          monsters: [],
          treasureDeck: [card],
          currentMap: { grid: [] },
        },
        visibilityMap: {},
        onNotify: vi.fn(),
        onActionDone: vi.fn(),
        onForceTurnEnd: vi.fn(),
        sessionManager: deckManager,
        onTreasureCardDrawn,
        onWanderingMonster: vi.fn(),
      }),
    );

    act(() => {
      drawn.result.current.searchTreasure();
    });
    expect(onTreasureCardDrawn).toHaveBeenCalledWith(card);
  });

  it("blocks search with monsters nearby and delegates treasure card effects", () => {
    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn(() => []),
    });
    const onNotify = vi.fn();
    const sessionManager = {
      executeMissionScripts: vi.fn(() => ({
        handled: false,
        session: null,
        notifications: [],
        revealPoints: [],
        effects: {},
      })),
      collectTreasureAtCell: vi.fn(),
      drawTreasureCard: vi.fn(),
      applyTreasureCardEffect: vi.fn(),
    };
    const onWanderingMonster = vi.fn();

    const { result } = renderHook(() =>
      useTreasureSearch({
        gameSession: {
          currentTurn: 1,
          heroes: [{ turnOrder: 1, heroId: 4, x: 1, y: 1 }],
          monsters: [{ id: 1 }],
          treasureDeck: [],
          currentMap: { grid: [] },
        },
        visibilityMap: {},
        onNotify,
        onActionDone: vi.fn(),
        onForceTurnEnd: vi.fn(),
        sessionManager,
        onTreasureCardDrawn: vi.fn(),
        onWanderingMonster,
      }),
    );

    act(() => {
      result.current.searchTreasure();
      result.current.applyTreasureEffect({ id: 9 });
    });

    expect(onNotify).toHaveBeenCalledWith(
      "Non puoi cercare tesori con mostri vicini!",
    );
    expect(sessionManager.applyTreasureCardEffect).toHaveBeenCalledWith(
      4,
      { id: 9 },
      onWanderingMonster,
    );
  });

  it("prioritizes room treasure scripts over normal treasure collection", () => {
    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn(() => [{ x: 2, y: 2 }]),
    });
    const onForceTurnEnd = vi.fn();
    const sessionManager = {
      executeMissionScripts: vi.fn(() => ({
        handled: true,
        session: null,
        notifications: [],
        revealPoints: [],
        effects: { forceFinishTurn: true },
      })),
      collectTreasureAtCell: vi.fn(),
      drawTreasureCard: vi.fn(),
      applyTreasureCardEffect: vi.fn(),
    };

    const { result } = renderHook(() =>
      useTreasureSearch({
        gameSession: {
          currentTurn: 1,
          heroes: [{ turnOrder: 1, heroId: 4, x: 1, y: 1 }],
          monsters: [],
          treasureDeck: [],
          currentMap: {
            grid: [{ x: 2, y: 2, tes: { mon: 100, ogg: 0, arma: 0, trp: 0 } }],
          },
        },
        visibilityMap: {
          data: [
            { x: 1, y: 1, fog: false, valo: 7 },
            { x: 2, y: 2, fog: false, valo: 7 },
          ],
        },
        onNotify: vi.fn(),
        onActionDone: vi.fn(),
        onForceTurnEnd,
        sessionManager,
        onTreasureCardDrawn: vi.fn(),
        onWanderingMonster: vi.fn(),
      }),
    );

    act(() => {
      result.current.searchTreasure();
    });

    expect(sessionManager.executeMissionScripts).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: 3 }),
    );
    expect(sessionManager.collectTreasureAtCell).not.toHaveBeenCalled();
    expect(onForceTurnEnd).toHaveBeenCalledTimes(1);
  });
});
