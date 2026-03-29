export function useDungeonMapQuery(config: { gameSession: any; visibilityMap?: any | null }): {
    initialize: () => { isReady: boolean; hasVisibility: boolean };
    getMapCell: (x: number, y: number) => any | null;
    getVisibilityCell: (x: number, y: number) => any | null;
    isDoor: (x: number, y: number) => boolean;
    isSecretPassage: (x: number, y: number) => boolean;
    isBlockedByFurniture: (x: number, y: number) => boolean;
    isBlockedByMonster: (x: number, y: number, excludeEntityId: number) => boolean;
    isOccupiedByHero: (x: number, y: number, excludeEntityId: number) => boolean;
    isBlockedByRock: (x: number, y: number) => boolean;
    getMapDimensions: () => { width: number; height: number };
};