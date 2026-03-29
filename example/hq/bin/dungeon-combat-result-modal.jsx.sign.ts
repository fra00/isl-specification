export default function CombatResultModal(props: {
  isOpen: boolean;
  onClose: () => void;
  combatResult: {
    attackerDice: string[];
    defenderDice: string[];
    skulls: number;
    shields: number;
    damageDealt: number;
  } | null;
  attacker: any;
  defender: any;
}): React.ReactElement | null;