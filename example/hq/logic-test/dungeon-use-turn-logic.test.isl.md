<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-turn-logic.isl.md -->

## Scenario: Movement Interruption by Trap

- **Given**: A hero is at (5,5) with 4 movement points. A trap (type 2: Spear) is located at (5,6). The hero initiates a move to (5,7).
- **When**: The hero moves to (5,6) during the `movementEffect` flow.
- **Assert (Expected Outcomes)**:
  - `trapsLogic.checkTrapActivation` returns true.
  - `trapsLogic.registerTriggeredTrap` is called for (5,6) with status 'TRIGGERED'.
  - `sessionManager.resolveMovementTrap(5, 6, 2, null, null)` is called.
  - The persisted hero body is decremented by 1.
  - `isMoving` is set to false.
  - `turnPhase.hasMoved` and `turnPhase.hasPerformedAction` are set to true.
  - `activePath` is cleared, halting further movement.

## Scenario: Ranged Weapon Consumption

- **Given**: A hero is equipped with a "Throwing Axe" (ID: 101, `tirounavo: true`). The hero is at (2,2) and a monster is at (2,5).
- **When**: The hero performs `handleMonsterClick` on the monster at (2,5).
- **Assert (Expected Outcomes)**:
  - `combatLogic.resolveCombat` is executed.
  - `heroStatsLogic.getConsumableWeaponId` returns 101.
  - `sessionManager.resolveHeroAttack(monsterId, combatResult, statusesToRemove, 101)` is called.
  - ID 101 is removed from `hero.equipped` and `hero.equipment` in the persisted session.
  - `onNotify` is triggered with "Hai lanciato l'arma e l'hai persa!".

## Scenario: Deterministic Turn End and Cleanup

- **Given**: A hero has finished their movement and performed an action.
- **When**: The user triggers `endTurn()`.
- **Assert (Expected Outcomes)**:
  - `isMoving` is false.
  - `turnPhase` properties are reset to false.
  - `movementPoints` is reset to null.
  - `attacksPerformed` is reset to 0.
  - `sessionManager.advanceTurn(nextTurn, clearStatusName)` is called.
  - `gameSession.currentTurn` is incremented through the boundary.
  - If the hero had "FoggyMist" status, it is removed, and `onNotify` is triggered.

## Scenario: Boss Kill Mission Completion

- **Given**: `MapHeader.mostro_uscita` is set to "Gargoyle" (ID: 5). The only remaining monster in `gameSession.monsters` is the Gargoyle.
- **When**: The hero attacks the Gargoyle, and `combatResult.damageDealt` reduces `currentBody` to 0.
- **Assert (Expected Outcomes)**:
  - `sessionManager.resolveHeroAttack(monsterId, combatResult, statusesToRemove, consumedId)` is called.
  - The Gargoyle is removed from `gameSession.monsters` by the boundary.
  - `checkMissionObjective()` returns true.
  - The system state is updated to reflect the mission completion.

## Scenario: Invalid Movement Pathing (Adversarial)

- **Given**: A hero is at (1,1). A wall (Rock) exists at (1,2).
- **When**: The user attempts `handleBoardClick` to (1,3) by passing through (1,2).
- **Assert (Expected Outcomes)**:
  - `hooksPathfinding.calculatePath` returns an empty list because `movementRules.isWalkable` returns false for the rock obstacle.
  - `isMoving` remains false.
  - No position update occurs for the hero.
  - `hoveredPath` remains empty.

## Scenario: Courage Spell Expiration

- **Given**: A hero has "Courage" in `activeStatus`. No monsters are visible (all cells in `visibilityMap.data` with `fog: false` contain no monsters).
- **When**: `updateCanAttack` is triggered.
- **Assert (Expected Outcomes)**:
  - `sessionManager.clearHeroStatusEverywhere("Courage")` is called.
  - "Courage" is removed from `hero.activeStatus` by the boundary.
  - `onNotify` is triggered with "L'effetto di Coraggio svanisce...".

## Scenario: Deterministic Completion of Movement

- **Given**: A hero is moving along an `activePath` of length 3.
- **When**: The hero reaches the final destination coordinate.
- **Assert (Expected Outcomes)**:
  - `isMoving` is set to false.
  - `activePath` is set to empty.
  - Each traversed step is persisted through `sessionManager.moveCurrentHeroTo(nextX, nextY)`.
  - If the destination cell has `fine` property and `checkMissionObjective` is true, `sessionManager.markCurrentHeroEscaped()` is called and `endTurn` is triggered.
  - The system ensures no "isMoving" flag remains stuck, preventing future actions.
