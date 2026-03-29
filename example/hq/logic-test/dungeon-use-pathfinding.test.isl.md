<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-pathfinding.isl.md -->

This document outlines the logical test scenarios for the `usePathfinding` component, ensuring structural integrity, flow continuity, and deterministic behavior in the Heroquest pathfinding logic.

## Scenario: Pathfinding Blocked by Static Obstacle
- **Given**: A `GameSession` where a `MapCell` at (5, 5) has `arnt.antroc = true` (Rock).
- **When**: `calculatePath` is called from (5, 4) to (5, 6) with `maxDepth = 10`.
- **Assert (Expected Outcomes)**:
    - The pathfinding algorithm must identify (5, 5) as non-walkable via `isWalkable`.
    - The returned path must be empty (no valid route).
    - The system must not enter an infinite loop or crash when encountering the rock.

## Scenario: Pathfinding Through Discovered Secret Passage
- **Given**: A `GameSession` where a secret passage exists at (10, 10). The `foundPassages` list contains `{x: 10, y: 10}`.
- **When**: `calculatePath` is called from (10, 9) to (10, 11).
- **Assert (Expected Outcomes)**:
    - `movementRules.isWalkable` must return `TRUE` for the transition between (10, 9) and (10, 10) because the passage is in `foundPassages`.
    - The path must successfully include the secret passage coordinate in the returned list.

## Scenario: Pathfinding with "FoggyMist" Status Effect
- **Given**: A hero with `excludeEntityId = 1` has `activeStatus` containing "FoggyMist". A monster is standing at (3, 3).
- **When**: `calculatePath` is called for the hero, attempting to traverse through the monster's coordinate (3, 3).
- **Assert (Expected Outcomes)**:
    - `isWalkable` must evaluate the monster presence and override the block due to the "FoggyMist" status.
    - The path must successfully traverse through the monster's cell.
    - The path must be the shortest valid route considering the override.

## Scenario: Deterministic Completion and Boundary Safety
- **Given**: A `GameSession` with a map of 26x19. `calculatePath` is called with `targetX = 50, targetY = 50` (out of bounds).
- **When**: The pathfinding logic executes.
- **Assert (Expected Outcomes)**:
    - `movementRules.isValidDestination` must return `FALSE` for out-of-bounds coordinates.
    - `calculatePath` must return an empty list immediately upon the pre-check failure.
    - The system must not attempt to access `grid` indices that would cause an out-of-bounds exception.

## Scenario: Pathfinding Depth Limitation
- **Given**: A path exists between (1, 1) and (1, 10) consisting of 9 steps. `maxDepth` is set to 5.
- **When**: `calculatePath` is called.
- **Assert (Expected Outcomes)**:
    - The BFS algorithm must terminate the search branch once `path.length` reaches `maxDepth`.
    - The function must return an empty list, as the target is unreachable within the allowed depth.
    - The system must release the BFS queue and return to a stable state.

## Scenario: Adversarial/Invalid Entity ID Handling
- **Given**: A `GameSession` where `excludeEntityId` is provided as a non-existent hero ID.
- **When**: `calculatePath` is called.
- **Assert (Expected Outcomes)**:
    - The logic must handle the missing hero gracefully (i.e., not crash when checking `activeStatus`).
    - The pathfinding must default to standard movement rules (no status-based overrides).
    - The function must return a valid path if one exists under standard rules, or an empty list if blocked.

## Scenario: Guaranteed Completion (No Dead-Ends)
- **Given**: A complex map with multiple rooms and closed doors.
- **When**: `calculatePath` is triggered for a target that is logically unreachable (e.g., behind a closed door not in `foundPassages`).
- **Assert (Expected Outcomes)**:
    - The BFS must exhaust all reachable nodes within the `maxDepth`.
    - The function must return an empty list `[]` rather than `null` or `undefined`.
    - The flow must ensure that the `visited` set is cleared/scoped to the current execution, preventing memory leaks or state pollution for subsequent calls.