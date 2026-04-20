# Project: Dungeon React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./dungeon

---

> **Reference**: @PageNavigationEnum in `./domain-core.isl.md`
> **Reference**: @GameSession, @TurnPhase in `./domain-session.isl.md`
> **Reference**: @MapDefinition, @VisibilityMap, @Campaign in `./domain-map.isl.md`
> **Reference**: @Item, @Equipment in `./domain-ruleset.isl.md`
> **Reference**: @Spell in `./domain-ruleset.isl.md`
> **Reference**: @DungeonBoard in `./dungeon-board.isl.md`
> **Reference**: @DungeonHeroOrder in `./dungeon-hero-order.isl.md`
> **Reference**: @useTurnLogic in `./dungeon-use-turn-logic.isl.md`
> **Reference**: @usePathfinding in `./dungeon-use-pathfinding.isl.md`
> **Reference**: @useCombatLogic in `./dungeon-use-combat.isl.md`
> **Reference**: @useHeroStats in `./dungeon-use-hero-stats.isl.md`
> **Reference**: @useFogOfWar in `./dungeon-use-fog-of-war.isl.md`
> **Reference**: @useDungeonMonsters in `./dungeon-use-monsters.isl.md`
> **Reference**: @CombatResultModal in `./dungeon-combat-result-modal.isl.md`
> **Reference**: @DungeonTurnControls in `./dungeon-turn-controls.isl.md`
> **Reference**: @DungeonHeroInfoPanel in `./dungeon-hero-info-panel.isl.md`
> **Reference**: @useSecretPassages in `./dungeon-use-secret-passages.isl.md`
> **Reference**: @useTreasureSearch in `./dungeon-use-treasure.isl.md`
> **Reference**: @useInventoryLogic in `./dungeon-use-inventory-logic.isl.md`
> **Reference**: @useItemLogic in `./dungeon-use-item-logic.isl.md`
> **Reference**: @useMapInteraction in `./dungeon-use-map-interaction.isl.md`
> **Reference**: @DungeonNotification in `./dungeon-notification.isl.md`
> **Reference**: @TreasureCard in `./domain-ruleset.isl.md`
> **Reference**: @TreasureCardModal in `./dungeon-treasure-card-modal.isl.md`
> **Reference**: @DungeonInventoryModal in `./dungeon-inventory-modal.isl.md`
> **Reference**: @useTraps in `./dungeon-use-traps.isl.md`
> **Reference**: @DungeonGameOver in `./dungeon-game-over.isl.md`
> **Reference**: @DungeonSpellSelectionModal in `./dungeon-spell-selection-modal.isl.md`
> **Reference**: @useMagicLogic in `./dungeon-use-magic.isl.md`
> **Reference**: @DungeonMissionSummary in `./dungeon-mission-summary.isl.md`
> **Reference**: @useCampaignManager in `./dungeon-use-campaign-manager.isl.md`
> **Reference**: @DungeonSpellCastModal in `./dungeon-spell-cast-modal.isl.md`
> **Reference**: @useMonsterAI in `./dungeon-use-monster-ai.isl.md`
> **Reference**: @useDungeonSessionManager in `./dungeon-use-session-manager.isl.md`

## Domain Concepts

### 📦 Content/Structure

- This component composes transient dungeon UI state with domain hooks and delegates persistent session writes to the dungeon session boundary.

## Component: Dungeon

### Role: Presentation

**Signature**:

- `gameSession`: @GameSession (Current session state).
- `onChangePageView`: (nextPage: @PageNavigationEnum) -> void (Callback to navigate).
- `onUpdateSession`: (session: @GameSession) -> void (Callback to update session).
- `staticMonsters`: List<@Monster>
- `staticVisibilityMap`: @VisibilityMap
- `staticEquipment`: List<@Equipment>
- `staticItems`: List<@Item>
- `staticSpells`: List<@Spell>
- `treasureDeck`: List<@TreasureCard>

### 🔍 Appearance

- **Layout**: 100% of the screen container.
- **Environment Frame**: The dungeon scene SHOULD sit inside a larger chamber-like screen treatment, with a dark stone backdrop, subtle rune/torch glows at the sides, and an ornate frame around the board so the play area feels embedded in the page instead of floating on a flat background.
- **Board Shell**: `DungeonBoard` SHOULD be wrapped by a decorative outer frame with bronze corners and a small centered plaque label, while preserving the exact board interaction area.
- **Turn Marker**: When hero order is confirmed, the framed board shell SHOULD show a small ornamental turn marker near the bottom center using `gameSession.currentTurn`.

### 📦 Content

- **Hero Order**: Displays `DungeonHeroOrder` IF `isMissionInitialized` is true AND `gameSession.isHeroOrderConfirmed` is false.
  - **Props**:
    - `heroes`: `gameSession.heroes`.
    - `onConfirmOrder`: Trigger `confirmHeroOrder`.

- **Spell Selection**: Displays `DungeonSpellSelectionModal` if `gameSession.isHeroOrderConfirmed` is true AND `isSpellSelectionRequired` is true.
  - **Props**:
    - `heroes`: `gameSession.heroes`.
    - `allSpells`: `staticSpells`.
    - `onConfirmSelection`: Trigger `confirmSpellSelection`.
- **Dungeon Board**: Displays `DungeonBoard` with props:
  - `boardVisibilityMap`: `boardVisibilityMap`.
  - `hoveredPath`: `hooksTurnLogic.hoveredPath`.
  - `hoveredPathVariant`: `hooksTurnLogic.hoveredPathVariant`.
  - `secretPassages`: `hooksSecretPassages.foundPassages`.
  - `treasures`: `hooksTreasure.foundTreasures`.
  - `triggeredTraps`: `hooksTraps.getTriggeredTraps()` filtered to exclude traps whose status is `DISARMED`, so a disarmed trap miniature disappears immediately.
  - `targetingSpell`: `targetingSpell`.
  - `visibilityCalc`: `hooksVisibilityCalc`.
  - `visibilityCalc` MUST be the live `hooksVisibilityCalc` instance and MUST NOT be `null` while the board supports line-of-sight highlights, targeting previews, or tracer rendering.
  - `hoveredPath` MUST be passed together with `hoveredPathVariant`; passing only the variant is invalid because the board highlight is driven by the actual path coordinates.
- **Turn Controls**:
  - Displays `@DungeonTurnControls` IF `gameSession.isHeroOrderConfirmed` is true AND `currentHero` is NOT null.
  - **Props**:
    - `currentHero`: derived from `gameSession.heroes` and `gameSession.currentTurn`.
    - `currentHeroStats`: `hooksHeroStats.calculateStats(currentHero)`.
    - `movementPoints`: `hooksTurnLogic.movementPoints`.
    - `turnPhase`: `hooksTurnLogic.turnPhase`.
    - `isMoving`: `hooksTurnLogic.isMoving`.
    - `onRollMovement`: `hooksTurnLogic.rollMovement`.
    - `onEndTurn`: `hooksTurnLogic.endTurn`.
    - `onSearchPassages`: `hooksSecretPassages.searchPassages`.
    - `onSearchTreasure`: `hooksTreasure.searchTreasure`.
    - `onSearchTraps`: `hooksTraps.searchTraps`.
    - `canDisarmTrap`: true only when the active hero is adjacent to a revealed active trap (`DETECTED` or `TRIGGERED`) and `hooksHeroStats.calculateStats(currentHero).canDisarmTraps` is true.
    - `onDisarmTrap`: Trigger `handleDisarmTrap`, applying the trap consequence if the disarm attempt fails.
    - `onOpenMagic`: Trigger `openMagicModal`.
    - `isTargeting`: `targetingSpell` is NOT null.
    - `onCancelTargeting`: Trigger `cancelTargeting`.
    - `canOpenDoor`: `hooksTurnLogic.canOpenDoor` is NOT null.
    - `onOpenDoor`: `hooksTurnLogic.handleOpenDoor`.
    - `onOpenInventory`: Trigger `openInventory`.
- **Hero Info Panel**:
  - Displays `@DungeonHeroInfoPanel` IF `gameSession.isHeroOrderConfirmed` is true AND `currentHero` is NOT null.
  - **Props**:
    - `currentHero`: derived from `gameSession.heroes` and `gameSession.currentTurn`.
    - `currentHeroStats`: `hooksHeroStats.calculateStats(currentHero)`.
    - `movementPoints`: `hooksTurnLogic.movementPoints`.
- **Combat Result**: Displays `CombatResultModal` if `gameSession.lastAttack` is not null.
  - **Props**:
    - `isOpen`: true.
    - `combatResult`: `gameSession.lastAttack.combatResult`.
    - `attacker`: `gameSession.lastAttack.hero`.
    - `defender`: `gameSession.lastAttack.monster`.
    - `onClose`: Trigger `closeCombatResult`.
- **Notification**: Displays `DungeonNotification` if `notificationMessage` is not null.
  - **Props**:
    - `message`: `notificationMessage`.
    - `onClose`: Trigger `handleCloseNotification`.
- **Treasure Card Modal**: Displays `TreasureCardModal` if `drawnTreasureCard` is not null.
  - **Props**:
    - `isOpen`: true.
    - `card`: `drawnTreasureCard`.
    - `onClose`: Trigger `closeTreasureCardModal`.

- **Inventory Modal**: Displays `DungeonInventoryModal` if `isInventoryOpen` is true.
  - **Props**:
    - `isOpen`: true.
    - `hero`: `currentHero`.
    - `onToggleEquip`: `hooksInventoryLogic.toggleEquipItem`.
    - `onUseItem`: `hooksItemLogic.useItem`.
    - `onClose`: Trigger `closeInventory`.

- **Spell Casting Modal**: Displays `DungeonSpellCastModal` if `isSpellCastModalOpen` is true.
  - **Props**:
    - `isOpen`: true.
    - `hero`: `currentHero`.
    - `allSpells`: `staticSpells`.
    - `onCastSpell`: Trigger `handleCastSpell`.
    - `onClose`: Trigger `closeMagicModal`.

- **Mission Summary**: Displays `DungeonMissionSummary` if `isMissionSummaryOpen` is true.
  - **Props**:
    - `isOpen`: true.
    - `heroes`: `gameSession.heroes`.
    - `allEquipment`: `staticEquipment`.
    - `allItems`: `staticItems`.
    - `onClose`: Trigger `completeMission`.

- **Game Over**: Displays `DungeonGameOver` if `isGameOverOpen` is true.
  - **Props**:
    - `isOpen`: true.
    - `onExit`: Trigger `handleGameOverExit`.

### ⚡ Capabilities

#### internal state

- **Contract**: Declares the transient UI state and hook instances required to orchestrate dungeon gameplay without directly owning persistent session mutations.

- `isMissionInitialized`: Boolean (Tracks if hero placement is done. Default false).
- `isInventoryOpen`: Boolean (Tracks if inventory modal is visible. Default false).
- `isSpellSelectionRequired`: Boolean (Tracks if spell selection is needed. Default false).
- `isSpellCastModalOpen`: Boolean (Tracks if the spell casting modal is visible. Default false).
- `isMissionSummaryOpen`: Boolean (Tracks if the victory summary is visible. Default false).
- `isGameOverOpen`: Boolean (Tracks if the defeat screen is visible. Default false).
- `targetingSpell`: @Spell (The spell currently being targeted, null if none).
- `targetingItem`: @Item (The item currently being targeted, null if none).
- `boardVisibilityMap`: current visibility map derived from `hooksFogOfWar`.
- `drawnTreasureCard`: @TreasureCard (The currently displayed treasure card, null if none).
- `notificationMessage`: String (Current message to display to the user, null if none).
- `hooksFogOfWar`: @useFogOfWar logic for calculating visibility based on hero positions and map data.
- `hooksSessionManager`: @useDungeonSessionManager passing `gameSession`, `onUpdateSession`, `setNotificationMessage`, `hooksFogOfWar`, `staticEquipment`, and `staticItems`.
- `hooksInventoryLogic`: @useInventoryLogic passing `staticEquipment` and `hooksSessionManager`.
- `hooksItemLogic`: @useItemLogic passing `staticItems` and `hooksSessionManager`.
- `hooksCampaignManager`: @useCampaignManager.
- `hooksVisibilityCalc`: @useVisibilityCalc passing `gameSession` and `staticVisibilityMap`.
- `hooksTraps`: @useTraps passing `gameSession`, `boardVisibilityMap`, `areMonstersVisible`, `setNotificationMessage`, `hooksTurnLogic.markActionDone`, `hooksTurnLogic.forceTurnExhausted`, and `hooksSessionManager`. The board-facing trap markers MUST be read through `getTriggeredTraps()`.
- `hooksMagicLogic`: @useMagicLogic passing `gameSession`, `onUpdateSession`, `setNotificationMessage`, `hooksTurnLogic.markActionDone`, `staticSpells`, `hooksCombatLogic`, `hooksMapInteraction`, `hooksFogOfWar`, and `hooksHeroStats`.
- `hooksMapInteraction`: @useMapInteraction passing `gameSession`, `hooksSecretPassages.getFoundPassages().visiblePassages`, and `hooksSessionManager`.
- `hooksHeroStats`: @useHeroStats passing `staticEquipment`.
- `hooksPathfinding`: @usePathfinding passing `gameSession`, `staticVisibilityMap`, and `hooksSecretPassages.getFoundPassages().visiblePassages`.
- `hooksCombatLogic`: @useCombatLogic.
- `hooksTurnLogic`: @useTurnLogic passing `gameSession`, `boardVisibilityMap`, `setNotificationMessage`, `hooksTraps`, `hooksHeroStats`, `hooksPathfinding`, `hooksCombatLogic`, `hooksMapInteraction`, `hooksVisibilityCalc`, and `hooksSessionManager`.
- `missionObjectiveCompleted`: Boolean derived from `hooksTurnLogic.isMissionObjectiveCompleted`.
- `hooksMonsters`: @useDungeonMonsters passing `gameSession`, `boardVisibilityMap`, `onUpdateSession`, `setNotificationMessage`, and `staticMonsters`.
- `hooksMonsterAI`: @useMonsterAI passing `gameSession`, `boardVisibilityMap`, `setNotificationMessage`, `hooksPathfinding`, `hooksCombatLogic`, `hooksHeroStats`, and `hooksSessionManager`.
- `hooksSecretPassages`: @useSecretPassages passing `gameSession`, `boardVisibilityMap`, `setNotificationMessage`, `hooksTurnLogic.markActionDone`, `hooksTurnLogic.forceTurnExhausted`, and `hooksSessionManager`.
- `hooksTreasure`: @useTreasureSearch passing `gameSession`, `boardVisibilityMap`, `setNotificationMessage`, `hooksTurnLogic.markActionDone`, `hooksTurnLogic.forceTurnExhausted`, `hooksSessionManager`, `handleTreasureCardDrawn`, and `handleWanderingMonster`. It exposes `applyTreasureEffect`.
- `areMonstersVisible`: Boolean (Derived: True if any monster in `gameSession.monsters` is on a cell where `boardVisibilityMap.fog` is false).

#### initializeMission

- **Contract**: Initializes hero positions and map vision once the mission starts.
- **Guard**: IF `isMissionInitialized` is true RETURN.
- **Trigger**: On Mount (after `gameSession` is available).
- **Flow**:
  - Call `hooksSessionManager.initializeMission(treasureDeck)`.
    - The boundary MUST also execute mission start scripts (`eventType = 6`) against the initialized snapshot before gameplay begins.
    - SET `isMissionInitialized` to true.

#### confirmHeroOrder

- **Contract**: Before start show a `DungeonHeroOrder`` when user can select the order turn of Heroes
- **Guard**: IF `gameSession.isHeroOrderConfirmed` is true RETURN.
- **Signature**: `(orderedHeroIds: List<Integer>) -> void`
- **Flow**:
  - Call `hooksSessionManager.confirmHeroOrder(orderedHeroIds)`.
  - **Magic Check**:
    - IF any `hero` in `gameSession.heroes` has `hero.hero.classe.toLowerCase()` matching "mago" or "elfo":
      - Set `isSpellSelectionRequired` to true.

#### confirmSpellSelection

- **Contract**: Updates heroes with selected spells and closes the selection modal.
- **Signature**: `(selection: Map<Integer, List<Integer>>)`
- **Flow**:
  - Create a deep copy of `gameSession.heroes` as `updatedHeroes`.
  - For each `hero` in `updatedHeroes`:
    - IF `selection` has a value for key `hero.heroId`:
      - Set `hero.availableSpells` to `selection.get(hero.heroId)`.
  - Set `isSpellSelectionRequired` to false.
  - Trigger `onUpdateSession` with updated `gameSession` containing `updatedHeroes`.

#### closeCombatResult

- **Contract**: Clears the last attack state to close the combat result modal.
- **Trigger**: `onClose` from `CombatResultModal`.
- **Flow**:
  - Call `hooksSessionManager.clearLastAttack()`.

#### handleTreasureCardDrawn

- **Contract**: Sets the drawn treasure card to display the modal.
- **Signature**: `(card: @TreasureCard)`
- **Flow**:
  - Set `drawnTreasureCard` to `card`.

#### closeTreasureCardModal

- **Contract**: Closes the treasure card modal.
- **Flow**:
  - IF `drawnTreasureCard` is NOT null:
    - Call `hooksTreasure.applyTreasureEffect(drawnTreasureCard)`.
  - Set `drawnTreasureCard` to `null`.

#### monitorTurn

- **Contract**: Monitors turn changes to trigger Master Turn automatically.
- **Trigger**: When `gameSession.currentTurn` changes.
- **Flow**:
  - Let `activeHeroes` = heroes where `currentBody` > 0.
  - **Defeat Check**:
    - IF `activeHeroes` length is 0:
      - Set `isGameOverOpen` to true.
      - RETURN.
  - **Victory Check**:
    - Let `escapedHeroes` = heroes where `isEscaped` is true.
    - IF `activeHeroes` length > 0 AND `activeHeroes` length EQUALS `escapedHeroes` length:
      - IF `missionObjectiveCompleted` is true:
        - Set `isMissionSummaryOpen` to true.
      - ELSE:
        - Trigger `leaveDungeonAfterRetreat()` so the party retreats without unlocking the next mission.
      - RETURN.
  - IF `gameSession.currentTurn` > `gameSession.heroes.length`:
    - Trigger `hooksMonsterAI.runMonsterTurn()`.

#### leaveDungeonAfterRetreat

- **Contract**: Persists hero progress after a voluntary retreat without advancing the campaign unlock index.
- **Flow**:
  - Execute mission end scripts (`eventType = 7`) against the current session using retreat context.
  - Let `missionEndSession` = the returned script session when handled, otherwise `gameSession`.
  - Load the existing campaign save, when available.
  - Preserve the highest unlocked mission index already saved.
  - Trigger `hooksCampaignManager.saveCampaign(missionEndSession.heroes, preservedMissionIndex)`.
  - Navigate back to @PageNavigationEnum.PLAY_GAME.

#### completeMission

- **Contract**: Saves progress and returns to mission selection.
- **Flow**:
  - Execute mission end scripts (`eventType = 7`) against the current session using victory context.
  - Let `missionEndSession` = the returned script session when handled, otherwise `gameSession`.
  - Load the existing campaign save, when available.
  - Let `nextMissionIndex` = the greater of the already unlocked mission index and `missionEndSession.currentMissionIndex + 1`.
  - Call `hooksCampaignManager.saveCampaign(missionEndSession.heroes, nextMissionIndex)`.
  - Set `isMissionSummaryOpen` to false.
  - onChangePageView to @PageNavigationEnum.PLAY_GAME.

#### handleGameOverExit

- **Contract**: Handles exit after defeat.
- **Flow**:
  - Set `isGameOverOpen` to false.
  - onChangePageView to @PageNavigationEnum.MAIN_MENU.

#### handleWanderingMonster

- **Contract**: Orchestrates the wandering monster appearance and immediate attack.
- **Signature**: `(x: Integer, y: Integer)`
- **Flow**:
  - Let `newMonster` = `hooksMonsters.spawnWanderingMonster(x, y)`.
  - IF `newMonster` is NOT null:
    - Find `hero` in `gameSession.heroes` at `x, y`.
    - Call `hooksMonsterAI.performInstantAttack(newMonster, hero)`.

#### openMagicModal

- **Contract**: Opens the spell casting modal.
- **Flow**:
  - Set `isSpellCastModalOpen` to true.

#### closeMagicModal

- **Contract**: Closes the spell casting modal.
- **Flow**:
  - Set `isSpellCastModalOpen` to false.

#### handleUseItem

- **Contract**: Handles the logic of using an item, checking if it requires targeting.
- **Signature**: `(heroId: Integer, itemId: Integer)`
- **Flow**:
  - Find `item` in `staticItems` matching `itemId`.
  - IF `item.targetType` EQUALS "Monster":
    - Set `targetingItem` to `item`.
    - Set `isInventoryOpen` to false.
    - Set `notificationMessage` to "Seleziona un mostro bersaglio per " + `item.nome`.
  - ELSE:
    - Call `hooksItemLogic.useItem(heroId, itemId, gameSession, null)`.

#### handleCastSpell

- **Contract**: Determines if a spell requires targeting or can be cast immediately.
- **Signature**: `(spellId: Integer)`
- **Flow**:
  - Find `spell` in `staticSpells` matching `spellId`.
  - IF `spell.targetType` EQUALS "Self":
    - Find `currentHero` in `gameSession.heroes`.
    - Call `hooksMagicLogic.castSpell(spellId, currentHero.heroId, null, null, null)`.
    - Set `isSpellCastModalOpen` to false.
  - ELSE:
    - Set `targetingSpell` to `spell`.
    - Set `isSpellCastModalOpen` to false.
    - IF `spell.effetto` EQUALS "Genio":
      - Set `notificationMessage` to "Il Genio attende: Clicca su un mostro per attaccare (5 dadi) o su una porta per aprirla.".
    - ELSE:
      - Set `notificationMessage` to "Seleziona un bersaglio per " + `spell.nome` + " (Clicca sulla mappa o su un mostro)".

#### handleBoardClick

- **Contract**: Intercepts map clicks for spell targeting or movement.
- **Signature**: `(x: Integer, y: Integer)`
- **Flow**:
  - IF `targetingSpell` is NOT null:
    - Find `currentHero` in `gameSession.heroes`.
    - IF `targetingSpell.Message` to `null`.
    - ELSE IF `targetingSpell.targetType` EQUALS "Hero":
      - Find `hero` in `gameSession.heroes` at coordinates `x, y`.
      - IF `hero` is found:
        - Call `hooksMagicLogic.castSpell(targetingSpell.id, hero.heroId, null, x, y)`.
        - Set `targetingSpell` to `null`.
        - Set `notificationMessage` to `null`.
      - ELSE:
        - Set `notificationMessage` to "Devi selezionare un Eroe come bersaglio!".
    - ELSE:
      - Set `notificationMessage` to "Bersaglio non valido per questo incantesimo!".
  - ELSE:
    - Call `hooksTurnLogic.handleBoardClick(x, y)`.

#### handleMonsterClick

- **Contract**: Intercepts monster clicks for spell targeting or physical attack.
- **Signature**: `(monsterId: Integer)`
- **Flow**:
  - IF `targetingItem` is NOT null:
    - Find `currentHero` in `gameSession.heroes`.
    - Call `hooksItemLogic.useItem(currentHero.heroId, targetingItem.id, gameSession, monsterId)`.
    - Set `targetingItem` to `null`.
    - Set `notificationMessage` to `null`.
    - RETURN.
  - IF `targetingSpell` is NOT null:
    - Find `currentHero` in `gameSession.heroes`.
    - Find `monster` in `gameSession.monsters` by `monsterId`.
    - IF `targetingSpell.targetType` EQUALS "Monster" OR `targetingSpell.effetto` EQUALS "Genio":
      - Call `hooksMagicLogic.castSpell(targetingSpell.id, null, monsterId, null, null)`.
      - Set `targetingSpell` to `null`.otificationMessage` to "Questo incantesimo non può essere lanciato su un mostro!".
  - ELSE:
    - Call `hooksTurnLogic.handleMonsterClick(monsterId)`.

#### cancelTargeting

- **Contract**: Aborts the spell targeting mode.
- **Flow**:
  - Set `targetingSpell` to `null`.
  - Set `notificationMessage` to "Lancio incantesimo annullato.".

#### openInventory

- **Contract**: Opens the inventory modal.
- **Flow**:
  - Set `isInventoryOpen` to true.

#### closeInventory

- **Contract**: Closes the inventory modal.
- **Flow**:
  - Set `isInventoryOpen` to false.
