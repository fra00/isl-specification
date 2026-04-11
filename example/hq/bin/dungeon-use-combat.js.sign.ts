export const CombatDiceResult: {
  SKULL: string;
  WHITE_SHIELD: string;
  BLACK_SHIELD: string;
};

export function useCombatLogic(): {
  resolveCombat: (attackDiceCount: number, defenseDiceCount: number, defenderIsHero: boolean) => {
    attackerDice: string[];
    defenderDice: string[];
    skulls: number;
    shields: number;
    damageDealt: number;
  };
};