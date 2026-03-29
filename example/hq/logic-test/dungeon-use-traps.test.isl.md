<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-traps.isl.md -->

## Scenario: Search Traps - Blocked by Proximity
- **Given**: `areMonstersVisible` is `true`. The current hero is at `(5, 5)`.
- **When**: The user triggers `searchTraps`.
- **Assert (Expected Outcomes)**:
    - `onNotify` is called with "Non puoi cercare trappole con mostri vicini!".
    - `triggeredTraps` remains unchanged.
    - `onActionDone` is **not** triggered (or flow terminates early).

## Scenario: Search Traps - Successful Detection
- **Given**: `areMonstersVisible` is `false`. A trap exists at `(6, 6)` within the hero's visibility range. `triggeredTraps` is empty.
- **When**: The user triggers `searchTraps`.
- **Assert (Expected Outcomes)**:
    - `visibilityCalc.calculateVisibleCells` returns a list including `(6, 6)`.
    - `triggeredTraps` contains an entry for `(6, 6)` with `status: 'DETECTED'`.
    - `onNotify` is called with "Attenzione! Hai individuato delle trappole!".
    - `onActionDone` is called.

## Scenario: Attempt Disarm - Success Logic
- **Given**: A trap at `(6, 6)` exists in `triggeredTraps` with `status: 'DETECTED'`. The hero has `canDisarm: true`.
- **When**: `attemptDisarmTrap` is called with a simulated roll of 1-5.
- **Assert (Expected Outcomes)**:
    - `triggeredTraps` entry at `(6, 6)` has `status: 'DISARMED'`.
    - `onNotify` is called with "Trappola disarmata con successo!".
    - `onActionDone` is called.

## Scenario: Attempt Disarm - Failure Logic (Triggered)
- **Given**: A trap at `(6, 6)` exists in `triggeredTraps` with `status: 'DETECTED'`. The hero has `canDisarm: true`.
- **When**: `attemptDisarmTrap` is called with a simulated roll of 6.
- **Assert (Expected Outcomes)**:
    - `triggeredTraps` entry at `(6, 6)` has `status: 'TRIGGERED'`.
    - `onNotify` is called with "Hai fatto scattare la trappola!".
    - `onFail()` callback is executed.
    - `onActionDone` is called.

## Scenario: Attempt Disarm - Invalid State/Permissions
- **Given**: A trap at `(6, 6)` is not in `triggeredTraps` (or status is 'TRIGGERED').
- **When**: `attemptDisarmTrap` is called.
- **Assert (Expected Outcomes)**:
    - `onNotify` is called with "Non c'è una trappola disarmabile qui.".
    - `triggeredTraps` remains unchanged.
    - `onActionDone` is **not** called.

## Scenario: Trap Activation - Abisso (Type 1)
- **Given**: A map cell at `(2, 2)` has `trpl.tipo: 1`.
- **When**: `checkTrapActivation` is called for `(2, 2)`.
- **Assert (Expected Outcomes)**:
    - Returns `true` regardless of `triggeredTraps` state.

## Scenario: Deterministic Completion - Flow Integrity
- **Given**: Any action (`searchTraps` or `attemptDisarmTrap`) is initiated.
- **When**: The logic executes.
- **Assert (Expected Outcomes)**:
    - The flow must guarantee that `onActionDone()` is called in all terminal paths (Success, Failure, or Invalid Input).
    - The system must never remain in a "processing" state; `triggeredTraps` must be updated atomically before `onActionDone` is triggered to ensure the UI reflects the new state immediately upon completion.