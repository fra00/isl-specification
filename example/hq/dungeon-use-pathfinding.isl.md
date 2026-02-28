# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-pathfinding

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @useDungeonMapQuery in `./dungeon-map-query.isl.md`
> **Reference**: @useDungeonMovementRules in `./dungeon-movement-rules.isl.md`

## Component: usePathfinding

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession (Current session state).
- `visibilityMap`: @VisibilityMap (The static board configuration loaded from JSON).

### ⚡ Capabilities

#### internal State
- hooksDungeonMapQuery: @useDungeonMapQuery passing `gameSession` and `visibilityMap`.
- hooksDungeonMovementRules: @useDungeonMovementRules passing `hooksDungeonMapQuery`.

#### calculatePath

- **Contract**: Calculates the shortest path between two points on the grid using BFS, considering obstacles.
- **Signature**: `(startX: Integer, startY: Integer, targetX: Integer, targetY: Integer, maxDepth: Integer, excludeEntityId: Integer) -> List<{x, y}>`
- **Flow**:
  - Initialize `mapQuery` using `hooksDungeonMapQuery`.
  - Initialize `movementRules` using `hooksDungeonMovementRules(mapQuery)`.
  - **Pre-check**: IF `movementRules.isValidDestination(targetX, targetY, excludeEntityId)` is FALSE, Return empty path.
  - **BFS Algorithm**:
    - Initialize `queue` with start node `{x: startX, y: startY, path: []}`.
    - Initialize `visited` set with start coordinates.
    - WHILE `queue` is not empty:
      - Dequeue `current` node.
      - IF `current` is target, Return `current.path`.
      - IF `current.path.length` >= `maxDepth`, Continue.
      - FOR EACH neighbor (Up, Down, Left, Right):
        - IF neighbor not visited AND `movementRules.isWalkable(current.x, current.y, neighbor.x, neighbor.y, excludeEntityId)`:
          - Mark neighbor as visited.
          - Enqueue neighbor with updated path.
  - Return empty path if no path found.
