export default function HeroSummary(props: {
  heroes?: Array<any>;
  staticHeroes?: Array<any>;
  staticEquipment?: Array<any>;
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}): React.ReactElement;