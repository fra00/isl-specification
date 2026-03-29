<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-combat.isl.md -->

## Scenario: Combat Resolution - Hero Attacking Monster
- **Given**: A Hero with 3 attack dice and a Monster with 2 defense dice.
- **When**: `resolveCombat(3, 2, false)` is triggered.
- **Assert (Expected Outcomes)**:
    - `attackerDice` contains exactly 3 elements.
    - `defenderDice` contains exactly 2 elements.
    - `shields` is calculated based on `BLACK_SHIELD` count (Monster defense rule).
    - `damageDealt` is `Max(0, skulls - shields)`.
    - The function returns a valid `@CombatResult` object.

## Scenario: Combat Resolution - Monster Attacking Hero
- **Given**: A Monster with 2 attack dice and a Hero with 2 defense dice.
- **When**: `resolveCombat(2, 2, true)` is triggered.
- **Assert (Expected Outcomes)**:
    - `attackerDice` contains exactly 2 elements.
    - `defenderDice` contains exactly 2 elements.
    - `shields` is calculated based on `WHITE_SHIELD` count (Hero defense rule).
    - `damageDealt` is `Max(0, skulls - shields)`.
    - The function returns a valid `@CombatResult` object.

## Scenario: Edge Case - Zero Dice Combat
- **Given**: An interaction where an entity has 0 attack or defense dice (e.g., disarmed or weakened state).
- **When**: `resolveCombat(0, 0, true)` is triggered.
- **Assert (Expected Outcomes)**:
    - `attackerDice` is an empty list.
    - `defenderDice` is an empty list.
    - `skulls` is 0.
    - `shields` is 0.
    - `damageDealt` is 0.

## Scenario: Deterministic Outcome - High Defense
- **Given**: A Hero with 1 attack die and a Monster with 5 defense dice.
- **When**: `resolveCombat(1, 5, false)` is triggered.
- **Assert (Expected Outcomes)**:
    - `damageDealt` must never be negative (must be 0 if `shields` > `skulls`).
    - The flow completes successfully without blocking or hanging.
    - The system state remains consistent regardless of the random roll values.

## Scenario: Adversarial - Invalid Dice Counts
- **Given**: A request to resolve combat with negative dice counts (e.g., -1).
- **When**: `resolveCombat(-1, 2, true)` is triggered.
- **Assert (Expected Outcomes)**:
    - The logic must treat negative inputs as 0 dice to prevent loop errors.
    - The flow must complete and return a valid `@CombatResult` with 0 damage.
    - The system must not enter an infinite loop or crash due to the invalid input.

## Scenario: Flow Integrity - Guaranteed Completion
- **Given**: The `resolveCombat` function is called within a game loop.
- **When**: The function executes its internal loops for rolling dice.
- **Assert (Expected Outcomes)**:
    - The function must guarantee completion regardless of the random number generation outcome.
    - The function must not maintain any internal state (e.g., "isProcessing" flags) that would prevent subsequent combat calls.
    - The output must always be a fully populated `@CombatResult` object, ensuring no partial or null returns.