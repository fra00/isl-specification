import { renderHook, act } from '../bin/node_modules/@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../bin/dungeon-use-visibility-calc', () => ({
  useVisibilityCalc: vi.fn(),
}));

import { useVisibilityCalc } from '../bin/dungeon-use-visibility-calc';
import { useTraps } from '../bin/dungeon-use-traps';

describe('useTraps', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('tracks visibility, activation and registration state for traps', () => {
    useVisibilityCalc.mockReturnValue({ calculateVisibleCells: vi.fn(() => []) });
    const { result } = renderHook(() => useTraps({ gameSession: {}, visibilityMap: {}, areMonstersVisible: false }));

    expect(result.current.checkTrapActivation({ tipo: 1 }, 1, 1)).toBe(true);
    expect(result.current.isTrapVisible(1, 1)).toBe(false);

    act(() => {
      result.current.registerTriggeredTrap(1, 1, 2);
    });

    expect(result.current.isTrapVisible(1, 1)).toBe(true);
    expect(result.current.checkTrapActivation({ tipo: 2 }, 1, 1)).toBe(false);
    expect(result.current.getTriggeredTraps()).toEqual([{ x: 1, y: 1, tipo: 2, status: 'TRIGGERED' }]);
  });

  it('supports trap search and both disarm outcomes', () => {
    useVisibilityCalc.mockReturnValue({ calculateVisibleCells: vi.fn(() => [{ x: 2, y: 2 }, { x: 4, y: 4 }]) });
    const onNotify = vi.fn();
    const onActionDone = vi.fn();
    const onFail = vi.fn();

    const { result } = renderHook(() => useTraps({
      gameSession: {
        currentTurn: 1,
        heroes: [{ turnOrder: 1, x: 1, y: 1 }],
        currentMap: { grid: [{ x: 2, y: 2, trpl: { tipo: 2 } }, { x: 4, y: 4, trpl: { tipo: 0 } }] },
      },
      visibilityMap: {},
      areMonstersVisible: false,
      onNotify,
      onActionDone,
    }));

    act(() => {
      result.current.searchTraps();
    });
    expect(onNotify).toHaveBeenCalledWith('Attenzione! Hai individuato delle trappole!');
    expect(result.current.getTriggeredTraps()[0]).toMatchObject({ x: 2, y: 2, status: 'DETECTED' });

    vi.spyOn(Math, 'random').mockReturnValueOnce(0.1);
    act(() => {
      result.current.attemptDisarmTrap(2, 2, true, onFail);
    });
    expect(result.current.getTriggeredTraps()[0].status).toBe('DISARMED');

    act(() => {
      result.current.registerTriggeredTrap(5, 5, 3);
    });
    expect(result.current.getTriggeredTraps().find((trap) => trap.x === 5 && trap.y === 5).status).toBe('TRIGGERED');

    act(() => {
      result.current.attemptDisarmTrap(8, 8, false, onFail);
    });
    expect(onNotify).toHaveBeenCalledWith("Non c'è una trappola disarmabile qui.");
  });

  it('blocks searching when monsters are visible', () => {
    useVisibilityCalc.mockReturnValue({ calculateVisibleCells: vi.fn(() => []) });
    const onNotify = vi.fn();
    const { result } = renderHook(() => useTraps({ gameSession: {}, visibilityMap: {}, areMonstersVisible: true, onNotify }));
    act(() => {
      result.current.searchTraps();
    });
    expect(onNotify).toHaveBeenCalledWith('Non puoi cercare trappole con mostri vicini!');
  });
});