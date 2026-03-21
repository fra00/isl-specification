export function useTurnLogic(config: {
    gameSession?: any;
    visibilityMap?: any;
    onUpdateSession?: (session: any) => void;
    onNotify?: (message: string) => void;
    trapsLogic?: any;
}): {
    turnPhase: { HasMoved: boolean; HasPerformedAction: boolean; IsTurnFinished: boolean };
    movementPoints: number | null;
    hoveredPath: Array<{ x: number; y: number }>;
    isMoving: boolean;
    rollMovement: () => void;
    handleBoardHover: (x: number, y: number) => void;
    handleBoardClick: (x: number, y: number) => void;
    handleMonsterClick: (monsterId: number) => void;
    markActionDone: () => void;
    endTurn: () => void;
};