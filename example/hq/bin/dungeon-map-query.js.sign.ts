export function useDungeonMapQuery(config: { gameSession?: any; visibilityMap?: any }): {
    getMapCell: (x: number, y: number) => { x: number; y: number; arnt: { antroc: boolean; inv: boolean }; mobili: { num: number | null; img: string }; mostab: { mosid: number; mos: boolean; corpo: number }; tes: { mon: number; ogg: number; arma: number; trp: number }; psgg: { ps: number | null; oriz: boolean }; trpl: { tipo: number; rccadex: number; rccadey: number }; fine: string } | null;
    getVisibilityCell: (x: number, y: number) => { x: number; y: number; valo: string; vis1: string; vis2: string; fog: boolean } | null;
    isDoor: (x: number, y: number) => boolean;
    isSecretPassage: (x: number, y: number) => boolean;
    isBlockedByFurniture: (x: number, y: number) => boolean;
    isBlockedByMonster: (x: number, y: number, excludeEntityId?: number) => boolean;
    isOccupiedByHero: (x: number, y: number, excludeEntityId?: number) => boolean;
    isBlockedByRock: (x: number, y: number) => boolean;
    getMapDimensions: () => { width: number; height: number };
};