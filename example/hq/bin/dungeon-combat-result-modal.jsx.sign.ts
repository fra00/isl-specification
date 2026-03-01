export default function CombatResultModal(props: {
    isOpen: boolean;
    onClose: () => void;
    combatResult: {
        attackerDice: Array<"SKULL" | "WHITE_SHIELD" | "BLACK_SHIELD">;
        defenderDice: Array<"SKULL" | "WHITE_SHIELD" | "BLACK_SHIELD">;
        skulls: number;
        shields: number;
        damageDealt: number;
    };
    attacker: {
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
    } | {
        id: number;
        monster: {
            id: number;
            nome: string;
            movimento: number;
            attacco: number;
            difesa: number;
            corpo: number;
            mente: number;
            immagine: string;
            immalarge: string;
            nonmorto: boolean;
        } | null;
        x: number;
        y: number;
        currentBody: number;
        currentMind: number;
    };
    defender: {
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
    } | {
        id: number;
        monster: {
            id: number;
            nome: string;
            movimento: number;
            attacco: number;
            difesa: number;
            corpo: number;
            mente: number;
            immagine: string;
            immalarge: string;
            nonmorto: boolean;
        } | null;
        x: number;
        y: number;
        currentBody: number;
        currentMind: number;
    };
}): React.Element;