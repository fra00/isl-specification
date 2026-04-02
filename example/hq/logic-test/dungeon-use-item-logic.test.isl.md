<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-item-logic.isl.md -->

## Scenario: Successful Healing Potion Usage
- **Given**: A `HeroState` with `currentBody` = 2, `hero.corpo` = 6, and `inventory` containing `itemId` 101 (Healing Potion: `hp` = 4).
- **When**: `useItem(heroId, 101, gameSession, null)` is invoked.
- **Assert (Expected Outcomes)**:
    - `hero.currentBody` is updated to 6 (2 + 4).
    - `itemId` 101 is removed from `hero.inventory`.
    - `onNotify` is triggered with "Hai usato Healing Potion!".
    - `onUpdateSession` is called with the modified `gameSession`.

## Scenario: Healing Clamping at Max Body Points
- **Given**: A `HeroState` with `currentBody` = 5, `hero.corpo` = 6, and `inventory` containing `itemId` 101 (Healing Potion: `hp` = 4).
- **When**: `useItem(heroId, 101, gameSession, null)` is invoked.
- **Assert (Expected Outcomes)**:
    - `hero.currentBody` is clamped to 6 (not 9).
    - `itemId` 101 is removed from `hero.inventory`.
    - `onUpdateSession` is called with the state reflecting the clamped value.

## Scenario: Holy Water Damage to Undead Monster
- **Given**: A `MonsterState` (ID: 50) where `monster.nonmorto` is true and `currentBody` = 2. An `Item` (ID: 202) where `acqua` is true and `danni` = 3.
- **When**: `useItem(heroId, 202, gameSession, 50)` is invoked.
- **Assert (Expected Outcomes)**:
    - `targetMonster.currentBody` becomes -1 (or 0).
    - `targetMonster` is removed from `gameSession.monsters`.
    - `onNotify` is triggered confirming damage dealt to the non-morto.
    - `itemId` 202 is removed from `hero.inventory`.

## Scenario: Holy Water Ineffective on Living Monster
- **Given**: A `MonsterState` (ID: 51) where `monster.nonmorto` is false. An `Item` (ID: 202) where `acqua` is true.
- **When**: `useItem(heroId, 202, gameSession, 51)` is invoked.
- **Assert (Expected Outcomes)**:
    - `targetMonster.currentBody` remains unchanged.
    - `onNotify` is triggered with "L'Acqua Santa non ha effetto su questa creatura.".
    - `itemId` 202 is removed from `hero.inventory` (Item is consumed regardless of effect).

## Scenario: Attempt to Use Item Not in Inventory
- **Given**: A `HeroState` with an empty `inventory`.
- **When**: `useItem(heroId, 999, gameSession, null)` is invoked.
- **Assert (Expected Outcomes)**:
    - The flow terminates immediately.
    - `onUpdateSession` is NOT called.
    - No `onNotify` regarding successful usage is triggered.

## Scenario: Deterministic State Cleanup (Invalid Target)
- **Given**: A `HeroState` with `itemId` 202 (Holy Water) in inventory. `targetMonsterId` is provided, but the monster is not found in `gameSession.monsters`.
- **When**: `useItem(heroId, 202, gameSession, 999)` is invoked.
- **Assert (Expected Outcomes)**:
    - `onNotify` is triggered with "Hai usato l'Acqua Santa, ma non hai colpito nulla!".
    - `itemId` 202 is removed from `hero.inventory`.
    - `onUpdateSession` is called to reflect the inventory change, ensuring the system does not hang in a "waiting for target" state.

## Scenario: Multi-Instance Inventory Integrity
- **Given**: A `HeroState` with `inventory` = [101, 101, 105].
- **When**: `useItem(heroId, 101, gameSession, null)` is invoked.
- **Assert (Expected Outcomes)**:
    - `hero.inventory` contains exactly one `101` and one `105`.
    - The logic correctly identifies and removes only the first instance of the item.