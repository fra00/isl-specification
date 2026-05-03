# Project: Heroquest React Logic Tests

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-12
**Implementation**: ./logic-test/dungeon-use-pathfinding.test

---

> **Reference**: `./dungeon-use-pathfinding.isl.md`

## Domain Concepts

- `logic test scenarios`: Deterministic acceptance scenarios used to verify the referenced HeroQuest component behavior.

## Component: LogicTestScenarios

### Role: Test

### ⚡ Scenarios

<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-pathfinding.isl.md -->

This document outlines the logical test scenarios for the `usePathfinding` component, focusing on state transitions, movement constraints, and deterministic flow.

## Scenario: Pathfinding Blocked by Static Obstacles

- **Given**: A `GameSession` where a hero is at (1,1) and a wall (Rock) exists at (1,2). `maxDepth` is set to 5.
- **When**: `calculatePath(1, 1, 1, 3, 5, heroId)` is called.
- **Assert (Expected Outcomes)**:
  - `movementRules.isWalkable` returns `FALSE` for the transition (1,1) to (1,2).
  - The BFS algorithm correctly identifies the rock as a terminal node for that branch.
  - The function returns an empty list `[]` if no alternative path exists.

## Scenario: Pathfinding Through Discovered Secret Passage

- **Given**: A `GameSession` where a secret passage exists at (5,5). The `foundPassages` list contains `{x: 5, y: 5}`.
- **When**: `calculatePath` is called for a path that requires crossing the secret passage at (5,5).
- **Assert (Expected Outcomes)**:
  - `movementRules.isWalkable` evaluates the passage as `TRUE` because it is present in `foundPassages`.
  - The path returned includes the coordinates of the secret passage.
  - The flow does not treat the passage as a wall.

## Scenario: Pathfinding with Dynamic Monster Obstacle

- **Given**: A `GameSession` where a monster is at (2,2). The hero does not have the "FoggyMist" status.
- **When**: `calculatePath` attempts to traverse through (2,2).
- **Assert (Expected Outcomes)**:
  - `movementRules.isWalkable` returns `FALSE` for the target (2,2) because `isBlockedByMonster` is `TRUE`.
  - The pathfinding algorithm treats the monster as a dynamic obstacle and attempts to route around it.
  - If no detour exists, the function returns an empty list.

## Scenario: Hero Pathfinding Can Traverse Allied Heroes

- **Given**: A hero is surrounded so that the only valid route to an empty destination requires stepping through cells currently occupied by allied heroes.
- **When**: `calculatePath` is called for that empty destination.
- **Assert (Expected Outcomes)**:
  - `movementRules.isWalkable` allows intermediate transitions through allied-hero cells.
  - `isValidDestination` still requires the final target cell to be empty.
  - The returned path is not empty if the only blocking entities are allied heroes on intermediate cells.

## Scenario: Pathfinding with "FoggyMist" Still Respects Occupants

- **Given**: A hero has the `activeStatus` containing "FoggyMist". A monster is blocking the only path to the target.
- **When**: `calculatePath` is called.
- **Assert (Expected Outcomes)**:
  - `movementRules.isWalkable` checks the hero's `activeStatus`.
  - The logic does not allow the hero to traverse the monster cell.
  - The function returns an empty path if no alternative route exists.

## Scenario: Pathfinding with "InvisiblePassage" Can Traverse Occupants

- **Given**: A hero has the `activeStatus` containing "InvisiblePassage". A monster is blocking the only path to the target.
- **When**: `calculatePath` is called.
- **Assert (Expected Outcomes)**:
  - `movementRules.isWalkable` allows traversal across the occupied cell.
  - The returned path may include the occupied intermediate coordinate.
  - The destination must still be empty because `isValidDestination` remains authoritative.

## Scenario: Deterministic Completion (Max Depth Limit)

- **Given**: A target destination is 10 tiles away, but `maxDepth` is set to 5.
- **When**: `calculatePath` is executed.
- **Assert (Expected Outcomes)**:
  - The BFS queue processes nodes until `current.path.length` reaches 5.
  - The algorithm terminates the search for that branch once the depth limit is hit.
  - The function returns an empty list `[]` (or partial path if target reached within depth, but here it is unreachable).
  - The system state remains clean (no hanging flags or memory leaks).

## Scenario: Invalid Destination Handling

- **Given**: A target coordinate (10, 10) that is occupied by furniture.
- **When**: `calculatePath` is called with this target.
- **Assert (Expected Outcomes)**:
  - `movementRules.isValidDestination` is called first.
  - It returns `FALSE` because `isBlockedByFurniture` is `TRUE`.
  - `calculatePath` immediately returns an empty list `[]` without initiating the BFS, ensuring efficiency and logical safety.

## Scenario: Room/Wall Crossing Logic

- **Given**: A hero is in a room with `valo: "A"`. The target is in a room with `valo: "B"`. No door exists between them.
- **When**: `calculatePath` is called.
- **Assert (Expected Outcomes)**:
  - `movementRules.isWalkable` detects `sourceValo != targetValo`.
  - It checks for `isDoor` and `isSecretPassage`.
  - Since neither exists, it returns `FALSE`.
  - The pathfinding algorithm correctly identifies the rooms as disconnected and returns an empty list.

## Scenario: Pathfinding Allows Wall Crossing With Passapareti

- **Given**: A hero has `activeStatus` containing `WallPass`, starts in a cell with `valo: "A"`, and targets a reachable empty cell in `valo: "B"` with no door between the two areas.
- **When**: `calculatePath` is called during that hero's movement phase.
- **Assert (Expected Outcomes)**:
  - The movement rules can resolve the active hero status from the shared session context used by `useDungeonMapQuery`.
  - `movementRules.isWalkable` returns `TRUE` on the room-boundary transition because `WallPass` is active.
  - The returned path crosses the area boundary instead of stopping at the wall.
  - The pathfinding result remains constrained by the hero's normal movement depth; no extra charges or extra path length are created by the spell itself.

## Scenario: Pathfinding Can Target Fogged Cell In Adjacent Room With Passapareti

- **Given**: A hero has `activeStatus` containing `WallPass`, starts in a revealed room, and the destination cell is empty, belongs to an adjacent room, and is still under `fog: true`.
- **When**: `calculatePath` is called for that fogged destination.
- **Assert (Expected Outcomes)**:
  - The target is accepted as a valid destination as long as it is not occupied by furniture, monster, hero, or rock.
  - `movementRules.isWalkable` uses area topology and hero status, not current fog visibility, to evaluate the room transition.
  - The returned path can include cells that are currently not visible to the player.

## Scenario: Turn Logic Consumes Passapareti After One Wall Crossing

- **Given**: The active hero moves along a path that crosses from one `valo` area to another without using a door or secret passage, and `activeStatus` contains `WallPass`.
- **When**: `movementEffect` resolves the first valid wall-crossing step.
- **Assert (Expected Outcomes)**:
  - The move is allowed.
  - `sessionManager.clearCurrentHeroStatus("WallPass")` is requested immediately after that crossing.
  - Any subsequent wall crossing in the same movement requires another valid rule and MUST NOT reuse the consumed `WallPass`.
