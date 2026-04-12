import { renderHook, act } from '../bin/node_modules/@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../bin/dungeon-use-visibility-calc', () => ({
  useVisibilityCalc: vi.fn(),
}));

import { useVisibilityCalc } from '../bin/dungeon-use-visibility-calc';
import { useSecretPassages } from '../bin/dungeon-use-secret-passages';

describe('useSecretPassages', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('discovers passages only once, notifies success and filters visibility when read back', () => {
    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn(() => [{ x: 2, y: 1 }, { x: 2, y: 3 }, { x: 5, y: 4 }]),
    });

    const onNotify = vi.fn();
    const onActionDone = vi.fn();

    const { result } = renderHook(() => useSecretPassages({
      gameSession: {
        currentTurn: 1,
        heroes: [{ turnOrder: 1, x: 2, y: 2 }],
        currentMap: { grid: [
          { x: 2, y: 2, psgg: { ps: 1, oriz: true } },
          { x: 5, y: 5, psgg: { ps: 2, oriz: false } },
        ] },
      },
      visibilityMap: { data: [{ x: 2, y: 2, fog: false }, { x: 2, y: 1, fog: false }] },
      onNotify,
      onActionDone,
    }));

    act(() => {
      result.current.searchPassages();
    });

    expect(onNotify).toHaveBeenCalledWith('Hai trovato un passaggio segreto!');
    expect(onActionDone).toHaveBeenCalled();
    expect(result.current.getFoundPassages()).toEqual({
      visiblePassages: [{ x: 2, y: 2, img: 'pso.jpg', oriz: true }],
    });
  });

  it('notifies when nothing is found or when required session data is missing', () => {
    useVisibilityCalc.mockReturnValue({ calculateVisibleCells: vi.fn(() => []) });
    const onNotify = vi.fn();
    const onActionDone = vi.fn();

    const { result } = renderHook(() => useSecretPassages({
      gameSession: { currentTurn: 1, heroes: [{ turnOrder: 1, x: 1, y: 1 }], currentMap: { grid: [] } },
      visibilityMap: { data: [] },
      onNotify,
      onActionDone,
    }));

    act(() => {
      result.current.searchPassages();
    });

    expect(onNotify).toHaveBeenCalledWith('Nessun passaggio segreto trovato.');
    expect(onActionDone).toHaveBeenCalled();

    const missing = renderHook(() => useSecretPassages({ gameSession: null, visibilityMap: null, onNotify, onActionDone }));
    act(() => {
      missing.result.current.searchPassages();
    });
    expect(onNotify).toHaveBeenCalledTimes(1);
  });

  it('prioritizes mission scripts for event 5 and merges scripted passages into local discovery state', () => {
    useVisibilityCalc.mockReturnValue({
      calculateVisibleCells: vi.fn(() => [{ x: 2, y: 1 }, { x: 2, y: 3 }]),
    });

    const onActionDone = vi.fn();
    const onForceTurnEnd = vi.fn();
    const sessionManager = {
      executeMissionScripts: vi.fn(() => ({
        handled: true,
        session: {
          currentTurn: 1,
          heroes: [{ turnOrder: 1, x: 2, y: 2 }],
          currentMap: {
            grid: [{ x: 2, y: 2, psgg: { ps: 1, oriz: true } }],
          },
        },
        notifications: [],
        revealPoints: [],
        effects: { forceFinishTurn: false },
      })),
    };

    const { result } = renderHook(() => useSecretPassages({
      gameSession: {
        currentTurn: 1,
        heroes: [{ turnOrder: 1, x: 2, y: 2 }],
        currentMap: { grid: [] },
      },
      visibilityMap: { data: [{ x: 2, y: 2, fog: false }, { x: 2, y: 1, fog: false }] },
      onNotify: vi.fn(),
      onActionDone,
      onForceTurnEnd,
      sessionManager,
    }));

    act(() => {
      result.current.searchPassages();
    });

    expect(sessionManager.executeMissionScripts).toHaveBeenCalledWith(expect.objectContaining({ eventType: 5 }));
    expect(result.current.getFoundPassages()).toEqual({
      visiblePassages: [{ x: 2, y: 2, img: 'pso.jpg', oriz: true }],
    });
    expect(onActionDone).toHaveBeenCalledTimes(1);
    expect(onForceTurnEnd).not.toHaveBeenCalled();
  });
});