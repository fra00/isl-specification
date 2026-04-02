# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-movement-rules

---

> **Reference**: @useDungeonMapQuery in `./dungeon-map-query.isl.md`
> **Reference**: @MapCell, @VisibilityCell in `./domain-map.isl.md`

## Component: useDungeonMovementRules

### Role: Business Logic

**Signature**:

- `mapQuery`: Object (Result of @useDungeonMapQuery)

### ⚡ Capabilities

#### isValidDestination

- **Contract**: Checks if a unit can end its movement at the target cell.
- **Signature**: `(x: Integer, y: Integer, excludeEntityId: Integer) -> Boolean`
- **Flow**:
  - Return FALSE if `mapQuery.getMapCell(x, y)` (@MapCell) is null.
  - Return FALSE if `mapQuery.isBlockedByFurniture(x, y)`.
  - Return FALSE if `mapQuery.isBlockedByMonster(x, y, excludeEntityId)`.
  - Return FALSE if `mapQuery.isOccupiedByHero(x, y, excludeEntityId)`.
  - Return FALSE if `mapQuery.isBlockedByRock(x, y)`.
  - Return TRUE.

#### isWalkable

- **Contract**: Checks if a unit can move from Source to Target (adjacent).
- **Signature**: `(sourceX: Integer, sourceY: Integer, targetX: Integer, targetY: Integer, excludeEntityId: Integer) -> Boolean`
- **Flow**:
  - **Bounds Check**: Return FALSE if target coordinates are less than 1 or greater than the map dimensions (using `mapQuery.getMapDimensions`).
  - **Static Obstacles**: Return FALSE if `mapQuery.isBlockedByFurniture(targetX, targetY)`.
  - **Dynamic Obstacles**: 
    - IF `mapQuery.isBlockedByMonster(targetX, targetY, excludeEntityId)` is TRUE:
      - Find the Hero in `mapQuery.gameSession.heroes` with `heroId` matching `excludeEntityId`.
      - IF hero exists AND `hero.activeStatus` contains "FoggyMist":
        - // Traversal allowed through monsters due to spell effect.
      - ELSE: Return FALSE.
  - **Rock Obstacles**: Return FALSE if `mapQuery.isBlockedByRock(targetX, targetY)`.
  - **Room/Wall Logic**:
    - Get `sourceValo` from `mapQuery.getVisibilityCell(sourceX, sourceY)` (@VisibilityCell).
    - Get `targetValo` from `mapQuery.getVisibilityCell(targetX, targetY)` (@VisibilityCell).
    - IF sourceValo IS NULL OR targetValo IS NULL: RETURN TRUE (Assume open space if visibility data missing).
    - **(Crossing Rooms)**: IF `sourceValo` != `targetValo`:
      - IF `mapQuery.isDoor(sourceX, sourceY)` OR `mapQuery.isDoor(targetX, targetY)` OR `mapQuery.isSecretPassage(sourceX, sourceY)` OR `mapQuery.isSecretPassage(targetX, targetY)`:
        - Return TRUE.
      - Find the Hero in `mapQuery.gameSession.heroes` with `heroId` matching `excludeEntityId`.
      - IF hero exists AND (`hero.activeStatus` contains "WallPass" OR `hero.activeStatus` contains "InvisiblePassage"):
        - Return TRUE.
      - Return FALSE.
  - Return TRUE.
