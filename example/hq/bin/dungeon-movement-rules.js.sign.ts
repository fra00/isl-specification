export function useDungeonMovementRules(props: {
  mapQuery: {
    getMapCell: (x: number, y: number) => { x: number; y: number; arnt: { antroc: boolean; inv: boolean }; mobili: { num: number | null; img: string }; mostab: { mosid: number | null; mos: boolean; corpo: number }; tes: { mon: number; ogg: number | null; arma: number | null; trp: number | null }; psgg: { ps: number | null; oriz: boolean }; trpl: { tipo: number }; fine: string } | null;
    getVisibilityCell: (x: number, y: number) => { x: number; y: number; valo: string; vis1: string; vis2: string; fog: boolean } | null;
    isDoor: (x: number, y: number) => boolean;
    isSecretPassage: (x: number, y: number) => boolean;
    isBlockedByFurniture: (x: number, y: number) => boolean;
    isBlockedByMonster: (x: number, y: number, excludeEntityId: number) => boolean;
    isOccupiedByHero: (x: number, y: number, excludeEntityId: number) => boolean;
    isBlockedByRock: (x: number, y: number) => boolean;
    getMapDimensions: () => { width: 26; height: 19 };
  };
}): {
  isValidDestination: (x: number, y: number, excludeEntityId: number) => boolean;
  isWalkable: (sourceX: number, sourceY: number, targetX: number, targetY: number, excludeEntityId: number) => boolean;
};