<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-map-interaction.isl.md -->

This document outlines the logical test scenarios for the `useMapInteraction` component, focusing on state transitions, boundary conditions, and flow integrity within the Heroquest React domain.

## Scenario: Identify Valid Door Interaction
- **Given**: A `GameSession` where a hero is at (5, 5). A `MapDoor` exists at (5, 6) with `oriz: true` (Horizontal). The cell at (5, 7) is in a different `valo` (Area ID) than (5, 5).
- **When**: `isFrontOfDoor(5, 5)` is called.
- **Assert (Expected Outcomes)**:
    - `found` is `true`.
    - `passageCell` is `{x: 5, y: 6}`.
    - `destination` is `{x: 5, y: 7}` (the cell in the new area).

## Scenario: Prevent Interaction with Already Opened Door
- **Given**: `gameSession.openedDoors` contains `"5,6"`. A `MapDoor` exists at (5, 6).
- **When**: `isFrontOfDoor(5, 5)` is called.
- **Assert (Expected Outcomes)**:
    - `found` is `false`.
    - Logic must ignore doors already present in the `openedDoors` list to prevent redundant state updates.

## Scenario: Successful Passage Opening and Vision Reveal
- **Given**: A closed door at (5, 6). `gameSession.openedDoors` is empty. `fogOfWarLogic` is initialized.
- **When**: `openPassage(5, 6, 5, 7)` is triggered.
- **Assert (Expected Outcomes)**:
    - `"5,6"` is added to `gameSession.openedDoors`.
    - `onNotify` is called with `"Porta aperta."`.
    - `fogOfWarLogic.revealFromPoint(5, 7)` is executed.
    - `onUpdateSession` is called with the updated `GameSession` object.

## Scenario: Deterministic Failure on Invalid Destination
- **Given**: A door at (5, 6). Both adjacent cells (5, 5) and (5, 7) belong to the same `valo` (Area ID) or are blocked/walls.
- **When**: `isFrontOfDoor(5, 5)` is called.
- **Assert (Expected Outcomes)**:
    - `found` is `false`.
    - The system must not return a `destination` if no valid transition area is identified, preventing the hero from "walking into a wall."

## Scenario: Secret Passage Discovery Logic
- **Given**: `foundPassages` contains `{x: 10, y: 10}`. The `MapDefinition` contains a secret passage at (10, 10).
- **When**: `isFrontOfDoor(10, 9)` is called.
- **Assert (Expected Outcomes)**:
    - `found` is `true`.
    - The logic treats the secret passage as a valid interaction point because it exists in the `foundPassages` list.
    - `destination` is correctly calculated based on the passage orientation.

## Scenario: Adversarial - Attempting to Open Non-Existent Door
- **Given**: Coordinates (0, 0) where no `MapDoor` or `MapCellPassage` exists.
- **When**: `openPassage(0, 0, 0, 1)` is called.
- **Assert (Expected Outcomes)**:
    - The system must perform a guard check.
    - `gameSession.openedDoors` remains unchanged.
    - No `onNotify` or `onUpdateSession` triggers occur, ensuring the session state remains immutable for invalid inputs.

## Scenario: Guaranteed State Consistency (Flow Integrity)
- **Given**: A valid door interaction sequence is initiated.
- **When**: `openPassage` is executed.
- **Assert (Expected Outcomes)**:
    - The flow must be atomic: `openedDoors` update, `onNotify`, and `revealFromPoint` must complete before `onUpdateSession` is dispatched.
    - The system must ensure that even if `fogOfWarLogic` fails, the `openedDoors` state is either rolled back or the session remains in a valid, non-blocking state (no "isLoading" deadlocks).