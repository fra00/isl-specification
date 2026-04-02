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

## Scenario: Pathfinding with "FoggyMist" Status (Adversarial/Special)
- **Given**: A hero has the `activeStatus` containing "FoggyMist". A monster is blocking the only path to the target.
- **When**: `calculatePath` is called.
- **Assert (Expected Outcomes)**:
    - `movementRules.isWalkable` checks the hero's `activeStatus`.
    - The logic allows the hero to move into the monster's cell (traversal allowed).
    - The path returned includes the monster's coordinates.

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