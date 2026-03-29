<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-turn-logic.isl.md -->

## Scenario: Movement Pathfinding with Obstacle Avoidance
- **Given**: A `GameSession` where the hero is at (5,5) and a `MapDefinition` containing a rock block (`arnt.antroc: true`) at (5,6).
- **When**: The user triggers `handleBoardHover` for target cell (5,7).
- **Assert (Expected Outcomes)**:
    - `hoveredPath` must be empty because the path is blocked by the rock at (5,6).
    - The system must not allow `handleBoardClick` to initiate movement to (5,7).

## Scenario: Combat Resolution with Equipment Bonus
- **Given**: A hero with `attacco: 2` equipped with a weapon (`dadatt: 3`). A monster with `difesa: 2`.
- **When**: The user triggers `handleMonsterClick` on the monster.
- **Assert (Expected Outcomes)**:
    - `heroStatsLogic.calculateAttackDice` must return 3 (the weapon value, not the sum).
    - `combatLogic.resolveCombat` must be called with 3 attack dice.
    - `combatResult.damageDealt` must be calculated as `Max(0, skulls - shields)`.

## Scenario: Trap Trigger and Movement Interruption
- **Given**: A hero at (2,2) with 5 `movementPoints`. A trap of type 2 (Lance) exists at (2,3).
- **When**: The user clicks (2,4) to move, and the path includes (2,3).
- **Assert (Expected Outcomes)**:
    - `movementEffect` must detect the trap at (2,3).
    - `currentHero.currentBody` must be decremented by 1.
    - `isMoving` must be set to `false` immediately upon triggering the trap.
    - `turnPhase.hasMoved` and `turnPhase.hasPerformedAction` must be set to `true`, ending the turn prematurely.

## Scenario: Deterministic Turn Transition and Cleanup
- **Given**: A hero with "FoggyMist" status active at the end of their turn.
- **When**: The user triggers `endTurn()`.
- **Assert (Expected Outcomes)**:
    - "FoggyMist" must be removed from `hero.activeStatus`.
    - `turnPhase` must be reset to initial state (all flags false).
    - `movementPoints` must be reset to `null`.
    - `attacksPerformed` must be reset to 0.
    - `onUpdateSession` must be called to persist the state change.

## Scenario: Ranged Weapon Consumption
- **Given**: A hero equipped with a weapon where `tirounavo: true`.
- **When**: The hero performs a ranged attack (`handleMonsterClick`) on a monster at distance > 1.
- **Assert (Expected Outcomes)**:
    - The weapon ID must be identified via `getConsumableWeaponId`.
    - The weapon ID must be removed from `hero.equipped` and `hero.equipment`.
    - The state must update to reflect the loss of the weapon.

## Scenario: Mission Objective Completion (Escape)
- **Given**: A map where `header.nfine` requires a specific boss kill, and the boss is still alive in `gameSession.monsters`.
- **When**: The hero moves onto a cell marked as `fine` (exit).
- **Assert (Expected Outcomes)**:
    - `checkMissionObjective` must return `false`.
    - The hero must NOT be marked as `isEscaped`.
    - The system must trigger `onNotify` with the message: "Non puoi uscire! Devi prima compiere la missione."
    - The hero must remain on the map.

## Scenario: Deterministic Completion of Movement
- **Given**: A hero is moving along an `activePath` of length 3.
- **When**: The hero reaches the final destination cell.
- **Assert (Expected Outcomes)**:
    - `isMoving` must be set to `false`.
    - `activePath` must be cleared.
    - If `movementPoints` > 0, the system must remain in a state where further actions (like searching or attacking) are permitted.
    - If `movementPoints` == 0, `turnPhase.hasMoved` must be set to `true`.
    - The system must never remain in a "moving" state (dead-end) if the path is completed.