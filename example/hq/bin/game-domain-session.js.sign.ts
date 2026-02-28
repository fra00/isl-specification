export const HeroState: (data?: {
    heroId?: number;
    turnOrder?: number;
    currentBody?: number;
    currentMind?: number;
    gold?: number;
    inventory?: number[];
    equipment?: number[];
    x?: number;
    y?: number;
    hero?: {
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
    };
}) => {
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

export const MonsterState: (data?: {
    id?: number;
    monster?: {
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
    };
    x?: number;
    y?: number;
    currentBody?: number;
    currentMind?: number;
}) => {
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

export const GameSession: (data?: {
    campaignName?: string;
    currentMap?: {
        header: { descrizione: string; mostro_uscita: string; nfine: number };
        grid: Array<{
            x: number;
            y: number;
            arnt: { antroc: boolean; inv: boolean };
            mobili: { num: number | null; img: string };
            mostab: { mosid: number; mos: boolean; corpo: number };
            tes: { mon: number; ogg: number | null; arma: number | null; trp: number };
            psgg: { ps: number | null; oriz: boolean };
            trpl: { tipo: number };
            fine: string;
        }>;
        eroi_start: Array<{ id: number; x: number; y: number }>;
        porte: Array<{ x: number; y: number; oriz: boolean }>;
        scripts: Array<{ x: number; y: number; text: string; evento: number }>;
    };
    currentMissionIndex?: number;
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
    monsters?: Array<{
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
    }>;
    spawnedLocations?: string[];
    currentTurn?: number;
    isHeroOrderConfirmed?: boolean;
    lastAttack?: { hero: any; monster: any; combatResult: any };
}) => {
    campaignName: string;
    currentMap: {
        header: { descrizione: string; mostro_uscita: string; nfine: number };
        grid: Array<{
            x: number;
            y: number;
            arnt: { antroc: boolean; inv: boolean };
            mobili: { num: number | null; img: string };
            mostab: { mosid: number; mos: boolean; corpo: number };
            tes: { mon: number; ogg: number | null; arma: number | null; trp: number };
            psgg: { ps: number | null; oriz: boolean };
            trpl: { tipo: number };
            fine: string;
        }>;
        eroi_start: Array<{ id: number; x: number; y: number }>;
        porte: Array<{ x: number; y: number; oriz: boolean }>;
        scripts: Array<{ x: number; y: number; text: string; evento: number }>;
    } | null;
    currentMissionIndex: number;
    heroes: Array<{
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
    monsters: Array<{
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
    }>;
    spawnedLocations: string[];
    currentTurn: number;
    isHeroOrderConfirmed: boolean;
    lastAttack: { hero: any; monster: any; combatResult: any } | null;
};

export const TurnPhase: {
    readonly START: "START";
    readonly MOVEMENT: "MOVEMENT";
    readonly ACTION: "ACTION";
    readonly FINISHED: "FINISHED";
};