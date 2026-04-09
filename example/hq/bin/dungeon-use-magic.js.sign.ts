export declare function useMagicLogic(config?: any): {
    castSpell: (spellId: number, targetHeroId: number | null, targetMonsterId: number | null, targetX: number | null, targetY: number | null) => void;
    removeExpiredEffects: (heroId: number | null, monsterId: number | null, effect: string) => void;
};