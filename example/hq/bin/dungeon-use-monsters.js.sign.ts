export declare function useDungeonMonsters(config: {
  gameSession: any;
  visibilityMap: any;
  onUpdateSession: (session: any) => void;
  onNotify: (message: string) => void;
  monsterDefinitions: Array<any>;
}): {
  spawnMonsters: () => void;
  spawnWanderingMonster: (heroX: number, heroY: number) => any | null;
};