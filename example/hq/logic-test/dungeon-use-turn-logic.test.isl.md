# Project: Heroquest React Logic Tests

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-12
**Implementation**: ./logic-test/dungeon-use-turn-logic.test

---

> **Reference**: `./dungeon-use-turn-logic.isl.md`

## Domain Concepts

- `logic test scenarios`: Deterministic acceptance scenarios used to verify the referenced HeroQuest component behavior.

## Component: LogicTestScenarios

### Role: Test

### ⚡ Scenarios

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

## Scenario: Mission Objective Requires All Active Header Goals

- **Given**: The current map header can specify a boss objective, a final treasure coordinate, a required item, and a required weapon.
- **When**: `checkMissionObjective()` is evaluated.
- **Assert (Expected Outcomes)**:
  - Boss objectives remain incomplete while the target monster is still alive or still hidden in an unspawned map cell.
  - Final treasure objectives remain incomplete while the target treasure cell still contains collectible treasure payload.
  - Item objectives remain incomplete while the required item is still on the map or not yet present in a hero inventory.
  - Weapon objectives remain incomplete while the required weapon is still on the map or not yet present in a hero equipment list.
  - The mission is complete only when every active objective in the header has been satisfied.

## Scenario: Invalid Movement Pathing (Adversarial)

- **Given**: A hero is at (1,1). A wall (Rock) exists at (1,2).
- **When**: The user attempts `handleBoardClick` to (1,3) by passing through (1,2).
- **Assert (Expected Outcomes)**:
  - `hooksPathfinding.calculatePath` returns an empty list because `movementRules.isWalkable` returns false for the rock obstacle.
  - `isMoving` remains false.
  - No position update occurs for the hero.
  - `hoveredPath` remains empty.

## Scenario: Passapareti Preview Allows One Fogged-Room Crossing

- **Given**: The active hero has `WallPass`, enough movement points, and hovers a fogged destination cell in a neighboring room that requires exactly one true wall crossing.
- **When**: `handleBoardHover` is triggered for that fogged destination.
- **Assert (Expected Outcomes)**:
  - `hooksPathfinding.calculatePath` returns a path to the fogged destination.
  - `hoveredPath` is populated with the full preview path.
  - `hoveredPathVariant` is set to `valid`.
  - The flow does not require the destination room to be already revealed.

## Scenario: Passapareti Preview Turns Red On Second Wall Crossing

- **Given**: The active hero has `WallPass`, enough movement points, and hovers a destination whose preview path would require two true wall crossings.
- **When**: `handleBoardHover` is triggered for that destination.
- **Assert (Expected Outcomes)**:
  - `hoveredPath` is still populated for feedback.
  - `hoveredPathVariant` is set to `blocked-by-second-wall`.
  - `handleBoardClick` on that destination does not start movement.
  - `onNotify` explains that `Passapareti` allows only one wall crossing.

## Scenario: Passapareti Preview Allows One Fogged-Room Crossing

- **Given**: The active hero has `WallPass`, enough movement points, and hovers a fogged destination cell in a neighboring room that requires exactly one true wall crossing.
- **When**: `handleBoardHover` is triggered for that fogged destination.
- **Assert (Expected Outcomes)**:
  - `hooksPathfinding.calculatePath` returns a path to the fogged destination.
  - `hoveredPath` is populated with the full preview path.
  - `hoveredPathVariant` is set to `valid`.
  - The flow does not require the destination room to be already revealed.

## Scenario: Passapareti Preview Turns Red On Second Wall Crossing

- **Given**: The active hero has `WallPass`, enough movement points, and hovers a destination whose preview path would require two true wall crossings.
- **When**: `handleBoardHover` is triggered for that destination.
- **Assert (Expected Outcomes)**:
  - `hoveredPath` is still populated for feedback.
  - `hoveredPathVariant` is set to `blocked-by-second-wall`.
  - `handleBoardClick` on that destination does not start movement.
  - `onNotify` explains that `Passapareti` allows only one wall crossing.

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

## Scenario: Exit Stairs Allow Confirmed Retreat Before Mission Completion

- **Given**: The active hero reaches a cell whose `fine` flag marks the stairs, but `checkMissionObjective()` is false.
- **When**: The movement completes on the stairs.
- **Assert (Expected Outcomes)**:
  - The system opens a confirmation dialog asking whether the player wants to leave without completing the mission.
  - If the player confirms, `sessionManager.markCurrentHeroEscaped()` is called and the turn ends normally.
  - After the confirmed retreat, `endTurn(true)` advances the session to the next eligible hero turn without waiting for `isMoving` to settle asynchronously.
  - If the player cancels, no escape is persisted and the hero remains available to continue the mission from the stairs cell.
