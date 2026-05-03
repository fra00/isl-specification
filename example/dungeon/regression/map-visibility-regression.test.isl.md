# Project: Dungeon React Regression Tests

**Version**: 1.0.0
**ISL Version**: 1.6.2
**Created**: 2026-04-27
**Implementation**: ./regression/map-visibility-regression.test

---

> **Reference**: `../dungeon-use-session-manager.isl.md`
> **Reference**: `../dungeon-use-map-interaction.isl.md`
> **Reference**: `../dungeon-use-fog-of-war.isl.md`

## Component: MapVisibilityRegression

### Role: Test

### ⚡ Scenarios

## Scenario: Open Door Persists Only After Successful Fog Reveal

- **Target**: `useDungeonSessionManager.openPassage`
- **Given**:
  - Hero tries to open a valid door/passage.
  - Destination side is computed as reachable.
- **When**:
  - Door opening flow triggers `revealFromPoint(destinationX, destinationY)`.
- **Assert (Expected Outcomes)**:
  - If destination cell becomes visible (`fog = false`), door coordinate is appended to `openedDoors`.
  - Notification `"Porta aperta."` is emitted only after successful reveal and persistence.

## Scenario: Open Door Fails If Destination Remains Fogged

- **Target**: `useDungeonSessionManager.openPassage`
- **Given**:
  - Door interaction is requested but reveal outcome does not clear destination fog.
- **When**:
  - Door open flow validates post-reveal destination cell.
- **Assert (Expected Outcomes)**:
  - Operation returns false.
  - Door is NOT added to `openedDoors`.
  - Notification `"Impossibile aprire la porta da questa posizione."` is emitted.

## Scenario: Door Destination Resolution Is Orientation-Aware

- **Target**: `useMapInteraction.isFrontOfDoor`
- **Given**:
  - Hero stands adjacent to a door with orientation constraints.
- **When**:
  - Logical destination is computed from door geometry and room sides.
- **Assert (Expected Outcomes)**:
  - Candidate destination side is computed symmetrically and filtered to valid map cells.
  - Ambiguous or blocked destination returns `null`.
  - Door opening request is rejected when destination side is invalid.

## Scenario: Revealed Cells Stay Revealed After Door Open

- **Target**: `useFogOfWar` permanence rule
- **Given**:
  - Door opening successfully reveals destination cells.
- **When**:
  - Heroes move away and visibility is recalculated later.
- **Assert (Expected Outcomes)**:
  - Previously revealed cells remain `fog = false`.
  - Fog does not regress to hidden state for already discovered cells.

### ✅ Coverage Intent

- Covers door-open + fog integration and map interaction destination correctness.
- Prevents "door opened but no reveal" regressions and invalid side-resolution behavior.

