export default function Dungeon(props: {
    gameSession: any;
    onChangePageView: (nextPage: string) => void;
    onUpdateSession: (session: any) => void;
    staticMonsters: Array<any>;
    staticVisibilityMap: any;
    staticEquipment: Array<any>;
    staticItems: Array<any>;
    staticSpells: Array<any>;
    treasureDeck: Array<any>;
}): React.ReactElement;