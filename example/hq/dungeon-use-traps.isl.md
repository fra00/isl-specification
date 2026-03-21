# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-traps

---

> **Reference**: @MapCellTrap in `./domain-map.isl.md`

## Component: useTraps

### Role: Business Logic

### ⚡ Capabilities

#### internalState

- `triggeredTraps`: List of {x: Integer, y: Integer, tipo: Integer} (Stores traps that have been activated).

#### checkTrapActivation

- **Contract**: Determines if a trap at given coordinates should trigger.
- **Signature**: `(trap: @MapCellTrap, x: Integer, y: Integer) -> Boolean`
- **Flow**:
  - IF `trap.tipo` == 1 (Abisso): RETURN true (Always active).
  - IF `trap.tipo` IN [2, 3]:
    - Check if `{x, y}` is already in `triggeredTraps`.
    - IF found: RETURN false (Trap already spent/inactive).
    - ELSE: RETURN true (Trap is active).
  - RETURN false.

#### registerTriggeredTrap

- **Contract**: Adds a trap to the triggered list.
- **Signature**: `(x: Integer, y: Integer, tipo: Integer)`
- **Flow**:
  - Add `{x, y, tipo}` to `triggeredTraps` (if not already present).

#### getTriggeredTraps

- **Contract**: Returns the list of triggered traps for rendering.
- **Return**: `triggeredTraps`.
