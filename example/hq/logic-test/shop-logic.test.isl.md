<!-- LOGIC TEST SCENARIOS FOR: shop-logic.isl.md -->

## Scenario: Load Shop Data - Deterministic Completion
- **Given**: The system is initialized and the network/file system is ready to serve `heroes.json` and `equipment.json`.
- **When**: `loadShopData` is triggered.
- **Assert (Expected Outcomes)**:
    - The flow must return a combined object containing both `heroes` and `items` lists.
    - The `items` list must strictly exclude any entries where `prezzo` is 0 or null (if applicable).
    - If either fetch fails, the flow must handle the error gracefully (e.g., return empty lists or throw a standardized error) rather than leaving the system in an "isLoading" state.

## Scenario: Validate Purchase - Insufficient Funds
- **Given**: A `HeroState` with `gold` = 100, and an `Equipment` item with `prezzo` = 150.
- **When**: `validatePurchase` is called with these parameters.
- **Assert (Expected Outcomes)**:
    - `allowed` must be `false`.
    - `reason` must be `"Not enough gold"`.

## Scenario: Validate Purchase - Class Restriction (Forbidden)
- **Given**: A `HeroState` for a Barbarian (ID: 1), and an `Equipment` item (e.g., "Wizard Staff") where `nopsg` = true and `nopsgid` = 1.
- **When**: `validatePurchase` is called.
- **Assert (Expected Outcomes)**:
    - `allowed` must be `false`.
    - `reason` must be `"Forbidden for class"`.

## Scenario: Validate Purchase - Class Restriction (Exclusive)
- **Given**: A `HeroState` for a Dwarf (ID: 2), and an `Equipment` item where `solopsg` = true and `solopsgid` = 1 (Barbarian).
- **When**: `validatePurchase` is called.
- **Assert (Expected Outcomes)**:
    - `allowed` must be `false`.
    - `reason` must be `"Exclusive to other class"`.

## Scenario: Validate Purchase - Duplicate Ownership
- **Given**: A `HeroState` where `equipment` list already contains `item.id` = 50.
- **When**: `validatePurchase` is called for an item with `id` = 50.
- **Assert (Expected Outcomes)**:
    - `allowed` must be `false`.
    - `reason` must be `"Already owned"`.

## Scenario: Execute Purchase - State Integrity
- **Given**: A `GameSession` with a hero having 500 gold and an empty `equipment` list.
- **When**: `executePurchase` is called for an item with `prezzo` = 200 and `id` = 10.
- **Assert (Expected Outcomes)**:
    - The returned `GameSession` must contain a new `HeroState` instance (immutability check).
    - The hero's `gold` must be exactly 300.
    - The hero's `equipment` list must contain `10`.
    - The hero's `equipped` list must remain unchanged (no automatic equipping).
    - The `session.heroes` list must reflect the updated state at the correct `heroIndex`.

## Scenario: Execute Purchase - Deterministic Flow
- **Given**: A `GameSession` and a valid `Equipment` item.
- **When**: `executePurchase` is triggered.
- **Assert (Expected Outcomes)**:
    - The flow must ensure that even if the `HeroState` update fails (e.g., index out of bounds), the system does not return a corrupted `GameSession`.
    - The system must guarantee that the `session` object returned is a complete, valid state, ensuring no "partial" updates are persisted to the global state.