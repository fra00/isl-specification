# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-traps

---

> **Reference**: @MapCellTrap in `./domain-map.isl.md`
> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @useVisibilityCalc in `./dungeon-use-visibility-calc.isl.md`

## Component: useTraps

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession
- `visibilityMap`: @VisibilityMap
- `areMonstersVisible`: Boolean
- `onNotify`: (message: String) -> void
- `onActionDone`: () -> void

### ⚡ Capabilities

#### internalState

- `triggeredTraps`: List of {x: Integer, y: Integer, tipo: Integer, status: String} (Stores traps. Status: 'DETECTED', 'TRIGGERED', 'DISARMED').
- `visibilityCalc`: @useVisibilityCalc (Hook instance for visibility calculations).

#### checkTrapActivation

- **Contract**: Determines if a trap at given coordinates should trigger.
- **Signature**: `(trap: @MapCellTrap, x: Integer, y: Integer) -> Boolean`
- **Flow**:
  - IF `trap.tipo` == 1 (Abisso): RETURN true (Always active).
  - IF `trap.tipo` IN [2, 3]:
    - Check if `{x, y}` is already in `triggeredTraps`.
    - IF found:
      - IF `found.status` == 'TRIGGERED' OR `found.status` == 'DISARMED': RETURN false (Trap spent/inactive).
      - IF `found.status` == 'DETECTED': RETURN true (Trap visible but active).
    - RETURN true (Trap is active).
  - RETURN false.

#### isTrapVisible

- **Contract**: Checks if a trap at specific coordinates is already revealed/triggered .
- **Signature**: `(x: Integer, y: Integer) -> Boolean`
- **Flow**:
  - Check if `{x, y}` is already in `triggeredTraps`.
  - Return true if found, false otherwise.

#### registerTriggeredTrap

- **Contract**: Adds a trap to the triggered list.
- **Signature**: `(x: Integer, y: Integer, tipo: Integer)`
- **Flow**:
  - Check if `{x, y}` is in `triggeredTraps`.
  - IF found:
    - Set `found.status` to 'TRIGGERED'.
  - ELSE:
    - Add `{x, y, tipo, status: 'TRIGGERED'}` to `triggeredTraps`.

#### attemptDisarmTrap

- **Contract**: Attempts to disarm a known trap.
- **Signature**: `(x: Integer, y: Integer, canDisarm: Boolean, onFail: () -> void)`
- **Flow**:
  - Find trap at `{x, y}` in `triggeredTraps`.
  - IF NOT found OR `trap.status` != 'DETECTED':
    - Trigger `onNotify("Non c'è una trappola disarmabile qui.")`.
    - Trigger `onActionDone()`.
    - RETURN.
  - IF `canDisarm` is false:
    - Trigger `onNotify("Non hai gli strumenti per disarmare questa trappola.")`.
    - Trigger `onActionDone()`.
    - RETURN.
  - Generate random number `roll` between 1 and 6.
  - IF `roll` < 6:
    - Set `trap.status` to 'DISARMED'.
    - Trigger `onNotify("Trappola disarmata con successo!")`.
  - ELSE:
    - Set `trap.status` to 'TRIGGERED'.
    - Trigger `onNotify("Hai fatto scattare la trappola!")`.
    - Trigger `onFail()`.
  - Trigger `onActionDone()`.

#### getTriggeredTraps

- **Contract**: Returns the list of triggered traps for rendering.
- **Return**: `triggeredTraps`.

#### searchTraps

- **Contract**: Scans the visible area for hidden traps.
- **Trigger**: User clicks "Search Traps".
- **Flow**:
  - IF `areMonstersVisible` is true:
    - Trigger `onNotify("Non puoi cercare trappole con mostri vicini!")`.
    - RETURN.
  - Find current hero in `gameSession.heroes` (turnOrder == currentTurn).
  - Call `visibilityCalc.calculateVisibleCells(hero.x, hero.y)` to get `visibleCells`.
  - Initialize `trapsFound` as false.
  - FOR each `cell` in `visibleCells`:
    - Find corresponding `mapCell` in `gameSession.currentMap.grid` at `cell.x`, `cell.y`.
    - IF `mapCell` exists AND `mapCell.trpl` exists and `map.Cell.trpl.tipo` > 0:
      - Check if `{cell.x, cell.y}` is NOT in `triggeredTraps`:
        - Add `{x: cell.x, y: cell.y, tipo: mapCell.trpl.tipo, status: 'DETECTED'}` to `triggeredTraps`.
        - Set `trapsFound` to true.
  - IF `trapsFound` is true:
    - Trigger `onNotify("Attenzione! Hai individuato delle trappole!")`.
  - ELSE:
    - Trigger `onNotify("Nessuna trappola trovata.")`.
  - Trigger `onActionDone()`.
