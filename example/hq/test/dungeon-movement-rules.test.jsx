import { renderHook } from '../bin/node_modules/@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDungeonMovementRules } from '../bin/dungeon-movement-rules';

function createMapQuery(overrides = {}) {
  return {
    getMapCell: vi.fn(() => ({ x: 2, y: 2 })),
    isBlockedByFurniture: vi.fn(() => false),
    isBlockedByMonster: vi.fn(() => false),
    isOccupiedByHero: vi.fn(() => false),
    isBlockedByRock: vi.fn(() => false),
    getMapDimensions: vi.fn(() => ({ width: 26, height: 19 })),
    getVisibilityCell: vi.fn((x, y) => ({ x, y, valo: 'A' })),
    isDoor: vi.fn(() => false),
    isSecretPassage: vi.fn(() => false),
    exposedContext: { gameSession: { heroes: [{ heroId: 5, activeStatus: [] }] } },
    ...overrides,
  };
}

describe('useDungeonMovementRules', () => {
  it('validates destinations against all blocking rules', () => {
    const mapQuery = createMapQuery();
    const { result, rerender } = renderHook(({ mapQuery: query }) => useDungeonMovementRules({ mapQuery: query }), { initialProps: { mapQuery } });
    expect(result.current.isValidDestination(2, 2, null)).toBe(true);

    rerender({ mapQuery: createMapQuery({ isBlockedByFurniture: vi.fn(() => true) }) });
    expect(result.current.isValidDestination(2, 2, null)).toBe(false);

    rerender({ mapQuery: createMapQuery({ isBlockedByMonster: vi.fn(() => true) }) });
    expect(result.current.isValidDestination(2, 2, null)).toBe(false);

    rerender({ mapQuery: createMapQuery({ isOccupiedByHero: vi.fn(() => true) }) });
    expect(result.current.isValidDestination(2, 2, null)).toBe(false);

    rerender({ mapQuery: createMapQuery({ isBlockedByRock: vi.fn(() => true) }) });
    expect(result.current.isValidDestination(2, 2, null)).toBe(false);
  });

  it('handles walkability across occupants, bounds and area transitions', () => {
    const mapQuery = createMapQuery();
    const { result, rerender } = renderHook(({ mapQuery: query }) => useDungeonMovementRules({ mapQuery: query }), { initialProps: { mapQuery } });

    expect(result.current.isWalkable(1, 1, 0, 1, 5)).toBe(false);

    rerender({ mapQuery: createMapQuery({ isOccupiedByHero: vi.fn(() => true), exposedContext: { gameSession: { heroes: [{ heroId: 5, activeStatus: [] }] } } }) });
    expect(result.current.isWalkable(1, 1, 2, 1, 5)).toBe(true);

    rerender({ mapQuery: createMapQuery({ isOccupiedByHero: vi.fn(() => true), exposedContext: { gameSession: { heroes: [] } } }) });
    expect(result.current.isWalkable(1, 1, 2, 1, 5)).toBe(false);

    rerender({ mapQuery: createMapQuery({ isBlockedByMonster: vi.fn(() => true), exposedContext: { gameSession: { heroes: [{ heroId: 5, activeStatus: ['InvisiblePassage'] }] } } }) });
    expect(result.current.isWalkable(1, 1, 2, 1, 5)).toBe(true);

    rerender({ mapQuery: createMapQuery({
      getVisibilityCell: vi.fn((x) => ({ valo: x === 1 ? 'A' : 'B' })),
      isDoor: vi.fn(() => false),
      isSecretPassage: vi.fn(() => false),
      exposedContext: { gameSession: { heroes: [{ heroId: 5, activeStatus: [] }] } },
    }) });
    expect(result.current.isWalkable(1, 1, 2, 1, 5)).toBe(false);

    rerender({ mapQuery: createMapQuery({
      getVisibilityCell: vi.fn((x) => ({ valo: x === 1 ? 'A' : 'B' })),
      isDoor: vi.fn((x) => x === 1),
    }) });
    expect(result.current.isWalkable(1, 1, 2, 1, 5)).toBe(true);

    rerender({ mapQuery: createMapQuery({
      getVisibilityCell: vi.fn((x) => ({ valo: x === 1 ? 'A' : 'B' })),
      exposedContext: { gameSession: { heroes: [{ heroId: 5, activeStatus: ['WallPass'] }] } },
    }) });
    expect(result.current.isWalkable(1, 1, 2, 1, 5)).toBe(true);
  });
});