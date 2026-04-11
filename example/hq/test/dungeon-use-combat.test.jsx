import { renderHook } from '../bin/node_modules/@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CombatDiceResult, CombatResult, useCombatLogic } from '../bin/dungeon-use-combat';

describe('useCombatLogic', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds combat result defaults', () => {
    expect(CombatResult()).toEqual({ attackerDice: [], defenderDice: [], skulls: 0, shields: 0, damageDealt: 0 });
  });

  it('resolves combat dice, shields and damage for hero defenders', () => {
    const rolls = [0.1, 0.6, 0.95, 0.6, 0.95];
    vi.spyOn(Math, 'random').mockImplementation(() => rolls.shift());

    const { result } = renderHook(() => useCombatLogic());
    const outcome = result.current.resolveCombat(3, 2, true);

    expect(outcome.attackerDice).toEqual([CombatDiceResult.SKULL, CombatDiceResult.WHITE_SHIELD, CombatDiceResult.BLACK_SHIELD]);
    expect(outcome.defenderDice).toEqual([CombatDiceResult.WHITE_SHIELD, CombatDiceResult.BLACK_SHIELD]);
    expect(outcome.skulls).toBe(1);
    expect(outcome.shields).toBe(1);
    expect(outcome.damageDealt).toBe(0);
  });

  it('resolves damage for monster defenders and clamps negative dice counts', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.95);

    const { result } = renderHook(() => useCombatLogic());
    expect(result.current.resolveCombat(-1, -2, false)).toEqual({ attackerDice: [], defenderDice: [], skulls: 0, shields: 0, damageDealt: 0 });

    const outcome = result.current.resolveCombat(2, 1, false);
    expect(outcome.skulls).toBe(2);
    expect(outcome.shields).toBe(1);
    expect(outcome.damageDealt).toBe(1);
  });
});