<!-- LOGIC TEST SCENARIOS FOR: domain-map.isl.md -->

## Scenario: Equipment Compatibility Constraint
- **Given**: A `Hero` with `id: 5` (e.g., Wizard) and an `Equipment` item with `nopsg: true` and `nopsgid: 5`.
- **When**: The system attempts to assign the `Equipment` to the `Hero`.
- **Assert (Expected Outcomes)**:
    - The assignment operation must be rejected.
    - The `Hero` inventory state remains unchanged.
    - A validation error or boolean `false` result is returned to the caller.

## Scenario: Map Cell Monster Initialization
- **Given**: A `MapCell` definition where `mostab.mos` is `true` and `mostab.mosid` is `101`.
- **When**: The `MapDefinition` is loaded into the game engine.
- **Assert (Expected Outcomes)**:
    - A new `Monster` instance is instantiated using the definition from `@Monster` (ID 101).
    - The instance `corpo` points must match `MapCellMonster.corpo` if provided, otherwise default to the `@Monster` base definition.
    - The monster must be placed at the coordinates `(x, y)` defined in the `MapCell`.

## Scenario: Visibility Fog-of-War Update
- **Given**: A `VisibilityCell` at `(5, 5)` with `fog: true` and a `Hero` moving into an adjacent cell.
- **When**: The `Hero` position update triggers a visibility recalculation.
- **Assert (Expected Outcomes)**:
    - The `fog` property for the cell at `(5, 5)` must transition to `false` if the cell belongs to a visible `valo` (Room ID).
    - All entities (monsters, furniture) within the newly visible cell must be rendered/initialized in the game state.
    - The system must ensure no "ghost" entities remain if the cell is re-fogged.

## Scenario: Treasure Trap Trigger
- **Given**: A `MapCell` containing `MapCellTreasure` with `trp: 2` (Trap ID) and a `Hero` performing a "Search for Treasure" action.
- **When**: The search action is executed and the logic determines a trap trigger.
- **Assert (Expected Outcomes)**:
    - The `MapCellTrap` properties at the current location must be activated.
    - The `Hero` must receive the damage or effect defined by the `Trap` type.
    - The `MapCellTreasure` must be marked as "searched" to prevent duplicate triggers.

## Scenario: Deterministic Script Execution
- **Given**: A `MapScript` at `(2, 2)` with `isOneTime: true` and a `GameScript` command `aggoro` (add gold).
- **When**: A `Hero` enters cell `(2, 2)`.
- **Assert (Expected Outcomes)**:
    - The `aggoro` command is executed, updating the `Hero` gold balance.
    - The `MapScript` instance must be removed from the active `MapDefinition.scripts` list to ensure it cannot be triggered again.
    - The system state must confirm the transition to the next turn or phase without blocking.

## Scenario: Equipment Diagonal Attack Logic
- **Given**: A `Hero` equipped with an `Equipment` item where `diago: true`.
- **When**: The `Hero` targets a `Monster` located at a diagonal coordinate (e.g., `x+1, y+1`).
- **Assert (Expected Outcomes)**:
    - The range validation logic must return `true` for the diagonal distance.
    - The attack calculation must include the `dadatt` (attack dice) from the `Equipment`.
    - The flow must proceed to the combat resolution phase.

## Scenario: Invalid Map Coordinate Access
- **Given**: A `MapDefinition` with a grid size of 10x10.
- **When**: An external process attempts to move a `Hero` or place a `Monster` at coordinate `(15, 15)`.
- **Assert (Expected Outcomes)**:
    - The system must throw an "Out of Bounds" exception or return a failure state.
    - The game state must not be mutated by the invalid coordinate request.
    - The flow must maintain the previous valid position of the entity.