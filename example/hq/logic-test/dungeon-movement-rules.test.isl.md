<!-- LOGIC TEST SCENARIOS FOR: dungeon-movement-rules.isl.md -->

## Scenario: Validate Destination on Occupied Cell

- **Given**: A `GameSession` where a Monster is at coordinates (5, 5) with `currentBody` > 0.
- **When**: `isValidDestination(5, 5, heroId)` is called.
- **Assert (Expected Outcomes)**:
  - Returns `FALSE` because the cell is blocked by a monster.
  - Ensures the `excludeEntityId` logic correctly identifies the target cell as non-traversable for movement termination.

## Scenario: FoggyMist Does Not Allow Crossing Monsters

- **Given**: A Hero with `activeStatus` containing "FoggyMist" at (2, 2). A Monster is positioned at (2, 3).
- **When**: `isWalkable(2, 2, 2, 3, heroId)` is called.
- **Assert (Expected Outcomes)**:
  - Returns `FALSE`.
  - Validates that `FoggyMist` does not override the occupant blocking rules.

## Scenario: InvisiblePassage Allows Hero To Cross Occupants

- **Given**: A Hero with `activeStatus` containing "InvisiblePassage" at (2, 2). A Monster is positioned at (2, 3).
- **When**: `isWalkable(2, 2, 2, 3, heroId)` is called.
- **Assert (Expected Outcomes)**:
  - Returns `TRUE`.
  - Validates that only `InvisiblePassage` allows a hero to traverse an occupied cell during movement.

## Scenario: Monster Cannot Cross Hero Cell

- **Given**: A Monster is moving and a living Hero occupies the only intermediate cell on the route.
- **When**: `isWalkable(sourceX, sourceY, heroX, heroY, monsterId)` is called.
- **Assert (Expected Outcomes)**:
  - Returns `FALSE`.
  - Validates that monsters cannot path through hero-occupied cells.

## Scenario: Hero Can Cross Allied Hero Cell

- **Given**: A Hero is moving and another living Hero occupies the only intermediate cell on the route.
- **When**: `isWalkable(sourceX, sourceY, allyHeroX, allyHeroY, heroId)` is called.
- **Assert (Expected Outcomes)**:
  - Returns `TRUE`.
  - Validates that hero movement may traverse cells occupied by allied heroes.
  - The final destination must still be validated separately by `isValidDestination`.

## Scenario: Active Hero Resolution Uses HeroState heroId

- **Given**: The moving entity is stored in `gameSession.heroes` as a `HeroState` whose identity field is `heroId`, and another allied hero occupies the only intermediate cell.
- **When**: `isWalkable(sourceX, sourceY, allyHeroX, allyHeroY, movingHeroId)` is called.
- **Assert (Expected Outcomes)**:
  - The movement rules resolve the active hero via `HeroState.heroId`.
  - `isHeroMovement` becomes `TRUE` for that moving hero.
  - The allied occupied cell remains traversable as an intermediate step.

## Scenario: Crossing Rooms Without Door or Status

- **Given**: `VisibilityCell` at (3, 3) has `valo` "RoomA". `VisibilityCell` at (3, 4) has `valo` "RoomB". No door or secret passage exists between these coordinates. The Hero has no special status.
- **When**: `isWalkable(3, 3, 3, 4, heroId)` is called.
- **Assert (Expected Outcomes)**:
  - Returns `FALSE`.
  - Ensures that movement between distinct `valo` zones is strictly gated by the presence of doors, passages, or specific hero status effects.

## Scenario: Boundary Constraint Enforcement

- **Given**: A map with dimensions 26x19.
- **When**: `isWalkable` is called with target coordinates (0, 5) or (27, 5).
- **Assert (Expected Outcomes)**:
  - Returns `FALSE` for any coordinate outside the [1, 26] and [1, 19] range.
  - Ensures the system prevents out-of-bounds memory access or logic errors.

## Scenario: Deterministic Handling of Missing Visibility Data

- **Given**: `visibilityMap` is `null` or the `VisibilityCell` for a specific coordinate is missing.
- **When**: `isWalkable` is called for adjacent cells.
- **Assert (Expected Outcomes)**:
  - Returns `TRUE` (assuming no other obstacles like furniture or rocks exist).
  - Ensures the system defaults to "open space" behavior rather than crashing or blocking movement when metadata is incomplete.

## Scenario: Rock Obstacle Blocking

- **Given**: A `MapCell` at (10, 10) where `arnt.antroc` is `TRUE`.
- **When**: `isValidDestination(10, 10, heroId)` is called.
- **Assert (Expected Outcomes)**:
  - Returns `FALSE`.
  - Confirms that rock-blocked cells are correctly identified as invalid for ending movement.

## Scenario: Hero Passing Through Wall via Status

- **Given**: A Hero with `activeStatus` containing "WallPass" at (5, 5). Target (5, 6) is in a different `valo` zone with no door.
- **When**: `isWalkable(5, 5, 5, 6, heroId)` is called.
- **Assert (Expected Outcomes)**:
  - Returns `TRUE`.
  - Validates that the `activeStatus` correctly bypasses the room-crossing restriction logic.

## Scenario: Deterministic Completion of Monster Check

- **Given**: A monster exists at (4, 4) but its `currentBody` is 0 (defeated).
- **When**: `isBlockedByMonster(4, 4, heroId)` is called.
- **Assert (Expected Outcomes)**:
  - Returns `FALSE`.
  - Ensures that defeated monsters do not block movement, maintaining flow continuity and preventing logical dead-ends where a hero is trapped by a "dead" entity.
