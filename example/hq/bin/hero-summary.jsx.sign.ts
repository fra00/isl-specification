import React from 'react';
import { Hero, Equipment } from './game-domain-ruleset';
import { HeroState } from './game-domain-session';

export default function HeroSummary(props: {
    heroes?: Array<{
        heroId: number;
        turnOrder: number;
        currentBody: number;
        currentMind: number;
        gold: number;
        inventory: number[];
        equipment: number[];
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
    }>;
    staticHeroes?: Array<{
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
    staticEquipment?: Array<{
        id: number;
        nome: string;
        dadatt: number;
        daddif: number;
        daddifex: number;
        numdadicontr: number;
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
    selectedIndex?: number;
    onSelect?: (index: number) => void;
}): React.Element;