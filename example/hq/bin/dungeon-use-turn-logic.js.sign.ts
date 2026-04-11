export declare function useTurnLogic(config: {
    gameSession: any;
    visibilityMap: any;
    onNotify: (message: string) => void;
    trapsLogic: any;
    heroStatsLogic: any;
    hooksPathfinding: any;
    combatLogic: any;
    mapInteractionLogic: any;
    visibilityCalc: any;
    sessionManager: any;
}): {
    turnPhase: { HasMoved: boolean; HasPerformedAction: boolean; IsTurnFinished: boolean };
    movementPoints: number | null;
    hoveredPath: Array<{ x: number; y: number }>;
    hoveredPathVariant: "valid" | "blocked-by-second-wall" | null;
    canAttack: boolean;
    isMoving: boolean;
    canOpenDoor: { found: boolean; destination: { x: number; y: number }; passageCell: { x: number; y: number } } | null;
    handleOpenDoor: () => void;
    rollMovement: () => void;
    handleBoardHover: (x: number, y: number) => void;
    handleBoardClick: (x: number, y: number) => void;
    handleMonsterClick: (monsterId: number) => void;
    markActionDone: () => void;
    endTurn: () => void;
};