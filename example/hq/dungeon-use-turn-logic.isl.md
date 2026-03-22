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
> **Reference**: @useTraps in `./dungeon-use-traps.isl.md`

## Component: useTurnLogic

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession (Current session state).
- `visibilityMap`: @VisibilityMap (The static board configuration).
- `onUpdateSession`: (session: @GameSession) -> void (Callback to update session).
- `onNotify`: (message: String) -> void (Callback to show notification).
- `trapsLogic`: @useTraps (Hook instance for trap management).

### ⚡ Capabilities

#### internalState

- `turnPhase`: @TurnPhase (Current phase of the turn).
- `movementPoints`: Integer (Remaining movement steps) Default: null.
- `hoveredPath`: List of {x, y} (The valid path to the hovered cell, empty if invalid).
- `canAttack`: Boolean (True if there is at least one visible monster in attack range).
- `isMoving`: Boolean (True if hero is currently animating movement).
- `isMovingStarted`: Boolean (True if hero has started moving).
- `combatLogic`: `useCombatLogic` (Hook instance to access `resolveCombat`).
- `activePath`: List of {x, y} (The path currently being traversed).
- `hooksPathfinding`: `usePathfinding` (Hook instance to access pathfinding functions).

#### updateCanAttack

- **Contract**: Updates the `canAttack` state based on visible monsters in attack range.
- **Trigger**: When `@Game` changes or hero position changes.
- **Flow**:
  - Initialize `canAttack` to false.
  - Iterate through @GameSession.monsters:
    - IF `turnPhase.hasPerformedAction` is true return false
    - IF monster is within attack range of current hero position (e.g., Manhattan distance <= 1):
      - Set `canAttack` to true.
      - BREAK loops.
  - Update internal state with new value of `canAttack`.

#### rollMovement

- **Contract**: Rolls 2d6 to determine movement points.
- **Trigger**: User clicks "Roll Movement".
- **Flow**:
  - Generate random number 2-12 (2d6).
  - Set `movementPoints`.

#### handleBoardHover

- **Contract**: Calculates path preview when mouse hovers a cell.
- **Signature**: `(x: Integer, y: Integer)`
- **Flow**:
  - IF `movementPoints` is null OR `movementPoints` <= 0 OR `isMoving` is true:
    - Set `hoveredPath` to empty.
    - RETURN.
  - Find current hero in `gameSession.heroes` where `turnOrder` == `gameSession.currentTurn`.
  - Call `hooksPathfinding.calculatePath(hero.x, hero.y, x, y, movementPoints, hero.heroId)` and store result in `path`.
  - IF `path` is not empty:
    - Prepend `{x: hero.x, y: hero.y}` to `path` (to include start).
    - Set `hoveredPath` to `path`.
  - ELSE: Set `hoveredPath` to empty.

#### handleBoardClick

- **Contract**: Executes movement along the calculated path.
- **Signature**: `(x: Integer, y: Integer)`
- **Flow**:
  - IF `isMoving` is true OR `movementPoints` <= 0 RETURN.
  - Set `isMovingStarted` to true.
  - Find `currentHero` in `gameSession.heroes`.
  - Initialize `path` with `hoveredPath`.
  - **Robustness Check**: IF `path` is empty OR last point of `path` is NOT (x, y):
    - Calculate path from `currentHero` to (x, y) using `hooksPathfinding`.
    - IF calculated path is valid (length > 0):
      - Set `path` to [`currentHero` position, ...calculated path].
  - IF `path` length > 1 AND last point of `path` is (x, y):
    - Set `isMoving` to true.
    - Set `activePath` to a copy of `path`.
    - Set `hoveredPath` to empty.

#### movementEffect

- **Contract**: Handles the step-by-step movement animation and logic.
- **Trigger**: `activePath` changes.
- **Flow**:
  - IF `activePath` length < 2 Finished moving to destination:
    - IF `isMoving` is true:
      - Set `isMoving` to false.
      - Set `activePath` to empty.
    - IF `movementPoints` <= 0 No movement left, mark action as done:
      - Set `turnPhase.hasMoved` to true.
    - RETURN.
  - Wait 300ms.
  - Get next step `nextPos` = `activePath[1]`.
  - Update hero position to `nextPos`.
  - Decrement `movementPoints` by 1.
  - Trigger `onUpdateSession`.
  - **Trap Check**:
    - Find `mapCell` at `nextPos` in grid.
    - IF `mapCell.trpl` exists AND `trapsLogic.checkTrapActivation(mapCell.trpl, nextPos.x, nextPos.y)` is true:
      - Initialize `jumpSuccess` to false.
      - **Try Abyss Jump Check**:
        - IF `mapCell.trpl.tipo` == 1 AND `trapsLogic.isTrapVisible(nextPos.x, nextPos.y)` is true:
          - Trigger `onNotify("Tenti di saltare l'abisso...")`.
          - Generate random number `roll` between 1 and 6.
          - IF `roll` > 1:
            - Set `jumpSuccess` to true.
            - Trigger `onNotify("Salto riuscito! L'eroe supera l'abisso.")`.
      - IF `jumpSuccess` is false:
        - **Trigger Trap**:
          - Apply Danni: `currentHero.currentBody -= 1` (or specific value based on type).
          - Register Trigger: `trapsLogic.registerTriggeredTrap(nextPos.x, nextPos.y, mapCell.trpl.tipo)`.
          - IF `mapCell.trpl.tipo` == 3 (Roccia che cade):
            - Find cell in `gameSession.currentMap.grid` at coordinates (`mapCell.trpl.rccadex`, `mapCell.trpl.rccadey`).
            - Set `arnt.antroc` to true for that cell (permanently blocks the path).
          - SWITCH `mapCell.trpl.tipo`:
            - CASE 1: Trigger `onNotify("Cadi in un abisso! Subisci 1 danno e il tuo turno finisce.")`.
            - CASE 2: Trigger `onNotify("Le lance scattano dal pavimento! Subisci 1 danno e il tuo turno finisce.")`.
            - CASE 3: Trigger `onNotify("Una roccia cade dal soffitto! Subisci 1 danno e il tuo turno finisce.")`.
            - DEFAULT: Trigger `onNotify("TRAPPOLA! Hai interrotto il movimento.")`.
          - Set `isMoving` to false.
          - **End Turn Activity**:
            - Set `turnPhase.hasMoved` to true.
            - Set `turnPhase.hasPerformedAction` to true.
          - Trigger `onUpdateSession`.
          - End Movement: Set `activePath` to empty list.
          - RETURN.
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
    - Set `turnPhase.hasPerformedAction` as true.
    - IF the Hero has started to move before attack set `turnPhase.hasMoved` as true.
    - Set `lastAttack` on session to {hero:@HeroState,monster:@MonsterState,combatResult: @CombatResult} for potential UI display.
    - Trigger `onUpdateSession`.

#### markActionDone

- **Contract**: Manually marks the turn action as completed (e.g., after searching).
- **Signature**: `()`
- **Flow**:
  - Set `turnPhase.hasPerformedAction` true.
  - if `isMovingStarted` is true set `turnPhase.hasMoved` as true.

#### endTurn

- **Contract**: Passes turn to the next hero.
- **Trigger**: User clicks "End Turn".
- **Flow**:
  - IF `isMoving` is true RETURN.
  - Increment `gameSession.currentTurn`.
  - IF `currentTurn` > number of heroes, reset to 1 (and potentially trigger Monster turn in future).
  - Reset all the prop in the object `turnPhase` (@TurnPhase) to false.
  - Reset `movementPoints` to null.
  - Set `isMovingStarted` to false.
  - Trigger `onUpdateSession`.

- **Return**: `{ turnPhase, movementPoints, hoveredPath, isMoving,  rollMovement, handleBoardHover, handleBoardClick, handleMonsterClick, markActionDone, endTurn }`
