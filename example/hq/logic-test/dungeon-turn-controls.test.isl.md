<!-- LOGIC TEST SCENARIOS FOR: dungeon-turn-controls.isl.md -->

This document outlines the logical test scenarios for the `DungeonTurnControls` component, focusing on its role as a **Presentation** layer that maps user intent to domain-driven state transitions.

## Scenario: Movement Roll Logic
- **Given**: `turnPhase` is `null` (start of turn), `movementPoints` is `null`.
- **When**: User clicks "Roll Movement".
- **Assert (Expected Outcomes)**:
    - `onRollMovement` callback is triggered.
    - "Roll Movement" button becomes disabled (preventing multiple rolls).
    - `turnPhase` transitions to `HasMoved`.

## Scenario: Action Button Constraints
- **Given**: `turnPhase` is `HasMoved` (movement completed).
- **When**: User attempts to click "Search Treasure", "Search Traps", or "Search Passages".
- **Assert (Expected Outcomes)**:
    - If `turnPhase` is `HasPerformedAction`, all search buttons are disabled.
    - If `turnPhase` is `HasMoved` (but not `HasPerformedAction`), search buttons are enabled.
    - Clicking any search button triggers the respective callback (`onSearchTreasure`, etc.).

## Scenario: Magic Usage Eligibility
- **Given**: `currentHero.availableSpells` is empty.
- **When**: Component renders.
- **Assert (Expected Outcomes)**:
    - "Magic" button is rendered in a disabled state.
    - `onOpenMagic` cannot be triggered.

## Scenario: Targeting Mode Interruption
- **Given**: `isTargeting` is `true`.
- **When**: User clicks "Cancel Targeting".
- **Assert (Expected Outcomes)**:
    - `onCancelTargeting` callback is triggered.
    - "Cancel Targeting" button is removed from the UI.
    - The component returns to the standard action state.

## Scenario: Door Interaction Visibility
- **Given**: `canOpenDoor` is `false`.
- **When**: Component renders.
- **Assert (Expected Outcomes)**:
    - "Open Door" button is not present in the DOM.
- **Given**: `canOpenDoor` is `true`.
- **When**: Component renders.
- **Assert (Expected Outcomes)**:
    - "Open Door" button is visible and enabled.

## Scenario: Drag and Drop Persistence (Deterministic Completion)
- **Given**: Component is mounted; LocalStorage key `dungeonTurnControlsPosition` is empty.
- **When**: User drags the component to `{x: 100, y: 100}` and releases the mouse.
- **Assert (Expected Outcomes)**:
    - `position` state updates to `{x: 100, y: 100}`.
    - `mouseup` event triggers a write to LocalStorage.
    - The value in LocalStorage is valid JSON matching the new coordinates.
    - Global event listeners (`mousemove`, `mouseup`) are removed from the `window` object to prevent memory leaks or ghost interactions.

## Scenario: Initialization from Storage
- **Given**: LocalStorage contains `{"x": 50, "y": 50}` for key `dungeonTurnControlsPosition`.
- **When**: Component mounts.
- **Assert (Expected Outcomes)**:
    - `position` state is initialized to `{x: 50, y: 50}`.
- **Given**: LocalStorage contains malformed data (e.g., "invalid-json").
- **When**: Component mounts.
- **Assert (Expected Outcomes)**:
    - `position` state defaults to `{x: 20, y: 20}` (Ensuring the component remains accessible).

## Scenario: Adversarial State Handling
- **Given**: `turnPhase` is `IsTurnFinished`.
- **When**: User attempts to click "End Turn".
- **Assert (Expected Outcomes)**:
    - The system should handle the redundant call gracefully (Idempotency).
    - The UI should reflect that the turn is already finished (e.g., all buttons disabled).
    - `onEndTurn` should not trigger side effects that would double-process the turn transition.