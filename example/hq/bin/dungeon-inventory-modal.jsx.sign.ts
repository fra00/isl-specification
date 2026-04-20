export default function DungeonInventoryModal(props: { 
  isOpen: boolean; 
  hero: {
    heroId: number;
    turnOrder: number;
    currentBody: number;
    currentMind: number;
    gold: number;
    inventory: Array<number>;
    equipment: Array<number>;
    equipped: Array<number>;
    availableSpells: Array<number>;
    activeStatus: Array<string>;
    isEscaped: boolean;
    x: number;
    y: number;
    hero: {
      id: number;
      classe: string;
      attacco: number;
      difesa: number;
      movimento: number;
      mente: number;
      corpo: number;
      miniature: string;
      miniatureDeath: string;
      portrait: string;
    } | null;
  }; 
  onClose: () => void; 
}): React.ReactElement | null;