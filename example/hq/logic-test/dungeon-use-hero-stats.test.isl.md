<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-hero-stats.isl.md -->

## Scenario: Calculate Stats - Weapon Replacement Rule
- **Given**: A `HeroState` with a base attack of 2. The `equipped` list contains an `Equipment` item with `dadatt` = 3.
- **When**: `calculateStats(heroState)` is invoked.
- **Assert (Expected Outcomes)**:
    - `stats.attacco` must be 3 (The weapon value must replace the base value, not add to it).
    - `stats.difesa` must remain the base hero defense (unless other items modify it).

## Scenario: Calculate Stats - Status Modifiers
- **Given**: A `HeroState` with `activeStatus` = ["RockSkin", "Courage"]. Base `difesa` = 2, base `attacco` = 2.
- **When**: `calculateStats(heroState)` is invoked.
- **Assert (Expected Outcomes)**:
    - `stats.difesa` must be 3 (Base 2 + 1 from RockSkin).
    - `stats.attacco` must be 4 (Base 2 + 2 from Courage).

## Scenario: Calculate Attack Dice - Specific Monster Bonus
- **Given**: A `HeroState` equipped with an item where `numdadicontr` = 5 and `targetMonster` = "10,11". A `Monster` instance with `id` = 10.
- **When**: `calculateAttackDice(heroState, monster)` is invoked.
- **Assert (Expected Outcomes)**:
    - The returned dice count must be 5 (The bonus for the specific monster ID must override the base attack).

## Scenario: Calculate Attack Dice - No Target Match
- **Given**: A `HeroState` equipped with an item where `numdadicontr` = 5 and `targetMonster` = 10. A `Monster` instance with `id` = 99.
- **When**: `calculateAttackDice(heroState, monster)` is invoked.
- **Assert (Expected Outcomes)**:
    - The returned dice count must be the base `attacco` value from `calculateStats` (The bonus should not apply if the monster ID does not match).

## Scenario: Can Attack Twice - Conditional Monster Match
- **Given**: A `HeroState` equipped with an item where `doppioatt` = true and `mosdoppio` = 5. A `Monster` instance with `id` = 5.
- **When**: `canAttackTwice(heroState, monster)` is invoked.
- **Assert (Expected Outcomes)**:
    - Must return `true` (The monster ID matches the specific requirement).

## Scenario: Can Attack Twice - Global Double Attack
- **Given**: A `HeroState` equipped with an item where `doppioatt` = true and `mosdoppio` is null or 0. A `Monster` instance with `id` = 99.
- **When**: `canAttackTwice(heroState, monster)` is invoked.
- **Assert (Expected Outcomes)**:
    - Must return `true` (The item allows double attack against any monster).

## Scenario: Consumable Weapon - Identification
- **Given**: A `HeroState` with `equipped` containing an item where `tirounavo` = true (ID: 50) and an item where `tirounavo` = false (ID: 20).
- **When**: `getConsumableWeaponId(heroState)` is invoked.
- **Assert (Expected Outcomes)**:
    - Must return 50.
    - Must not return 20.

## Scenario: Deterministic Stats Calculation (Empty State)
- **Given**: A `HeroState` with an empty `equipped` list and no `activeStatus`.
- **When**: `calculateStats(heroState)` is invoked.
- **Assert (Expected Outcomes)**:
    - All boolean flags (`canAttackDiagonal`, `canAttackRanged`, `canDisarmTraps`, `hasDoubleAttack`) must be `false`.
    - Stats must match the base `hero` definition exactly.
    - The flow must complete without errors or null pointer exceptions.

## Scenario: Missing Hero Returns Zeroed Stats
- **Given**: `heroState` is null.
- **When**: `calculateStats(heroState)` is invoked.
- **Assert (Expected Outcomes)**:
    - All numeric stats must be 0.
    - All capability flags must be `false`.
    - The function must return a stable object shape instead of `null`.

## Scenario: Dwarf Can Disarm Traps Natively
- **Given**: A `HeroState` whose `hero.classe` is `"Nano"` and with no equipped toolkit.
- **When**: `calculateStats(heroState)` is invoked.
- **Assert (Expected Outcomes)**:
    - `stats.canDisarmTraps` must be `true`.
    - No equipment with `disinnesc` is required for the Dwarf.