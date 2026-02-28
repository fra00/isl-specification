export default function DungeonHeroOrder(props: {
    heroes?: Array<{
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
    }>;
    onConfirmOrder?: (orderedHeroIds: number[]) => void;
}): React.Element;