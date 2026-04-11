import { describe, expect, it } from 'vitest';
import { Equipment, Hero, Item, Monster, Spell, TreasureCard } from '../bin/domain-ruleset';

describe('domain-ruleset', () => {
  it('creates hero records with defaults and overrides', () => {
    expect(Hero()).toEqual({ id: 0, classe: '', attacco: 0, difesa: 0, movimento: 0, mente: 0, corpo: 0, miniature: '', miniatureDeath: '', portrait: '' });
    expect(Hero({ id: 1, classe: 'Barbaro', attacco: 3 })).toMatchObject({ id: 1, classe: 'Barbaro', attacco: 3 });
  });

  it('creates monster records and normalizes nonmorto to boolean', () => {
    expect(Monster({ id: 4, nome: 'Skeleton', nonmorto: 1 })).toMatchObject({ id: 4, nome: 'Skeleton', nonmorto: true });
    expect(Monster()).toEqual({ id: 0, nome: '', movimento: 0, attacco: 0, difesa: 0, corpo: 0, mente: 0, immagine: '', immalarge: '', nonmorto: false });
  });

  it('creates equipment with booleans and numeric defaults', () => {
    const equipment = Equipment({ id: 8, doppioatt: 1, diago: 1, tiro: 1, disinnesc: 1, prezzo: 100 });
    expect(equipment).toMatchObject({ id: 8, doppioatt: true, diago: true, tiro: true, disinnesc: true, prezzo: 100 });
    expect(Equipment()).toMatchObject({ id: 0, nome: '', dadatt: 0, daddif: 0, noogg: 0, nopsg: false, solopsg: false });
  });

  it('creates items, spells and treasure cards with default targeting/value fields', () => {
    expect(Item()).toEqual({ id: 0, nome: '', hp: 0, mp: 0, targetType: 'Self', movimento: 0, attacco: 0, difesa: 0, natt: 0, acqua: false, danni: 0 });
    expect(Item({ id: 2, acqua: 1, danni: 3, targetType: 'Monster' })).toMatchObject({ id: 2, acqua: true, danni: 3, targetType: 'Monster' });

    expect(Spell()).toEqual({ id: 0, nome: '', elemento: 'Fuoco', descrizione: '', immagine: '', dorso: '', targetType: 'Self', effetto: '', valore: 0 });
    expect(Spell({ id: 3, nome: 'Genio', elemento: 'Terra', valore: 5 })).toMatchObject({ id: 3, nome: 'Genio', elemento: 'Terra', valore: 5 });

    expect(TreasureCard()).toEqual({ id: 0, effetto: '', azione: 'nessuna', valore: 0, immagine: '' });
    expect(TreasureCard({ id: 1, azione: 'aggiungi_oro', valore: 50 })).toMatchObject({ id: 1, azione: 'aggiungi_oro', valore: 50 });
  });
});