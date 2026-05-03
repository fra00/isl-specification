<!-- LOGIC TEST SCENARIOS FOR: domain-session.isl.md -->

## Scenario: Hero Inventory Integrity
- **Given**: A `HeroState` with an empty `inventory` and `equipment` list.
- **When**: An item ID is added to `inventory` and an equipment ID is added to `equipped`.
- **Assert (Expected Outcomes)**: 
    - The `inventory` list contains the added item ID.
    - The `equipped` list contains the added equipment ID.
    - The `HeroState` remains valid (no null references in lists).
    - The `currentBody` and `currentMind` values remain unchanged unless the item/equipment provides a passive modifier.

## Scenario: Monster Spawn Determinism
- **Given**: A `GameSession` with an empty `monsters` list and a `MapDefinition` containing a `MapCell` with a `MapCellMonster` (mos: true).
- **When**: The system triggers a spawn event for that coordinate.
- **Assert (Expected Outcomes)**:
    - A new `MonsterState` is added to the `GameSession.monsters` list.
    - The `spawnedLocations` list in `GameSession` is updated with the "x,y" string of the cell.
    - The `MonsterState` correctly references the static `@Monster` definition.
    - The `currentBody` of the `MonsterState` matches the `MapCellMonster.corpo` value.

## Scenario: Turn Phase Transition Logic
- **Given**: A `HeroState` where `TurnPhase` is `HasMoved`.
- **When**: The hero performs an attack action.
- **Assert (Expected Outcomes)**:
    - The `TurnPhase` transitions to `HasPerformedAction`.
    - The `lastAttack` object in `GameSession` is populated with the combat result.
    - The system prevents further movement actions for the remainder of the turn.

## Scenario: Door Interaction and State Persistence
- **Given**: A `MapDoor` at coordinates (5, 5) and an empty `openedDoors` list in `GameSession`.
- **When**: A hero moves to an adjacent cell and triggers an "Open Door" action.
- **Assert (Expected Outcomes)**:
    - The string "5,5" is added to `GameSession.openedDoors`.
    - The visibility logic (Fog of War) for the adjacent room is updated to `fog: false`.
    - The state change is persistent across subsequent turns.

## Scenario: Guaranteed Completion of Treasure Draw
- **Given**: A `GameSession` with a `treasureDeck` containing at least one `TreasureCard`.
- **When**: A hero performs a "Search for Treasure" action.
- **Assert (Expected Outcomes)**:
    - The `treasureDeck` count decreases by 1.
    - The `GameSession` state is updated to reflect the card's `azione` (e.g., `aggiungi_oro` or `mostro_errante`).
    - If the deck is empty, the flow must trigger a "Deck Reshuffle" or "No Treasure" state to ensure the action completes without hanging.
    - The `isProcessing` flag (if applicable to the UI/Logic bridge) is reset to `false` regardless of whether a card was drawn or the deck was empty.

## Scenario: Adversarial Movement Restriction
- **Given**: A `HeroState` at (1, 1) and a `MapCell` at (1, 2) where `arnt.antroc` is `true` (Rock block).
- **When**: The hero attempts to move to (1, 2).
- **Assert (Expected Outcomes)**:
    - The movement action is rejected by the domain logic.
    - The `HeroState.x` and `HeroState.y` remain at (1, 1).
    - No movement points are deducted from the hero's turn allowance.