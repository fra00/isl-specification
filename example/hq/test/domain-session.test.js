import { describe, expect, it } from 'vitest';
import { GameSession, HeroState, MonsterState, TurnPhase } from '../bin/domain-session';

describe('domain-session', () => {
  it('creates hero state defaults and copies arrays safely', () => {
    const inventory = [1, 2];
    const hero = HeroState({ heroId: 3, inventory, equipment: [4], equipped: [4], availableSpells: [5], activeStatus: ['Courage'], hero: { id: 3, classe: 'Elfo' } });
    expect(hero).toMatchObject({ heroId: 3, gold: 500, inventory: [1, 2], equipment: [4], equipped: [4], availableSpells: [5], activeStatus: ['Courage'], hero: { id: 3, classe: 'Elfo' } });
    inventory.push(9);
    expect(hero.inventory).toEqual([1, 2]);
  });

  it('creates monster state defaults and nested monster records', () => {
    expect(MonsterState({ id: 2, monster: { id: 8, nome: 'Orc' }, activeStatus: ['Sleep'] })).toMatchObject({ id: 2, monster: { id: 8, nome: 'Orc' }, activeStatus: ['Sleep'] });
    expect(MonsterState()).toEqual({ id: 0, monster: null, x: 0, y: 0, currentBody: 0, currentMind: 0, activeStatus: [] });
  });

  it('builds a game session recursively and keeps session defaults', () => {
    const session = GameSession({
      campaignName: 'Base',
      currentMissionIndex: 4,
      heroes: [{ heroId: 1, hero: { id: 1, classe: 'Nano' } }],
      monsters: [{ id: 9, monster: { id: 2, nome: 'Goblin' } }],
      openedDoors: ['3,4'],
      spawnedLocations: ['1,1'],
      treasureDeck: [{ id: 7, azione: 'aggiungi_oro', valore: 25 }],
      currentMap: { header: { descrizione: 'desc' }, grid: [] },
      lastAttack: { test: true },
    });

    expect(session).toMatchObject({
      campaignName: 'Base',
      currentMissionIndex: 4,
      heroes: [{ heroId: 1, hero: { id: 1, classe: 'Nano' } }],
      monsters: [{ id: 9, monster: { id: 2, nome: 'Goblin' } }],
      openedDoors: ['3,4'],
      spawnedLocations: ['1,1'],
      currentTurn: 1,
      isHeroOrderConfirmed: false,
      treasureDeck: [{ id: 7, azione: 'aggiungi_oro', valore: 25 }],
      currentMap: { header: { descrizione: 'desc' } },
      lastAttack: { test: true },
    });
  });

  it('creates a turn phase with false defaults and explicit overrides', () => {
    expect(TurnPhase()).toEqual({ HasMoved: false, HasPerformedAction: false, IsTurnFinished: false });
    expect(TurnPhase({ HasMoved: true, IsTurnFinished: true })).toEqual({ HasMoved: true, HasPerformedAction: false, IsTurnFinished: true });
  });
});