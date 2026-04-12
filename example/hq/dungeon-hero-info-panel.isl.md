# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-12
**Implementation**: ./dungeon-hero-info-panel

---

> **Reference**: @HeroState in `./domain-session.isl.md`

## Domain Concepts

- `currentHeroStats`: Effective hero stats already resolved by business logic, including equipment bonuses and temporary effects such as `RockSkin` and `Courage`.
- `activeEffects`: The list of current hero status effects from `currentHero.activeStatus`, used to surface temporary spell effects such as `WallPass`, `FoggyMist`, `RockSkin`, and `Courage`.

## Component: DungeonHeroInfoPanel

### Role: Presentation

**Signature**:

- `currentHero`: @HeroState (The hero currently taking the turn).
- `currentHeroStats`: { attacco: Integer, difesa: Integer, movimento: Integer, mente: Integer, corpo: Integer, canAttackDiagonal: Boolean, canAttackRanged: Boolean, canDisarmTraps: Boolean, hasDoubleAttack: Boolean } | null.
- `movementPoints`: Integer | null.

### 🔍 Appearance

- **Type**: Fixed floating status panel.
- **Position**: Initially on the right side of the viewport, occupying the space previously used by the obsolete debug panel, but user-draggable afterward.
- **Styling**: Stone-and-bronze gothic panel visually matched to `DungeonTurnControls`.
- **Width**: Around 290-310px.
- **Cursor**: `grab` on header, `grabbing` while dragging.

### 📦 Content

- **Header**:
  - Text: "Scheda Eroe".
  - Behavior: Acts as the drag handle.
- **Hero Summary**:
  - Display `currentHero.hero.classe` (or "Sconosciuto" if null).
  - Display the hero portrait when available using `img/eroi/` + `currentHero.hero.portrait`.
  - Display `movementPoints`.
- **Stats Section**:
  - Display Gold.
  - Display Health.
  - Display Intelligence.
  - Display Attack using `currentHeroStats.attacco` when available; otherwise fall back to the base hero value.
  - Display Defense using `currentHeroStats.difesa` when available; otherwise fall back to the base hero value.
- **Active Effects**:
  - Display the active temporary effects from `currentHero.activeStatus`, if any.

### ⚡ Capabilities

#### renderGuard

- **Contract**: Avoids rendering the panel when no active hero is available.
- **Flow**:
  - IF `currentHero` is null RETURN null.

#### renderPanel

- **Contract**: Renders the floating right-side hero information panel so the left action panel can stay focused on buttons only.
- **Flow**:
  - Build a compact portrait-and-summary header.
  - Render movement and resolved hero statistics in a two-column card grid.
  - Render active effects in a dedicated footer section.

#### initializePosition

- **Contract**: Initializes the panel position from persisted storage when available, otherwise starts near the right edge of the viewport.
- **Trigger**: On mount.
- **Flow**:
  - Read `localStorage['dungeonHeroInfoPanelPosition']`.
  - IF the stored value is valid JSON with numeric `x` and `y`, restore it.
  - ELSE compute a default position near the right side with a safe top offset.

#### beginDrag

- **Contract**: Starts header-driven drag movement for the hero info panel.
- **Trigger**: Mouse down on the header.
- **Flow**:
  - Set dragging state to true.
  - Store the pointer offset from the current panel origin.

#### persistDragPosition

- **Contract**: Updates panel position while dragging and persists the final coordinates when the drag ends.
- **Trigger**: Global mouse move and mouse up while dragging.
- **Flow**:
  - On mouse move, update `left` and `top` using the stored offset.
  - On mouse up, stop dragging and persist the final coordinates into `localStorage['dungeonHeroInfoPanelPosition']`.