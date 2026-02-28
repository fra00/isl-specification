export const BlockCellArea: (data?: {
    antroc?: boolean;
    inv?: boolean;
}) => {
    antroc: boolean;
    inv: boolean;
};

export const MapCellFurniture: (data?: {
    num?: number | null;
    img?: string;
}) => {
    num: number | null;
    img: string;
};

export const MapCellMonster: (data?: {
    mosid?: number;
    mos?: boolean;
    corpo?: number;
}) => {
    mosid: number;
    mos: boolean;
    corpo: number;
};

export const MapCellTreasure: (data?: {
    mon?: number;
    ogg?: number | null;
    arma?: number | null;
    trp?: number;
}) => {
    mon: number;
    ogg: number | null;
    arma: number | null;
    trp: number;
};

export const MapCellPassage: (data?: {
    ps?: number | null;
    oriz?: boolean;
}) => {
    ps: number | null;
    oriz: boolean;
};

export const MapCellTrap: (data?: {
    tipo?: number;
}) => {
    tipo: number;
};

export const MapCell: (data?: {
    x?: number;
    y?: number;
    arnt?: { antroc?: boolean; inv?: boolean };
    mobili?: { num?: number | null; img?: string };
    mostab?: { mosid?: number; mos?: boolean; corpo?: number };
    tes?: { mon?: number; ogg?: number | null; arma?: number | null; trp?: number };
    psgg?: { ps?: number | null; oriz?: boolean };
    trpl?: { tipo?: number };
    fine?: string;
}) => {
    x: number;
    y: number;
    arnt: { antroc: boolean; inv: boolean };
    mobili: { num: number | null; img: string };
    mostab: { mosid: number; mos: boolean; corpo: number };
    tes: { mon: number; ogg: number | null; arma: number | null; trp: number };
    psgg: { ps: number | null; oriz: boolean };
    trpl: { tipo: number };
    fine: string;
};

export const MapHeader: (data?: {
    descrizione?: string;
    mostro_uscita?: string;
    nfine?: number;
}) => {
    descrizione: string;
    mostro_uscita: string;
    nfine: number;
};

export const MapHeroStart: (data?: {
    id?: number;
    x?: number;
    y?: number;
}) => {
    id: number;
    x: number;
    y: number;
};

export const MapDoor: (data?: {
    x?: number;
    y?: number;
    oriz?: boolean;
}) => {
    x: number;
    y: number;
    oriz: boolean;
};

export const MapScript: (data?: {
    x?: number;
    y?: number;
    text?: string;
    evento?: number;
}) => {
    x: number;
    y: number;
    text: string;
    evento: number;
};

export const MapDefinition: (data?: {
    header?: { descrizione?: string; mostro_uscita?: string; nfine?: number };
    grid?: Array<any>;
    eroi_start?: Array<any>;
    porte?: Array<any>;
    scripts?: Array<any>;
}) => {
    header: { descrizione: string; mostro_uscita: string; nfine: number };
    grid: Array<{
        x: number;
        y: number;
        arnt: { antroc: boolean; inv: boolean };
        mobili: { num: number | null; img: string };
        mostab: { mosid: number; mos: boolean; corpo: number };
        tes: { mon: number; ogg: number | null; arma: number | null; trp: number };
        psgg: { ps: number | null; oriz: boolean };
        trpl: { tipo: number };
        fine: string;
    }>;
    eroi_start: Array<{ id: number; x: number; y: number }>;
    porte: Array<{ x: number; y: number; oriz: boolean }>;
    scripts: Array<{ x: number; y: number; text: string; evento: number }>;
};

export const Mission: (data?: {
    ordine?: number;
    file?: string;
    titolo?: string;
}) => {
    ordine: number;
    file: string;
    titolo: string;
};

export const Campaign: (data?: {
    nome_campagna?: string;
    missioni?: Array<any>;
}) => {
    nome_campagna: string;
    missioni: Array<{ ordine: number; file: string; titolo: string }>;
};

export const VisibilityCell: (data?: {
    x?: number;
    y?: number;
    valo?: string;
    vis1?: string;
    vis2?: string;
    fog?: boolean;
}) => {
    x: number;
    y: number;
    valo: string;
    vis1: string;
    vis2: string;
    fog: boolean;
};

export const VisibilityMap: (data?: {
    source?: string;
    image?: string;
    data?: Array<any>;
}) => {
    source: string;
    image: string;
    data: Array<{ x: number; y: number; valo: string; vis1: string; vis2: string; fog: boolean }>;
};

export const GameScript: (data?: {
    command?: string;
    params?: number;
    isOneTime?: boolean;
}) => {
    command: string;
    params: number;
    isOneTime: boolean;
};