export declare const CombatDiceResult: {
  SKULL: string;
  WHITE_SHIELD: string;
  BLACK_SHIELD: string;
};

export declare function useCombatLogic(): {
  resolveCombat: (
    attackDiceCount: number,
    defenseDiceCount: number,
    defenderIsHero: boolean
  ) => {
    attackerDice: Array<string>;
    defenderDice: Array<string>;
    skulls: number;
    shields: number;
    damageDealt: number;
  };
};