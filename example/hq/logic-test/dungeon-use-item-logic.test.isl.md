<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-item-logic.isl.md -->

## Scenario: Successful Healing Potion Usage
- **Given**: A `HeroState` with `currentBody` = 2, `hero.corpo` = 6, and `inventory` = [101] (Healing Potion, `hp` = 4).
- **When**: `useItem(heroId, 101, session, null)` is triggered.
- **Assert (Expected Outcomes)**:
    - `hero.currentBody` is updated to 6 (2 + 4).
    - `hero.inventory` does not contain 101.
    - `onNotify` is called with "Hai usato Pozione di Cura!".
    - `onUpdateSession` is called with the modified session.

## Scenario: Healing Clamping at Max Body Points
- **Given**: A `HeroState` with `currentBody` = 5, `hero.corpo` = 6, and `inventory` = [101] (Healing Potion, `hp` = 4).
- **When**: `useItem(heroId, 101, session, null)` is triggered.
- **Assert (Expected Outcomes)**:
    - `hero.currentBody` is clamped to 6 (not 9).
    - `hero.inventory` does not contain 101.
    - `onUpdateSession` is called with the valid state.

## Scenario: Holy Water Against Undead Monster
- **Given**: A `MonsterState` (ID: 50) with `currentBody` = 2, `monster.nonmorto` = true. `HeroState` has `inventory` = [202] (Holy Water, `acqua` = true, `danni` = 3).
- **When**: `useItem(heroId, 202, session, 50)` is triggered.
- **Assert (Expected Outcomes)**:
    - `targetMonster.currentBody` becomes -1 (2 - 3).
    - `targetMonster` is removed from `gameSession.monsters`.
    - `onNotify` is called with "L'Acqua Santa purifica il non-morto infliggendo 3 danni!".
    - `hero.inventory` does not contain 202.

## Scenario: Holy Water Against Non-Undead Monster
- **Given**: A `MonsterState` (ID: 51) with `monster.nonmorto` = false. `HeroState` has `inventory` = [202] (Holy Water).
- **When**: `useItem(heroId, 202, session, 51)` is triggered.
- **Assert (Expected Outcomes)**:
    - `targetMonster.currentBody` remains unchanged.
    - `onNotify` is called with "L'Acqua Santa non ha effetto su questa creatura.".
    - `hero.inventory` does not contain 202 (Item is consumed regardless of effect).

## Scenario: Attempt to Use Item Not in Inventory
- **Given**: A `HeroState` with `inventory` = [101].
- **When**: `useItem(heroId, 999, session, null)` (Item ID not in inventory) is triggered.
- **Assert (Expected Outcomes)**:
    - The flow terminates early.
    - `onUpdateSession` is NOT called.
    - `hero.inventory` remains [101].

## Scenario: Holy Water Used Without Target
- **Given**: A `HeroState` with `inventory` = [202] (Holy Water).
- **When**: `useItem(heroId, 202, session, null)` (targetMonsterId is null) is triggered.
- **Assert (Expected Outcomes)**:
    - `onNotify` is called with "Hai usato l'Acqua Santa, ma non hai colpito nulla!".
    - `hero.inventory` does not contain 202.
    - `onUpdateSession` is called (Item is consumed).

## Scenario: Deterministic State Cleanup
- **Given**: A valid `GameSession` with a hero and an item.
- **When**: Any `useItem` call is executed.
- **Assert (Expected Outcomes)**:
    - The flow must guarantee that `onUpdateSession` is called if the item was successfully found and removed, ensuring the UI/State syncs.
    - The system must never leave the `inventory` in an inconsistent state (e.g., if the item is removed, it must be removed exactly once).
    - The flow must handle the `targetMonsterId` lookup gracefully; if the ID is provided but the monster is not found, the item is still consumed, but no damage is applied.