import { renderHook } from '../bin/node_modules/@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../bin/dungeon-map-query', () => ({
  useDungeonMapQuery: vi.fn(),
}));

vi.mock('../bin/dungeon-movement-rules', () => ({
  useDungeonMovementRules: vi.fn(),
}));

import { useDungeonMapQuery } from '../bin/dungeon-map-query';
import { useDungeonMovementRules } from '../bin/dungeon-movement-rules';
import { usePathfinding } from '../bin/dungeon-use-pathfinding';

describe('usePathfinding', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty arrays for null coordinates or invalid targets', () => {
    useDungeonMapQuery.mockReturnValue({});
    useDungeonMovementRules.mockReturnValue({ isValidDestination: vi.fn(() => false), isWalkable: vi.fn(() => true) });
    const { result } = renderHook(() => usePathfinding({}));
    expect(result.current.calculatePath(null, 1, 2, 2, 5, null)).toEqual([]);
    expect(result.current.calculatePath(1, 1, 2, 2, 5, null)).toEqual([]);
  });

  it('finds the shortest BFS path within max depth and respects walkability', () => {
    useDungeonMapQuery.mockReturnValue({});
    useDungeonMovementRules.mockReturnValue({
      isValidDestination: vi.fn(() => true),
      isWalkable: vi.fn((sx, sy, tx, ty) => {
        if (tx === 2 && ty === 1) return false;
        return tx >= 1 && tx <= 3 && ty >= 1 && ty <= 3;
      }),
    });

    const { result } = renderHook(() => usePathfinding({}));
    expect(result.current.calculatePath(1, 1, 3, 1, 10, null)).toEqual([
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
    ]);
    expect(result.current.calculatePath(1, 1, 3, 1, 2, null)).toEqual([]);
  });
});