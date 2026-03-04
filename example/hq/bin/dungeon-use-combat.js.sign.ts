import { HeroState, MonsterState } from './domain-session';

export const CombatDiceResult: {
  SKULL: 'SKULL';
  WHITE_SHIELD: 'WHITE_SHIELD';
  BLACK_SHIELD: 'BLACK_SHIELD';
};

export type CombatDiceResult = 'SKULL' | 'WHITE_SHIELD' | 'BLACK_SHIELD';

export type CombatResult = {
  attackerDice: Array<CombatDiceResult>;
  defenderDice: Array<CombatDiceResult>;
  skulls: number;
  shields: number;
  damageDealt: number;
};

export function useCombatLogic(): {
  resolveCombat: (attacker: HeroState | MonsterState, defender: HeroState | MonsterState) => CombatResult;
};