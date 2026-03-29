<!-- LOGIC TEST SCENARIOS FOR: page-presentation.isl.md -->

This test suite focuses on the **Domain Integrity** and **Flow Continuity** of the `Heroquest React` application, specifically targeting the critical transitions between the `Armory`, `Dungeon`, and `TurnLogic` components.

---

## Scenario: Purchase Validation Integrity
- **Given**: A `HeroState` (Barbarian, 500 Gold) and an `Equipment` item (ID 11: Shield, Price 150).
- **When**: `ShopLogic.validatePurchase` is called for the Barbarian.
- **Assert (Expected Outcomes)**:
    - `allowed` is `true`.
    - If `heroState.gold` is set to 100, `allowed` is `false` with reason "Not enough gold".
    - If `item.nopsgid` matches the Barbarian's ID, `allowed` is `false` with reason "Forbidden for class".

## Scenario: Inventory Equipment Exclusivity (noogg)
- **Given**: A `HeroState` with an equipped "Spadone" (ID 13, `noogg: 11`) and a "Shield" (ID 11) in inventory.
- **When**: `useInventoryLogic.toggleEquipItem` is called to equip the Shield (ID 11).
- **Assert (Expected Outcomes)**:
    - The "Shield" is added to `hero.equipped`.
    - The "Spadone" (ID 13) is automatically removed from `hero.equipped` due to the `noogg` constraint.
    - `onUpdateSession` is triggered with the modified `GameSession`.

## Scenario: Deterministic Movement and Trap Trigger
- **Given**: A hero at (2,2) with 5 `movementPoints` and a "Pit Trap" (tipo: 1) at (2,3).
- **When**: `hooksTurnLogic.handleBoardClick(2, 3)` is triggered.
- **Assert (Expected Outcomes)**:
    - `isMoving` transitions to `true`.
    - Hero position updates to (2,3).
    - `trapsLogic.registerTriggeredTrap` is called for (2,3).
    - `currentBody` is decremented by 1.
    - `turnPhase.hasMoved` and `turnPhase.hasPerformedAction` are set to `true` (End of turn).
    - `isMoving` resets to `false`.

## Scenario: Combat Resolution and Monster Death
- **Given**: A hero with 3 attack dice and a monster with 2 body points.
- **When**: `hooksTurnLogic.handleMonsterClick(monsterId)` is triggered.
- **Assert (Expected Outcomes)**:
    - `combatLogic.resolveCombat` is called with correct dice counts.
    - If `damageDealt` >= 2, the monster is removed from `gameSession.monsters`.
    - `lastAttack` object is populated for UI display.
    - If `canAttackTwice` is true and `attacksPerformed` < 2, `turnPhase.hasPerformedAction` remains `false`.

## Scenario: Fog of War Persistence
- **Given**: A hero moves from (5,5) to (5,6), revealing a room.
- **When**: The hero moves back to (5,5).
- **Assert (Expected Outcomes)**:
    - The cells revealed at (5,6) remain with `fog: false` in `boardVisibilityMap`.
    - The system never reverts `fog` to `true` for previously visited cells.

## Scenario: Guaranteed Flow Completion (Monster AI)
- **Given**: All heroes have ended their turns (`currentTurn` > `heroes.length`).
- **When**: `monitorTurn` detects the turn overflow.
- **Assert (Expected Outcomes)**:
    - `hooksMonsterAI.runMonsterTurn()` is executed.
    - After all monsters act, `gameSession.currentTurn` is reset to 1.
    - `turnPhase` for all heroes is reset to `false` (HasMoved, HasPerformedAction, IsTurnFinished).
    - The system never enters a state where `currentTurn` is stuck or `turnPhase` remains locked.

## Scenario: Spell Targeting Cancellation
- **Given**: `targetingSpell` is set to "Palla di Fuoco".
- **When**: `cancelTargeting` is called.
- **Assert (Expected Outcomes)**:
    - `targetingSpell` becomes `null`.
    - `notificationMessage` is updated to "Lancio incantesimo annullato.".
    - The board cursor reverts from `crosshair` to `pointer`.