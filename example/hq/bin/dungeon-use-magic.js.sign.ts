export function useMagicLogic(config: {
  gameSession: any;
  onUpdateSession: (session: any) => void;
  onNotify: (message: string) => void;
  onActionDone: () => void;
  staticSpells: Array<any>;
  combatLogic: any;
  mapInteractionLogic: any;
  fogOfWarLogic: any;
  heroStatsLogic: any;
}): {
  castSpell: (spellId: number, targetHeroId: number | null, targetMonsterId: number | null, targetX: number | null, targetY: number | null) => void;
  removeExpiredEffects: (heroId: number | null, monsterId: number | null, effect: string) => void;
};