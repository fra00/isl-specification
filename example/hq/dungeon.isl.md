# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./dungeon

---

> **Reference**: @PageNavigationEnum in `./domain-core.isl.md`
> **Reference**: @GameSession, @TurnPhase in `./domain-session.isl.md`
> **Reference**: @MapDefinition, @VisibilityMap, @Campaign in `./domain-map.isl.md`
> **Reference**: @DungeonBoard in `./dungeon-board.isl.md`
> **Reference**: @DungeonHeroOrder in `./dungeon-hero-order.isl.md`
> **Reference**: @useTurnLogic in `./dungeon-use-turn-logic.isl.md`
> **Reference**: @useFogOfWar in `./dungeon-use-fog-of-war.isl.md`
> **Reference**: @useDungeonMonsters in `./dungeon-use-monsters.isl.md`
> **Reference**: @CombatResultModal in `./dungeon-combat-result-modal.isl.md`
> **Reference**: @DungeonTurnControls in `./dungeon-turn-controls.isl.md`
> **Reference**: @useSecretPassages in `./dungeon-use-secret-passages.isl.md`
> **Reference**: @useTreasureSearch in `./dungeon-use-treasure.isl.md`
> **Reference**: @DungeonNotification in `./dungeon-notification.isl.md`
> **Reference**: @TreasureCard in `./domain-ruleset.isl.md`
> **Reference**: @TreasureCardModal in `./dungeon-treasure-card-modal.isl.md`
> **Reference**: @DungeonInventoryModal in `./dungeon-inventory-modal.isl.md`

## Component: Dungeon

### Role: Presentation

**Signature**:

- `gameSession`: @GameSession (Current session state).
- `onChangePageView`: (nextPage: @PageNavigationEnum) -> void (Callback to navigate).
- `onUpdateSession`: (session: @GameSession) -> void (Callback to update session).

### 🔍 Appearance

- **Layout**: 100% of the screen container.

### 📦 Content

- **Dungeon Board**: Displays `DungeonBoard` with props.
- **Loading State**: Displays "Loading Mission..." while fetching map data.
- **Turn Controls**:
  - Displays `@DungeonTurnControls` IF `gameSession.isHeroOrderConfirmed` is true.
  - **Props**:
    - `currentHero`: derived from `gameSession.heroes` and `gameSession.currentTurn`.
    - `movementPoints`: `hooksTurnLogic.movementPoints`.
    - `turnPhase`: `hooksTurnLogic.turnPhase`.
    - `isMoving`: `hooksTurnLogic.isMoving`.
    - `onRollMovement`: `hooksTurnLogic.rollMovement`.
    - `onEndTurn`: `hooksTurnLogic.endTurn`.
    - `onSearchPassages`: `hooksSecretPassages.searchPassages`.
    - `onSearchTreasure`: `hooksTreasure.searchTreasure`.
    - `onOpenInventory`: Trigger `openInventory`.
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
    - `onClose`: Trigger `closeInventory`.

### ⚡ Capabilities

#### internal state

- `isMissionLoading`: Boolean (Tracks if mission data is being fetched. Default null).
- `isStaticDataLoaded`: Boolean (Tracks if static data like visibility map is loaded. Default false).
- `isInventoryOpen`: Boolean (Tracks if inventory modal is visible. Default false).
- `staticVisibilityMap`: @VisibilityMap (The static visibility map loaded from the mission data, used as reference for calculations).
- `boardVisibilityMap`: current visibility map derived from `hooksFogOfWar`.
- `isMissionLoading`: Boolean (Tracks if mission data is being fetched. Default true).
- `drawnTreasureCard`: @TreasureCard (The currently displayed treasure card, null if none).
- `notificationMessage`: String (Current message to display to the user, null if none).
- `hooksFogOfWar`: @useFogOfWar logic for calculating visibility based on hero positions and map data.
- `hooksTurnLogic`:@useTurnLogic Manages turn phases, movement points, and pathfinding logic.
- `hooksMonsters`: @useDungeonMonsters passing `gameSession`, `boardVisibilityMap`, and `onUpdateSession`.
- `hooksSecretPassages`: @useSecretPassages passing `gameSession`, `boardVisibilityMap`, `setNotificationMessage`, and `hooksTurnLogic.markActionDone`.
- `hooksTreasure`: @useTreasureSearch passing `gameSession`, `boardVisibilityMap`, `setNotificationMessage`, `hooksTurnLogic.markActionDone`, `onUpdateSession`, and `handleTreasureCardDrawn`. It exposes `applyTreasureEffect`.
- `areMonstersVisible`: Boolean (Derived: True if any monster in `gameSession.monsters` is on a cell where `boardVisibilityMap.fog` is false).

#### fetchHqData

- **Contract**: Fetches static data for the HQ.
- **Trigger**: On Mount.
- **Flow**:
- Set `isMissionLoading` to true.
- Fetch board data from `/jsonData/tabellone/default.json`.
- IF response is not OK, throw Error "Failed to load default.json: File not found" and set `isMissionLoading` to false.
- Parse response into `@VisibilityMap` and store in `staticVisibilityMap`.
- Fetch treasure cards from `/jsonData/treasure-card.json`.
- IF response is not OK, throw Error "Failed to load treasure-card.json" and set `isMissionLoading` to false.
- Parse treasure cards, shuffle them to create `treasureDeck`.
- Set `gameSession.treasureDeck` to the shuffled `treasureDeck`.
- Set `isMissionLoading` to false.
- Set `isStaticDataLoaded` to true.

#### loadMissionData

- **Contract**: Ensures mission map data is loaded.
- **Trigger**: On `isStaticDataLoaded` changed and is true.
- **Flow**:
  - IF `gameSession.currentMap` is missing, throw Error "No mission loaded".
  - Set `loadedMap` to `gameSession.currentMap`.
  - **Update Hero Positions**:
    - For each hero in `gameSession.heroes`, find matching start position in `gameSession.currentMap.eroi_start` (matching `id`).
    - IF found, update hero's `x` and `y` coordinates.
    - Trigger `onUpdateSession` with the updated session containing new hero positions, `loadedMap`, and `treasureDeck`.
  - Set `isMissionLoading` to false.

#### order turn selection

- **Contract**: Before start show a `DungeonHeroOrder`` when user can select the order turn of Heroes
- **Trigger**: after loaded
- **Flow**:
  - Show `DungeonHeroOrder` modal if `gameSession.isHeroOrderConfirmed` is false.
  - onConfirmOrder, update `gameSession.heroes` with correct `turnOrder` AND set `gameSession.isHeroOrderConfirmed` to true.
  - Trigger `onUpdateSession`.

#### closeCombatResult

- **Contract**: Clears the last attack state to close the combat result modal.
- **Trigger**: `onClose` from `CombatResultModal`.
- **Flow**:
  - Create updated `gameSession` with `lastAttack` set to `null`.
  - Trigger `onUpdateSession`.

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

#### openInventory

- **Contract**: Opens the inventory modal.
- **Flow**:
  - Set `isInventoryOpen` to true.

#### closeInventory

- **Contract**: Closes the inventory modal.
- **Flow**:
  - Set `isInventoryOpen` to false.
