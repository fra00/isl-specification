# Project: Heroquest React Logic Tests

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-12
**Implementation**: ./logic-test/dungeon-use-traps.test

---

> **Reference**: `./dungeon-use-traps.isl.md`

## Domain Concepts

- `logic test scenarios`: Deterministic acceptance scenarios used to verify the referenced HeroQuest component behavior.

## Component: LogicTestScenarios

### Role: Test

### ⚡ Scenarios

<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-traps.isl.md -->

## Scenario: Search Traps - Adversarial Block

- **Given**: `areMonstersVisible` is `true`.
- **When**: Hero attempts to call `searchTraps`.
- **Assert (Expected Outcomes)**:
  - `onNotify` is triggered with "Non puoi cercare trappole con mostri vicini!".
  - `triggeredTraps` remains unchanged.
  - `onActionDone` is **not** called (or flow terminates before state mutation).

## Scenario: Search Traps - Successful Detection

- **Given**: `areMonstersVisible` is `false`. A hero is at (5,5). `visibilityCalc` returns a list of cells including (6,5). `gameSession.currentMap.grid` at (6,5) contains a `MapCellTrap` with `tipo: 2`.
- **When**: Hero calls `searchTraps`.
- **Assert (Expected Outcomes)**:
  - `triggeredTraps` contains an entry for (6,5) with `status: 'DETECTED'`.
  - `onNotify` is triggered with "Attenzione! Hai individuato delle trappole!".
  - `onActionDone` is triggered.

## Scenario: Attempt Disarm - Failure (No Tools)

- **Given**: A trap exists at (6,5) with `status: 'DETECTED'`. `canDisarm` is `false`.
- **When**: Hero calls `attemptDisarmTrap(6, 5, false, onFail)`.
- **Assert (Expected Outcomes)**:
  - `onNotify` is triggered with "Non hai gli strumenti per disarmare questa trappola.".
  - `trap.status` remains 'DETECTED'.
  - `onActionDone` is triggered.

## Scenario: Attempt Disarm - Success (Roll 1-5)

- **Given**: A trap exists at (6,5) with `status: 'DETECTED'`. `canDisarm` is `true`. Random roll generates 3.
- **When**: Hero calls `attemptDisarmTrap(6, 5, true, onFail)`.
- **Assert (Expected Outcomes)**:
  - `trap.status` is updated to 'DISARMED'.
  - `onNotify` is triggered with "Trappola disarmata con successo!".
  - The trap is no longer considered visible, so the miniature disappears from the board.
  - `onActionDone` is triggered.

## Scenario: Attempt Disarm - Critical Failure (Roll 6)

- **Given**: A trap exists at (6,5) with `status: 'DETECTED'`. `canDisarm` is `true`. Random roll generates 6.
- **When**: Hero calls `attemptDisarmTrap(6, 5, true, onFail)`.
- **Assert (Expected Outcomes)**:
  - `trap.status` is updated to 'TRIGGERED'.
  - `onNotify` is triggered with "Hai fatto scattare la trappola!".
  - `onFail` callback is executed.
  - The trap remains visible and active, so the hero can attempt to disarm it again on a later turn.
  - `onActionDone` is triggered.

## Scenario: Trap Activation - Abisso (Type 1)

- **Given**: A `MapCellTrap` with `tipo: 1` (Abisso) exists at (2,2).
- **When**: `checkTrapActivation` is called for (2,2).
- **Assert (Expected Outcomes)**:
  - Returns `true` while the trap is hidden, detected, or already triggered but not yet disarmed.
  - Returns `false` only after the trap has been disarmed.

## Scenario: Adjacent Disarm Action

- **Given**: A hero stands at (5,5). A detected trap exists at (5,4). Another detected trap exists at (8,8). The acting hero is a Dwarf or has equipment with `disinnesc = true`.
- **When**: The hero calls `disarmAdjacentTrap(5, 5, true, onFail)`.
- **Assert (Expected Outcomes)**:
  - Only the adjacent trap at (5,4) is chosen for the action.
  - On success, the adjacent trap becomes `DISARMED`.
  - The non-adjacent trap at (8,8) remains unchanged.

## Scenario: Retry After Failed Disarm

- **Given**: A hero stands adjacent to a trap. The first disarm attempt fails, so the trap becomes `TRIGGERED` and deals its consequence.
- **When**: On a later turn, the hero is still adjacent and calls `disarmAdjacentTrap(...)` again.
- **Assert (Expected Outcomes)**:
  - The trap is still offered as a valid disarm target.
  - The disarm button remains available while the hero is adjacent and capable of disarming.
  - A later successful attempt changes the trap to `DISARMED`.

## Scenario: Deterministic Flow - Disarm Cleanup

- **Given**: A valid trap interaction flow is initiated.
- **When**: Any path of `attemptDisarmTrap` is executed (Success, Failure, or Invalid).
- **Assert (Expected Outcomes)**:
  - The `onActionDone` callback is **guaranteed** to be called in all logical branches.
  - The system state never remains in a "pending" or "blocking" state, ensuring the UI/Game loop can proceed to the next turn phase.
