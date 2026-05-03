<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-map-interaction.isl.md -->

This document outlines the logical test scenarios for the `useMapInteraction` component, focusing on state transitions, boundary conditions, and flow integrity.

## Scenario: Identify Valid Door Interaction

- **Given**: A `GameSession` where a hero is at `(5, 5)` and a `MapDoor` exists at `(5, 6)` (Horizontal). The door is not in `gameSession.openedDoors`.
- **When**: `isFrontOfDoor(5, 5)` is called.
- **Assert (Expected Outcomes)**:
  - Returns an object with `found: true`.
  - `passageCell` is `(5, 6)`.
  - `destination` is calculated as the cell on the opposite side of the door relative to the hero's current `valo` (Area ID).

## Scenario: Prevent Interaction with Already Opened Doors

- **Given**: A `GameSession` where `openedDoors` contains `"5,6"`. A hero is at `(5, 5)` adjacent to the door at `(5, 6)`.
- **When**: `isFrontOfDoor(5, 5)` is called.
- **Assert (Expected Outcomes)**:
  - Returns `null` (or `found: false`), as the door is already processed and no longer acts as an interactive barrier.

## Scenario: Successful Passage Opening and Fog Reveal

- **Given**: A `GameSession` with a closed door at `(10, 10)`. `fogOfWarLogic` is available.
- **When**: `openPassage(10, 10, 10, 11)` is triggered.
- **Assert (Expected Outcomes)**:
  - `sessionManager.openPassage(10, 10, 10, 11, foundPassages)` is called.
  - The call returns `true`.
  - The `useMapInteraction` component does not apply direct session mutation outside the session boundary.

## Scenario: Deterministic Failure Handling (Adversarial/Error)

- **Given**: A `GameSession` where `openPassage` is called for a coordinate that is neither a door nor a discovered secret passage.
- **When**: `openPassage(99, 99, 100, 100)` is triggered.
- **Assert (Expected Outcomes)**:
  - The function returns `false`.
  - `sessionManager.openPassage` is NOT called.
  - System state remains consistent (no partial updates).

## Scenario: Symmetric Destination Calculation

- **Given**: A Vertical door at `(5, 5)`. Hero is at `(4, 5)` (West side).
- **When**: `isFrontOfDoor(4, 5)` is called.
- **Assert (Expected Outcomes)**:
  - `destination` is correctly identified as `(6, 5)` (East side).
  - Logic verifies that if the hero were at `(6, 5)`, the destination would be `(4, 5)`.

## Scenario: Secret Passage Discovery Flow

- **Given**: `foundPassages` contains `{x: 2, y: 2}`. The door is not in `gameSession.openedDoors`.
- **When**: `isFrontOfDoor(2, 3)` is called (adjacent to the secret passage).
- **Assert (Expected Outcomes)**:
  - `found` is `true`.
  - The logic treats the secret passage with the same priority as a standard `MapDoor`.

## Scenario: Guaranteed Completion of State Update

- **Given**: A valid `openPassage` request.
- **When**: `sessionManager.openPassage` returns `false` because fog reveal fails.
- **Assert (Expected Outcomes)**:
  - `useMapInteraction.openPassage` returns `false`.
  - The `gameSession` is NOT updated to an inconsistent state (the door remains closed if the fog reveal fails, preventing a "dead-end" where the door is open but the area is hidden).
