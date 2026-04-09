<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-session-manager.isl.md -->

## Scenario: Mission Initialization Preserves Session Branches

- **Given**: A `GameSession` with a loaded `currentMap`, pre-existing `monsters`, `openedDoors`, and heroes without board coordinates.
- **When**: `initializeMission(treasureDeck)` is triggered.
- **Assert (Expected Outcomes)**:
  - Each hero is placed at the matching `currentMap.eroi_start` coordinate.
  - `treasureDeck` is copied into `gameSession.treasureDeck`.
  - `currentMap`, `monsters`, `openedDoors`, and `currentMissionIndex` remain unchanged.
  - `onUpdateSession` is called with the updated `GameSession` snapshot.

## Scenario: Confirm Hero Order Commits Deterministically

- **Given**: A `GameSession` with four heroes and `isHeroOrderConfirmed = false`.
- **When**: `confirmHeroOrder([4, 1, 3, 2])` is triggered.
- **Assert (Expected Outcomes)**:
  - The hero with `heroId = 4` receives `turnOrder = 1`.
  - The hero with `heroId = 1` receives `turnOrder = 2`.
  - `isHeroOrderConfirmed` becomes `true`.
  - `fogOfWarLogic.revealInitialVisibility()` is called exactly once.
  - `onUpdateSession` is called with the updated session.

## Scenario: Clear Last Attack Is Narrowly Scoped

- **Given**: A `GameSession` with a populated `lastAttack` and existing hero, monster, and map state.
- **When**: `clearLastAttack()` is triggered.
- **Assert (Expected Outcomes)**:
  - `lastAttack` becomes `null`.
  - `heroes`, `monsters`, `currentMap`, and `currentTurn` remain unchanged.
  - `onUpdateSession` is called once with the updated session.

## Scenario: Passage Opening Persists Only After Fog Reveal

- **Given**: A valid closed door at `(10, 10)` and a destination `(10, 11)`.
- **When**: `openPassage(10, 10, 10, 11, foundPassages)` is triggered and fog reveal succeeds.
- **Assert (Expected Outcomes)**:
  - `fogOfWarLogic.revealFromPoint(10, 11)` is called before persistence completes.
  - `gameSession.openedDoors` contains `"10,10"` in the emitted session.
  - `onNotify` is called with `"Porta aperta."`.
  - The capability returns `true`.

## Scenario: Passage Opening Failure Leaves Session Untouched

- **Given**: A valid door opening request but `fogOfWarLogic.revealFromPoint` throws an error.
- **When**: `openPassage(...)` is triggered.
- **Assert (Expected Outcomes)**:
  - The capability returns `false`.
  - `onUpdateSession` is NOT called.
  - `gameSession.openedDoors` is unchanged.
  - The system never persists a half-opened door state.

## Scenario: Equipment Toggle Preserves Ownership

- **Given**: A hero owns Shield (ID 11) and Longsword (ID 5), with only the Shield currently equipped.
- **When**: `toggleEquipItem(heroId, 5, staticEquipment)` is triggered.
- **Assert (Expected Outcomes)**:
  - The emitted session updates only the target hero `equipped` list.
  - The hero `equipment` list remains unchanged because ownership is not altered by equip state.
  - `onUpdateSession` is called once with the updated session snapshot.

## Scenario: Equipment Toggle Rejects Forbidden Class

- **Given**: A Wizard hero and an armor item forbidden by `nopsg` for that hero ID.
- **When**: `toggleEquipItem(heroId, itemId, staticEquipment)` is triggered.
- **Assert (Expected Outcomes)**:
  - The capability returns `false`.
  - `onNotify` is triggered with "La tua classe non può equipaggiare questo oggetto.".
  - `onUpdateSession` is NOT called.

## Scenario: Item Usage Removes Single Inventory Instance

- **Given**: A hero inventory `[101, 101, 105]` and a healing item 101 with `hp = 4`.
- **When**: `useItem(heroId, 101, staticItems, null)` is triggered.
- **Assert (Expected Outcomes)**:
  - The capability returns `true`.
  - Exactly one `101` is removed from inventory.
  - `currentBody` is increased and clamped to the hero maximum body.
  - `onUpdateSession` is called once with the updated session snapshot.

## Scenario: Holy Water Invalid Target Still Consumes Item

- **Given**: A hero with Holy Water in inventory and a `targetMonsterId` that does not exist.
- **When**: `useItem(heroId, holyWaterId, staticItems, missingMonsterId)` is triggered.
- **Assert (Expected Outcomes)**:
  - `onNotify` is triggered with "Hai usato l'Acqua Santa, ma non hai colpito nulla!".
  - The capability returns `true`.
  - The Holy Water item is removed from inventory.
  - `onUpdateSession` is called with the updated session.

## Scenario: Treasure Collection Clears Only One Cell

- **Given**: A hero sees a treasure cell at `(6, 6)` containing `mon = 50` while other treasure cells remain untouched.
- **When**: `collectTreasureAtCell(heroId, 6, 6)` is triggered.
- **Assert (Expected Outcomes)**:
  - The capability returns `true`.
  - The hero gains 50 gold in the emitted session.
  - Only the `tes` payload of cell `(6, 6)` is reset.
  - Unrelated map cells and other heroes remain unchanged.

## Scenario: Monster Attack Persists Last Combat Snapshot

- **Given**: A monster instance and a hero instance with positive body points.
- **When**: `resolveMonsterAttack(monsterId, heroId, combatResult)` is triggered.
- **Assert (Expected Outcomes)**:
  - The hero loses `combatResult.damageDealt` body points.
  - `lastAttack` is updated with the persisted hero, monster, and combat result.
  - `RockSkin` is removed only when damage is greater than 0.

## Scenario: Hero Attack Removes Monster And Consumable Weapon

- **Given**: The active hero attacks with a thrown weapon and the target monster reaches 0 body.
- **When**: `resolveHeroAttack(monsterId, combatResult, statusesToRemove, consumedWeaponId)` is triggered.
- **Assert (Expected Outcomes)**:
  - The consumed weapon is removed from both `equipped` and `equipment`.
  - The defeated monster is removed from `gameSession.monsters`.
  - `lastAttack` is updated in the emitted session snapshot.

## Scenario: Movement Trap Can Block Falling-Rock Cell

- **Given**: The active hero steps on a type 3 trap with `rockFallX` and `rockFallY` defined.
- **When**: `resolveMovementTrap(nextX, nextY, 3, rockFallX, rockFallY)` is triggered.
- **Assert (Expected Outcomes)**:
  - The hero position is updated to the trap cell and body is reduced by 1.
  - The hero loses `RockSkin` only if it was active.
  - The target rock-fall cell is persisted with `arnt.antroc = true`.

## Scenario: Turn Advance Clears Expiring Status Narrowly

- **Given**: The current hero has `FoggyMist` and the next hero is alive and not escaped.
- **When**: `advanceTurn(nextTurn, "FoggyMist")` is triggered.
- **Assert (Expected Outcomes)**:
  - `currentTurn` becomes `nextTurn`.
  - Only the current hero loses `FoggyMist`.
  - Unrelated hero statuses and map state remain unchanged.
