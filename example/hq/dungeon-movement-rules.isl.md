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
  - Return TRUE.

#### isWalkable
- **Contract**: Checks if a unit can move from Source to Target (adjacent).
- **Signature**: `(sourceX: Integer, sourceY: Integer, targetX: Integer, targetY: Integer, excludeEntityId: Integer) -> Boolean`
- **Flow**:
  - **Bounds Check**: Return FALSE if target coordinates are less than 1 or greater than the map dimensions (using `mapQuery.getMapDimensions`).
  - **Static Obstacles**: Return FALSE if `mapQuery.isBlockedByFurniture(targetX, targetY)`.
  - **Dynamic Obstacles**: Return FALSE if `mapQuery.isBlockedByMonster(targetX, targetY, excludeEntityId)`.
  - **Room/Wall Logic**:
    - Get `sourceValo` from `mapQuery.getVisibilityCell(sourceX, sourceY)` (@VisibilityCell).
    - Get `targetValo` from `mapQuery.getVisibilityCell(targetX, targetY)` (@VisibilityCell).
    - **Rule 1 (Entering Wall)**: IF `targetValo` is NULL:
      - Return TRUE IF `mapQuery.isDoor(targetX, targetY)` OR `mapQuery.isSecretPassage(targetX, targetY)`.
      - ELSE Return FALSE.
    - **Rule 2 (Crossing Rooms)**: IF `sourceValo` != `targetValo`:
      - Return TRUE IF `mapQuery.isDoor(sourceX, sourceY)` OR `mapQuery.isDoor(targetX, targetY)` OR `mapQuery.isSecretPassage(sourceX, sourceY)` OR `mapQuery.isSecretPassage(targetX, targetY)`.
      - ELSE Return FALSE.
  - Return TRUE.