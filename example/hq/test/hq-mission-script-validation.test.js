import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  executeDungeonScripts,
} from '../bin/dungeon-script-runtime';

function loadMap(name) {
  const filePath = resolve(process.cwd(), 'public', 'jsonData', 'map', `${name}.json`);
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function createSessionForMap(map, overrides = {}) {
  return {
    currentTurn: 1,
    heroes: [
      {
        heroId: 1,
        turnOrder: 1,
        x: 1,
        y: 1,
        gold: 0,
        inventory: [],
        equipment: [],
        equipped: [],
        currentBody: 8,
        currentMind: 4,
        activeStatus: [],
      },
    ],
    monsters: [
      {
        id: 90,
        x: 2,
        y: 2,
        currentBody: 2,
        currentMind: 0,
        activeStatus: [],
        monster: { id: 14, nome: 'Spirito', difesa: 2 },
      },
    ],
    triggeredScripts: [],
    scriptImages: [],
    currentMap: map,
    ...overrides,
    heroes: overrides.heroes ?? [
      {
        heroId: 1,
        turnOrder: 1,
        x: 1,
        y: 1,
        gold: 0,
        inventory: [],
        equipment: [],
        equipped: [],
        currentBody: 8,
        currentMind: 4,
        activeStatus: [],
      },
    ],
    monsters: overrides.monsters ?? [
      {
        id: 90,
        x: 2,
        y: 2,
        currentBody: 2,
        currentMind: 0,
        activeStatus: [],
        monster: { id: 14, nome: 'Spirito', difesa: 2 },
      },
    ],
  };
}

describe('HeroQuest mission script validation', () => {
  it('validates HQBase05 room treasure script from real mission data', () => {
    const map = loadMap('HQBase05');
    const result = executeDungeonScripts({
      session: createSessionForMap(map, {
        heroes: [{ heroId: 1, turnOrder: 1, x: 2, y: 9, gold: 0, inventory: [], equipment: [], equipped: [], currentBody: 8, currentMind: 4, activeStatus: [] }],
      }),
      eventType: 3,
      visibilityMap: { data: [{ x: 2, y: 9, valo: 7, fog: false }] },
    });

    expect(result.handled).toBe(true);
    expect(result.session.currentMap.grid.find((cell) => cell.x === 5 && cell.y === 8).psgg).toMatchObject({ ps: 1, oriz: false });
    expect(result.notifications[0]).toContain('chiave di Melar');
  });

  it('validates HQBase10 teleport movement script from real mission data', () => {
    const map = loadMap('HQBase10');
    const result = executeDungeonScripts({
      session: createSessionForMap(map, {
        heroes: [{ heroId: 1, turnOrder: 1, x: 5, y: 15, gold: 0, inventory: [], equipment: [], equipped: [], currentBody: 8, currentMind: 4, activeStatus: [] }],
      }),
      eventType: 1,
      context: { previousPosition: { x: 5, y: 15 } },
      visibilityMap: { data: [] },
      random: () => 0.5,
    });

    expect(result.handled).toBe(true);
    expect(result.session.heroes[0]).toMatchObject({ x: 11, y: 16 });
    expect(result.effects.stopMovement).toBe(true);
    expect(result.effects.movementDelta).toBe(-1);
  });

  it('validates HQBase11 scripted ambush and forced end-turn from real mission data', () => {
    const map = loadMap('HQBase11');
    const result = executeDungeonScripts({
      session: createSessionForMap(map, {
        heroes: [{ heroId: 1, turnOrder: 1, x: 7, y: 13, gold: 0, inventory: [], equipment: [], equipped: [], currentBody: 8, currentMind: 4, activeStatus: [] }],
      }),
      eventType: 3,
      visibilityMap: { data: [{ x: 7, y: 13, valo: 9, fog: false }] },
    });

    expect(result.handled).toBe(true);
    expect(result.session.currentMap.grid.find((cell) => cell.x === 6 && cell.y === 13).mostab).toMatchObject({ mos: true, mosid: 7 });
    expect(result.notifications[0]).toContain('gargola');
    expect(result.effects.forceFinishTurn).toBe(true);
  });

  it('validates HQBase12 attack blocking script from real mission data', () => {
    const map = loadMap('HQBase12');
    const result = executeDungeonScripts({
      session: createSessionForMap(map),
      eventType: 2,
      context: { monsterTypeId: 13, onDeath: false },
      visibilityMap: { data: [] },
    });

    expect(result.handled).toBe(true);
    expect(result.effects.attackBlocked).toBe(true);
  });

  it('validates HQBase13 falling-ceiling damage script from real mission data', () => {
    const map = loadMap('HQBase13');
    const result = executeDungeonScripts({
      session: createSessionForMap(map, {
        heroes: [{ heroId: 1, turnOrder: 1, x: 14, y: 17, gold: 0, inventory: [], equipment: [], equipped: [], currentBody: 8, currentMind: 4, activeStatus: [] }],
      }),
      eventType: 1,
      context: { previousPosition: { x: 14, y: 17 } },
      visibilityMap: { data: [] },
      random: () => 0.8,
    });

    expect(result.handled).toBe(true);
    expect(result.session.heroes[0].currentBody).toBe(7);
    expect(result.notifications[0]).toContain('crollata addosso');
  });

  it('validates HQBase14 spirit-blade restriction from real mission data', () => {
    const map = loadMap('HQBase14');
    const blocked = executeDungeonScripts({
      session: createSessionForMap(map),
      eventType: 2,
      context: { monsterTypeId: 14, onDeath: false },
      visibilityMap: { data: [] },
    });

    const allowed = executeDungeonScripts({
      session: createSessionForMap(map, {
        heroes: [{ heroId: 1, turnOrder: 1, x: 1, y: 1, gold: 0, inventory: [], equipment: [17], equipped: [17], currentBody: 8, currentMind: 4, activeStatus: [] }],
      }),
      eventType: 2,
      context: { monsterTypeId: 14, onDeath: false },
      visibilityMap: { data: [] },
    });

    expect(blocked.handled).toBe(true);
    expect(blocked.effects.attackBlocked).toBe(true);
    expect(allowed.effects.attackBlocked).toBe(false);
  });
});