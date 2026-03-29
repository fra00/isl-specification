<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-inventory-logic.isl.md -->

## Scenario: Equip Item - Successful Compatibility
- **Given**: A Barbarian hero (ID: 1) with an empty `equipped` list. An `Equipment` item (ID: 50) exists with `solopsg: false` and `nopsg: false`.
- **When**: `toggleEquipItem(1, 50, gameSession)` is called.
- **Assert (Expected Outcomes)**:
    - `hero.equipped` contains `50`.
    - `onUpdateSession` is triggered with the updated session.
    - No notification of incompatibility is sent.

## Scenario: Equip Item - Class Restriction (solopsg)
- **Given**: A Barbarian hero (ID: 1). An `Equipment` item (ID: 20) exists with `solopsg: true` and `solopsgid: 2` (Dwarf).
- **When**: `toggleEquipItem(1, 20, gameSession)` is called.
- **Assert (Expected Outcomes)**:
    - `hero.equipped` does NOT contain `20`.
    - `onNotify` is triggered with "La tua classe non può equipaggiare questo oggetto.".
    - `onUpdateSession` is NOT triggered (or session remains unchanged).

## Scenario: Equip Item - Class Restriction (nopsg)
- **Given**: A Wizard hero (ID: 3). An `Equipment` item (ID: 30) exists with `nopsg: true` and `nopsgid: 3` (Wizard).
- **When**: `toggleEquipItem(3, 30, gameSession)` is called.
- **Assert (Expected Outcomes)**:
    - `hero.equipped` does NOT contain `30`.
    - `onNotify` is triggered with "La tua classe non può equipaggiare questo oggetto.".

## Scenario: Equip Item - Mutual Exclusivity (noogg)
- **Given**: A hero (ID: 1) currently has a Shield (ID: 11) in `equipped`. A Two-Handed Sword (ID: 40) exists with `noogg: 11`.
- **When**: `toggleEquipItem(1, 40, gameSession)` is called.
- **Assert (Expected Outcomes)**:
    - `hero.equipped` contains `40`.
    - `hero.equipped` does NOT contain `11`.
    - `onNotify` is triggered with "Hai rimosso [Shield Name] perché incompatibile.".
    - `onUpdateSession` is triggered with the updated session.

## Scenario: Unequip Item - Manual Toggle
- **Given**: A hero (ID: 1) has a Longsword (ID: 5) in `equipped`.
- **When**: `toggleEquipItem(1, 5, gameSession)` is called.
- **Assert (Expected Outcomes)**:
    - `hero.equipped` does NOT contain `5`.
    - `onUpdateSession` is triggered.

## Scenario: Equip Item - Reverse Mutual Exclusivity
- **Given**: A hero (ID: 1) has a Two-Handed Sword (ID: 40) in `equipped`. A Shield (ID: 11) exists.
- **When**: `toggleEquipItem(1, 11, gameSession)` is called.
- **Assert (Expected Outcomes)**:
    - `hero.equipped` contains `11`.
    - `hero.equipped` does NOT contain `40` (because the sword has `noogg: 11`, the logic must scan existing items for the `noogg` constraint).
    - `onNotify` is triggered with "Hai rimosso [Two-Handed Sword Name] perché incompatibile.".

## Scenario: Deterministic State Integrity
- **Given**: A `GameSession` with multiple heroes and complex inventory states.
- **When**: `toggleEquipItem` is triggered with an invalid `itemId` or `heroId`.
- **Assert (Expected Outcomes)**:
    - The system must handle the lookup failure gracefully (e.g., return or notify).
    - The `gameSession` must remain in a valid state (no partial updates or corrupted lists).
    - `onUpdateSession` must not be called if the validation fails, ensuring the UI does not sync an invalid state.