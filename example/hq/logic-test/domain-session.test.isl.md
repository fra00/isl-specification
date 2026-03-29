<!-- LOGIC TEST SCENARIOS FOR: domain-session.isl.md -->

# GameDomainSession Logic Test Scenarios

## Scenario: Hero Inventory Integrity
- **Given**: A `HeroState` with an empty `inventory` and `equipment` list.
- **When**: An `Item` or `Equipment` ID is added to the respective lists.
- **Assert (Expected Outcomes)**:
    - The ID must exist within the valid range defined in `@Item` or `@Equipment`.
    - The `HeroState` must not allow duplicate IDs if the business rule dictates unique ownership.
    - Adding an item must not trigger a state mutation in the static `@Hero` definition.

## Scenario: Monster Spawn Determinism
- **Given**: A `GameSession` with a `currentMap` containing `MapCellMonster` definitions and an empty `monsters` list.
- **When**: The game engine triggers a spawn event for a specific coordinate (x, y).
- **Assert (Expected Outcomes)**:
    - The coordinate (x, y) must be added to `spawnedLocations` to prevent duplicate spawning.
    - A new `MonsterState` must be instantiated using the `@Monster` definition linked to the `MapCellMonster.mosid`.
    - The `currentBody` and `currentMind` of the `MonsterState` must initialize to the values defined in the static `@Monster` definition unless overridden by `MapCellMonster` properties.

## Scenario: Door Interaction State
- **Given**: A `GameSession` where a door exists at (x, y) in `currentMap.porte`.
- **When**: A hero performs an "Open Door" action at (x, y).
- **Assert (Expected Outcomes)**:
    - The coordinate "x,y" must be appended to `openedDoors`.
    - The `VisibilityMap` must be updated to reveal the area behind the door (fog of war removal).
    - If the door triggers a `MapScript`, the script must be queued for execution.

## Scenario: Turn Phase Transition Continuity
- **Given**: A `HeroState` in `TurnPhase.HasMoved` state.
- **When**: The hero performs an action (e.g., `attack` or `search`).
- **Assert (Expected Outcomes)**:
    - The state must transition to `TurnPhase.HasPerformedAction`.
    - The system must validate that the hero has sufficient movement points remaining if the action is movement-dependent.
    - The system must prevent a second "Action" phase if the current phase is already `HasPerformedAction`.

## Scenario: Guaranteed Completion of Treasure Draw
- **Given**: A `GameSession` with a `treasureDeck` containing at least one `TreasureCard`.
- **When**: A hero triggers a "Search for Treasure" action.
- **Assert (Expected Outcomes)**:
    - The `treasureDeck` must return the top card and remove it from the list.
    - If the deck is empty, the flow must handle the "Empty Deck" state (e.g., reshuffle or no-op) without crashing.
    - The `HeroState` must be updated based on the `TreasureCard.azione` (e.g., `modifica_hp` or `aggiungi_oro`).
    - The system must ensure the "isProcessing" flag (if applicable to the UI/Logic bridge) is reset to `false` regardless of whether the card effect was a trap or a reward, ensuring the turn can proceed.

## Scenario: Adversarial Movement Validation
- **Given**: A `HeroState` at (x, y) and a `MapCell` at (x+1, y) where `arnt.antroc` is `true`.
- **When**: The hero attempts to move to (x+1, y).
- **Assert (Expected Outcomes)**:
    - The movement action must be rejected.
    - The `HeroState` coordinates (x, y) must remain unchanged.
    - The `TurnPhase` must not advance to `HasMoved` if the move was invalid.

## Scenario: Deterministic Session Cleanup
- **Given**: A `GameSession` with active `monsters` and `openedDoors`.
- **When**: The `currentMissionIndex` is incremented (Mission Complete).
- **Assert (Expected Outcomes)**:
    - All `monsters` must be cleared from the `GameSession`.
    - `openedDoors` and `spawnedLocations` must be reset to empty lists.
    - `currentTurn` must reset to 1.
    - The `HeroState` must persist `gold`, `inventory`, and `equipment` while resetting `currentBody` and `currentMind` to base values (or mission-start values).
    - The system must guarantee that no stale references to the previous `MapDefinition` remain in memory.