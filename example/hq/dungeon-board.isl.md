# Project: Heroquest React

**Version**: 1.0.1
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./dungeon-board

---

> **Reference**: @PageNavigationEnum in `./domain-core.isl.md`
> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @MapDefinition, @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @HeroState, @MonsterState in `./domain-session.isl.md`
> **Reference**: @Hero, @Monster in `./domain-ruleset.isl.md`
> **Reference**: @Spell in `./domain-ruleset.isl.md`
> **Reference**: @useDungeonFurniture in `./dungeon-use-furniture.isl.md`
> **Reference**: @useDungeonDoors in `./dungeon-use-doors.isl.md`
> **Reference**: @useDungeonVisibleMonsters in `./dungeon-use-visible-monsters.isl.md`
> **Reference**: @useVisibilityCalc in `./dungeon-use-visibility-calc.isl.md`

## Domain Concepts

- `triggeredTraps`: Visible trap markers already revealed on the board, including detected traps that remain active until disarmed or triggered.

## Component: DungeonBoard

### Role: Presentation

**Signature**:

- `gameSession`: @GameSession (Current session state).
- `boardVisibilityMap`: @VisibilityMap (The calculated visibility map with fog status passed from parent).
- `onCellClick`: (x: Integer, y: Integer) -> void (Callback when a cell is clicked).
- `onCellHover`: (x: Integer, y: Integer) -> void (Callback when a cell is hovered).
- `onMonsterClick`: (monsterId: Integer) -> void (Callback when a monster is clicked).
- `hoveredPath`: List of {x, y} (Path to highlight).
- `secretPassages`: List of {x: Integer, y: Integer, img: String} (List of discovered secret passages).
- `treasures`: List of {x: Integer, y: Integer, img: String} (List of discovered treasures).
- `triggeredTraps`: List of {x: Integer, y: Integer, tipo: Integer} (List of traps that have been activated).
- `targetingSpell`: @Spell (The spell currently being targeted, null if none).
- `visibilityCalc`: @useVisibilityCalc (Hook instance for LOS calculation).

### 🔍 Appearance

- **Layout**: Relative container width 884px and height 646px of the board dimensions center content vertically and horizzontaly (no padding, no border, no margin). The board container MUST use hidden overflow so any mist content extending beyond the board edges stays clipped.
- **Board**: The board image `/img/tabellone/default.bmp` (884x646px) as the bottom background layer.
- **Fog of war**: no border. Fogged cells stay black, while two slow mist image layers drift over the entire board, with the second image rotated by 180 degrees. The mist layers MUST extend beyond the board bounds so the moving image borders never become visible.

### 📦 Content

- **Board Image**: Displays `/img/tabellone/default.bmp`.
- **Grid**: Absolute Overlay container (top:0, left:0) covering the entire board.
  - **Visibility**: Use `boardVisibilityMap` prop (@VisibilityMap).
  - **Cells**: Divs representing the grid squares (26x19 0-indexed) width:34px, height:34px.
    - **Cursor**:
      - IF `targetingSpell` is NOT null AND (`targetingSpell.targetType` IN ["Point", "Door"] OR `targetingSpell.effetto` == "Genio") THEN `cursor-crosshair`.
      - ELSE IF `targetingSpell` is NOT null THEN `cursor-default`.
      - ELSE `cursor-pointer`.
    - **Fog of War Layer**: Each cell MUST render a black background overlay by default.
    - **Mist Effect**: The board MUST render two global `/img/mist.jpeg` layers over the entire board area.
    - **Mist Layering**:
      - The mist layers MUST be rendered as a dedicated global overlay and MUST NOT be rendered inside individual cells.
      - The mist layers MUST be stacked ABOVE the per-cell black fog overlays.
      - The mist layers MUST remain visible on top of both fogged and revealed cells.
      - A fogged cell MUST appear as black fog with moving mist above it, never as flat black only.
      - The mist layers SHOULD remain BELOW entity tokens, interaction highlights, and the targeting tracer unless a more specific visual rule overrides this order.
    - **Mist Geometry**:
      - Each mist layer MUST be positioned with `top: -100px` and `left: -100px`.
      - Each mist layer MUST use `width: calc(100% + 200px)` and `height: calc(100% + 200px)`.
      - Each mist layer MUST use `background-repeat: no-repeat`, `background-position: center`, and `background-size: 100% 100%`.
      - Each mist layer MUST remain clipped by the board container hidden overflow so the image borders stay outside the visible board area.
    - **Mist Opacity**: Both mist layers MUST use opacity `0.1`.
    - **Mist Rotation**: The second mist layer MUST be rotated by 180 degrees.
    - **Mist Motion**: Both mist layers MUST move slowly but remain visibly animated during normal gameplay.
    - **Mist Animation Parameters**:
      - The first mist layer MUST animate with keyframes `translate3d(-28px, -18px, 0)` to `translate3d(16px, 12px, 0)` to `translate3d(34px, -20px, 0)` over `14s` with `ease-in-out`, `infinite`, and `alternate`.
      - The second mist layer MUST animate with keyframes `rotate(180deg) translate3d(-32px, 18px, 0)` to `rotate(180deg) translate3d(14px, -12px, 0)` to `rotate(180deg) translate3d(30px, 22px, 0)` over `18s` with `ease-in-out`, `infinite`, and `alternate`.
    - **Unfogging Logic**: The black overlay MUST disappear ONLY IF the corresponding cell in `boardVisibilityMap.data` (matching x+1, y+1) has `fog` set to `false`. The mist layers remain global and visible across both revealed and fogged areas.
    - **Layer Order**: The visual stack MUST be, from back to front: board background, per-cell black fog overlays, global mist overlay, board entities, targeting tracer, debug panel.
    - **Path Highlight**: If cell {x+1, y+1} is in `hoveredPath`, add a semi-transparent green overlay (bg-green-500/50).
    - **Targeting Highlight**:
      - IF `targetingSpell` is NOT null:
        - Let `activeHero` = Hero in `gameSession.heroes` where `turnOrder` == `gameSession.currentTurn`.
        - Let `hasLOS` = `visibilityCalc.hasLineOfSight(activeHero.x, activeHero.y, x + 1, y + 1)`.
        - IF `targetingSpell.effetto` == "Genio" AND cell contains a Monster or a closed Door: add a pulsing blue/purple border or overlay (bg-blue-500/30 animate-pulse).
        - ELSE IF mouse is over a valid target for the current `targetingSpell.targetType`:
          - IF `hasLOS` is true: add a stronger highlight (bg-blue-400/50).
          - ELSE: add a red warning highlight (bg-red-500/40).
- **Furniture**: Visual elements for map furniture.
  - **Data Source**: Derive `visibleFurniture` using `useDungeonFurniture(@GameSession, @VisibilityMap)`.
  - **Render**: Image at x,y coordinates(start from 1). Src: `/img/mobili/` + `img`. do not scale.
- **Doors**: Visual elements for map doors.
  - **Data Source**: Derive `visibleDoors` using `useDungeonDoors(@GameSession, @VisibilityMap)`.
  - **Render**: Image at x,y coordinates(start from 1). Src: `/img/cell/` + `img`. do not scale
- **Monsters**: Visual tokens for `@GameSession.monsters` (@MonsterState) at their x,y coordinates (start from 1).
  - **Data Source**: Derive `visibleMonsters` using `useDungeonVisibleMonsters(@GameSession, @VisibilityMap)`.
  - **Image**: `/img/mostri/` + `@MonsterState.monster.immagine` (max-width:34px).
  - **Cursor**:
    - IF `targetingSpell` is NOT null AND (`targetingSpell.targetType` == "Monster" OR `targetingSpell.effetto` == "Genio") THEN `cursor-crosshair`.
    - ELSE IF `targetingSpell` is NOT null THEN `cursor-default`.
    - ELSE `cursor-pointer`.
  - **Status Effects**:
    - IF `@MonsterState.activeStatus` contains "Sleep":
      - Apply a pulsing blue outer glow (aura) and a small "Zzz" icon overlay.
    - IF `@MonsterState.activeStatus` contains "Tempest":
      - Apply a pulsing gray swirling outer glow (aura/vortex).
    - IF `@MonsterState.activeStatus` contains "Entangled":
      - Apply a green web overlay icon.
- **Secret Passages**: Visual elements for discovered secret passages.
  - **Data Source**: `secretPassages` prop.
  - **Render**: Image at x,y coordinates (start from 1). Src: `/img/cell/` + `img`. do not scale.
- **Treasures**: Visual elements for discovered treasures.
  - **Data Source**: `treasures` prop.
  - **Render**: Image at x,y coordinates (start from 1). Src: `/img/cell/` + `img`. do not scale.
- **Activated Traps**: Visual elements for triggered traps.
  - **Data Source**: `triggeredTraps` prop.
  - **Render**:
    - IF `tipo` == 1 (Abisso) THEN Image at x,y with Src: `/img/cell/abisso.jpg`.
    - IF `tipo` == 2 (Lancia) THEN Image at x,y with Src: `/img/cell/lancia.jpg`.
    - IF `tipo` == 3 (Masso cadente) THEN Image at x,y with Src: `/img/cell/rocciacad.jpg`.
- **Heroes**: Visual tokens for `@GameSession.heroes` (@HeroState) at their x,y coordinates (start from 1).
  - **Image**: `/img/eroi/` + `@Hero.miniature` (max-width:34px).
  - **square selection**: square selection on the current hero who has the turn where (`@GameSession.currentTurn` == `@HeroState.turnOrder`)
  - **Cursor**:
    - IF `targetingSpell` is NOT null AND `targetingSpell.targetType` == "Hero" THEN `cursor-crosshair`.
    - ELSE `cursor-default`.
  - **Status Effects**:
    - IF `@HeroState.activeStatus` contains "FoggyMist":
      - Apply 50% opacity and a pulsing white outer glow (aura).
    - IF `@HeroState.activeStatus` contains "RockSkin":
      - Apply a pulsing gray/brown outer glow (aura).
    - IF `@HeroState.activeStatus` contains "Courage":
      - Apply a pulsing red/orange outer glow (aura).
  - **Style**: Apply CSS transition `top 0.3s linear, left 0.3s linear` to the container for smooth movement.
- **debug panel**: Display an "fixed" "right" side bar containing these Debug information (fixed width:250px):
  - cell coordinates x,y of current mouse position
  - vis1
  - vis2
  - viso
  - fog
  - currentTurn
- **Targeting Tracer**:
  - Visible ONLY IF `targetingSpell` is NOT null AND `hoveredCell` is NOT null.
  - Let `activeHero` = Hero in `gameSession.heroes` where `turnOrder` == `gameSession.currentTurn`.
  - **Color**:
    - IF `targetingSpell.effetto` == "Genio" THEN magic-blue (Genie ignores Line of Sight).
    - ELSE IF `visibilityCalc.hasLineOfSight(activeHero.x, activeHero.y, hoveredCell.x + 1, hoveredCell.y + 1)` is false THEN red.
    - ELSE magic-blue.
  - Render an SVG line overlay connecting the center of `activeHero` to the center of the `hoveredCell`.
  - Style: Thin dashed line with a pulsing glow.

### ⚡ Capabilities

#### internalState

- **Contract**: Tracks local hover state used by board interactions and targeting preview.

- `hoveredCell`: {x: Integer, y: Integer} | null (Coordinates of the cell currently under the mouse for targeting preview).

#### initialize

- **Contract**: Sets isLoaded to true when `@VisibilityMap` is available.
- **Trigger**: On Mount or when `boardVisibilityMap` changes.

#### onCellClick

- **Contract**: Trigger `onCellClick` callback with 1-indexed coordinates.
- **Trigger**: When a cell is clicked.
- **Flow**:
  - Convert 0-indexed (x, y) to 1-indexed by adding 1.
  - Trigger `onCellClick(x + 1, y + 1)`.

#### onCellHover

- **Contract**: Trigger `onCellHover` callback with 1-indexed coordinates.
- **Trigger**: When a cell is hovered.
- **Flow**:
  - Set `hoveredCell` to {x, y}.
  - Convert 0-indexed (x, y) to 1-indexed by adding 1.
  - Trigger `onCellHover(x + 1, y + 1)`.

#### onMouseLeaveBoard

- **Contract**: Clears targeting visualization when the mouse leaves the board area.
- **Trigger**: When the mouse leaves the grid container.
- **Flow**:
  - Set `hoveredCell` to null.

#### handleMonsterHover

- **Contract**: Show monster details on hover (optional enhancement).
- **Trigger**: When a monster token is hovered.
- **Flow**:
  - Display a tooltip or side panel with `@MonsterState.monster` details (e.g., name, currentBody, currentMind).
  - IF `targetingSpell` is NULL:
    - Show "Attackable" status and change cursor to indicate physical attack.
