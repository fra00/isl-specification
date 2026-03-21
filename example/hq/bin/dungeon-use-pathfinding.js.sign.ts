export function usePathfinding(config: { gameSession?: any; visibilityMap?: any }): {
    calculatePath: (startX: number, startY: number, targetX: number, targetY: number, maxDepth: number, excludeEntityId?: number) => Array<{ x: number; y: number }>;
};