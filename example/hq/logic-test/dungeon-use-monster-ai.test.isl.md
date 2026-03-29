<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-monster-ai.isl.md -->

## Scenario: Monster Movement Blocked by Dynamic Entities
- **Given**: A `Monster` is at (5, 5). A `Hero` is at (5, 7). The path (5, 6) is clear, but (5, 7) is occupied by the `Hero`.
- **When**: `runMonsterTurn` is triggered and the `Monster` attempts to move toward the `Hero`.
- **Assert (Expected Outcomes)**:
    - The `Monster` calculates the path to (5, 7).
    - The `Occupancy Check` identifies (5, 7) as occupied.
    - The `Monster` stops at (5, 6) (the last valid, unoccupied cell in the path).
    - The `Monster` does not overlap the `Hero`.

## Scenario: Monster Turn Skip due to Status Effects
- **Given**: A `Monster` has "Sleep" in its `activeStatus` list.
- **When**: `runMonsterTurn` reaches this specific `Monster`.
- **Assert (Expected Outcomes)**:
    - `onNotify` is triggered with the message indicating the monster is sleeping.
    - The `Monster` movement logic is bypassed entirely.
    - The loop proceeds immediately to the next `Monster` in the `gameSession.monsters` list.

## Scenario: Hero Defense against Monster Attack
- **Given**: A `Monster` (Attack: 3) is adjacent to a `Hero` (Defense: 2).
- **When**: `runMonsterTurn` triggers `combatLogic.resolveCombat`.
- **Assert (Expected Outcomes)**:
    - `combatLogic` generates 3 attack dice for the monster and 2 defense dice for the hero.
    - `damageDealt` is calculated as `Max(0, Skulls - WhiteShields)`.
    - `hero.currentBody` is updated by subtracting `damageDealt`.
    - `gameSession.lastAttack` is populated with the correct combat result.

## Scenario: Deterministic Turn Reset
- **Given**: All `Monster` actions in `runMonsterTurn` have completed.
- **When**: The `runMonsterTurn` function reaches the "End Phase".
- **Assert (Expected Outcomes)**:
    - `gameSession.currentTurn` is reset to 1.
    - All `TurnPhase` flags (`HasMoved`, `HasPerformedAction`, `IsTurnFinished`) for all heroes are set to `false`.
    - `onNotify` confirms the transition to the Hero turn.
    - The system state is guaranteed to be ready for the next player input, preventing a logical dead-end.

## Scenario: Fog of War Constraint on Targeting
- **Given**: A `Hero` is at (10, 10), but the `VisibilityCell` at (10, 10) has `fog: true`.
- **When**: `findNearestHero` is called by a `Monster`.
- **Assert (Expected Outcomes)**:
    - The `Hero` is excluded from the candidate list because they are in a fogged area.
    - If no other heroes are visible, `findNearestHero` returns `null`.
    - The `Monster` does not move or attack, as it cannot "see" the target.

## Scenario: RockSkin Status Removal
- **Given**: A `Hero` has "RockSkin" in `activeStatus` and receives 1 damage from a `Monster`.
- **When**: `runMonsterTurn` applies the combat result.
- **Assert (Expected Outcomes)**:
    - `hero.currentBody` is reduced.
    - "RockSkin" is removed from `hero.activeStatus`.
    - `onNotify` is triggered to inform the player that the "RockSkin" has shattered.

## Scenario: Instant Attack Flow Integrity
- **Given**: A `Monster` is triggered via `performInstantAttack` against a `Hero`.
- **When**: The combat resolves and the `Hero` reaches 0 Body Points.
- **Assert (Expected Outcomes)**:
    - `onNotify` reports the hero's defeat.
    - `gameSession` is updated via `onUpdateSession`.
    - The process waits 1000ms to ensure the UI reflects the final state before potentially triggering game-over logic.
    - The flow completes deterministically without leaving the system in a "processing" state.