# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./dungeon-board

---

> **Reference**: @PageNavigationEnum in `./domain-core.isl.md`
> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @MapDefinition, @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @HeroState, @MonsterState in `./domain-session.isl.md`
> **Reference**: @Hero, @Monster in `./domain-ruleset.isl.md`
> **Reference**: @useDungeonFurniture in `./dungeon-use-furniture.isl.md`
> **Reference**: @useDungeonDoors in `./dungeon-use-doors.isl.md`
> **Reference**: @useDungeonVisibleMonsters in `./dungeon-use-visible-monsters.isl.md`

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

### 🔍 Appearance

- **Layout**: Relative container width 884px and height 646px of the board dimensions center content vertically and horizzontaly (no padding, no border, no margin).
- **Board**: The board image `/img/tabellone/default.bmp` the size of image is width 884px and height 646px
- **Fog of war**: no border

### Role: Backend

### 📦 Content

- **Board Image**: Displays `/img/tabellone/default.bmp`.
- **Grid**: Container for grid cells.
  - **Visibility**: Use `boardVisibilityMap` prop (@VisibilityMap).
  - **Cells**: Divs representing the grid squares (26x19 0-indexed) widht:34px,height:34px - area width 884px and height 646px .
    - **Fog of War**: Black overlay 70% opacity, removed/transparent if cell at `x+1, y+1` in `boardVisibilityMap.data` has `fog` as false.
    - **Path Highlight**: If cell {x,y} is in `hoveredPath`, add a semi-transparent green overlay (bg-green-500/50).
- **Furniture**: Visual elements for map furniture.
  - **Data Source**: Derive `visibleFurniture` using `useDungeonFurniture(@GameSession, @VisibilityMap)`.
  - **Render**: Image at x,y coordinates(start from 1). Src: `/img/mobili/` + `img`. do not scale.
- **Doors**: Visual elements for map doors.
  - **Data Source**: Derive `visibleDoors` using `useDungeonDoors(@GameSession, @VisibilityMap)`.
  - **Render**: Image at x,y coordinates(start from 1). Src: `/img/cell/` + `img`. do not scale
- **Monsters**: Visual tokens for `@GameSession.monsters` (@MonsterState) at their x,y coordinates (start from 1).
  - **Data Source**: Derive `visibleMonsters` using `useDungeonVisibleMonsters(@GameSession, @VisibilityMap)`.
  - **Image**: `/img/mostri/` + `@MonsterState.monster.immagine` (max-width:34px).
- **Secret Passages**: Visual elements for discovered secret passages.
  - **Data Source**: `secretPassages` prop.
  - **Render**: Image at x,y coordinates (start from 1). Src: `/img/cell/` + `img`. do not scale.
- **Treasures**: Visual elements for discovered treasures.
  - **Data Source**: `treasures` prop.
  - **Render**: Image at x,y coordinates (start from 1). Src: `/img/cell/` + `img`. do not scale.
- **Heroes**: Visual tokens for `@GameSession.heroes` (@HeroState) at their x,y coordinates (start from 1).
  - **Image**: `/img/eroi/` + `@Hero.miniature` (max-width:34px).
  - **square selection**: square selection on the current hero who has the turn where (`@GameSession.currentTurn` == `@HeroState.turnOrder`)
  - **Style**: Apply CSS transition `top 0.3s linear, left 0.3s linear` to the container for smooth movement.
- **debug panel**: Display an "fixed" "right" side bar containing these Debug information (fixed width:250px):
  - cell coordinates x,y of current mouse position
  - vis1
  - vis2
  - viso
  - fog
  - currentTurn

### ⚡ Capabilities

#### internalState

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
  - Convert 0-indexed (x, y) to 1-indexed by adding 1.
  - Trigger `onCellHover(x + 1, y + 1)`.

#### handleMonsterHover

- **Contract**: Show monster details on hover (optional enhancement).
- **Trigger**: When a monster token is hovered.
- **Flow**:
  - Display a tooltip or side panel with `@MonsterState.monster` details (e.g., name, currentBody, currentMind).
  - Show "Attackable" status. and change cursor to indicate attack.
