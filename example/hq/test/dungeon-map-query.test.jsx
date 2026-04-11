import { renderHook } from '../bin/node_modules/@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDungeonMapQuery } from '../bin/dungeon-map-query';

const gameSession = {
  heroes: [{ heroId: 1, x: 3, y: 3 }],
  monsters: [{ id: 7, x: 4, y: 4, currentBody: 2 }, { id: 8, x: 5, y: 5, currentBody: 0 }],
  currentMap: {
    grid: [
      { x: 1, y: 1, mobili: { num: null }, arnt: { antroc: false }, psgg: { ps: null } },
      { x: 2, y: 2, mobili: { num: 1 }, arnt: { antroc: false }, psgg: { ps: null } },
      { x: 3, y: 3, mobili: { num: null }, arnt: { antroc: true }, psgg: { ps: 2 } },
    ],
    porte: [{ x: 9, y: 9 }],
  },
};

describe('useDungeonMapQuery', () => {
  it('returns map and visibility cells when present', () => {
    const { result } = renderHook(() => useDungeonMapQuery({ gameSession, visibilityMap: { data: [{ x: 1, y: 1, valo: 'A' }] } }));
    expect(result.current.getMapCell(1, 1)).toMatchObject({ x: 1, y: 1 });
    expect(result.current.getMapCell(9, 9)).toBeNull();
    expect(result.current.getVisibilityCell(1, 1)).toEqual({ x: 1, y: 1, valo: 'A' });
    expect(result.current.getVisibilityCell(2, 2)).toBeNull();
  });

  it('evaluates obstacles and occupancy correctly', () => {
    const { result } = renderHook(() => useDungeonMapQuery({ gameSession, visibilityMap: null }));
    expect(result.current.isDoor(9, 9)).toBe(true);
    expect(result.current.isSecretPassage(3, 3)).toBe(true);
    expect(result.current.isBlockedByFurniture(2, 2)).toBe(true);
    expect(result.current.isBlockedByMonster(4, 4, null)).toBe(true);
    expect(result.current.isBlockedByMonster(4, 4, 7)).toBe(false);
    expect(result.current.isOccupiedByHero(3, 3, null)).toBe(true);
    expect(result.current.isOccupiedByHero(3, 3, 1)).toBe(false);
    expect(result.current.isBlockedByRock(3, 3)).toBe(true);
    expect(result.current.getMapDimensions()).toEqual({ width: 26, height: 19 });
  });
});