<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-hero-stats.isl.md -->

## Scenario: Calculate Stats - Weapon Dice Replacement Rule
- **Given**: A `HeroState` with a base attack of 2. The `equipped` list contains an `Equipment` item (ID: 101) where `dadatt` = 3.
- **When**: `calculateStats(heroState)` is invoked.
- **Assert (Expected Outcomes)**:
    - `stats.attacco` must be 3 (The weapon value 3 must replace the base value 2, not be added to it).

## Scenario: Calculate Stats - Status Modifier Aggregation
- **Given**: A `HeroState` with base defense of 2 and `activeStatus` containing "RockSkin". The `equipped` list contains an `Equipment` item (ID: 202) where `daddif` = 1.
- **When**: `calculateStats(heroState)` is invoked.
- **Assert (Expected Outcomes)**:
    - `stats.difesa` must be 4 (Base 2 + Equipment 1 + RockSkin 1).

## Scenario: Calculate Attack Dice - Specific Monster Bonus
- **Given**: A `HeroState` equipped with a weapon (ID: 303) where `numdadicontr` = 4 and `targetMonster` = "5,6". A `Monster` instance with `id` = 5.
- **When**: `calculateAttackDice(heroState, monster)` is invoked.
- **Assert (Expected Outcomes)**:
    - The returned dice count must be 4 (The bonus for target monster ID 5 is applied).

## Scenario: Calculate Attack Dice - No Target Match
- **Given**: A `HeroState` equipped with a weapon (ID: 303) where `numdadicontr` = 4 and `targetMonster` = "5,6". A `Monster` instance with `id` = 9.
- **When**: `calculateAttackDice(heroState, monster)` is invoked.
- **Assert (Expected Outcomes)**:
    - The returned dice count must be the base attack value (The bonus is ignored because the monster ID does not match).

## Scenario: Can Attack Twice - Conditional Monster Match
- **Given**: A `HeroState` equipped with an item where `doppioatt` = true and `mosdoppio` = 10. A `Monster` instance with `id` = 10.
- **When**: `canAttackTwice(heroState, monster)` is invoked.
- **Assert (Expected Outcomes)**:
    - Result must be `true`.

## Scenario: Can Attack Twice - Negative Monster Match
- **Given**: A `HeroState` equipped with an item where `doppioatt` = true and `mosdoppio` = 10. A `Monster` instance with `id` = 11.
- **When**: `canAttackTwice(heroState, monster)` is invoked.
- **Assert (Expected Outcomes)**:
    - Result must be `false` (The double attack is restricted to monster ID 10).

## Scenario: Get Consumable Weapon - Identification
- **Given**: A `HeroState` with `equipped` containing two items: Item A (`tirounavo` = false) and Item B (`tirounavo` = true, `id` = 50).
- **When**: `getConsumableWeaponId(heroState)` is invoked.
- **Assert (Expected Outcomes)**:
    - Result must be 50.

## Scenario: Deterministic Completion - Empty Equipment
- **Given**: A `HeroState` with an empty `equipped` list.
- **When**: `calculateStats(heroState)` is invoked.
- **Assert (Expected Outcomes)**:
    - The function must return a valid stats object populated with base hero values.
    - All boolean flags (`canAttackDiagonal`, `canAttackRanged`, etc.) must be `false`.
    - The flow must complete without errors or null pointer exceptions.

## Scenario: Adversarial - Invalid Equipment State
- **Given**: A `HeroState` where `equipped` contains an ID that does not exist in `staticEquipment`.
- **When**: `calculateStats(heroState)` is invoked.
- **Assert (Expected Outcomes)**:
    - The flow must gracefully ignore the missing ID.
    - The function must return the base stats of the hero without crashing.
    - The system must remain in a valid state.