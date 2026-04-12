const cloneSession = (session) => {
  if (typeof structuredClone === "function") {
    return structuredClone(session);
  }
  return JSON.parse(JSON.stringify(session));
};

const toInteger = (value, fallback = 0) => {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toBoolean = (value) => value === true || value === 1 || value === "1";

const splitArguments = (args) =>
  String(args ?? "")
    .split(",")
    .map((part) => part.trim());

const getCurrentHeroIndex = (session) =>
  (session?.heroes || []).findIndex(
    (hero) => hero.turnOrder === session?.currentTurn,
  );

const getCurrentHero = (session) => {
  const heroIndex = getCurrentHeroIndex(session);
  if (heroIndex < 0) return null;
  return session.heroes[heroIndex];
};

const getMapCell = (session, x, y) =>
  (session?.currentMap?.grid || []).find(
    (cell) => cell.x === x && cell.y === y,
  );

const updateCurrentHero = (session, updater) => {
  const heroIndex = getCurrentHeroIndex(session);
  if (heroIndex < 0) return null;

  const updatedHero = updater(session.heroes[heroIndex]);
  session.heroes[heroIndex] = updatedHero;
  return updatedHero;
};

const updateHeroByIndex = (session, heroIndex, updater) => {
  if (heroIndex < 0 || heroIndex >= (session?.heroes || []).length) return null;
  const updatedHero = updater(session.heroes[heroIndex]);
  session.heroes[heroIndex] = updatedHero;
  return updatedHero;
};

const getRoomIdFromVisibilityMap = (visibilityMap, x, y) => {
  const visCell = visibilityMap?.data?.find(
    (cell) => cell.x === x && cell.y === y,
  );
  if (!visCell || visCell.valo == null) return null;
  return String(visCell.valo);
};

const hasRockBetweenCells = (session, originX, originY, targetX, targetY) => {
  const startX = toInteger(originX, 0);
  const startY = toInteger(originY, 0);
  const endX = toInteger(targetX, 0);
  const endY = toInteger(targetY, 0);

  if (
    startX <= 0 ||
    startY <= 0 ||
    endX <= 0 ||
    endY <= 0 ||
    startX >= 26 ||
    startY >= 19 ||
    endX >= 26 ||
    endY >= 19
  ) {
    return false;
  }

  if (startY < endY) {
    for (let scanY = startY + 1; scanY < endY; scanY += 1) {
      if (getMapCell(session, endX, scanY)?.arnt?.antroc) return true;
    }
  } else {
    for (let scanY = startY - 1; scanY > endY; scanY -= 1) {
      if (getMapCell(session, endX, scanY)?.arnt?.antroc) return true;
    }
  }

  if (startX < endX) {
    for (let scanX = startX + 1; scanX < endX; scanX += 1) {
      if (getMapCell(session, scanX, endY)?.arnt?.antroc) return true;
    }
  } else {
    for (let scanX = startX - 1; scanX > endX; scanX -= 1) {
      if (getMapCell(session, scanX, endY)?.arnt?.antroc) return true;
    }
  }

  return false;
};

const normalizeScriptImagePath = (sourcePath) => {
  const normalized = String(sourcePath ?? "")
    .trim()
    .replace(/\\/g, "/");
  if (!normalized) return "";
  if (normalized.startsWith("/")) return normalized;
  return `/${normalized}`;
};

const ensureScriptArrays = (session) => {
  session.triggeredScripts = Array.isArray(session.triggeredScripts)
    ? [...session.triggeredScripts]
    : [];
  session.scriptImages = Array.isArray(session.scriptImages)
    ? [...session.scriptImages]
    : [];
};

const buildScriptKey = (script, index) =>
  [
    index,
    toInteger(script.evento, 0),
    toInteger(script.x, 0),
    toInteger(script.y, 0),
    toInteger(script.idmosc, 0),
    toBoolean(script.morto) ? 1 : 0,
    toBoolean(script.unavolta) ? 1 : 0,
    String(script.text ?? ""),
  ].join(":");

const SCRIPT_CONDITION_NAMES = new Set([
  "serand",
  "sestanza",
  "seogg",
  "searma",
]);

const SCRIPT_COMMAND_NAMES = new Set([
  "pospsg",
  "possta",
  "msg",
  "posroc",
  "img",
  "posrocinv",
  "posmostro",
  "posps",
  "posporta",
  "aggogg",
  "aggarma",
  "aggoroid",
  "rimogg",
  "rrndogg",
  "fineturno",
  "aggoro",
  "agghppsg",
  "agghp",
  "att",
  "noatt",
  "noattarma",
]);

const SCRIPT_KEYWORDS = new Set([
  ...SCRIPT_CONDITION_NAMES,
  ...SCRIPT_COMMAND_NAMES,
  "end",
]);

const isKeywordBoundary = (text, index) => {
  if (text[index] !== "\n") {
    return false;
  }

  const remaining = text.slice(index + 1);
  const keywordMatch = remaining.match(/^\s*([A-Za-z]+)/);
  if (!keywordMatch) {
    return false;
  }

  return SCRIPT_KEYWORDS.has(keywordMatch[1].toLowerCase());
};

const parseCommandList = (text, index = 0) => {
  const commands = [];
  let currentIndex = index;

  while (currentIndex < text.length) {
    while (currentIndex < text.length && /\s/.test(text[currentIndex])) {
      currentIndex += 1;
    }

    if (currentIndex >= text.length) {
      break;
    }

    const startIndex = currentIndex;
    while (currentIndex < text.length && !/[\s;]/.test(text[currentIndex])) {
      currentIndex += 1;
    }

    const commandName = text
      .slice(startIndex, currentIndex)
      .trim()
      .toLowerCase();
    while (currentIndex < text.length && /\s/.test(text[currentIndex])) {
      currentIndex += 1;
    }

    const argsStart = currentIndex;
    while (currentIndex < text.length && text[currentIndex] !== ";") {
      if (isKeywordBoundary(text, currentIndex)) {
        break;
      }
      currentIndex += 1;
    }

    const args = text.slice(argsStart, currentIndex).trim();
    const statement = text.slice(startIndex, currentIndex).trim();
    if (currentIndex < text.length && text[currentIndex] === ";") {
      currentIndex += 1;
    }

    if (!commandName) {
      continue;
    }

    if (commandName === "end") {
      return { commands, index: currentIndex };
    }

    if (SCRIPT_CONDITION_NAMES.has(commandName)) {
      const nested = parseCommandList(text, currentIndex);
      currentIndex = nested.index;
      commands.push({
        type: "condition",
        name: commandName,
        args,
        block: nested.commands,
      });
      continue;
    }

    if (!SCRIPT_COMMAND_NAMES.has(commandName)) {
      commands.push({ type: "command", name: "msg", args: statement });
      continue;
    }

    commands.push({ type: "command", name: commandName, args });
  }

  return { commands, index: currentIndex };
};

const evaluateCondition = ({
  entry,
  session,
  context,
  visibilityMap,
  randomVariables,
  random,
}) => {
  const hero = getCurrentHero(session);
  const args = splitArguments(entry.args);

  switch (entry.name) {
    case "serand": {
      const variableId = toInteger(args[0], 0);
      const maxValue = toInteger(args[1], 0);
      const expectedValue = toInteger(args[2], 0);

      if (!randomVariables.has(variableId)) {
        randomVariables.set(variableId, Math.floor((maxValue + 1) * random()));
      }

      return randomVariables.get(variableId) === expectedValue;
    }
    case "sestanza":
      return (
        String(
          context.roomId ??
            getRoomIdFromVisibilityMap(visibilityMap, hero?.x, hero?.y),
        ) === String(toInteger(args[0], 0))
      );
    case "seogg":
      return Boolean(hero?.inventory?.includes(toInteger(args[0], 0)));
    case "searma":
      return Boolean(
        hero?.equipment?.includes(toInteger(args[0], 0)) ||
        hero?.equipped?.includes(toInteger(args[0], 0)),
      );
    default:
      return false;
  }
};

const applyCommand = ({
  entry,
  session,
  notifications,
  revealPoints,
  effects,
  random,
}) => {
  const args = splitArguments(entry.args);

  switch (entry.name) {
    case "pospsg": {
      const targetX = toInteger(args[0], 0);
      const targetY = toInteger(args[1], 0);
      const allowOverlap = toInteger(args[2], 0) === 1;
      const currentHero = getCurrentHero(session);

      if (!currentHero) return;

      const occupiedHeroIndex = (session.heroes || []).findIndex(
        (hero) =>
          hero.turnOrder !== session.currentTurn &&
          hero.x === targetX &&
          hero.y === targetY,
      );
      const isOccupied = occupiedHeroIndex >= 0;

      if (!allowOverlap && isOccupied) {
        notifications.push("Casella occupata spostamento impossibile");
        return;
      }

      updateCurrentHero(session, (hero) => ({
        ...hero,
        x: targetX,
        y: targetY,
      }));
      if (allowOverlap && isOccupied) {
        updateHeroByIndex(session, occupiedHeroIndex, (hero) => ({
          ...hero,
          currentBody: (hero.currentBody || 0) - 1,
        }));
      }

      effects.stopMovement = true;
      effects.movementDelta -= 1;
      effects.activeHeroPosition = { x: targetX, y: targetY };
      return;
    }
    case "possta": {
      const targetX = toInteger(args[0], 0);
      const targetY = toInteger(args[1], 0);
      if (
        !revealPoints.some(
          (point) => point.x === targetX && point.y === targetY,
        )
      ) {
        revealPoints.push({ x: targetX, y: targetY });
      }
      return;
    }
    case "msg":
      if (entry.args) {
        notifications.push(entry.args);
      }
      return;
    case "posroc": {
      const targetX = toInteger(args[0], 0);
      const targetY = toInteger(args[1], 0);
      const mapCell = getMapCell(session, targetX, targetY);
      if (!mapCell) return;
      mapCell.arnt = { ...(mapCell.arnt || {}), antroc: true };
      return;
    }
    case "img": {
      const src = normalizeScriptImagePath(args[0]);
      const targetX = toInteger(args[1], 0);
      const targetY = toInteger(args[2], 0);
      if (!src) return;
      if (
        !session.scriptImages.some(
          (image) =>
            image.x === targetX && image.y === targetY && image.src === src,
        )
      ) {
        session.scriptImages.push({ x: targetX, y: targetY, src });
      }
      return;
    }
    case "posrocinv": {
      const targetX = toInteger(args[0], 0);
      const targetY = toInteger(args[1], 0);
      const mapCell = getMapCell(session, targetX, targetY);
      if (!mapCell) return;
      mapCell.arnt = { ...(mapCell.arnt || {}), inv: true };
      return;
    }
    case "posmostro": {
      const monsterTypeId = toInteger(args[0], 0);
      const targetX = toInteger(args[1], 0);
      const targetY = toInteger(args[2], 0);
      const mapCell = getMapCell(session, targetX, targetY);
      if (!mapCell) return;
      mapCell.mostab = {
        ...(mapCell.mostab || {}),
        mos: true,
        mosid: monsterTypeId,
        corpo: mapCell.mostab?.corpo ?? 0,
      };
      session.scriptImages = session.scriptImages.filter(
        (image) => !(image.x === targetX && image.y === targetY),
      );
      return;
    }
    case "posps": {
      const isHorizontal = toInteger(args[0], 0) === 1;
      const targetX = toInteger(args[1], 0);
      const targetY = toInteger(args[2], 0);
      const mapCell = getMapCell(session, targetX, targetY);
      if (!mapCell) return;
      mapCell.psgg = { ...(mapCell.psgg || {}), ps: 1, oriz: isHorizontal };
      return;
    }
    case "posporta": {
      const isHorizontal = toInteger(args[0], 0) === 1;
      const targetX = toInteger(args[1], 0);
      const targetY = toInteger(args[2], 0);
      session.currentMap.porte = Array.isArray(session.currentMap?.porte)
        ? [...session.currentMap.porte]
        : [];
      if (
        !session.currentMap.porte.some(
          (door) => door.x === targetX && door.y === targetY,
        )
      ) {
        session.currentMap.porte.push({
          x: targetX,
          y: targetY,
          oriz: isHorizontal,
        });
      }
      return;
    }
    case "aggogg": {
      const itemId = toInteger(args[0], 0);
      updateCurrentHero(session, (hero) => ({
        ...hero,
        inventory: [...(hero.inventory || []), itemId],
      }));
      return;
    }
    case "aggarma": {
      const equipmentId = toInteger(args[0], 0);
      updateCurrentHero(session, (hero) => ({
        ...hero,
        equipment: [...(hero.equipment || []), equipmentId],
      }));
      return;
    }
    case "aggoroid": {
      const heroIndex = toInteger(args[0], -1);
      const goldDelta = toInteger(args[1], 0);
      updateHeroByIndex(session, heroIndex, (hero) => ({
        ...hero,
        gold: (hero.gold || 0) + goldDelta,
      }));
      return;
    }
    case "rimogg": {
      const itemId = toInteger(args[0], 0);
      updateCurrentHero(session, (hero) => {
        const nextInventory = [...(hero.inventory || [])];
        const itemIndex = nextInventory.indexOf(itemId);
        if (itemIndex >= 0) {
          nextInventory.splice(itemIndex, 1);
        }
        return { ...hero, inventory: nextInventory };
      });
      return;
    }
    case "rrndogg": {
      updateCurrentHero(session, (hero) => {
        const nextInventory = [...(hero.inventory || [])];
        if (nextInventory.length === 0) {
          return hero;
        }
        const removedIndex = Math.floor(random() * nextInventory.length);
        nextInventory.splice(removedIndex, 1);
        return { ...hero, inventory: nextInventory };
      });
      return;
    }
    case "fineturno":
      effects.stopMovement = true;
      effects.forceFinishTurn = true;
      return;
    case "aggoro": {
      const goldDelta = toInteger(args[0], 0);
      updateCurrentHero(session, (hero) => ({
        ...hero,
        gold: (hero.gold || 0) + goldDelta,
      }));
      return;
    }
    case "agghppsg": {
      const heroIndex = toInteger(args[0], -1);
      const healthDelta = toInteger(args[1], 0);
      updateHeroByIndex(session, heroIndex, (hero) => {
        if ((hero.currentBody || 0) <= 0) {
          return hero;
        }
        return { ...hero, currentBody: (hero.currentBody || 0) + healthDelta };
      });
      return;
    }
    case "agghp": {
      const healthDelta = toInteger(args[0], 0);
      updateCurrentHero(session, (hero) => {
        if ((hero.currentBody || 0) <= 0) {
          return hero;
        }
        return { ...hero, currentBody: (hero.currentBody || 0) + healthDelta };
      });
      return;
    }
    case "att":
      effects.attackBlocked = false;
      return;
    case "noatt":
      effects.attackBlocked = true;
      return;
    case "noattarma": {
      const weaponId = toInteger(args[0], 0);
      const currentHero = getCurrentHero(session);
      effects.attackBlocked = !Boolean(
        currentHero?.equipped?.includes(weaponId),
      );
      return;
    }
    default:
      return;
  }
};

const executeEntries = ({
  commands,
  session,
  context,
  visibilityMap,
  notifications,
  revealPoints,
  effects,
  randomVariables,
  random,
}) => {
  for (const entry of commands) {
    if (entry.type === "condition") {
      if (
        evaluateCondition({
          entry,
          session,
          context,
          visibilityMap,
          randomVariables,
          random,
        })
      ) {
        executeEntries({
          commands: entry.block,
          session,
          context,
          visibilityMap,
          notifications,
          revealPoints,
          effects,
          randomVariables,
          random,
        });
      }
      continue;
    }

    applyCommand({
      entry,
      session,
      notifications,
      revealPoints,
      effects,
      random,
    });
  }
};

const matchesAreaEvent = (session, script, visibilityMap) => {
  const currentHero = getCurrentHero(session);
  if (!currentHero) return false;

  const heroRoomId = getRoomIdFromVisibilityMap(
    visibilityMap,
    currentHero.x,
    currentHero.y,
  );
  const scriptRoomId = getRoomIdFromVisibilityMap(
    visibilityMap,
    toInteger(script.x, 0),
    toInteger(script.y, 0),
  );

  if (
    heroRoomId == null ||
    scriptRoomId == null ||
    heroRoomId !== scriptRoomId
  ) {
    return false;
  }

  if (scriptRoomId !== "1") {
    return true;
  }

  return !hasRockBetweenCells(
    session,
    toInteger(script.x, 0),
    toInteger(script.y, 0),
    currentHero.x,
    currentHero.y,
  );
};

const shouldExecuteScript = ({
  session,
  script,
  index,
  eventType,
  context,
  visibilityMap,
}) => {
  if (toInteger(script.evento, -1) !== toInteger(eventType, -1)) {
    return false;
  }

  if (!String(script.text ?? "").trim()) {
    return false;
  }

  if (
    toBoolean(script.unavolta) &&
    (session.triggeredScripts || []).includes(buildScriptKey(script, index))
  ) {
    return false;
  }

  switch (toInteger(eventType, -1)) {
    case 1:
      return (
        toInteger(script.x, 0) === toInteger(context.previousPosition?.x, -1) &&
        toInteger(script.y, 0) === toInteger(context.previousPosition?.y, -1)
      );
    case 2:
      return (
        toInteger(script.idmosc, 0) === toInteger(context.monsterTypeId, -1) &&
        toBoolean(script.morto) === Boolean(context.onDeath)
      );
    case 3:
    case 4:
    case 5:
      return matchesAreaEvent(session, script, visibilityMap);
    case 6:
    case 7:
      return true;
    case 8:
      return true;
    default:
      return false;
  }
};

export const moveCurrentHeroInSession = (session, nextX, nextY) => {
  const nextSession = cloneSession(session);
  updateCurrentHero(nextSession, (hero) => ({ ...hero, x: nextX, y: nextY }));
  return nextSession;
};

export const resolveHeroAttackInSession = (
  session,
  { monsterId, combatResult, statusesToRemove = [], consumedWeaponId = null },
) => {
  const nextSession = cloneSession(session);
  const heroIndex = getCurrentHeroIndex(nextSession);
  const monsterIndex = (nextSession?.monsters || []).findIndex(
    (monster) => monster.id === monsterId,
  );

  if (heroIndex < 0 || monsterIndex < 0) {
    return nextSession;
  }

  const updatedHero = { ...nextSession.heroes[heroIndex] };
  if (consumedWeaponId != null) {
    updatedHero.equipped = (updatedHero.equipped || []).filter(
      (itemId) => itemId !== consumedWeaponId,
    );
    updatedHero.equipment = (updatedHero.equipment || []).filter(
      (itemId) => itemId !== consumedWeaponId,
    );
  }

  const updatedMonster = { ...nextSession.monsters[monsterIndex] };
  updatedMonster.currentBody =
    (updatedMonster.currentBody || 0) - (combatResult?.damageDealt || 0);
  if (statusesToRemove.length > 0) {
    updatedMonster.activeStatus = (updatedMonster.activeStatus || []).filter(
      (status) => !statusesToRemove.includes(status),
    );
  }

  nextSession.heroes[heroIndex] = updatedHero;
  if (updatedMonster.currentBody <= 0) {
    nextSession.monsters = (nextSession.monsters || []).filter(
      (monster) => monster.id !== monsterId,
    );
  } else {
    nextSession.monsters[monsterIndex] = updatedMonster;
  }

  nextSession.lastAttack = {
    hero: updatedHero,
    monster: updatedMonster,
    combatResult,
  };
  return nextSession;
};

export const executeDungeonScripts = ({
  session,
  eventType,
  context = {},
  visibilityMap,
  random = Math.random,
}) => {
  const nextSession = cloneSession(session);
  ensureScriptArrays(nextSession);

  const effects = {
    attackBlocked: false,
    forceFinishTurn: false,
    movementDelta: 0,
    stopMovement: false,
    activeHeroPosition: getCurrentHero(nextSession)
      ? { x: getCurrentHero(nextSession).x, y: getCurrentHero(nextSession).y }
      : null,
  };
  const notifications = [];
  const revealPoints = [];
  const randomVariables = new Map();

  let handled = false;

  for (const [index, script] of (
    nextSession?.currentMap?.scripts || []
  ).entries()) {
    if (
      !shouldExecuteScript({
        session: nextSession,
        script,
        index,
        eventType,
        context,
        visibilityMap,
      })
    ) {
      continue;
    }

    handled = true;
    const parsed = parseCommandList(String(script.text ?? ""));
    executeEntries({
      commands: parsed.commands,
      session: nextSession,
      context,
      visibilityMap,
      notifications,
      revealPoints,
      effects,
      randomVariables,
      random,
    });

    if (toBoolean(script.unavolta)) {
      const key = buildScriptKey(script, index);
      if (!nextSession.triggeredScripts.includes(key)) {
        nextSession.triggeredScripts.push(key);
      }
    }
  }

  const currentHero = getCurrentHero(nextSession);
  if (currentHero) {
    effects.activeHeroPosition = { x: currentHero.x, y: currentHero.y };
  }

  return {
    session: nextSession,
    handled,
    notifications,
    revealPoints,
    effects,
  };
};

export { buildScriptKey, getRoomIdFromVisibilityMap };
