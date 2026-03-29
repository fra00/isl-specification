<!-- LOGIC TEST SCENARIOS FOR: dungeon-board.isl.md -->

## Scenario: Fog of War Rendering Integrity
- **Given**: A `boardVisibilityMap` where `data` contains a cell at (x: 5, y: 5) with `fog: true`, and a cell at (x: 6, y: 6) with `fog: false`.
- **When**: The `DungeonBoard` component renders the grid.
- **Assert (Expected Outcomes)**:
    - The cell at (5, 5) must render a black background overlay with 70% opacity.
    - The cell at (6, 6) must render with full transparency (no black overlay).
    - The `DungeonBoard` must correctly map 0-indexed grid coordinates to the 1-indexed visual representation.

## Scenario: Targeting Tracer Logic (Line of Sight)
- **Given**: An `activeHero` at (1, 1), a `targetingSpell` with `targetType: "Monster"` is active, and a `hoveredCell` at (3, 3) containing a wall obstacle.
- **When**: The `DungeonBoard` calculates the `Targeting Tracer` visual.
- **Assert (Expected Outcomes)**:
    - The `visibilityCalc.hasLineOfSight` must return `false` due to the wall.
    - The SVG line overlay connecting the hero to the `hoveredCell` must be rendered in **red**.
    - If the spell effect is "Genio", the line must be rendered in **magic-blue** regardless of the LOS result.

## Scenario: Dynamic Visibility of Doors
- **Given**: A door exists at (2, 2). `gameSession.openedDoors` does not contain "2,2". The adjacent cells in `boardVisibilityMap` have `fog: true`.
- **When**: `useDungeonDoors` is triggered.
- **Assert (Expected Outcomes)**:
    - The door must NOT be included in the `visibleDoors` list.
    - If a hero moves to an adjacent cell (e.g., 1, 2) and the `boardVisibilityMap` updates to `fog: false` for that cell, the door must immediately appear in the `visibleDoors` list.

## Scenario: Monster Status Effect Visualization
- **Given**: A `MonsterState` exists with `activeStatus: ["Sleep"]`.
- **When**: The `DungeonBoard` renders the monster token.
- **Assert (Expected Outcomes)**:
    - The monster token must display a pulsing blue outer glow.
    - A "Zzz" icon overlay must be rendered on top of the monster token.
    - The monster must remain visible only if its coordinates are in a non-fogged area of the `boardVisibilityMap`.

## Scenario: Deterministic Interaction Flow (Cell Click)
- **Given**: A user clicks on a cell at grid position (x: 10, y: 10).
- **When**: `onCellClick` is triggered.
- **Assert (Expected Outcomes)**:
    - The component must trigger the `onCellClick` callback with 1-indexed coordinates (11, 11).
    - The flow must ensure that even if `gameSession` is updating, the coordinate conversion remains consistent.
    - The system must not enter a dead-end state if the callback fails; the `DungeonBoard` must maintain its current `hoveredCell` state until a new interaction occurs.

## Scenario: Hero Status Effect Aura
- **Given**: A `HeroState` has `activeStatus: ["RockSkin"]`.
- **When**: The `DungeonBoard` renders the hero token.
- **Assert (Expected Outcomes)**:
    - The hero token must apply a pulsing gray/brown outer glow (aura).
    - The hero token must be rendered at the correct 1-indexed coordinates.
    - The CSS transition `top 0.3s linear, left 0.3s linear` must be applied to the hero container to ensure smooth movement during state updates.

## Scenario: Debug Panel Data Consistency
- **Given**: The mouse is hovering over cell (x: 2, y: 2).
- **When**: The `DungeonBoard` renders the debug panel.
- **Assert (Expected Outcomes)**:
    - The panel must display the correct `x, y` (2, 2).
    - The `vis1`, `vis2`, `viso`, and `fog` values must match the properties of the corresponding `VisibilityCell` in the `boardVisibilityMap`.
    - The `currentTurn` must match `gameSession.currentTurn`.