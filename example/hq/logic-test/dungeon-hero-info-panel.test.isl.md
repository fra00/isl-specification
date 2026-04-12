# Project: Heroquest React Logic Tests

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-12
**Implementation**: ./logic-test/dungeon-hero-info-panel.test

---

> **Reference**: `./dungeon-hero-info-panel.isl.md`

## Domain Concepts

- `logic test scenarios`: Deterministic acceptance scenarios used to verify the referenced HeroQuest component behavior.

## Component: DungeonHeroInfoPanelLogicTests

### Role: Test

### ⚡ Scenarios

<!-- LOGIC TEST SCENARIOS FOR: dungeon-hero-info-panel.isl.md -->

## Scenario: Guard On Missing Active Hero

- **Given**: `currentHero` is `null`.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
  - The component MUST return `null`.
  - No empty right-side shell should be displayed.

## Scenario: Effective Defense Display Includes RockSkin

- **Given**: `currentHero.hero.difesa` is 2 and `currentHeroStats.difesa` is 3 because `RockSkin` is active.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
  - The Defense value shown in the hero info panel is 3, not the base 2.
  - The displayed defense reflects active effects and equipped bonuses already resolved by business logic.

## Scenario: Effective Attack Display Includes Courage

- **Given**: `currentHero.hero.attacco` is 2 and `currentHeroStats.attacco` is 4 because `Courage` is active.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
  - The Attack value shown in the hero info panel is 4, not the base 2.
  - The displayed attack reflects active effects and equipped bonuses already resolved by business logic.

## Scenario: Active Effects List Shows Movement Buffs

- **Given**: `currentHero.activeStatus` contains `WallPass` and `FoggyMist`.
- **When**: The component renders at the start of that hero's turn.
- **Assert (Expected Outcomes)**:
  - The hero info panel displays both active effects.
  - Movement-related spell effects remain visible without reopening the action panel.
  - The UI makes it immediately clear that the hero still has temporary traversal effects available.

## Scenario: Right-Side Replacement Of Obsolete Debug Space

- **Given**: The live dungeon screen renders both floating side panels.
- **When**: The layout settles after mission start.
- **Assert (Expected Outcomes)**:
  - The hero info panel occupies the right-side space previously used by the debug panel.
  - The hero info panel uses the same stone-and-bronze visual family as `DungeonTurnControls`.
  - The right-side panel shows hero summary data instead of engineering-only debug values.

## Scenario: Persistent Position Initialization

- **Given**: LocalStorage contains a valid JSON string `{"x": 920, "y": 140}` for key `dungeonHeroInfoPanelPosition`.
- **When**: The component mounts.
- **Assert (Expected Outcomes)**:
  - The hero info panel restores its position to `{x: 920, y: 140}`.
  - The component does not fall back to the default right-side placement.

## Scenario: Drag Interaction And Persistence

- **Given**: The user drags the hero info panel header to a new screen position.
- **When**: The `mouseup` event triggers.
- **Assert (Expected Outcomes)**:
  - The panel position updates continuously during the drag.
  - The final position is saved into `localStorage['dungeonHeroInfoPanelPosition']`.
  - Global `mousemove` and `mouseup` listeners are removed after drag completion.

## Scenario: Out-Of-Viewport Saved Position Is Clamped Back On Screen

- **Given**: LocalStorage contains coordinates that would place the hero info panel outside the visible viewport.
- **When**: The component mounts or the window is resized smaller.
- **Assert (Expected Outcomes)**:
  - The hero info panel position is clamped back inside the viewport bounds.
  - The panel remains visibly reachable by the player.