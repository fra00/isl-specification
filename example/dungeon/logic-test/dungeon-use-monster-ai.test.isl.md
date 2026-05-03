# Project: Dungeon React Logic Tests

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-12
**Implementation**: ./logic-test/dungeon-use-monster-ai.test

---

> **Reference**: `./dungeon-use-monster-ai.isl.md`

## Domain Concepts

- `logic test scenarios`: Deterministic acceptance scenarios used to verify the referenced Dungeon component behavior.

## Component: LogicTestScenarios

### Role: Test

### ⚡ Scenarios

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

## Scenario: Monster Must Not Skip Over First Fogged Step

- **Given**: A monster has a valid path toward a hero, but the first non-current visible segment is interrupted by a cell still under `fog: true`, while a later cell in the same path would be visible.
- **When**: `runMonsterTurn` processes that path.
- **Assert (Expected Outcomes)**:
  - The monster stops path consumption at the first fogged step.
  - The movement logic does not compress the path by removing hidden intermediate cells.
  - `sessionManager.updateMonsterState(...)` is never called with a later visible cell beyond that fogged interruption.

## Scenario: Monster Only Chooses Topological Attack Cells

- **Given**: A hero has orthogonally adjacent cells that look close by coordinates, but some of those cells are separated from the hero by a wall boundary.
- **When**: `runMonsterTurn` computes `validAdjacents` around that hero.
- **Assert (Expected Outcomes)**:
  - Cells that are not true melee-contact positions are excluded.
  - The monster only approaches cells from which `canAttackHeroFromPosition(...)` would be true.

## Scenario: Combat Resolution and Status Effects

- **Given**: A monster is adjacent to a hero with `activeStatus` = ["RockSkin"].
- **When**: `runMonsterTurn` executes the combat phase for this monster.
- **Assert (Expected Outcomes)**:
  - `combatLogic.resolveCombat` is called with correct dice counts.
  - `sessionManager.resolveMonsterAttack(monster.id, hero.heroId, combatResult)` is called.
  - If `damageDealt` > 0, the persisted hero body is reduced and "RockSkin" is removed by the boundary.
  - `gameSession.lastAttack` is updated through the boundary with the combat result.
  - `onNotify` is triggered to announce the attack and the shattering of "RockSkin".

## Scenario: Monster Must Not Attack Through Wall

- **Given**: A monster and a hero have Manhattan distance 1, but their cells belong to different `valo` areas and there is no door or discovered secret passage between them.
- **When**: `runMonsterTurn` evaluates adjacency and combat.
- **Assert (Expected Outcomes)**:
  - The monster is NOT considered adjacent for attack purposes.
  - `sessionManager.resolveMonsterAttack(...)` is NOT called for that hero.
  - The logic does not treat wall-separated cells as melee contact.

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

## Scenario: Targeting Prefers Reachable Hero Over Wall-Separated Hero

- **Given**: Hero A is Manhattan-closer to the monster but separated by a wall with no valid attack approach, while Hero B is farther away but has a valid path to an adjacent attack cell.
- **When**: `findNearestHero` is evaluated during `runMonsterTurn`.
- **Assert (Expected Outcomes)**:
  - Hero A is not preferred solely because of raw Manhattan proximity.
  - The monster selects Hero B as the actionable target.
  - The logic uses reachable attack positions before falling back to raw distance.
