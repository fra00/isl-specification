# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-turn-logic

---

> **Reference**: @GameSession, @TurnPhase in `./domain-session.isl.md`
> **Reference**: @MapDefinition in `./domain-map.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @usePathfinding in `./dungeon-use-pathfinding.isl.md`
> **Reference**: @useCombatLogic in `./dungeon-use-combat.isl.md`

## Component: useTurnLogic

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession (Current session state).
- `visibilityMap`: @VisibilityMap (The static board configuration).
- `onUpdateSession`: (session: @GameSession) -> void (Callback to update session).

### ⚡ Capabilities

#### internalState

- `turnPhase`: @TurnPhase (Current phase of the turn).
- `movementPoints`: Integer (Remaining movement steps).
- `hasActed`: Boolean (True if action performed).
- `hoveredPath`: List of {x, y} (The valid path to the hovered cell, empty if invalid).
- `canAttack`: Boolean (True if there is at least one visible monster in attack range).
- `isMoving`: Boolean (True if hero is currently animating movement).
- `combatLogic`: `useCombatLogic` (Hook instance to access `resolveCombat`).
- `activePath`: List of {x, y} (The path currently being traversed).
- `hooksPathfinding`: `usePathfinding` (Hook instance to access pathfinding functions).

#### updateCanAttack

- **Contract**: Updates the `canAttack` state based on visible monsters in attack range.
- **Trigger**: When `@Game` changes or hero position changes.
- **Flow**:
  - Initialize `canAttack` to false.
  - Iterate through @GameSession.monsters:
    - IF hasActed is false
    - IF monster is within attack range of current hero position (e.g., Manhattan distance <= 1):
      - Set `canAttack` to true.
      - BREAK loops.
  - Update internal state with new value of `canAttack`.

#### rollMovement

- **Contract**: Rolls 2d6 to determine movement points.
- **Trigger**: User clicks "Roll Movement".
- **Flow**:
  - IF `turnPhase` is NOT `START` RETURN.
  - Generate random number 2-12 (2d6).
  - Set `movementPoints`.
  - Set `turnPhase` to `MOVEMENT`.

#### handleBoardHover

- **Contract**: Calculates path preview when mouse hovers a cell.
- **Signature**: `(x: Integer, y: Integer)`
- **Flow**:
  - IF `turnPhase` is NOT `MOVEMENT` OR `movementPoints` <= 0 OR `isMoving` is true:
    - Set `hoveredPath` to empty.
    - RETURN.
  - `hooksPathfinding.pathfind` from Current Hero Position to (x, y).
  - IF path found:
    - Prepend Current Hero Position to the path (to include start).
    - Set `hoveredPath` to the calculated path.
  - ELSE: Set `hoveredPath` to empty.

#### handleBoardClick

- **Contract**: Executes movement along the calculated path.
- **Signature**: `(x: Integer, y: Integer)`
- **Flow**:
  - IF `hoveredPath` is valid AND ends at (x, y) AND `isMoving` is false:
    - Set `isMoving` to true.
    - Set `activePath` to `hoveredPath`.
    - Reset `hoveredPath`.

#### movementEffect

- **Contract**: Handles the step-by-step movement animation and logic.
- **Trigger**: `activePath` changes.
- **Flow**:
  - IF `activePath` is empty OR length < 2:
    - Set `isMoving` to false.
    - Set `activePath` to empty.
    - RETURN.
  - Wait 300ms.
  - Get next step `nextPos` = `activePath[1]`.
  - Update hero position to `nextPos`.
  - Decrement `movementPoints` by 1.
  - Trigger `onUpdateSession`.
  - Set `activePath` to `activePath` starting from index 1.

#### handleMonsterClick

- **Contract**: Executes attack action on clicked monster if in range.
- **Signature**: `(monsterId: Integer)`
- **Flow**:
  - Find monster in `@GameSession.monsters` by `monsterId`.
  - Find current hero in `@GameSession.heroes` where `turnOrder` == `@GameSession.currentTurn`.
  - IF monster is found AND hero is found AND `canAttack` is true AND `isMoving` is false:
    - Call `combatLogic.resolveCombat(hero, monster)` to get `combatResult`.
    - Calculate `newBody` = `monster.currentBody` - `combatResult.damageDealt`.
    - Update monster's `currentBody` to `newBody`.
    - IF `newBody` <= 0:
      - Remove monster from `@GameSession.monsters`.
        ELSE IF `newBody` > 0:
      - Update monster's state in `@GameSession.monsters` with new `currentBody`.
    - Set `hasActed` to true.
    - Set `lastAttack` on session to {hero:@HeroState,monster:@MonsterState,combatResult: @CombatResult} for potential UI display.
    - Trigger `onUpdateSession`.

#### endTurn

- **Contract**: Passes turn to the next hero.
- **Trigger**: User clicks "End Turn".
- **Flow**:
  - IF `isMoving` is true RETURN.
  - Increment `gameSession.currentTurn`.
  - IF `currentTurn` > number of heroes, reset to 1 (and potentially trigger Monster turn in future).
  - Reset `turnPhase` to `START`.
  - Reset `movementPoints` to 0.
  - Reset `hasActed` to false.
  - Trigger `onUpdateSession`.

- **Return**: `{ turnPhase, movementPoints, hoveredPath, isMoving, rollMovement, handleBoardHover, handleBoardClick, endTurn }`
