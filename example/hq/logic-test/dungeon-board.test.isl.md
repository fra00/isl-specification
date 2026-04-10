<!-- LOGIC TEST SCENARIOS FOR: dungeon-board.isl.md -->

## Scenario: Fog of War Rendering Integrity

- **Given**: A `boardVisibilityMap` where `data` contains a cell at (x: 2, y: 2) with `fog: true`, and a cell at (x: 3, y: 3) with `fog: false`.
- **When**: The `DungeonBoard` component renders the grid.
- **Assert (Expected Outcomes)**:
  - The cell at (2, 2) MUST render a black background overlay.
  - The board MUST also render two global mist image layers across the whole board instead of clipping them to fogged cells.
  - The global mist layers MUST be rendered above the per-cell black fog overlays, not below them.
  - Each mist image layer MUST render at 10% opacity.
  - Each mist image layer MUST be expanded by 100px beyond each board edge and remain hidden outside the board by container clipping.
  - The second mist image layer MUST be rotated by 180 degrees.
  - The cell at (2, 2) MUST show moving mist above the black fog overlay and MUST NOT appear as flat black only.
  - The cell at (3, 3) MUST render with full transparency for the black fog overlay, while the global mist overlay remains visible above it.
  - The visual stack MUST be, from back to front: board background, black fog overlays, global mist overlay, entities, targeting tracer, debug panel.
  - The `fog` state must be strictly derived from the `boardVisibilityMap` prop.

## Scenario: Mist Animation Matches Runtime

- **Given**: The `DungeonBoard` component renders the global mist effect.
- **When**: The board is observed over time during normal gameplay.
- **Assert (Expected Outcomes)**:
  - The first mist layer MUST animate over `14s` with `ease-in-out`, `infinite`, and `alternate`.
  - The second mist layer MUST animate over `18s` with `ease-in-out`, `infinite`, and `alternate`.
  - The first mist layer MUST move between `translate3d(-28px, -18px, 0)`, `translate3d(16px, 12px, 0)`, and `translate3d(34px, -20px, 0)`.
  - The second mist layer MUST move between `rotate(180deg) translate3d(-32px, 18px, 0)`, `rotate(180deg) translate3d(14px, -12px, 0)`, and `rotate(180deg) translate3d(30px, 22px, 0)`.
  - During this motion, no border of the mist texture MUST become visible inside the board area.

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

## Scenario: Detected Spear Trap Visualization

- **Given**: `triggeredTraps` contains a trap at (6, 5) with `tipo: 2`.
- **When**: The `DungeonBoard` renders activated or detected traps.
- **Assert (Expected Outcomes)**:
  - The board MUST render the image `/img/cell/lancia.jpg` at (6, 5).
  - The spear trap marker MUST remain visible after `searchTraps` reveals the trap.
  - Rendering the spear trap marker MUST NOT change the trap status or disarm it automatically.

## Scenario: Detected Falling Rock Trap Visualization

- **Given**: `triggeredTraps` contains a trap at (8, 7) with `tipo: 3`.
- **When**: The `DungeonBoard` renders activated or detected traps.
- **Assert (Expected Outcomes)**:
  - The board MUST render the image `/img/cell/rocciacad.jpg` at (8, 7).
  - The falling rock trap marker MUST remain visible after `searchTraps` reveals the trap.
  - Rendering the falling rock trap marker MUST NOT change the trap status or disarm it automatically.

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

## Scenario: Hero Token Body Points Indicator Updates Immediately

- **Given**: A hero token is rendered with `currentBody: 2` and `hero.corpo: 4`.
- **When**: The session updates that same hero to `currentBody: 4` after `Acqua Guaritrice` or to `currentBody: 1` after damage.
- **Assert (Expected Outcomes)**:
  - The token MUST display a compact body-points indicator showing the current and max body values.
  - The displayed values MUST update immediately with the new `currentBody`.
  - The indicator MUST NOT block hover or click interactions used for movement or hero-target spell selection.

## Scenario: Hero Token Shows Wall Traversal Effects

- **Given**: A hero token is rendered with `activeStatus` containing `WallPass` or `InvisiblePassage`.
- **When**: The board renders the hero token.
- **Assert (Expected Outcomes)**:
  - The token MUST show a distinct movement-effect aura so wall traversal is visually apparent.
  - The tooltip/title MUST expose the active movement effect name.
  - The effect indicator MUST NOT block hero-target spell selection or hover preview forwarding.

## Scenario: Hero-Target Spell Selection Through Hero Token

- **Given**: `targetingSpell.targetType` is `Hero` and a hero token is rendered at (4, 6).
- **When**: The pointer enters the hero token and the user clicks that hero token.
- **Assert (Expected Outcomes)**:
  - The hero token MUST update the same hover preview used by the underlying board cell.
  - The hero token click MUST forward the selection through the board click flow using coordinates (4, 6).
  - Hero-target spells such as `Coraggio`, `Pelle di Pietra`, `Nebbia Caliginosa`, `Acqua Guaritrice`, `Passapareti`, and `Passaggio Invisibile` MUST remain directly selectable by clicking the hero miniature.
  - The hero token MUST NOT absorb the click without producing target selection.
