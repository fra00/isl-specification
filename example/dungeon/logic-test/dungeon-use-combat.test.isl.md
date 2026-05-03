<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-combat.isl.md -->

## Scenario: Combat Dice Resolution - Standard Hero Attack
- **Given**: A Hero attacks a Monster with 3 Attack Dice and 2 Defense Dice.
- **When**: `resolveCombat(3, 2, false)` is executed.
- **Assert (Expected Outcomes)**:
    - `attackerDice` length is exactly 3.
    - `defenderDice` length is exactly 2.
    - `shields` is calculated based on `BLACK_SHIELD` count (Monster defense).
    - `damageDealt` is `Max(0, skulls - shields)`.
    - The result object is returned with all fields populated correctly.

## Scenario: Combat Dice Resolution - Monster Attack on Hero
- **Given**: A Monster attacks a Hero with 2 Attack Dice and 2 Defense Dice.
- **When**: `resolveCombat(2, 2, true)` is executed.
- **Assert (Expected Outcomes)**:
    - `shields` is calculated based on `WHITE_SHIELD` count (Hero defense).
    - `damageDealt` is `Max(0, skulls - shields)`.
    - The logic correctly distinguishes between Hero and Monster defense rules.

## Scenario: Edge Case - Negative Dice Input
- **Given**: An attack is triggered with invalid negative dice counts (e.g., -1 Attack, -2 Defense).
- **When**: `resolveCombat(-1, -2, false)` is executed.
- **Assert (Expected Outcomes)**:
    - The Guard clause triggers.
    - `attackDiceCount` is treated as 0.
    - `defenseDiceCount` is treated as 0.
    - `skulls` = 0, `shields` = 0, `damageDealt` = 0.
    - The system returns a valid `@CombatResult` without crashing.

## Scenario: Zero Dice Outcome
- **Given**: An attack is triggered with 0 Attack Dice (e.g., due to a debuff).
- **When**: `resolveCombat(0, 3, false)` is executed.
- **Assert (Expected Outcomes)**:
    - `attackerDice` is an empty list.
    - `skulls` is 0.
    - `damageDealt` is 0 regardless of the defender's roll.

## Scenario: Deterministic Damage Floor
- **Given**: A defender rolls more shields than the attacker rolls skulls.
- **When**: `resolveCombat(1, 3, false)` is executed where the attacker rolls 1 `SKULL` and the defender rolls 2 `BLACK_SHIELD`.
- **Assert (Expected Outcomes)**:
    - `skulls` = 1.
    - `shields` = 2.
    - `damageDealt` = 0 (Ensuring `Max(0, ...)` logic prevents negative damage).

## Scenario: Guaranteed Completion and State Integrity
- **Given**: The combat resolution is called within the game loop.
- **When**: The `resolveCombat` function is invoked.
- **Assert (Expected Outcomes)**:
    - The function completes synchronously without hanging.
    - No external state (like `GameSession` or `HeroState`) is mutated by the function itself (it is a pure calculation).
    - The returned `@CombatResult` is fully formed, ensuring the UI/Controller layer can immediately process the result without checking for null or partial data.