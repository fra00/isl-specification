<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-item-logic.isl.md -->

## Scenario: Successful Healing Potion Usage

- **Given**: A `HeroState` with `currentBody` = 2, `hero.corpo` = 6, and `inventory` containing `itemId` 101 (Healing Potion: `hp` = 4).
- **When**: `useItem(heroId, 101, gameSession, null)` is invoked.
- **Assert (Expected Outcomes)**:
  - `sessionManager.useItem(heroId, 101, staticItems, null)` is called.
  - `hero.currentBody` is updated to 6 (2 + 4).
  - `itemId` 101 is removed from `hero.inventory`.
  - The emitted session preserves unrelated session branches.

## Scenario: Healing Clamping at Max Body Points

- **Given**: A `HeroState` with `currentBody` = 5, `hero.corpo` = 6, and `inventory` containing `itemId` 101 (Healing Potion: `hp` = 4).
- **When**: `useItem(heroId, 101, gameSession, null)` is invoked.
- **Assert (Expected Outcomes)**:
  - `hero.currentBody` is clamped to 6 (not 9).
  - `itemId` 101 is removed from `hero.inventory`.
  - `sessionManager.useItem(heroId, 101, staticItems, null)` returns `true`.

## Scenario: Holy Water Damage to Undead Monster

- **Given**: A `MonsterState` (ID: 50) where `monster.nonmorto` is true and `currentBody` = 2. An `Item` (ID: 202) where `acqua` is true and `danni` = 3.
- **When**: `useItem(heroId, 202, gameSession, 50)` is invoked.
- **Assert (Expected Outcomes)**:
  - `sessionManager.useItem(heroId, 202, staticItems, 50)` is called.
  - `targetMonster.currentBody` becomes -1 (or 0).
  - `targetMonster` is removed from `gameSession.monsters`.
  - `itemId` 202 is removed from `hero.inventory`.

## Scenario: Holy Water Ineffective on Living Monster

- **Given**: A `MonsterState` (ID: 51) where `monster.nonmorto` is false. An `Item` (ID: 202) where `acqua` is true.
- **When**: `useItem(heroId, 202, gameSession, 51)` is invoked.
- **Assert (Expected Outcomes)**:
  - `sessionManager.useItem(heroId, 202, staticItems, 51)` is called.
  - `targetMonster.currentBody` remains unchanged.
  - `itemId` 202 is removed from `hero.inventory` (Item is consumed regardless of effect).

## Scenario: Attempt to Use Item Not in Inventory

- **Given**: A `HeroState` with an empty `inventory`.
- **When**: `useItem(heroId, 999, gameSession, null)` is invoked.
- **Assert (Expected Outcomes)**:
  - The flow terminates immediately.
  - `sessionManager.useItem(heroId, 999, staticItems, null)` returns `false`.
  - No persistent mutation occurs.

## Scenario: Deterministic State Cleanup (Invalid Target)

- **Given**: A `HeroState` with `itemId` 202 (Holy Water) in inventory. `targetMonsterId` is provided, but the monster is not found in `gameSession.monsters`.
- **When**: `useItem(heroId, 202, gameSession, 999)` is invoked.
- **Assert (Expected Outcomes)**:
  - `sessionManager.useItem(heroId, 202, staticItems, 999)` is called.
  - `itemId` 202 is removed from `hero.inventory`.
  - The updated session reflects the inventory change, ensuring the system does not hang in a "waiting for target" state.

## Scenario: Multi-Instance Inventory Integrity

- **Given**: A `HeroState` with `inventory` = [101, 101, 105].
- **When**: `useItem(heroId, 101, gameSession, null)` is invoked.
- **Assert (Expected Outcomes)**:
  - `sessionManager.useItem(heroId, 101, staticItems, null)` is called.
  - `hero.inventory` contains exactly one `101` and one `105`.
  - The logic correctly identifies and removes only the first instance of the item.
