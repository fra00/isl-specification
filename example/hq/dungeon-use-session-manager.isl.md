# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-09
**Implementation**: ./dungeon-use-session-manager

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @HeroState, @MonsterState in `./domain-session.isl.md`
> **Reference**: @TreasureCard in `./domain-ruleset.isl.md`
> **Reference**: @Equipment in `./domain-ruleset.isl.md`
> **Reference**: @Item in `./domain-ruleset.isl.md`
> **Reference**: @CombatResult in `./dungeon-use-combat.isl.md`
> **Reference**: @useFogOfWar in `./dungeon-use-fog-of-war.isl.md`

## Domain Concepts

### 📦 Content/Structure

- This component centralizes deterministic `@GameSession` mutations owned by the dungeon domain.

## Component: useDungeonSessionManager

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession
- `onUpdateSession`: `(session: @GameSession) -> void` OR `((previousSession: @GameSession) -> @GameSession) -> void`
- `onNotify`: (message: String) -> void
- `fogOfWarLogic`: @useFogOfWar

### ⚡ Capabilities

#### commitSessionUpdate

- **Contract**: Persists a dungeon session mutation against the latest available session snapshot so sequential asynchronous updates cannot overwrite each other with stale state.
- **Signature**: `(updater: (@GameSession) -> @GameSession) -> Boolean`
- **Flow**:
  - IF `onUpdateSession` is not available RETURN false.
  - Trigger `onUpdateSession` with a functional updater.
  - The functional updater MUST receive the latest available `previousSession`.
  - Let `baseSession` = `previousSession` when available, otherwise `gameSession`.
  - IF `baseSession` is null RETURN `previousSession` unchanged.
  - RETURN `updater(baseSession)`.
  - RETURN true.

#### initializeMission

- **Contract**: Initializes persistent mission session data that must be owned by the dungeon boundary before interactive gameplay starts.
- **Signature**: `(treasureDeck: List<@TreasureCard>) -> void`
- **Flow**:
  - IF `gameSession` is null OR `gameSession.currentMap` is null RETURN.
  - Create `placedHeroes` by mapping `gameSession.heroes`.
  - FOR EACH `heroState` in `placedHeroes`:
    - Find `spawnPoint` in `gameSession.currentMap.eroi_start` where `id` == `heroState.heroId`.
    - IF `spawnPoint` exists:
      - Set `heroState.x` to `spawnPoint.x`.
      - Set `heroState.y` to `spawnPoint.y`.
      - Set `heroState.isEscaped` to false.
  - Create `updatedSession` as a new @GameSession preserving all unrelated properties.
  - Set `updatedSession.heroes` to `placedHeroes`.
  - Set `updatedSession.treasureDeck` to `treasureDeck`.
  - Trigger `onUpdateSession(updatedSession)`.

#### confirmHeroOrder

- **Contract**: Commits the selected hero turn order inside the session boundary and triggers the initial visibility reveal.
- **Signature**: `(orderedHeroIds: List<Integer>) -> void`
- **Flow**:
  - IF `gameSession` is null OR `gameSession.isHeroOrderConfirmed` is true RETURN.
  - Create `updatedHeroes` by mapping `gameSession.heroes`.
  - For each `hero` in `updatedHeroes`:
    - Let `nextTurnOrder` = position of `hero.heroId` in `orderedHeroIds` + 1.
    - IF `nextTurnOrder` is greater than 0:
      - Set `hero.turnOrder` to `nextTurnOrder`.
  - Create `updatedSession` as a new @GameSession preserving all unrelated properties.
  - Set `updatedSession.heroes` to `updatedHeroes`.
  - Set `updatedSession.isHeroOrderConfirmed` to true.
  - Call `fogOfWarLogic.revealInitialVisibility()`.
  - Trigger `onUpdateSession(updatedSession)`.

#### clearLastAttack

- **Contract**: Clears the last combat result without mutating unrelated session branches.
- **Signature**: `() -> void`
- **Flow**:
  - IF `gameSession` is null OR `gameSession.lastAttack` is null RETURN.
  - Create `updatedSession` as a new @GameSession preserving all unrelated properties.
  - Set `updatedSession.lastAttack` to `null`.
  - Trigger `onUpdateSession(updatedSession)`.

#### openPassage

- **Contract**: Opens a valid door or revealed secret passage, reveals the destination area, and persists the door state atomically.
- **Signature**: `(passageX: Integer, passageY: Integer, destinationX: Integer, destinationY: Integer, foundPassages: List<{x: Integer, y: Integer}>) -> Boolean`
- **Flow**:
  - IF `gameSession` is null OR `gameSession.currentMap` is null RETURN false.
  - Let `coordKey` = `passageX + "," + passageY`.
  - Let `isKnownDoor` = `gameSession.currentMap.porte.exists(p => p.x == passageX AND p.y == passageY)`.
  - Let `isKnownPassage` = `foundPassages.exists(p => p.x == passageX AND p.y == passageY)`.
  - IF `isKnownDoor` is false AND `isKnownPassage` is false RETURN false.
  - IF `gameSession.openedDoors` contains `coordKey` RETURN false.
  - TRY:
    - Call `fogOfWarLogic.revealFromPoint(destinationX, destinationY)`.
    - Create `updatedSession` as a new @GameSession preserving all unrelated properties.
    - Set `updatedSession.openedDoors` to `gameSession.openedDoors` plus `coordKey`.
    - Trigger `onNotify("Porta aperta.")`.
    - Trigger `onUpdateSession(updatedSession)`.
    - RETURN true.
  - CATCH:
    - LOG "Errore durante l'apertura della porta o rivelazione nebbia."
    - RETURN false.

#### toggleEquipItem

- **Contract**: Equips or unequips owned equipment while preserving class restrictions and incompatibility rules inside the session boundary.
- **Signature**: `(heroId: Integer, itemId: Integer, staticEquipment: List<@Equipment>) -> Boolean`
- **Flow**:
  - IF `gameSession` is null OR `gameSession.heroes` is null RETURN false.
  - Find `hero` in `gameSession.heroes` matching `heroId`.
  - Find `item` in `staticEquipment` matching `itemId`.
  - IF `hero` is null RETURN false.
  - IF `item` is null:
    - Trigger `onNotify("Oggetto non trovato.")`.
    - RETURN false.
  - Create `updatedEquipped` as a copy of `hero.equipped`.
  - IF `updatedEquipped` contains `itemId`:
    - Remove `itemId` from `updatedEquipped`.
  - ELSE:
    - IF `item.solopsg` is true AND `item.solopsgid` is NOT equal to `hero.heroId`:
      - Trigger `onNotify("La tua classe non può equipaggiare questo oggetto.")`.
      - RETURN false.
    - IF `item.nopsg` is true AND `item.nopsgid` is EQUAL to `hero.heroId`:
      - Trigger `onNotify("La tua classe non può equipaggiare questo oggetto.")`.
      - RETURN false.
    - IF `item.noogg` > 0:
      - Remove `item.noogg` from `updatedEquipped`.
    - FOR EACH `equippedId` in `updatedEquipped`:
      - Find `equippedItem` in `staticEquipment`.
      - IF `equippedItem.noogg` is EQUAL to `itemId`:
        - Remove `equippedId` from `updatedEquipped`.
        - Trigger `onNotify("Hai rimosso " + equippedItem.nome + " perché incompatibile.")`.
    - Add `itemId` to `updatedEquipped`.
  - Create `updatedHeroes` as a copy of `gameSession.heroes`.
  - Replace the matching hero with a new hero state whose `equipped` is `updatedEquipped`.
  - Create `updatedSession` as a new @GameSession preserving all unrelated properties.
  - Set `updatedSession.heroes` to `updatedHeroes`.
  - Trigger `onUpdateSession(updatedSession)`.
  - RETURN true.

#### useItem

- **Contract**: Applies the effects of a consumable item inside the dungeon session boundary and removes exactly one matching inventory instance.
- **Signature**: `(heroId: Integer, itemId: Integer, staticItems: List<@Item>, targetMonsterId: Integer | null) -> Boolean`
- **Flow**:
  - IF `gameSession` is null OR `gameSession.heroes` is null RETURN false.
  - Find `hero` in `gameSession.heroes` matching `heroId`.
  - Find `itemDef` in `staticItems` matching `itemId`.
  - IF `hero` is null OR `itemDef` is null RETURN false.
  - Find the first index of `itemId` in `hero.inventory`.
  - IF item index is less than 0 RETURN false.
  - Create `updatedHero` as a copy of `hero`.
  - Create `updatedMonsters` as a copy of `gameSession.monsters`.
  - IF `itemDef.hp` is NOT 0:
    - Add `itemDef.hp` to `updatedHero.currentBody`.
    - Clamp `updatedHero.currentBody` to max `updatedHero.hero.corpo`.
  - IF `itemDef.mp` is NOT 0:
    - Add `itemDef.mp` to `updatedHero.currentMind`.
    - Clamp `updatedHero.currentMind` to max `updatedHero.hero.mente`.
  - IF `itemDef.acqua` is true:
    - IF `targetMonsterId` is NOT null:
      - Find `targetMonster` in `updatedMonsters` matching `targetMonsterId`.
      - IF `targetMonster` is found:
        - IF `targetMonster.monster.nonmorto` is true:
          - Subtract `itemDef.danni` from `targetMonster.currentBody`.
          - Trigger `onNotify("L'Acqua Santa purifica il non-morto infliggendo " + itemDef.danni + " danni!")`.
          - IF `targetMonster.currentBody` <= 0:
            - Remove `targetMonster` from `updatedMonsters`.
        - ELSE:
          - Trigger `onNotify("L'Acqua Santa non ha effetto su questa creatura.")`.
      - ELSE:
        - Trigger `onNotify("Hai usato l'Acqua Santa, ma non hai colpito nulla!")`.
    - ELSE:
      - Trigger `onNotify("Hai usato l'Acqua Santa, ma non hai colpito nulla!")`.
  - Remove the first matching `itemId` from `updatedHero.inventory`.
  - Trigger `onNotify("Hai usato " + itemDef.nome + "!")`.
  - Create `updatedHeroes` as a copy of `gameSession.heroes`.
  - Replace the matching hero with `updatedHero`.
  - Create `updatedSession` as a new @GameSession preserving all unrelated properties.
  - Set `updatedSession.heroes` to `updatedHeroes`.
  - Set `updatedSession.monsters` to `updatedMonsters`.
  - Trigger `onUpdateSession(updatedSession)`.
  - RETURN true.

#### collectTreasureAtCell

- **Contract**: Applies a visible map treasure to a specific hero, clears the treasure cell, and persists the resulting session snapshot.
- **Signature**: `(heroId: Integer, treasureX: Integer, treasureY: Integer) -> Boolean`
- **Flow**:
  - IF `gameSession` is null OR `gameSession.currentMap` is null RETURN false.
  - Find `hero` in `gameSession.heroes` matching `heroId`.
  - Find `mapCell` in `gameSession.currentMap.grid` matching `treasureX`, `treasureY`.
  - IF `hero` is null OR `mapCell` is null OR `mapCell.tes` is null RETURN false.
  - Let `treasure` = `mapCell.tes`.
  - IF `treasure.mon`, `treasure.ogg`, `treasure.arma`, and `treasure.trp` are all 0 RETURN false.
  - Create `updatedHero` as a copy of `hero`.
  - Initialize `notificationParts` as an empty list.
  - IF `treasure.mon` > 0:
    - Add `treasure.mon` to `updatedHero.gold`.
    - Add "Hai trovato " + `treasure.mon` + " monete d'oro!" to `notificationParts`.
  - IF `treasure.ogg` > 0:
    - Add `treasure.ogg` to `updatedHero.inventory`.
    - Add "Hai trovato un oggetto!" to `notificationParts`.
  - IF `treasure.arma` > 0:
    - Add `treasure.arma` to `updatedHero.equipment`.
    - Add "Hai trovato un'arma!" to `notificationParts`.
  - IF `treasure.trp` > 0:
    - Subtract `treasure.trp` from `updatedHero.currentBody`.
    - Add "È una trappola! Subisci " + `treasure.trp` + " danni." to `notificationParts`.
  - Create `updatedHeroes` as a copy of `gameSession.heroes`.
  - Replace the matching hero with `updatedHero`.
  - Create `updatedGrid` as a copy of `gameSession.currentMap.grid`.
  - Replace the matching map cell with a copy whose `tes` has all numeric values reset to 0.
  - Create `updatedMap` as a copy of `gameSession.currentMap`.
  - Set `updatedMap.grid` to `updatedGrid`.
  - Create `updatedSession` as a new @GameSession preserving all unrelated properties.
  - Set `updatedSession.heroes` to `updatedHeroes`.
  - Set `updatedSession.currentMap` to `updatedMap`.
  - Trigger `onNotify` with `notificationParts` joined by a newline.
  - Trigger `onUpdateSession(updatedSession)`.
  - RETURN true.

#### drawTreasureCard

- **Contract**: Draws the top treasure card and persists the shortened deck atomically.
- **Signature**: `() -> @TreasureCard | null`
- **Flow**:
  - IF `gameSession` is null OR `gameSession.treasureDeck` is empty RETURN null.
  - Let `drawnCard` = first element of `gameSession.treasureDeck`.
  - Create `updatedSession` as a new @GameSession preserving all unrelated properties.
  - Set `updatedSession.treasureDeck` to `gameSession.treasureDeck` without the first card.
  - Trigger `onUpdateSession(updatedSession)`.
  - RETURN `drawnCard`.

#### applyTreasureCardEffect

- **Contract**: Applies a drawn treasure card to the current hero and persists any resulting session changes.
- **Signature**: `(heroId: Integer, card: @TreasureCard, onWanderingMonster: (x: Integer, y: Integer) -> void) -> Boolean`
- **Flow**:
  - IF `gameSession` is null RETURN false.
  - Find `hero` in `gameSession.heroes` matching `heroId`.
  - IF `hero` is null RETURN false.
  - Create `updatedHero` as a copy of `hero`.
  - Create `updatedSession` as a new @GameSession preserving all unrelated properties.
  - SWITCH `card.azione`:
    - CASE "aggiungi_oro":
      - Add `card.valore` to `updatedHero.gold`.
      - Trigger `onNotify("Hai trovato " + card.valore + " monete d'oro!")`.
    - CASE "aggiungi_oggetto":
      - Add `card.valore` to `updatedHero.inventory`.
      - Trigger `onNotify("Hai trovato un oggetto: " + card.valore)`.
    - CASE "modifica_hp":
      - Add `card.valore` to `updatedHero.currentBody`.
      - Trigger `onNotify("Punti Corpo modificati!")`.
    - CASE "trappola_e_fine":
      - Add `card.valore` to `updatedHero.currentBody`.
      - Trigger `onNotify("Trappola! Subisci danni.")`.
    - CASE "mostro_errante":
      - Trigger `onUpdateSession(updatedSession)`.
      - Trigger `onWanderingMonster(updatedHero.x, updatedHero.y)`.
      - RETURN true.
  - Create `updatedHeroes` as a copy of `gameSession.heroes`.
  - Replace the matching hero with `updatedHero`.
  - Set `updatedSession.heroes` to `updatedHeroes`.
  - Trigger `onUpdateSession(updatedSession)`.
  - RETURN true.

#### updateMonsterState

- **Contract**: Persists a monster position update and/or removes temporary monster statuses against the latest available session snapshot.
- **Signature**: `(monsterId: Integer, nextX: Integer | null, nextY: Integer | null, statusesToRemove: List<String>) -> Boolean`
- **Flow**:
  - Call `commitSessionUpdate` with an updater.
  - Inside the updater, find `monster` in the provided current session matching `id` = `monsterId`.
  - IF `monster` is null RETURN the current session unchanged.
  - Create `updatedMonster` as a copy of `monster`.
  - IF `nextX` is NOT null: Set `updatedMonster.x` to `nextX`.
  - IF `nextY` is NOT null: Set `updatedMonster.y` to `nextY`.
  - IF `statusesToRemove` is not empty:
    - Remove all entries in `statusesToRemove` from `updatedMonster.activeStatus`.
  - Create `updatedMonsters` as a copy of the current session `monsters`.
  - Replace the matching monster with `updatedMonster`.
  - RETURN a new @GameSession preserving all unrelated properties and setting `monsters` to `updatedMonsters`.

#### resolveMonsterAttack

- **Contract**: Applies monster combat damage to a hero, clears protective statuses when broken, and persists `lastAttack` against the latest available session snapshot.
- **Signature**: `(monsterId: Integer, heroId: Integer, combatResult: @CombatResult) -> Boolean`
- **Flow**:
  - Call `commitSessionUpdate` with an updater.
  - Inside the updater, find `monster` in the provided current session matching `id` = `monsterId`.
  - Find `hero` in the provided current session `heroes` matching `heroId`.
  - IF `monster` is null OR `hero` is null RETURN the current session unchanged.
  - Create `updatedHero` as a copy of `hero`.
  - Subtract `combatResult.damageDealt` from `updatedHero.currentBody`.
  - IF `combatResult.damageDealt` > 0 AND `updatedHero.activeStatus` contains "RockSkin":
    - Remove "RockSkin" from `updatedHero.activeStatus`.
  - Create `updatedHeroes` as a copy of the current session `heroes`.
  - Replace the matching hero with `updatedHero`.
  - RETURN a new @GameSession preserving all unrelated properties, setting `heroes` to `updatedHeroes`, and setting `lastAttack` to {hero: `updatedHero`, monster: `monster`, combatResult: `combatResult`}.

#### startNextHeroRound

- **Contract**: Ends the master phase by resetting the hero round state inside the session snapshot.
- **Contract**: Ends the master phase by resetting the hero round state inside the latest available session snapshot.
- **Signature**: `() -> void`
- **Flow**:
  - Call `commitSessionUpdate` with an updater.
  - Inside the updater, create `updatedHeroes` by mapping the current session `heroes`.
  - FOR EACH `hero` in `updatedHeroes`:
    - Set `hero.turnPhase.HasMoved` to false.
    - Set `hero.turnPhase.HasPerformedAction` to false.
    - Set `hero.turnPhase.IsTurnFinished` to false.
  - RETURN a new @GameSession preserving all unrelated properties, setting `currentTurn` to 1, and setting `heroes` to `updatedHeroes`.

#### clearHeroStatusEverywhere

- **Contract**: Removes a status from every hero and persists the update only if at least one hero changed.
- **Contract**: Removes a status from every hero and persists the update only if at least one hero changed, using the latest available session snapshot.
- **Signature**: `(statusName: String) -> Boolean`
- **Flow**:
  - Call `commitSessionUpdate` with an updater.
  - Inside the updater, initialize `didChange` as false.
  - Create `updatedHeroes` by mapping the current session `heroes`.
  - FOR EACH `hero` in `updatedHeroes`:
    - IF `hero.activeStatus` contains `statusName`:
      - Remove `statusName` from `hero.activeStatus`.
      - Set `didChange` to true.
  - IF `didChange` is false RETURN the current session unchanged.
  - RETURN a new @GameSession preserving all unrelated properties and setting `heroes` to `updatedHeroes`.

#### moveCurrentHeroTo

- **Contract**: Persists the active hero position update without mutating unrelated session branches.
- **Contract**: Persists the active hero position update against the latest available session snapshot without mutating unrelated session branches.
- **Signature**: `(nextX: Integer, nextY: Integer) -> Boolean`
- **Flow**:
  - Call `commitSessionUpdate` with an updater.
  - Inside the updater, find `hero` in the current session `heroes` matching `turnOrder` = `currentTurn`.
  - IF `hero` is null RETURN the current session unchanged.
  - Create `updatedHero` as a copy of `hero`.
  - Set `updatedHero.x` to `nextX`.
  - Set `updatedHero.y` to `nextY`.
  - Create `updatedHeroes` as a copy of the current session `heroes`.
  - Replace the matching hero with `updatedHero`.
  - RETURN a new @GameSession preserving all unrelated properties and setting `heroes` to `updatedHeroes`.

#### resolveMovementTrap

- **Contract**: Applies trap consequences to the active hero, optionally blocks a falling-rock cell, and persists the interrupted movement state.
- **Contract**: Applies trap consequences to the active hero, optionally blocks a falling-rock cell, and persists the interrupted movement state against the latest available session snapshot.
- **Signature**: `(nextX: Integer, nextY: Integer, trapType: Integer, rockFallX: Integer | null, rockFallY: Integer | null) -> Boolean`
- **Flow**:
  - Call `commitSessionUpdate` with an updater.
  - Inside the updater, IF the current session `currentMap` is null RETURN the current session unchanged.
  - Find `hero` in the current session `heroes` matching `turnOrder` = `currentTurn`.
  - IF `hero` is null RETURN the current session unchanged.
  - Create `updatedHero` as a copy of `hero`.
  - Set `updatedHero.x` to `nextX`.
  - Set `updatedHero.y` to `nextY`.
  - Subtract 1 from `updatedHero.currentBody`.
  - IF `updatedHero.activeStatus` contains "RockSkin":
    - Remove "RockSkin" from `updatedHero.activeStatus`.
  - Create `updatedHeroes` as a copy of the current session `heroes`.
  - Replace the matching hero with `updatedHero`.
  - Create `updatedMap` as a copy of the current session `currentMap`.
  - Create `updatedGrid` as a copy of the current session `currentMap.grid`.
  - IF `trapType` == 3 AND `rockFallX` is NOT null AND `rockFallY` is NOT null:
    - Find the grid cell matching `rockFallX`, `rockFallY`.
    - Replace it with a copy whose `arnt.antroc` is true.
  - Set `updatedMap.grid` to `updatedGrid`.
  - RETURN a new @GameSession preserving all unrelated properties, setting `heroes` to `updatedHeroes`, and setting `currentMap` to `updatedMap`.

#### markCurrentHeroEscaped

- **Contract**: Marks the active hero as escaped and finishes their persisted turn state.
- **Contract**: Marks the active hero as escaped and finishes their persisted turn state against the latest available session snapshot.
- **Signature**: `() -> Boolean`
- **Flow**:
  - Call `commitSessionUpdate` with an updater.
  - Inside the updater, find `hero` in the current session `heroes` matching `turnOrder` = `currentTurn`.
  - IF `hero` is null RETURN the current session unchanged.
  - Create `updatedHero` as a copy of `hero`.
  - Set `updatedHero.isEscaped` to true.
  - Set `updatedHero.turnPhase.IsTurnFinished` to true.
  - Create `updatedHeroes` as a copy of the current session `heroes`.
  - Replace the matching hero with `updatedHero`.
  - RETURN a new @GameSession preserving all unrelated properties and setting `heroes` to `updatedHeroes`.

#### resolveHeroAttack

- **Contract**: Applies hero attack results to a target monster, updates `lastAttack`, and removes any consumed thrown weapon.
- **Contract**: Applies hero attack results to a target monster, updates `lastAttack`, and removes any consumed thrown weapon against the latest available session snapshot.
- **Signature**: `(monsterId: Integer, combatResult: @CombatResult, statusesToRemove: List<String>, consumedWeaponId: Integer | null) -> Boolean`
- **Flow**:
  - Call `commitSessionUpdate` with an updater.
  - Inside the updater, find `hero` in the current session `heroes` matching `turnOrder` = `currentTurn`.
  - Find `monster` in the current session `monsters` matching `id` = `monsterId`.
  - IF `hero` is null OR `monster` is null RETURN the current session unchanged.
  - Create `updatedHero` as a copy of `hero`.
  - IF `consumedWeaponId` is NOT null:
    - Remove `consumedWeaponId` from `updatedHero.equipped`.
    - Remove `consumedWeaponId` from `updatedHero.equipment`.
  - Create `updatedMonster` as a copy of `monster`.
  - Subtract `combatResult.damageDealt` from `updatedMonster.currentBody`.
  - IF `statusesToRemove` is not empty:
    - Remove all entries in `statusesToRemove` from `updatedMonster.activeStatus`.
  - Create `updatedHeroes` as a copy of the current session `heroes`.
  - Replace the matching hero with `updatedHero`.
  - Create `updatedMonsters` as a copy of the current session `monsters`.
  - IF `updatedMonster.currentBody` <= 0:
    - Remove the matching monster from `updatedMonsters`.
  - ELSE:
    - Replace the matching monster with `updatedMonster`.
  - RETURN a new @GameSession preserving all unrelated properties, setting `heroes` to `updatedHeroes`, setting `monsters` to `updatedMonsters`, and setting `lastAttack` to {hero: `updatedHero`, monster: `updatedMonster`, combatResult: `combatResult`}.

#### advanceTurn

- **Contract**: Persists the next hero turn index and optionally clears one expiring status from the current hero.
- **Contract**: Persists the next hero turn index and optionally clears one expiring status from the current hero against the latest available session snapshot.
- **Signature**: `(nextTurn: Integer, clearStatusName: String | null) -> Boolean`
- **Flow**:
  - Call `commitSessionUpdate` with an updater.
  - Inside the updater, find `hero` in the current session `heroes` matching `turnOrder` = `currentTurn`.
  - Create `updatedHeroes` as a copy of the current session `heroes`.
  - IF `hero` is NOT null AND `clearStatusName` is NOT null AND `hero.activeStatus` contains `clearStatusName`:
    - Create `updatedHero` as a copy of `hero`.
    - Remove `clearStatusName` from `updatedHero.activeStatus`.
    - Replace the matching hero with `updatedHero`.
  - RETURN a new @GameSession preserving all unrelated properties, setting `heroes` to `updatedHeroes`, and setting `currentTurn` to `nextTurn`.

### 🚨 Constraints

- All capabilities MUST create a new `@GameSession` snapshot when persisting state; they MUST NOT rely on mutating `gameSession` in place.
- Capabilities that can run during chained or asynchronous dungeon flows MUST persist through `commitSessionUpdate`, so they always compute from the latest available session snapshot rather than a stale closure.
- A capability MUST call `onUpdateSession` only if the requested mutation produces a valid session state transition.
- `openPassage` MUST reveal fog before persisting the opened door coordinate, so failed reveal logic cannot leave the session half-updated.
- `initializeMission` MUST preserve `currentMap`, `currentMissionIndex`, `monsters`, `openedDoors`, and all other unrelated branches of `@GameSession`.
- `toggleEquipItem` MUST only change the targeted hero `equipped` list; it MUST preserve `equipment`, `inventory`, `gold`, and all unrelated session branches.
- `useItem` MUST remove only one inventory instance per invocation and MUST preserve unrelated heroes, map data, and door state.
- `collectTreasureAtCell`, `resolveMovementTrap`, and `resolveHeroAttack` MUST preserve all unrelated heroes, monsters, map rows, and door state while updating only the affected branches.
- `startNextHeroRound` and `advanceTurn` MUST remain the only persisted turn-index mutations inside the dungeon boundary.
