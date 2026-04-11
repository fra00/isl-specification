import { renderHook } from '../bin/node_modules/@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDungeonDoors } from '../bin/dungeon-use-doors';
import { useDungeonFurniture } from '../bin/dungeon-use-furniture';
import { useDungeonVisibleMonsters } from '../bin/dungeon-use-visible-monsters';

describe('derived dungeon hooks', () => {
  it('returns visible doors based on opened state and adjacent visible cells', () => {
    const { result } = renderHook(() => useDungeonDoors({
      gameSession: {
        openedDoors: ['1,1'],
        currentMap: { porte: [{ x: 1, y: 1, oriz: true }, { x: 3, y: 3, oriz: false }] },
      },
      boardVisibilityMap: { data: [{ x: 4, y: 3, fog: false }] },
    }));

    expect(result.current.visibleDoors).toEqual([
      { x: 1, y: 1, img: 'portao.jpg' },
      { x: 3, y: 3, img: 'portav.jpg' },
    ]);
  });

  it('returns visible furniture and rocks only on non-fogged cells', () => {
    const { result } = renderHook(() => useDungeonFurniture({
      gameSession: {
        currentMap: {
          grid: [
            { x: 1, y: 1, arnt: { antroc: true, inv: false }, mobili: { num: null } },
            { x: 2, y: 2, arnt: { antroc: false, inv: false }, mobili: { num: 1, img: 'table.jpg' } },
            { x: 3, y: 3, arnt: { antroc: false, inv: false }, mobili: { num: 1, img: 'hidden.jpg' } },
          ],
        },
      },
      boardVisibilityMap: { data: [{ x: 1, y: 1, fog: false }, { x: 2, y: 2, fog: false }, { x: 3, y: 3, fog: true }] },
    }));

    expect(result.current.visibleFurniture).toEqual([
      { x: 1, y: 1, img: '../cell/pietra.jpg' },
      { x: 2, y: 2, img: 'table.jpg' },
    ]);
  });

  it('filters visible monsters using the board fog map', () => {
    const { result } = renderHook(() => useDungeonVisibleMonsters({
      gameSession: { monsters: [{ id: 1, x: 1, y: 1 }, { id: 2, x: 2, y: 2 }, null] },
      boardVisibilityMap: { data: [{ x: 1, y: 1, fog: false }, { x: 2, y: 2, fog: true }] },
    }));

    expect(result.current.visibleMonsters).toEqual([{ id: 1, x: 1, y: 1 }]);
  });
});