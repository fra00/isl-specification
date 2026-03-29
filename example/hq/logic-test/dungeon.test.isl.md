<!-- LOGIC TEST SCENARIOS FOR: dungeon.isl.md -->

## Scenario: Fog of War Persistence
- **Given**: A `GameSession` where a hero is at (5,5) and `boardVisibilityMap` has fog enabled for all cells.
- **When**: The hero moves to (5,6), triggering `useFogOfWar.calculateFog`.
- **Assert (Expected Outcomes)**:
  - The cells within the hero's line of sight (calculated via `useVisibilityCalc`) must have `fog` set to `false`.
  - The `fog` status of previously visited cells (e.g., (5,5)) must remain `false` (Deterministic persistence).
  - The system must never revert a `false` fog status to `true` regardless of hero movement.

## Scenario: Trap Detection and Disarm Logic
- **Given**: A hero is adjacent to a trap at (3,3) of type 2 (Spear Trap) and `areMonstersVisible` is false.
- **When**: The hero performs `searchTraps` and then `attemptDisarmTrap` on the detected trap.
- **Assert (Expected Outcomes)**:
  - `searchTraps` must correctly identify the trap and add it to `triggeredTraps` with status 'DETECTED'.
  - `attemptDisarmTrap` must validate the `canDisarm` capability (hero must have disarm tool).
  - If the random roll is < 6, status must transition to 'DISARMED'.
  - If the random roll is 6, status must transition to 'TRIGGERED' and apply damage to the hero.

## Scenario: Combat Resolution and State Cleanup
- **Given**: A hero attacks a monster with 1 Body Point remaining using a weapon with 2 attack dice.
- **When**: `resolveCombat` is triggered and the monster's `currentBody` drops to 0.
- **Assert (Expected Outcomes)**:
  - `combatResult.damageDealt` must be correctly calculated as `Max(0, skulls - shields)`.
  - The monster must be removed from `gameSession.monsters`.
  - The `lastAttack` object must be populated in the session for UI display.
  - The system must ensure `attacksPerformed` is incremented and `turnPhase.hasPerformedAction` is set to `true` if no double attack is possible.

## Scenario: Deterministic Movement and Trap Trigger
- **Given**: A hero has 5 movement points and there is a trap at the next step of the path.
- **When**: `movementEffect` processes the step onto the trap cell.
- **Assert (Expected Outcomes)**:
  - The hero's position must update to the trap cell.
  - `movementPoints` must decrement.
  - `checkTrapActivation` must return true, triggering the trap effect (damage/status change).
  - The movement animation must stop immediately (`isMoving` = false), and the turn must end (`hasMoved` = true, `hasPerformedAction` = true).
  - The system must ensure no logical dead-end occurs; the hero must remain in a valid state even after taking damage.

## Scenario: Spell Targeting and Line of Sight
- **Given**: A hero is targeting a "Palla di Fuoco" spell at a monster behind a wall.
- **When**: The user clicks the monster on the board.
- **Assert (Expected Outcomes)**:
  - `handleMonsterClick` must invoke `hooksVisibilityCalc.hasLineOfSight`.
  - Since LOS is blocked, the system must trigger `onNotify("Non hai linea di vista sul mostro!")` and abort the cast.
  - The `targetingSpell` state must remain active, allowing the user to select a valid target or cancel.
  - The system must not consume the spell from `availableSpells` until a valid cast is confirmed.

## Scenario: Inventory Mutual Exclusivity
- **Given**: A hero has a "Shield" (ID 11) equipped and attempts to equip a "Two-Handed Sword" (noogg: 11).
- **When**: `toggleEquipItem` is called for the sword.
- **Assert (Expected Outcomes)**:
  - The system must detect the `noogg` conflict.
  - The "Shield" must be automatically removed from `hero.equipped`.
  - The "Two-Handed Sword" must be added to `hero.equipped`.
  - A notification "Hai rimosso Scudo perché incompatibile" must be triggered.
  - The session must be updated to reflect the new equipment state.