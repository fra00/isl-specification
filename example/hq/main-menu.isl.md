# Project: Heroquest React

Short description

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./main-menu

---

> **Reference**: Core entities are defined in `./domain-core.isl.md`.

## Domain Concepts

- `menu action plaque`: primary clickable card for one destination of the home screen.
- `active backdrop`: full-screen hover/focus image that changes with the selected action and defaults to the `GIOCA` entry.
- `compact viewport mode`: low-height home variant that reduces spacing and card height so title and both main actions remain inside the fixed runtime stage.

## Component: MainMenu

Main Menu Screen

### Role: Presentation

**Signature**:

- `onChangePageView`: (page: @PageNavigationEnum) -> void

### 🔍 Appearance

- Full width landing screen with dark fantasy styling.
- Height: exactly the viewport height.
- Overflow: hidden. The home screen MUST stay inside the fixed runtime stage and MUST NOT require page scrollbars.
- `BackgroundLayer`: cinematic base image `/img/menusfondo.jpg`, always visible, with slow breathing motion.
- `ActiveBackdropLayer`: hovered action image crossfades above the base background.
  - Default state uses the `GIOCA` artwork.
  - Hover/focus on `EDITOR` switches the active backdrop to `/img/main-menu/editor.jpg`.
- `AtmosphereLayer`: sparse ember particles and warm glow accents. Decorative only; they must not make the screen visually noisy.
- `HeaderPlaque`: compact top block with:
  - eyebrow text `Portale del Regno`
  - main title `HeroQuest`
  - one short instruction line
- `ActiveStatePill`: small capsule that shows the currently active area label and short hint.
- `ActionArea`: only two large menu plaques, no secondary long-form text column.
  - `GIOCA` plaque
  - `EDITOR` plaque
  - Each plaque shows only: eyebrow, main label, short teaser, short hint, ordinal badge.
  - Long descriptive paragraphs and oversized preview cards MUST NOT be used here.
- Tall viewport layout:
  - two plaques can sit side by side
  - a small optional status plaque may appear to the right
- Compact viewport layout:
  - padding, title size, and plaque height compress aggressively
  - secondary copy may be removed when the viewport is very low
  - the two menu plaques may switch to a two-column action row to reduce total height
  - `GIOCA` and `EDITOR` remain visible in the first frame together with the title block

### 📦 Content

- `HeaderPlaque`
  - eyebrow: `Portale del Regno`
  - title: `HeroQuest`
  - short line inviting the user to choose a path
- `ActiveStatePill`
  - shows `Campagna` or `Forgia`
  - shows a short active hint
- `ActionArea`
  - `GIOCA` `destination` => PageNavigationEnum.PLAY_GAME
    - eyebrow => `Campagna`
    - teaser => compact campaign/dungeon hint
  - `EDITOR` `destination` => PageNavigationEnum.EDITOR_GAME
    - eyebrow => `Forgia`
    - teaser => compact tooling hint
- `StatusPlaque` (desktop-only optional)
  - heading => `Scena attiva`
  - shows the active menu label and short hint

### ⚡ Capabilities

#### clickMenuItems

**Contract**:
Handles navigation when the user activates a menu action plaque.

**Trigger**:
Click su voce di menu

**Side Effects**:
- IF `isProcessing` is true: ignore the action.
- IF `destination` is not a valid `PageNavigationEnum` value: ignore the action.
- ELSE:
  - set `isProcessing` = TRUE
  - call `onChangePageView(destination)`
  - set `isProcessing` = FALSE

#### mouseOverMenuItems

**Contract**:
Updates the active visual state when the user hovers or focuses a menu action plaque.

**Trigger**:
Mouse over or focus voce di menu

**Side Effects**:
- Marks the hovered item as active.
- Updates the active backdrop image.
- Updates the active state pill and optional status plaque.

#### clearPreviewState

**Contract**:
Restores the default active visual state when the user leaves a menu action plaque.

**Trigger**:
Mouse leave or blur on menu item.

**Side Effects**:
- Clear hovered state.
- Active backdrop returns to the primary `GIOCA` entry.
- Active state pill returns to the primary `GIOCA` hint.

#### compactViewportResolution

**Contract**:
Switches the menu into compact mode on short viewports.

**Trigger**:
Initial render and viewport resize.

**Side Effects**:
- Reduce spacing and title scale.
- Reduce plaque height.
- Remove non-essential secondary copy on very low heights.
- Prefer a two-column action row when vertical space is the limiting factor.
- Keep title and both main menu plaques visible in the fixed stage without scroll.
