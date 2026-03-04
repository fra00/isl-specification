import { CombatResult } from './dungeon-use-combat';
import { HeroState, MonsterState } from './domain-session';

export default function CombatResultModal(props: {
  isOpen: boolean;
  onClose: () => void;
  combatResult: CombatResult;
  attacker: HeroState | MonsterState;
  defender: HeroState | MonsterState;
}): React.Element;