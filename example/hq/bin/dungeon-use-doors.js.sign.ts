import { GameSession } from './domain-session';
import { VisibilityMap } from './domain-map';

export function useDungeonDoors(props: { gameSession: GameSession; boardVisibilityMap: VisibilityMap }): { visibleDoors: Array<{ x: number; y: number; img: string }> };