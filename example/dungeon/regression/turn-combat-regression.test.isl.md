# Project: Dungeon React Regression Tests

**Version**: 1.0.0
**ISL Version**: 1.6.2
**Created**: 2026-04-27
**Implementation**: ./regression/turn-combat-regression.test

---

> **Reference**: `../dungeon.isl.md`
> **Reference**: `../dungeon-use-turn-logic.isl.md`

## Component: TurnCombatRegression

### Role: Test

### ⚡ Scenarios

## Scenario: Roll Movement Re-Enabled On New Hero Turn

- **Target**: `useTurnLogic.syncTurnTransientStateOnTurnChange`, `DungeonTurnControls`
- **Given**:
  - Hero A ends turn after moving.
  - Turn advances to Hero B.
- **When**:
  - New active turn owner is Hero B.
- **Assert (Expected Outcomes)**:
  - Transient state is reset for new turn owner.
  - `movementPoints` is `null` and `turnPhase.HasMoved` is false.
  - "Roll Movement" is enabled for Hero B.

## Scenario: Dead Hero Cannot Act And Is Skipped

- **Target**: `Dungeon.monitorTurn`, `useTurnLogic.rollMovement`, `useTurnLogic.handleBoardClick`, `useTurnLogic.handleMonsterClick`
- **Given**:
  - Active hero has `currentBody <= 0`.
- **When**:
  - Turn processing and action handlers execute.
- **Assert (Expected Outcomes)**:
  - Hero is treated as dead and cannot roll/move/attack.
  - Turn is skipped by advancing to next valid hero.
  - No action side effects are persisted for dead hero input.

## Scenario: Escaped Hero Cannot Act And Is Skipped

- **Target**: `Dungeon.monitorTurn`, `useTurnLogic` action guards
- **Given**:
  - Active hero has `isEscaped = true`.
- **When**:
  - Turn processing and action handlers execute.
- **Assert (Expected Outcomes)**:
  - Escaped hero cannot perform turn actions.
  - Turn immediately advances to next usable hero.
  - UI controls for active hero actions are not exposed for escaped hero.

## Scenario: Invisible Passage Expires At Turn End

- **Target**: `useTurnLogic.endTurn`, `useDungeonSessionManager.clearCurrentHeroStatus`
- **Given**:
  - Active hero has `"InvisiblePassage"` in `activeStatus`.
- **When**:
  - Hero ends turn.
- **Assert (Expected Outcomes)**:
  - `"InvisiblePassage"` is removed from current hero status.
  - Optional notification of expiration is emitted.
  - Status does not persist across subsequent turns.

### ✅ Coverage Intent

- Covers turn-state reset, dead/escaped guardrails, and status lifecycle at end turn.
- Prevents regressions where unusable heroes still act or stale turn state leaks to next hero.

