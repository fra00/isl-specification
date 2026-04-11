# Project: Heroquest React Logic Tests

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-12
**Implementation**: ./logic-test/dungeon-turn-controls.test

---

> **Reference**: `./dungeon-turn-controls.isl.md`

## Domain Concepts

- `logic test scenarios`: Deterministic acceptance scenarios used to verify the referenced HeroQuest component behavior.

## Component: LogicTestScenarios

### Role: Test

### ⚡ Scenarios

<!-- LOGIC TEST SCENARIOS FOR: dungeon-turn-controls.isl.md -->

This document outlines the logical test scenarios for the `DungeonTurnControls` component, focusing on its role as a **Presentation** layer that maps user intent to domain-driven state transitions.

## Scenario: Movement Roll Availability

- **Given**: `turnPhase` is `null` (start of turn), `movementPoints` is `null`.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
  - "Roll Movement" button is enabled.
  - "Search" buttons (Passage, Treasure, Trap) are enabled.
  - "End Turn" button is enabled.

## Scenario: Action Restriction After Movement

- **Given**: `turnPhase` is `HasMoved`, `movementPoints` is `5`.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
  - "Roll Movement" button is disabled.
  - "Search" buttons are enabled (as `HasPerformedAction` is false).
  - "End Turn" button is enabled.

## Scenario: Action Restriction After Performing Action

- **Given**: `turnPhase` is `HasPerformedAction`.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
  - "Search" buttons are disabled.
  - "Magic" button is disabled.
  - "Roll Movement" button is disabled.
  - "End Turn" button remains enabled.

## Scenario: Magic Button Visibility Logic

- **Given**: `currentHero.availableSpells` is empty.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
  - "Magic" button is disabled regardless of `turnPhase`.

## Scenario: Targeting Mode Override

- **Given**: `isTargeting` is `true`.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
  - "Cancel Targeting" button is visible.
  - All other action buttons (Search, Magic, End Turn) should be evaluated for interaction based on the current `turnPhase`.

## Scenario: Door Interaction Context

- **Given**: `canOpenDoor` is `true`.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
  - "Open Door" button is visible and enabled.

## Scenario: Persistent Position Initialization (Deterministic Completion)

- **Given**: LocalStorage contains a valid JSON string `{"x": 150, "y": 300}` for key `dungeonTurnControlsPosition`.
- **When**: The component mounts.
- **Assert (Expected Outcomes)**:
  - `position` state is initialized to `{x: 150, y: 300}`.
  - The component does not fall back to default `{x: 20, y: 20}`.

## Scenario: Drag Interaction and Persistence

- **Given**: The user drags the component header from `{x: 20, y: 20}` to `{x: 100, y: 100}`.
- **When**: The `mouseup` event triggers.
- **Assert (Expected Outcomes)**:
  - `position` state is updated to `{x: 100, y: 100}`.
  - LocalStorage key `dungeonTurnControlsPosition` is updated with the new coordinates.
  - Global event listeners (`mousemove`, `mouseup`) are successfully removed to prevent memory leaks or ghost interactions.

## Scenario: Adversarial State Handling (Null Hero)

- **Given**: `currentHero` is `null`.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
  - The Info Section displays "Unknown" for the class.
  - The component does not crash (graceful degradation).
  - All action buttons are disabled to prevent invalid state triggers.

## Scenario: Effective Defense Display Includes RockSkin

- **Given**: `currentHero.hero.difesa` is 2 and `currentHeroStats.difesa` is 3 because `RockSkin` is active.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
  - The Defense value shown in the Info Section is 3, not the base 2.
  - The displayed defense reflects active effects and equipped bonuses already resolved by business logic.

## Scenario: Effective Attack Display Includes Courage

- **Given**: `currentHero.hero.attacco` is 2 and `currentHeroStats.attacco` is 4 because `Courage` is active.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
  - The Attack value shown in the Info Section is 4, not the base 2.
  - The displayed attack reflects active effects and equipped bonuses already resolved by business logic.

## Scenario: Active Effects List Shows Movement Buffs

- **Given**: `currentHero.activeStatus` contains `WallPass` and `FoggyMist`.
- **When**: The component renders at the start of that hero's turn.
- **Assert (Expected Outcomes)**:
  - The Info Section displays both active effects.
  - Movement-related spell effects remain visible without opening any secondary panel.
  - The UI makes it immediately clear that the hero still has a temporary traversal effect available.

## Scenario: Guaranteed Cleanup on Unmount

- **Given**: The user is in the middle of a drag operation (`mousemove` listener active).
- **When**: The component unmounts.
- **Assert (Expected Outcomes)**:
  - All global event listeners are removed.
  - The system state is not left in a "dragging" state, ensuring no interference with subsequent UI components.
