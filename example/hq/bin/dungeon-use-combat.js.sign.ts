export const CombatDiceResult: { SKULL: string; WHITE_SHIELD: string; BLACK_SHIELD: string };
export const CombatResult: (data?: any) => { attackerDice: Array<string>; defenderDice: Array<string>; skulls: number; shields: number; damageDealt: number };
export function useCombatLogic(config?: any): { resolveCombat: (attacker: any, defender: any) => ReturnType<typeof CombatResult> };