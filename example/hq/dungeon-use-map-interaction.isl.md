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
- **Signature**: `(x: Integer, y: Integer) -> { found: Boolean, destination: {x: Integer, y: Integer} | null, passageCell: {x: Integer, y: Integer} | null }`
- **Flow**:
  - Search for a valid Passage at the provided coordinates or in the immediate adjacent cells.
    - A Passage is valid if it is a Door or a Secret Passage that has been previously discovered AND it is NOT in `gameSession.openedDoors`.
  - IF no Passage is found, report that no interaction is possible.
  - Identify the orientation of the found Passage (Horizontal or Vertical).
  - **Determine the Logical Destination**:
    - Inspect the two cells adjacent to the Passage along its axis of transition.
    - For Horizontal Passages, check the cells above and below.
    - For Vertical Passages, check the cells to the left and right.
    - Compare the Area ID (`valo`) of these cells with the Area ID of the starting position.
    - The Destination is the adjacent cell that belongs to a different, valid Area (not wall or void).
  - Return the Passage location and the calculated Destination.
  - ELSE IF no valid Destination area is found, return no result.

#### openPassage

- **Contract**: Marks a door as open and reveals the area behind it.
- **Signature**: `(passageX: Integer, passageY: Integer, destinationX: Integer, destinationY: Integer)`
- **Flow**:
  - Let `coordKey` = `passageX + "," + passageY`.
  - IF `gameSession.openedDoors` does NOT contain `coordKey`:
    - Add `coordKey` to `gameSession.openedDoors`.
    - Trigger `onNotify("Porta aperta.")`.
    - TRY:
      - **Reveal Vision**:
        - Call `fogOfWarLogic.revealFromPoint(destinationX, destinationY)`.
      - Trigger `onUpdateSession` with updated session.
    - CATCH:
      - LOG "Errore durante l'apertura della porta o rivelazione nebbia."
