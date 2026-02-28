export default function DungeonTurnControls(props: {
    currentHero: {
        heroId: number;
        turnOrder: number;
        currentBody: number;
        currentMind: number;
        gold: number;
        inventory: number[];
        equipment: number[];
        x: number;
        y: number;
        hero: {
            id: number;
            classe: string;
            attacco: number;
            difesa: number;
            movimento: number;
            mente: number;
            corpo: number;
            miniature: string;
            miniatureDeath: string;
            portrait: string;
        } | null;
    };
    movementPoints: number;
    turnPhase: "START" | "MOVEMENT" | "ACTION" | "FINISHED";
    isMoving: boolean;
    onRollMovement: () => void;
    onEndTurn: () => void;
}): React.Element;