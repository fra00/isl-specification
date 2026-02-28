import { MapCell, VisibilityCell } from "./game-domain-map";

export function useDungeonMovementRules(props: {
    mapQuery: {
        getMapCell: (x: number, y: number) => MapCell | null;
        getVisibilityCell: (x: number, y: number) => VisibilityCell | null;
        isDoor: (x: number, y: number) => boolean;
        isSecretPassage: (x: number, y: number) => boolean;
        isBlockedByFurniture: (x: number, y: number) => boolean;
        isBlockedByMonster: (x: number, y: number, excludeEntityId: number) => boolean;
        isOccupiedByHero: (x: number, y: number, excludeEntityId: number) => boolean;
        getMapDimensions: () => { width: number; height: number };
    };
}): {
    isValidDestination: (x: number, y: number, excludeEntityId: number) => boolean;
    isWalkable: (sourceX: number, sourceY: number, targetX: number, targetY: number, excludeEntityId: number) => boolean;
};