export function useFogOfWar(config: { gameSession: any; staticVisibilityMap: any }): {
  fogVisibilityMap: any;
  revealFromPoint: (x: number, y: number) => void;
};