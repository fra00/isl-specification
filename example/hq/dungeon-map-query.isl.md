# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-map-query

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`

## Component: useDungeonMapQuery

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession
- `visibilityMap`: @VisibilityMap (Nullable).

### ⚡ Capabilities

#### initialize

- **Contract**: Safely initializes internal structures, handling potential null `visibilityMap`.

#### getMapCell

- **Contract**: Retrieves from `@MapDefinition` data cell at coordinates `@GameSession.currentMap.grid[]`.
  Search for all cells with matching `x` and `y`. Returns null if not found.
- **Signature**: `(x: Integer, y: Integer) -> @MapCell | null`

#### getVisibilityCell

- **Contract**: Retrieves the (`@VisibilityCell`) visibility data from (`@VisibilityMap.data`).
  Search for all cells with matching `x` and `y`. Returns null if not found.
- **Signature**: `(x: Integer, y: Integer) -> @VisibilityCell | null`

#### isDoor

- **Contract**: Retrieves from `@MapDefinition` data cell at coordinates `@GameSession.currentMap.porte`.
  Search for all cells with matching `x` and `y`. Returns null if not found.
- **Signature**: `(x: Integer, y: Integer) -> Boolean`

#### isSecretPassage

- **Contract**: `getMapCell` (@MapCell) and Checks if a secret passage exists at the given coordinates.
- **Signature**: `(x: Integer, y: Integer) -> Boolean`

#### isBlockedByFurniture

- **Contract**: `getMapCell` (@MapCell) and Checks if the cell is blocked by furniture.
- **Signature**: `(x: Integer, y: Integer) -> Boolean`

#### isBlockedByMonster

- **Contract**: `getMapCell` (@MapCell) and Checks if the cell is occupied by a monster.
- **Signature**: `(x: Integer, y: Integer, excludeEntityId: Integer) -> Boolean`

#### isOccupiedByHero

- **Contract**: Checks if the cell is occupied by a hero.
- **Signature**: `(x: Integer, y: Integer, excludeEntityId: Integer) -> Boolean`

#### getMapDimensions

- **Contract**: Returns the width and height of the map.
- **Signature**: `() -> { width: 26, height: 19 }`

### 🚨 Global Constraints

- Must handle `visibilityMap` being null or undefined gracefully without crashing.
