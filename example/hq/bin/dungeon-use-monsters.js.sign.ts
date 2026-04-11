export function useDungeonMonsters(config: {
  gameSession: any;
  visibilityMap: any;
  onUpdateSession: (session: any) => void;
  onNotify: (message: string) => void;
  monsterDefinitions: any[];
}): {
  spawnedLocations: string[];
  spawnWanderingMonster: (heroX: number, heroY: number) => any | null;
};