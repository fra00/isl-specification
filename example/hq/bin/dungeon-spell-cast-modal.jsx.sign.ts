export default function DungeonSpellCastModal(props: {
  isOpen?: boolean;
  hero?: any;
  allSpells?: Array<any>;
  onCastSpell?: (spellId: number) => void;
  onClose?: () => void;
}): React.ReactElement | null;