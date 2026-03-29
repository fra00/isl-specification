export function useDungeonMonsters(config: {
  gameSession: any;
  visibilityMap: any;
  onUpdateSession: (session: any) => void;
  onNotify: (message: string) => void;
  monsterDefinitions: any[];
}): {
  spawnWanderingMonster: (heroX: number, heroY: number) => { 
    id: number; 
    monster: any; 
    x: number; 
    y: number; 
    currentBody: number; 
    currentMind: number; 
    activeStatus: string[] 
  } | null;
};