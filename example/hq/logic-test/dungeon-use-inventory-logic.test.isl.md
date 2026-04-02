<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-inventory-logic.isl.md -->

## Scenario: Prevent Incompatible Class Equipment (solopsg)
- **Given**: A `GameSession` containing a Barbarian hero (ID 1) and a "Dwarf-Only" Axe (ID 50) where `solopsg` is true and `solopsgid` is 2 (Dwarf).
- **When**: The user attempts to `toggleEquipItem` for the Barbarian with the Dwarf-Only Axe.
- **Assert (Expected Outcomes)**:
    - `onNotify` is triggered with "La tua classe non può equipaggiare questo oggetto.".
    - The Axe ID (50) is NOT added to the Barbarian's `equipped` list.
    - `onUpdateSession` is NOT called (or called with an unchanged session).

## Scenario: Prevent Forbidden Class Equipment (nopsg)
- **Given**: A `GameSession` containing a Wizard hero (ID 3) and a Plate Armor (ID 60) where `nopsg` is true and `nopsgid` is 3 (Wizard).
- **When**: The user attempts to `toggleEquipItem` for the Wizard with the Plate Armor.
- **Assert (Expected Outcomes)**:
    - `onNotify` is triggered with "La tua classe non può equipaggiare questo oggetto.".
    - The Plate Armor ID (60) is NOT added to the Wizard's `equipped` list.

## Scenario: Automatic Unequip of Incompatible Item (noogg)
- **Given**: A `GameSession` where a hero has a Shield (ID 11) currently in `equipped`. A Two-Handed Sword (ID 99) exists with `noogg: 11`.
- **When**: The user calls `toggleEquipItem` for the hero with the Two-Handed Sword (ID 99).
- **Assert (Expected Outcomes)**:
    - The Shield (ID 11) is removed from the hero's `equipped` list.
    - The Two-Handed Sword (ID 99) is added to the hero's `equipped` list.
    - `onNotify` is triggered confirming the removal of the Shield.
    - `onUpdateSession` is called with the updated `GameSession`.

## Scenario: Mutual Incompatibility (Weapon vs Shield)
- **Given**: A `GameSession` where a hero has a Two-Handed Sword (ID 99) currently in `equipped`. The user attempts to equip a Shield (ID 11).
- **When**: The user calls `toggleEquipItem` for the hero with the Shield (ID 11).
- **Assert (Expected Outcomes)**:
    - The logic iterates through `equipped` items, identifies the Two-Handed Sword (ID 99) as having `noogg: 11` (or the Shield having `noogg` matching the sword).
    - The Two-Handed Sword (ID 99) is removed from `equipped`.
    - The Shield (ID 11) is added to `equipped`.
    - `onUpdateSession` reflects the state where only the Shield is equipped.

## Scenario: Deterministic Handling of Missing Items
- **Given**: A `GameSession` with a valid hero.
- **When**: The user calls `toggleEquipItem` with an `itemId` that does not exist in the `staticEquipment` registry.
- **Assert (Expected Outcomes)**:
    - `onNotify` is triggered with "Oggetto non trovato.".
    - The flow terminates immediately.
    - No changes are made to the `hero.equipped` list.
    - `onUpdateSession` is not triggered, ensuring the system state remains consistent and valid.

## Scenario: Toggle Unequip Existing Item
- **Given**: A `GameSession` where a hero already has a Longsword (ID 5) in their `equipped` list.
- **When**: The user calls `toggleEquipItem` for the hero with the Longsword (ID 5).
- **Assert (Expected Outcomes)**:
    - The Longsword (ID 5) is removed from the `equipped` list.
    - `onUpdateSession` is called with the updated session.
    - No incompatibility checks are triggered (as this is an unequip action).