<!-- LOGIC TEST SCENARIOS FOR: domain-map.isl.md -->

## Scenario: Equipment Compatibility Constraint
- **Given**: A `Hero` with `id: 5` (e.g., Wizard) and an `Equipment` item with `nopsg: true` and `nopsgid: 5`.
- **When**: The system attempts to assign the `Equipment` to the `Hero`.
- **Assert (Expected Outcomes)**: 
    - The assignment logic must return a validation failure.
    - The `Hero` inventory state remains unchanged.
    - The system must not trigger any UI update that suggests the item was equipped.

## Scenario: Map Cell Collision Integrity
- **Given**: A `MapCell` where `arnt.antroc` is `true` (Rock block).
- **When**: A `Hero` movement logic attempts to calculate a path through the coordinate `(x, y)` of that cell.
- **Assert (Expected Outcomes)**:
    - The pathfinding algorithm must treat the cell as non-traversable.
    - The movement cost calculation must exclude this cell from valid destination candidates.
    - The system must prevent the `Hero` entity from occupying the coordinate.

## Scenario: Treasure Trap Trigger
- **Given**: A `MapCell` with `tes.trp` set to a valid trap ID and a `Hero` performing a "Search for Treasure" action.
- **When**: The search action is executed on the cell.
- **Assert (Expected Outcomes)**:
    - The system must evaluate the trap trigger logic.
    - If the trap is triggered, the `Hero` must receive the corresponding damage or status effect defined by the trap ID.
    - The `MapCellTreasure` state must be updated to reflect that the treasure has been searched (preventing infinite gold farming).

## Scenario: Visibility Fog-of-War Update
- **Given**: A `VisibilityMap` where a cell at `(x, y)` has `fog: true`.
- **When**: A `Hero` moves to an adjacent cell that shares the same `valo` (Room ID) as the target cell.
- **Assert (Expected Outcomes)**:
    - The `fog` property for the target cell must transition to `false`.
    - The system must trigger a re-render/refresh of the map visibility layer.
    - Any `MapCellMonster` located in the newly revealed cell must become visible to the player.

## Scenario: Deterministic Script Execution (One-Time)
- **Given**: A `GameScript` with `isOneTime: true` located at `(x, y)`.
- **When**: A `Hero` enters the coordinate `(x, y)`.
- **Assert (Expected Outcomes)**:
    - The `command` (e.g., `aggoro`) must be executed exactly once.
    - The `GameScript` must be removed from the `MapDefinition.scripts` list or marked as "consumed" in the active game state.
    - Subsequent entries to `(x, y)` by any entity must not re-trigger the script.

## Scenario: Monster Death State Transition
- **Given**: A `MapCellMonster` with `corpo: 1` (1 Body Point remaining).
- **When**: An attack action results in damage calculation that reduces `corpo` to `0`.
- **Assert (Expected Outcomes)**:
    - The `mos` flag in `MapCellMonster` must be set to `false`.
    - The monster entity must be removed from the active turn order/initiative list.
    - The system must ensure the `corpo` value does not underflow (e.g., stay at 0, not negative).

## Scenario: Equipment Attribute Modifier Application
- **Given**: A `Hero` with base `attacco: 2` and an `Equipment` with `dadatt: 1`.
- **When**: The `Hero` equips the item.
- **Assert (Expected Outcomes)**:
    - The effective `attacco` value must be calculated as `base + modifier` (3).
    - The system must maintain the original `Hero` definition as immutable while applying the modifier to the "Active Hero" state.
    - Removing the equipment must revert the `attacco` value to the base 2.