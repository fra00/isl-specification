export const CombatDiceResult: {
  SKULL: string;
  WHITE_SHIELD: string;
  BLACK_SHIELD: string;
};

export const CombatResult: (data?: any) => {
  attackerDice: string[];
  defenderDice: string[];
  skulls: number;
  shields: number;
  damageDealt: number;
};

export function useCombatLogic(config?: any): {
  resolveCombat: (attackDiceCount: number, defenseDiceCount: number, defenderIsHero: boolean) => {
    attackerDice: string[];
    defenderDice: string[];
    skulls: number;
    shields: number;
    damageDealt: number;
  };
};