# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-map-interaction

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @useDungeonSessionManager in `./dungeon-use-session-manager.isl.md`

## Domain Concepts

### 📦 Content/Structure

- This component resolves passage geometry and delegates any persistent door mutation to the dungeon session boundary.

## Component: useMapInteraction

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession
- `foundPassages`: List of {x: Integer, y: Integer} (Discovered secret passages from useSecretPassages).
- `sessionManager`: @useDungeonSessionManager

### ⚡ Capabilities

#### isFrontOfDoor

- **Contract**: Checks if coordinates are on or adjacent to a passage (door or revealed secret passage) and calculates the logical destination.
- **Signature**: `(x: Integer, y: Integer) -> { found: Boolean, destination: {x: Integer, y: Integer}, passageCell: {x: Integer, y: Integer} } | null`
- **Flow**:
  - Search for a valid Passage at the provided `(x, y)` coordinates or its 4 cardinal neighbors (Up, Down, Left, Right).
  - **🚨 Constraint**: Diagonals MUST be ignored.
    - A Passage is valid if it is a Door or a Secret Passage that has been previously discovered AND it is NOT in `gameSession.openedDoors`.
  - IF no Passage is found:
    - RETURN null.
  - Identify the orientation of the found Passage (Horizontal or Vertical).
  - **Orientation Validation**:
    - IF Passage is **Horizontal** (`oriz` is true):
      - Valid ONLY IF hero is at `passage.x, passage.y` OR `passage.x, passage.y-1` OR `passage.x, passage.y+1`.
    - ELSE IF Passage is **Vertical** (`oriz` is false):
      - Valid ONLY IF hero is at `passage.x, passage.y` OR `passage.x-1, passage.y` OR `passage.x+1, passage.y`.
    - IF not valid for orientation: RETURN null.
  - **Determine the Logical Destination**:
    - Find the hero whose turn it is in `gameSession`.
    - Let `heroArea` be the Area ID (`valo`) of the cell where the hero is currently standing.
    - Identify the two cells connected by the Passage:
      - IF **Horizontal**: `sideA` is (passage.x, passage.y - 1), `sideB` is (passage.x, passage.y).
      - ELSE (**Vertical**): `sideA` is (passage.x - 1, passage.y), `sideB` is (passage.x, passage.y).
    - IF `sideA.valo` matches `heroArea`:
      - The Destination is `sideB`.
    - ELSE:
      - The Destination is `sideA`. (Symmetric logic ensures transition regardless of starting side).
  - Return the Passage location and the calculated Destination.

#### openPassage

- **Contract**: Validates the requested passage opening and delegates the session mutation to the dungeon session boundary.
- **Signature**: `(passageX: Integer, passageY: Integer, destinationX: Integer, destinationY: Integer) -> Boolean`
- **Flow**:
  - IF `gameSession` is null OR `gameSession.currentMap` is null RETURN false.
  - IF NOT (gameSession.currentMap.porte.exists(p => p.x == passageX AND p.y == passageY) OR foundPassages.exists(p => p.x == passageX AND p.y == passageY)) THEN RETURN false.
  - RETURN `sessionManager.openPassage(passageX, passageY, destinationX, destinationY, foundPassages)`.
