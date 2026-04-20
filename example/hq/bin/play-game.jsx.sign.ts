export default function PlayGame(props: {
  gameSession?: any;
  onChangePageView: (nextPage: string) => void;
  onUpdateSession: (session: any | ((prev: any) => any)) => void;
  campaign: {
    nome_campagna: string;
    missioni: Array<{ ordine: number; file: string; titolo: string }>;
  };
  staticHeroes: Array<{
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
  }>;
  staticEquipment: Array<{
    id: number;
    nome: string;
    dadatt: number;
    daddif: number;
    daddifex: number;
    numdadicontr: number;
    targetMonster: string | number;
    doppioatt: boolean;
    mosdoppio: number;
    puntimente: number;
    doppiamag: boolean;
    movim: number;
    noogg: number;
    diago: boolean;
    tiro: boolean;
    tirounavo: boolean;
    disinnesc: boolean;
    nopsg: boolean;
    nopsgid: number;
    solopsg: boolean;
    solopsgid: number;
    prezzo: number;
    immagine: string;
  }>;
}): React.ReactElement;