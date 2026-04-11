import { renderHook } from '../bin/node_modules/@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useHeroStats } from '../bin/dungeon-use-hero-stats';

const staticEquipment = [
  { id: 1, dadatt: 4, daddif: 1, daddifex: 1, movim: 2, puntimente: 1, diago: true, tiro: true, disinnesc: true, doppioatt: true },
  { id: 2, numdadicontr: 6, targetMonster: '9,10', mosdoppio: 9, doppioatt: true },
  { id: 3, tirounavo: true },
];

const heroState = {
  equipped: [1, 2, 3],
  activeStatus: ['RockSkin', 'Courage'],
  hero: { attacco: 2, difesa: 1, movimento: 6, mente: 3, corpo: 8 },
};

describe('useHeroStats', () => {
  it('calculates stats from hero base, equipment and statuses', () => {
    const { result } = renderHook(() => useHeroStats({ staticEquipment }));
    expect(result.current.calculateStats(heroState)).toEqual({
      attacco: 6,
      difesa: 4,
      movimento: 8,
      mente: 4,
      corpo: 8,
      canAttackDiagonal: true,
      canAttackRanged: true,
      canDisarmTraps: true,
      hasDoubleAttack: true,
    });
  });

  it('returns zeroed stats for missing hero and computes targeted attack/double attack/consumable ids', () => {
    const { result } = renderHook(() => useHeroStats({ staticEquipment }));
    expect(result.current.calculateStats(null)).toMatchObject({ attacco: 0, difesa: 0, movimento: 0, mente: 0, corpo: 0 });
    expect(result.current.calculateAttackDice(heroState, { id: 9 })).toBe(6);
    expect(result.current.calculateAttackDice(heroState, { id: 3 })).toBe(6);
    expect(result.current.canAttackTwice(heroState, { id: 9 })).toBe(true);
    expect(result.current.canAttackTwice(heroState, { id: 3 })).toBe(true);
    expect(result.current.getConsumableWeaponId(heroState)).toBe(3);
  });

  it('allows the dwarf to disarm traps without requiring the toolkit', () => {
    const { result } = renderHook(() => useHeroStats({ staticEquipment: [] }));

    expect(
      result.current.calculateStats({
        equipped: [],
        activeStatus: [],
        hero: { classe: 'Nano', attacco: 2, difesa: 2, movimento: 2, mente: 4, corpo: 6 },
      }),
    ).toMatchObject({ canDisarmTraps: true });
  });
});