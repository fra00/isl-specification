export const CombatResult: (data?: {
    attackerDice?: Array<"SKULL" | "WHITE_SHIELD" | "BLACK_SHIELD">;
    defenderDice?: Array<"SKULL" | "WHITE_SHIELD" | "BLACK_SHIELD">;
    skulls?: number;
    shields?: number;
    damageDealt?: number;
}) => {
    attackerDice: Array<"SKULL" | "WHITE_SHIELD" | "BLACK_SHIELD">;
    defenderDice: Array<"SKULL" | "WHITE_SHIELD" | "BLACK_SHIELD">;
    skulls: number;
    shields: number;
    damageDealt: number;
};

export function useCombatLogic(): {
    resolveCombat: (
        attacker: {
            hero?: { attacco: number; };
            monster?: { attacco: number; };
            equipment?: number[]; // Present in HeroState, not MonsterState
        },
        defender: {
            hero?: { difesa: number; };
            monster?: { difesa: number; };
            equipment?: number[]; // Present in HeroState, not MonsterState
        }
    ) => {
        attackerDice: Array<"SKULL" | "WHITE_SHIELD" | "BLACK_SHIELD">;
        defenderDice: Array<"SKULL" | "WHITE_SHIELD" | "BLACK_SHIELD">;
        skulls: number;
        shields: number;
        damageDealt: number;
    };
};