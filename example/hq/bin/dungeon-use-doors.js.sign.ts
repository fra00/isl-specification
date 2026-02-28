import { GameSession } from './game-domain-session';
import { VisibilityMap } from './game-domain-map';

export function useDungeonDoors(
  gameSession: GameSession,
  boardVisibilityMap: VisibilityMap
): {
  visibleDoors: Array<{ x: number; y: number; img: string }>;
};