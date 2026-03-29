export function useMonsterAI(config: {
  gameSession: any;
  visibilityMap: any;
  onUpdateSession: (session: any) => void;
  onNotify: (message: string) => void;
  pathfinding: any;
  combatLogic: any;
  heroStatsLogic: any;
}): {
  runMonsterTurn: () => Promise<void>;
  performInstantAttack: (monster: any, hero: any) => Promise<void>;
  findNearestHero: (monster: any, currentSession?: any) => any;
};