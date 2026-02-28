import { GameSession } from './game-domain-session';
import { VisibilityMap } from './game-domain-map';

export function useDungeonMonsters(props: {
    gameSession: GameSession;
    visibilityMap: VisibilityMap;
    onUpdateSession: (session: GameSession) => void;
}): void;