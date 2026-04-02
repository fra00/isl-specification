<!-- LOGIC TEST SCENARIOS FOR: dungeon-board.isl.md -->

## Scenario: Fog of War Rendering Integrity
- **Given**: A `boardVisibilityMap` where `data` contains a cell at (x: 2, y: 2) with `fog: true`, and a cell at (x: 3, y: 3) with `fog: false`.
- **When**: The `DungeonBoard` component renders the grid.
- **Assert (Expected Outcomes)**:
    - The cell at (2, 2) MUST render a black background overlay with 70% opacity.
    - The cell at (3, 3) MUST render with full transparency (no black overlay).
    - The `fog` state must be strictly derived from the `boardVisibilityMap` prop.

## Scenario: Targeting Tracer Logic (Line of Sight)
- **Given**: `targetingSpell` is active (e.g., "Fireball"), `activeHero` is at (1, 1), and `hoveredCell` is at (5, 5).
- **When**: The user hovers over (5, 5) and `visibilityCalc.hasLineOfSight(1, 1, 5, 5)` returns `false`.
- **Assert (Expected Outcomes)**:
    - The SVG tracer line connecting the hero to the hovered cell MUST be rendered in **red**.
    - The tracer line MUST NOT be rendered if `targetingSpell` is null.
    - The tracer line MUST be rendered in **magic-blue** if `targetingSpell.effetto` is "Genio" (ignoring LOS).

## Scenario: Door Visibility and Interaction
- **Given**: A door exists at (5, 5) in `gameSession.currentMap.porte`. The door is NOT in `gameSession.openedDoors`.
- **When**: The `boardVisibilityMap` is updated such that the cell (5, 4) has `fog: false`.
- **Assert (Expected Outcomes)**:
    - `visibleDoors` hook MUST return the door at (5, 5) because one of its boundary cells (5, 4) is revealed.
    - The `DungeonBoard` MUST render the door image `portav.jpg` at (5, 5).
    - If the door is subsequently added to `gameSession.openedDoors`, the door MUST remain visible regardless of fog status.

## Scenario: Monster Status Effect Visualization
- **Given**: A `MonsterState` exists with `activeStatus: ["Sleep"]` and `x: 10, y: 10`.
- **When**: The `DungeonBoard` renders the monster token at (10, 10).
- **Assert (Expected Outcomes)**:
    - The monster token MUST display the pulsing blue outer glow.
    - The monster token MUST display the "Zzz" icon overlay.
    - If `activeStatus` is empty, no glow or icon should be rendered.

## Scenario: Deterministic Completion of Visibility Updates
- **Given**: `gameSession` or `boardVisibilityMap` is updated asynchronously.
- **When**: The component receives a null or undefined `boardVisibilityMap`.
- **Assert (Expected Outcomes)**:
    - The `visibleFurniture`, `visibleDoors`, and `visibleMonsters` hooks MUST return an empty list `[]` immediately.
    - The `DungeonBoard` MUST NOT crash or throw an exception.
    - The UI must reset to a "no-data" state (e.g., all cells remain under fog or empty) to prevent logical dead-ends where stale data is displayed.

## Scenario: Hero Movement and State Transition
- **Given**: `gameSession.currentTurn` matches the `turnOrder` of a specific `HeroState`.
- **When**: The component renders the hero token.
- **Assert (Expected Outcomes)**:
    - The hero token MUST have a visual "square selection" indicator applied.
    - The CSS transition `top 0.3s linear, left 0.3s linear` MUST be active on the hero container to ensure smooth movement when coordinates update.
    - If `activeStatus` contains "FoggyMist", the hero MUST render with 50% opacity and a pulsing white aura.