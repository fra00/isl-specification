# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-turn-controls

---

> **Reference**: @HeroState, @TurnPhase in `./domain-session.isl.md`

## Domain Concepts

- `currentHeroStats`: Effective hero stats already resolved by business logic, including equipment bonuses and temporary effects such as `RockSkin` and `Courage`.
- `activeEffects`: The list of current hero status effects from `currentHero.activeStatus`, used to surface temporary spell effects such as `WallPass`, `FoggyMist`, `RockSkin`, and `Courage`.

## Component: DungeonTurnControls

### Role: Presentation

**Signature**:

- `currentHero`: @HeroState (The hero currently taking their turn).
- `currentHeroStats`: { attacco: Integer, difesa: Integer, movimento: Integer, mente: Integer, corpo: Integer, canAttackDiagonal: Boolean, canAttackRanged: Boolean, canDisarmTraps: Boolean, hasDoubleAttack: Boolean } | null (Precomputed effective hero stats, including equipment and temporary status effects).
- `movementPoints`: Integer (Current movement points available).
- `turnPhase`: @TurnPhase (info about the current activity of the turn).
- `canOpenDoor`: Boolean (Whether an adjacent door can be opened).
- `isTargeting`: Boolean (Whether a spell targeting mode is active).
- `isMoving`: Boolean (Whether the hero is currently animating movement).
- `onRollMovement`: () -> void (Callback to roll for movement).
- `onEndTurn`: () -> void (Callback to end the turn).
- `onSearchPassages`: () -> void (Callback to search for secret passages).
- `onSearchTreasure`: () -> void (Callback to search for treasure).
- `onSearchTraps`: () -> void (Callback to search for traps).
- `onOpenMagic`: () -> void (Callback to open magic selection).
- `onOpenInventory`: () -> void (Callback to open inventory modal).
- `onCancelTargeting`: () -> void (Callback to cancel spell targeting).

### 🔍 Appearance

- **Type**: Draggable Floating Dialog.
- **Position**: Fixed.
- **Styling**: Dark theme (`bg-gray-800`), white text, rounded corners, shadow-xl.
- **Width**: 250px.
- **Cursor**: `grab` on header, `grabbing` while dragging.

### 📦 Content

- **Header**:
  - Text: "Turn Controls".
  - Behavior: Acts as the drag handle.
- **Info Section**:
  - Display `currentHero.hero.classe` (or "Unknown" if null).
  - Display `movementPoints`.
  - Display Gold.
  - Display Health.
  - Display Intelligence.
  - Display Attack using `currentHeroStats.attacco` when available; otherwise fall back to the base hero value.
  - Display Defense using `currentHeroStats.difesa` when available; otherwise fall back to the base hero value.
  - Display the active temporary effects from `currentHero.activeStatus`, if any, so movement-related spells remain visible when the affected hero starts the turn.
- **Inventary Section**
  - **Inventory button**
    - Style: Blue primary button.
    - OnClick: Trigger `onOpenInventory`.
- **Action Buttons**:
  - **Roll Movement**:
    - Disabled IF `turnPhase.HasMoved` is true OR `movementPoints` is NOT null.
    - Style: Blue primary button.
    - OnClick: Trigger `onRollMovement`.
  - **Search Passages**:
    - Disabled IF `turnPhase.HasPerformedAction` is true.
    - Style: Yellow/Orange button.
    - OnClick: Trigger `onSearchPassages`.
  - **Search Treasure**:
    - Disabled IF `turnPhase.HasPerformedAction` is true.
    - Style: Yellow/Orange button.
    - OnClick: Trigger `onSearchTreasure`.
  - **Search Trap**:
    - Disabled IF `turnPhase.HasPerformedAction` is true.
    - Style: Yellow/Orange button.
    - OnClick: Trigger `onSearchTraps`.
  - **Magic**:
    - Visible IF `currentHero.hero.classe.toLowerCase()` IN ["mago", "elfo"].
    - Disabled IF `turnPhase.HasPerformedAction` is true OR `isMoving` is true OR `isTargeting` is true.
    - Style: Purple/Indigo button.
    - OnClick: Trigger `onOpenMagic`.
  - **Cancel Targeting**:
    - Visible IF `isTargeting` is true.
    - Style: Gray/Neutral secondary button.
    - OnClick: Trigger `onCancelTargeting`.
  - **Open Door**:
    - Visible IF `canOpenDoor` is NOT null AND `canOpenDoor.found` is true.
    - Style: Green success button.
    - OnClick: Trigger `onOpenDoor`.
  - **End Turn**:
    - Style: Red danger button.
    - OnClick: Trigger `onEndTurn`.

### ⚡ Capabilities

#### internalState

- **Contract**: Stores the floating panel position used by the drag interaction lifecycle.
- `position`: {x: Integer, y: Integer} (Tracks the top-left coordinates of the dialog).

#### initialize

- **Contract**: Loads the last known position from storage on mount.
- **Flow**:
  - Read string from LocalStorage key "dungeonTurnControlsPosition".
  - IF valid JSON, parse into `position`.
  - ELSE set `position` to default `{ x: 20, y: 20 }`.

#### handleDragInteraction

- **Contract**: Manages the drag-and-drop lifecycle.
- **Flow**:
  - **On Mouse Down** (Header):
    - Set internal dragging flag to true.
    - Calculate offset between mouse pointer and dialog top-left.
    - Add global event listeners for `mousemove` and `mouseup`.
  - **On Mouse Move** (Window):
    - IF dragging:
      - Calculate new `position` = mouse coordinates - offset.
      - Update `position` state.
  - **On Mouse Up** (Window):
    - Set internal dragging flag to false.
    - Remove global event listeners.
    - Save current `position` to LocalStorage key "dungeonTurnControlsPosition".

- **On Unmount**: Remove all global event listeners for `mousemove` and `mouseup`.
