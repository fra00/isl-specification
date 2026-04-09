export declare function useDungeonSessionManager(config: {
    gameSession: any;
    onUpdateSession: (session: any) => void;
    onNotify: (message: string) => void;
    fogOfWarLogic: any;
}): {
    commitSessionUpdate: (updater: (session: any) => any) => boolean;
    initializeMission: (treasureDeck: Array<any>) => void;
    confirmHeroOrder: (orderedHeroIds: Array<number>) => void;
    clearLastAttack: () => void;
    openPassage: (passageX: number, passageY: number, destinationX: number, destinationY: number, foundPassages: Array<{x: number, y: number}>) => boolean;
    toggleEquipItem: (heroId: number, itemId: number, staticEquipment: Array<any>) => boolean;
    useItem: (heroId: number, itemId: number, staticItems: Array<any>, targetMonsterId: number | null) => boolean;
    collectTreasureAtCell: (heroId: number, treasureX: number, treasureY: number) => boolean;
    drawTreasureCard: () => any | null;
    applyTreasureCardEffect: (heroId: number, card: any, onWanderingMonster: (x: number, y: number) => void) => boolean;
    updateMonsterState: (monsterId: number, nextX: number | null, nextY: number | null, statusesToRemove: Array<string>) => boolean;
    resolveMonsterAttack: (monsterId: number, heroId: number, combatResult: any) => boolean;
    startNextHeroRound: () => void;
    clearHeroStatusEverywhere: (statusName: string) => boolean;
    moveCurrentHeroTo: (nextX: number, nextY: number) => boolean;
    resolveMovementTrap: (nextX: number, nextY: number, trapType: number, rockFallX: number | null, rockFallY: number | null) => boolean;
    markCurrentHeroEscaped: () => boolean;
    resolveHeroAttack: (monsterId: number, combatResult: any, statusesToRemove: Array<string>, consumedWeaponId: number | null) => boolean;
    advanceTurn: (nextTurn: number, clearStatusName: string | null) => boolean;
};