import { GameSession, TurnPhase, VisibilityMap } from './game-domain-session'; // Assuming VisibilityMap is also exported from game-domain-session based on context, otherwise adjust.
// NOTE: VisibilityMap is actually from game-domain-map, corrected in code.
import { MapDefinition, VisibilityMap as MapVisibilityMap } from './game-domain-map'; // Corrected import for VisibilityMap

export function useTurnLogic(props: {
    gameSession: {
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
    visibilityMap: {
        source: string;
        image: string;
        data: Array<{ x: number; y: number; valo: string; vis1: string; vis2: string; fog: boolean }>;
    } | null;
    onUpdateSession: (session: {
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
    }) => void;
}): {
    turnPhase: "START" | "MOVEMENT" | "ACTION" | "FINISHED";
    movementPoints: number;
    hoveredPath: Array<{ x: number; y: number }>;
    canAttack: boolean;
    isMoving: boolean;
    rollMovement: () => void;
    handleBoardHover: (x: number, y: number) => void;
    handleBoardClick: (x: number, y: number) => void;
    handleMonsterClick: (monsterId: number) => void;
    endTurn: () => void;
};