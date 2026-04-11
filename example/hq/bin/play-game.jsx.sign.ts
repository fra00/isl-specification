export default function PlayGame(props: {
  gameSession?: any;
  onChangePageView?: (nextPage: string) => void;
  onUpdateSession?: (session: any) => void;
  campaign?: any;
  staticHeroes?: any[];
  staticEquipment?: any[];
}): React.Element;