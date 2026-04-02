<!-- LOGIC TEST SCENARIOS FOR: page-presentation.isl.md -->

This document outlines the critical logic test scenarios for the **Heroquest React** system, focusing on domain integrity, state transitions, and flow continuity.

---

## Scenario: Hero Purchase Validation (Domain Integrity)
- **Given**: A `HeroState` with 100 Gold and an `Equipment` item (ID: 11, Shield) with `prezzo: 150` and `nopsgid: 1` (Barbarian).
- **When**: The `ShopLogic.validatePurchase` is called for a Barbarian hero.
- **Assert (Expected Outcomes)**:
    - `allowed` must be `false`.
    - `reason` must be "Not enough gold".
    - If gold is increased to 200, `allowed` must be `false` with `reason` "Forbidden for class" (if heroId is 1).

## Scenario: Turn Phase Transition (Flow Continuity)
- **Given**: A `GameSession` where the current hero has `movementPoints: 5` and `turnPhase: {HasMoved: false, HasPerformedAction: false}`.
- **When**: The hero moves 5 tiles and calls `markActionDone`.
- **Assert (Expected Outcomes)**:
    - `movementPoints` must be 0.
    - `turnPhase.HasMoved` must be `true`.
    - `turnPhase.HasPerformedAction` must be `true`.
    - The system must prevent further movement or actions for this turn.

## Scenario: Deterministic Trap Trigger (Flow Integrity)
- **Given**: A hero moves onto a cell containing a "Falling Rock" trap (`tipo: 3`) and `trapsLogic.checkTrapActivation` returns `true`.
- **When**: The movement animation completes on the trap cell.
- **Assert (Expected Outcomes)**:
    - `currentHero.currentBody` must be decremented by 1.
    - The trap must be registered in `triggeredTraps` with status `TRIGGERED`.
    - The target cell defined in `rccadex/y` must have `arnt.antroc` set to `true` (blocking the path).
    - `turnPhase` must be forced to `IsTurnFinished: true` to prevent further movement.

## Scenario: Combat Resolution (Adversarial Scenario)
- **Given**: A hero with 3 attack dice attacks a monster with 2 defense dice.
- **When**: `combatLogic.resolveCombat` is executed.
- **Assert (Expected Outcomes)**:
    - `damageDealt` must be `Max(0, skulls - shields)`.
    - `attackerDice` and `defenderDice` lists must contain exactly the number of dice rolled.
    - If `damageDealt` >= `monster.currentBody`, the monster must be removed from `gameSession.monsters`.

## Scenario: Spell Casting Consumption (Flow Continuity)
- **Given**: A hero has `availableSpells: [1, 2]` (where 1 is "Palla di Fuoco").
- **When**: `hooksMagicLogic.castSpell` is called successfully for spell ID 1.
- **Assert (Expected Outcomes)**:
    - The spell ID `1` must be removed from `hero.availableSpells`.
    - `onUpdateSession` must be triggered with the updated session.
    - `onActionDone` must be triggered to mark the turn action as complete.
    - The system must never leave the spell in the list if the cast was successful.

## Scenario: Monster AI Turn (Deterministic Completion)
- **Given**: A session with 2 monsters and 1 hero.
- **When**: `hooksMonsterAI.runMonsterTurn` is triggered.
- **Assert (Expected Outcomes)**:
    - `isMonsterTurnInProgress` must be `true` during execution.
    - Each monster must perform exactly one movement and one attack (if in range).
    - After all monsters act, `isMonsterTurnInProgress` must be `false`.
    - `currentTurn` must reset to 1.
    - All `turnPhase` flags must be reset to `false` for all heroes.

## Scenario: Inventory Incompatibility (Domain Integrity)
- **Given**: A hero has a "Two-Handed Sword" (ID 20, `noogg: 11`) equipped.
- **When**: The user attempts to equip a "Shield" (ID 11).
- **Assert (Expected Outcomes)**:
    - The "Two-Handed Sword" must be automatically removed from `hero.equipped`.
    - The "Shield" must be added to `hero.equipped`.
    - `onNotify` must be triggered indicating the removal of the incompatible item.

## Scenario: Fog of War Persistence (Domain Integrity)
- **Given**: A cell has `fog: true`. A hero moves into a position where the cell becomes visible.
- **When**: The hero moves away from the cell.
- **Assert (Expected Outcomes)**:
    - The cell's `fog` property must remain `false` (permanently revealed).
    - The system must not revert the cell to `fog: true` when the hero leaves the line of sight.