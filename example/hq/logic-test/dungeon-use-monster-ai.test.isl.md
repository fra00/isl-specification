<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-monster-ai.isl.md -->

This test suite focuses on the **Business Logic** and **Flow Integrity** of the `useMonsterAI` component, ensuring deterministic state transitions and adherence to the dungeon rules.

## Scenario: Monster Turn Initialization and Skipping

- **Given**: A `GameSession` where `currentTurn` > number of heroes. One monster has `activeStatus` = ["Sleep"], another has ["Tempest"].
- **When**: `runMonsterTurn` is triggered.
- **Assert (Expected Outcomes)**:
  - `isMonsterTurnInProgress` is set to `true`.
  - The "Sleep" monster triggers `onNotify` and skips movement/combat logic.
  - The "Tempest" monster triggers `onNotify`, removes "Tempest" from `activeStatus`, and skips movement/combat logic.
  - `sessionManager.updateMonsterState(monster.id, null, null, ["Tempest"])` is called after the status removal decision.

## Scenario: Pathfinding and Movement Constraints

- **Given**: A monster is 5 tiles away from a hero. A wall (rock) exists between them. The path is partially covered by `fog = true`.
- **When**: `runMonsterTurn` calculates the path.
- **Assert (Expected Outcomes)**:
  - The pathfinding algorithm ignores cells where `fog` is `true`.
  - The monster does not move into or through cells blocked by `isBlockedByRock` or `isBlockedByFurniture`.
  - The monster stops movement if the calculated `reachablePath` is blocked by another entity (Hero or Monster).
  - The monster never moves into a cell occupied by another entity.

## Scenario: Combat Resolution and Status Effects

- **Given**: A monster is adjacent to a hero with `activeStatus` = ["RockSkin"].
- **When**: `runMonsterTurn` executes the combat phase for this monster.
- **Assert (Expected Outcomes)**:
  - `combatLogic.resolveCombat` is called with correct dice counts.
  - `sessionManager.resolveMonsterAttack(monster.id, hero.heroId, combatResult)` is called.
  - If `damageDealt` > 0, the persisted hero body is reduced and "RockSkin" is removed by the boundary.
  - `gameSession.lastAttack` is updated through the boundary with the combat result.
  - `onNotify` is triggered to announce the attack and the shattering of "RockSkin".

## Scenario: Deterministic Turn Completion (Flow Integrity)

- **Given**: All monsters have completed their movement and combat actions.
- **When**: The final monster in the `gameSession.monsters` list finishes its turn.
- **Assert (Expected Outcomes)**:
  - `isMonsterTurnInProgress` is reset to `false`.
  - `sessionManager.startNextHeroRound()` is called.
  - `gameSession.currentTurn` is reset to `1` by the boundary.
  - All heroes' `turnPhase` flags (`HasMoved`, `HasPerformedAction`, `IsTurnFinished`) are reset to `false` by the boundary.
  - `onNotify` triggers "Nuovo Turno! Tocca agli eroi."
  - The system is in a valid state for the next hero input, ensuring no logical dead-ends.

## Scenario: Instant Attack (Mostro Errante)

- **Given**: A monster is spawned via `performInstantAttack` against a hero.
- **When**: `performInstantAttack` is called.
- **Assert (Expected Outcomes)**:
  - `onNotify` announces the immediate attack.
  - Combat is resolved using `combatLogic`.
  - If the hero's `currentBody` reaches <= 0, the death notification is triggered.
  - `sessionManager.resolveMonsterAttack(monster.id, hero.heroId, combatResult)` persists the damage and `lastAttack`.
  - The flow waits (simulated delay) before returning control, ensuring the UI has time to reflect the state change.

## Scenario: Targeting Logic (Nearest Hero)

- **Given**: Two heroes are on the map. Hero A is at distance 3 (visible), Hero B is at distance 2 (visible).
- **When**: `findNearestHero` is called for a monster.
- **Assert (Expected Outcomes)**:
  - The monster identifies Hero B as the target.
  - If Hero B enters `fog` (becomes hidden), the monster re-evaluates and targets Hero A.
  - If no heroes are visible (all in fog), the function returns `null` and the monster remains stationary.
