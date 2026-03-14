# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-turn-controls

---

> **Reference**: @HeroState, @TurnPhase in `./domain-session.isl.md`

## Component: DungeonTurnControls

### Role: Presentation

**Signature**:

- `currentHero`: @HeroState (The hero currently taking their turn).
- `movementPoints`: Integer (Current movement points available).
- `turnPhase`: @TurnPhase (info about the current activity of the turn).
- `isMoving`: Boolean (Whether the hero is currently animating movement).
- `onRollMovement`: () -> void (Callback to roll for movement).
- `onEndTurn`: () -> void (Callback to end the turn).
- `onSearchPassages`: () -> void (Callback to search for secret passages).
- `onSearchTreasure`: () -> void (Callback to search for treasure).
- `onOpenInventory`: () -> void (Callback to open inventory modal).

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
  - Display Attack.
  - Display Defense.
- **Inventary Section**
  - **Inventory button**
    - Style: Blue primary button.
    - OnClick: Trigger `onOpenInventory`.
- **Action Buttons**:
  - **Roll Movement**:
    - Diabled IF `turnPhase.hasMoved` is true.
    - Style: Blue primary button.
    - OnClick: Trigger `onRollMovement`.
  - **Search Passages**:
    - Disabled IF `turnPhase.hasPerformedAction` is true.
    - Style: Yellow/Orange button.
    - OnClick: Trigger `onSearchPassages`.
  - **Search Treasure**:
    - Disabled IF `turnPhase.hasPerformedAction` is true.
    - Style: Yellow/Orange button.
    - OnClick: Trigger `onSearchTreasure`.
  - **Search Trap**:
    - Disabled IF `turnPhase.hasPerformedAction` is true.
    - Style: Yellow/Orange button.
  - **End Turn**:
    - Style: Red danger button.
    - OnClick: Trigger `onEndTurn`.

### ⚡ Capabilities

#### internalState

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
