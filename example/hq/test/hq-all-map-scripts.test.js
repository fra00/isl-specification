import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildScriptKey, executeDungeonScripts } from '../bin/dungeon-script-runtime';

const MAP_DIR = resolve(process.cwd(), 'public', 'jsonData', 'map');
const SCRIPT_KEYWORDS = new Set([
  'serand',
  'sestanza',
  'seogg',
  'searma',
  'pospsg',
  'possta',
  'msg',
  'posroc',
  'img',
  'posrocinv',
  'posmostro',
  'posps',
  'posporta',
  'aggogg',
  'aggarma',
  'aggoroid',
  'rimogg',
  'rrndogg',
  'fineturno',
  'aggoro',
  'agghppsg',
  'agghp',
  'att',
  'noatt',
  'noattarma',
  'end',
]);

function loadMap(fileName) {
  return JSON.parse(readFileSync(resolve(MAP_DIR, fileName), 'utf8'));
}

function loadCases() {
  return readdirSync(MAP_DIR)
    .filter((fileName) => /^HQBase.*\.json$/i.test(fileName))
    .sort((left, right) => left.localeCompare(right))
    .flatMap((fileName) => {
      const map = loadMap(fileName);
      return (map.scripts || [])
        .map((script, index) => ({ fileName, map, script, index }))
        .filter(({ script }) => String(script.text || '').trim());
    });
}

function createHero(overrides = {}) {
  return {
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
    ...overrides,
  };
}

function createExecutionInput({ map, script }) {
  let hero = createHero();
  let context = {};
  let visibilityData = [];
  const random = () => 0.5;

  switch (Number(script.evento)) {
    case 1:
      hero = createHero({ x: Number(script.x) || 1, y: Number(script.y) || 1 });
      context = { previousPosition: { x: Number(script.x), y: Number(script.y) } };
      break;
    case 2:
      context = { monsterTypeId: Number(script.idmosc), onDeath: Boolean(script.morto) };
      break;
    case 3:
    case 4:
    case 5:
      hero = createHero({ x: Number(script.x) || 1, y: Number(script.y) || 1 });
      visibilityData = [
        { x: hero.x, y: hero.y, valo: '7', fog: false },
        { x: Number(script.x), y: Number(script.y), valo: '7', fog: false },
      ];
      break;
    case 8:
      hero = createHero({ x: Number(script.x) || 1, y: Number(script.y) || 1 });
      context = { roomId: 13 };
      visibilityData = [
        { x: hero.x, y: hero.y, valo: '13', fog: false },
        { x: Number(script.x), y: Number(script.y), valo: '13', fog: false },
      ];
      break;
    default:
      break;
  }

  return {
    session: {
      currentTurn: 1,
      heroes: [hero],
      monsters: [
        {
          id: 90,
          x: 2,
          y: 2,
          currentBody: 2,
          currentMind: 0,
          activeStatus: [],
          monster: { id: Number(script.idmosc) || 14, nome: 'Monster', difesa: 2 },
        },
      ],
      triggeredScripts: [],
      scriptImages: [],
      currentMap: map,
    },
    eventType: Number(script.evento),
    context,
    visibilityMap: { data: visibilityData },
    random,
  };
}

function normalizeSourcePath(sourcePath) {
  const normalized = String(sourcePath || '').trim().replace(/\\/g, '/');
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function extractNumbers(text, commandName) {
  const pattern = new RegExp(`\\b${commandName}\\s+(-?\\d+)`, 'gi');
  return Array.from(text.matchAll(pattern), (match) => Number(match[1]));
}

function extractTriples(text, commandName) {
  const pattern = new RegExp(`\\b${commandName}\\s+(-?\\d+)\\s*,\\s*(-?\\d+)\\s*,\\s*(-?\\d+)`, 'gi');
  return Array.from(text.matchAll(pattern), (match) => match.slice(1).map(Number));
}

function extractPairs(text, commandName) {
  const pattern = new RegExp(`\\b${commandName}\\s+(-?\\d+)\\s*,\\s*(-?\\d+)`, 'gi');
  return Array.from(text.matchAll(pattern), (match) => match.slice(1).map(Number));
}

function extractImageCommands(text) {
  const pattern = /\bimg\s+([^,;]+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)/gi;
  return Array.from(text.matchAll(pattern), (match) => ({
    src: normalizeSourcePath(match[1]),
    x: Number(match[2]),
    y: Number(match[3]),
  }));
}

function firstToken(text) {
  return String(text || '').trim().split(/[\s;]/)[0].toLowerCase();
}

const allCases = loadCases();

describe('all HQBase mission scripts', () => {
  for (const testCase of allCases) {
    const { fileName, script, index } = testCase;
    it(`${fileName} script ${index} event ${script.evento} executes and produces its expected effects`, () => {
      const input = createExecutionInput(testCase);
      const result = executeDungeonScripts(input);
      const text = String(script.text || '');
      const initialHero = input.session.heroes[0];
      const finalHero = result.session.heroes[0];
      const hasRandomConditions = /\bserand\b/i.test(text);

      expect(result.handled).toBe(true);

      if (script.unavolta) {
        expect(result.session.triggeredScripts).toContain(buildScriptKey(script, index));
      }

      const isImplicitMessage = !SCRIPT_KEYWORDS.has(firstToken(text));
      const messageCount = (text.match(/\bmsg\b/gi) || []).length;
      if (messageCount > 0 || isImplicitMessage) {
        expect(result.notifications.length).toBeGreaterThan(0);
      }

      const revealTargets = extractPairs(text, 'possta').map(([x, y]) => ({ x, y }));
      if (revealTargets.length > 0) {
        expect(result.revealPoints).toEqual(revealTargets);
      }

      const addedGold = extractNumbers(text, 'aggoro').reduce((sum, value) => sum + value, 0);
      if (addedGold !== 0) {
        expect(finalHero.gold).toBe(initialHero.gold + addedGold);
      }

      const addedItems = extractNumbers(text, 'aggogg');
      if (addedItems.length > 0) {
        expect(finalHero.inventory).toEqual(expect.arrayContaining(addedItems));
      }

      const addedEquipment = extractNumbers(text, 'aggarma');
      if (addedEquipment.length > 0) {
        expect(finalHero.equipment).toEqual(expect.arrayContaining(addedEquipment));
      }

      const bodyDeltas = extractNumbers(text, 'agghp').reduce((sum, value) => sum + value, 0);
      if (bodyDeltas !== 0 && !hasRandomConditions) {
        expect(finalHero.currentBody).toBe(initialHero.currentBody + bodyDeltas);
      }

      const rockTargets = extractPairs(text, 'posroc');
      for (const [x, y] of rockTargets) {
        expect(result.session.currentMap.grid.find((cell) => cell.x === x && cell.y === y)?.arnt?.antroc).toBe(true);
      }

      const passageTargets = extractTriples(text, 'posps');
      for (const [oriz, x, y] of passageTargets) {
        expect(result.session.currentMap.grid.find((cell) => cell.x === x && cell.y === y)?.psgg).toMatchObject({ ps: 1, oriz: oriz === 1 });
      }

      const monsterTargets = extractTriples(text, 'posmostro');
      for (const [monsterId, x, y] of monsterTargets) {
        expect(result.session.currentMap.grid.find((cell) => cell.x === x && cell.y === y)?.mostab).toMatchObject({ mos: true, mosid: monsterId });
      }

      const imageTargets = extractImageCommands(text);
      for (const image of imageTargets) {
        expect(result.session.scriptImages).toEqual(expect.arrayContaining([image]));
      }

      if (/\bpospsg\b/i.test(text)) {
        expect(result.effects.stopMovement).toBe(true);
        expect(result.effects.movementDelta).toBe(-1);
        expect(finalHero.x !== initialHero.x || finalHero.y !== initialHero.y).toBe(true);
      }

      if (/\bfineturno\b/i.test(text)) {
        expect(result.effects.forceFinishTurn).toBe(true);
      }

      if (/\bnoatt\b/i.test(text) || /\bnoattarma\b/i.test(text)) {
        expect(result.effects.attackBlocked).toBe(true);
      }

      if (fileName === 'HQBase02.json' && index === 0) {
        expect(result.revealPoints).toHaveLength(7);
        expect(finalHero.inventory).toEqual([9]);
        expect(finalHero.gold).toBe(200);
      }

      if (fileName === 'HQBase12.json' && index === 1) {
        expect(result.notifications[0]).toContain('Avete infranto il magico sigillo');
      }

      if (fileName === 'HQBase14.json' && index === 1) {
        expect(result.notifications[0]).toContain('Hai trovato il signore degli stregoni');
      }
    });
  }
});