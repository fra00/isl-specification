# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-map-interaction

---

> **Reference**: @GameSession in `./domain-session.isl.md`

## Component: useMapInteraction

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession
- `foundPassages`: List of {x: Integer, y: Integer} (Discovered secret passages from useSecretPassages).
- `onUpdateSession`: (session: @GameSession) -> void
- `onNotify`: (message: String) -> void
- `fogOfWarLogic`: @useFogOfWar

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
    - Identify the two potential destination cells (`sideA`, `sideB`) adjacent to the Passage (North/South if Horizontal, East/West if Vertical).
    - IF `sideA.valo` matches `heroArea`:
      - The Destination is `sideB`.
    - ELSE:
      - The Destination is `sideA`. (Symmetric logic ensures transition regardless of starting side).
  - Return the Passage location and the calculated Destination.

#### openPassage

- **Contract**: Marks a door as open and reveals the area behind it.
- **Signature**: `(passageX: Integer, passageY: Integer, destinationX: Integer, destinationY: Integer)`
- **Flow**:
  - Let `coordKey` = `passageX + "," + passageY`.
  - IF NOT (gameSession.currentMap.porte.exists(p => p.x == passageX AND p.y == passageY) OR foundPassages.exists(p => p.x == passageX AND p.y == passageY)) THEN RETURN.
  - IF `gameSession.openedDoors` does NOT contain `coordKey`:
    - TRY:
      - Call `fogOfWarLogic.revealFromPoint(destinationX, destinationY)`.
      - Add `coordKey` to `gameSession.openedDoors`.
      - Trigger `onNotify("Porta aperta.")`.
      - Trigger `onUpdateSession` with updated session.
    - CATCH:
      - LOG "Errore durante l'apertura della porta o rivelazione nebbia."
