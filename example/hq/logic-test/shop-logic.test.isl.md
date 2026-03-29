<!-- LOGIC TEST SCENARIOS FOR: shop-logic.isl.md -->

## Scenario: LoadShopData - Filter Logic
- **Given**: A `heroes.json` file and an `equipment.json` file containing items with `prezzo` values of 0 (e.g., quest items) and > 0 (e.g., standard shop items).
- **When**: `loadShopData` is invoked.
- **Assert (Expected Outcomes)**:
    - The returned `items` list must contain only entries where `prezzo > 0`.
    - The returned `heroes` list must match the source data structure.
    - The operation must complete deterministically, returning a valid object even if one of the files is empty.

## Scenario: ValidatePurchase - Insufficient Funds
- **Given**: A `HeroState` with `gold = 50` and an `Equipment` item with `prezzo = 100`.
- **When**: `validatePurchase` is called with these parameters.
- **Assert (Expected Outcomes)**:
    - `allowed` must be `false`.
    - `reason` must be `"Not enough gold"`.

## Scenario: ValidatePurchase - Class Restriction (Forbidden)
- **Given**: A `HeroState` where `heroId = 1` (Barbarian) and an `Equipment` item where `nopsg = true` and `nopsgid = 1`.
- **When**: `validatePurchase` is called.
- **Assert (Expected Outcomes)**:
    - `allowed` must be `false`.
    - `reason` must be `"Forbidden for class"`.

## Scenario: ValidatePurchase - Class Restriction (Exclusive)
- **Given**: A `HeroState` where `heroId = 2` (Dwarf) and an `Equipment` item where `solopsg = true` and `solopsgid = 3` (Elf).
- **When**: `validatePurchase` is called.
- **Assert (Expected Outcomes)**:
    - `allowed` must be `false`.
    - `reason` must be `"Exclusive to other class"`.

## Scenario: ValidatePurchase - Duplicate Ownership
- **Given**: A `HeroState` where `equipment` list contains `[10]`, and an `Equipment` item with `id = 10`.
- **When**: `validatePurchase` is called.
- **Assert (Expected Outcomes)**:
    - `allowed` must be `false`.
    - `reason` must be `"Already owned"`.

## Scenario: ExecutePurchase - State Integrity
- **Given**: A `GameSession` with a hero having `gold = 500` and an `Equipment` item with `prezzo = 150`.
- **When**: `executePurchase` is called for that hero.
- **Assert (Expected Outcomes)**:
    - The returned `GameSession` must be a new object (immutability).
    - The hero's `gold` must be exactly `350`.
    - The hero's `equipment` list must contain the new `item.id`.
    - The hero's `equipped` list must remain unchanged (no auto-equip).
    - The `session.heroes` list must reflect the updated state at the correct index.

## Scenario: ExecutePurchase - Deterministic Completion
- **Given**: A `GameSession` with multiple heroes and a valid `Equipment` item.
- **When**: `executePurchase` is triggered.
- **Assert (Expected Outcomes)**:
    - The flow must ensure that even if the `heroIndex` is at the boundary (first or last hero), the session is updated correctly.
    - The system must guarantee that the `session` object is returned in a consistent state, ensuring no partial updates or corrupted references occur.
    - The operation must not modify the original `session` input, preserving the integrity of the previous game state.