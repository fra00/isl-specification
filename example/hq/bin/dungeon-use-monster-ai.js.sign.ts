export function useMonsterAI(config: {
    gameSession: any;
    visibilityMap: any;
    onUpdateSession: (session: any) => void;
    onNotify: (message: string) => void;
    pathfinding: { calculatePath: (startX: number, startY: number, targetX: number, targetY: number, maxDepth: number, excludeEntityId: number) => Array<{ x: number; y: number }> };
    combatLogic: { resolveCombat: (attackDiceCount: number, defenseDiceCount: number, defenderIsHero: boolean) => { attackerDice: Array<string>; defenderDice: Array<string>; skulls: number; shields: number; damageDealt: number } };
    heroStatsLogic: { calculateStats: (heroState: any) => any; calculateAttackDice: (heroState: any, monster: any) => number; canAttackTwice: (heroState: any, monster: any) => boolean; getConsumableWeaponId: (heroState: any) => number | null };
}): {
    isMonsterTurnInProgress: boolean;
    runMonsterTurn: () => Promise<void>;
    performInstantAttack: (monster: any, hero: any) => Promise<void>;
    findNearestHero: (monster: any) => any;
};