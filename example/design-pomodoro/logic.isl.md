# Project: Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./logic

> **Reference**: TimerMode, TimerState, TimerConfigEntity in `./domain.isl.md`

## Component: PomodoroEngine
### Role: Business Logic
**Signature**:
- `initialConfig`: `TimerConfigEntity` - The initial configuration for timer durations.

### ⚡ Capabilities

#### initialize
**Contract**: Sets up the initial state of the timer based on the provided configuration.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1. Set `currentMode` to `TimerMode.Work`.
2. Set `currentState` to `TimerState.Idle`.
3. Set `remainingTime` to `initialConfig.workDuration`.
4. Store `initialConfig` as the active `config`.
**Side Effects**: Updates internal state properties (`currentMode`, `currentState`, `remainingTime`, `config`).

#### startTimer
**Contract**: Initiates the countdown for the current timer mode.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1. IF `currentState` is `TimerState.Idle` OR `TimerState.Paused` THEN
   1. Set `currentState` to `TimerState.Running`.
   2. Trigger a periodic `tick` operation every `1` second.
2. ELSE IF `currentState` is `TimerState.Completed` THEN
   1. No action. The timer must be reset or a new mode selected to exit `Completed` state.
**Side Effects**: Changes `currentState` to `Running`, initiates periodic `tick` operations.

#### pauseTimer
**Contract**: Suspends the countdown of the current timer mode.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1. IF `currentState` is `TimerState.Running` THEN
   1. Set `currentState` to `TimerState.Paused`.
   2. Stop any active periodic `tick` operations.
**Side Effects**: Changes `currentState` to `Paused`, stops periodic `tick` operations.

#### resetTimer
**Contract**: Resets the current timer mode to its initial duration and `Idle` state.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1. Stop any active periodic `tick` operations.
2. Set `currentState` to `TimerState.Idle`.
3. IF `currentMode` is `TimerMode.Work` THEN
   1. Set `remainingTime` to `config.workDuration`.
4. ELSE IF `currentMode` is `TimerMode.ShortBreak` THEN
   1. Set `remainingTime` to `config.shortBreakDuration`.
5. ELSE IF `currentMode` is `TimerMode.LongBreak` THEN
   1. Set `remainingTime` to `config.longBreakDuration`.
**Side Effects**: Changes `currentState` to `Idle`, resets `remainingTime`, stops periodic `tick` operations.

#### selectMode
**Contract**: Changes the active timer mode and resets the timer to the new mode's initial duration.
**Signature**:
- **Input**:
  - `mode`: `TimerMode` - The new mode to switch to.
- **Output**: None
**Flow**:
1. Stop any active periodic `tick` operations.
2. Set `currentMode` to `mode`.
3. Set `currentState` to `TimerState.Idle`.
4. IF `mode` is `TimerMode.Work` THEN
   1. Set `remainingTime` to `config.workDuration`.
5. ELSE IF `mode` is `TimerMode.ShortBreak` THEN
   1. Set `remainingTime` to `config.shortBreakDuration`.
6. ELSE IF `mode` is `TimerMode.LongBreak` THEN
   1. Set `remainingTime` to `config.longBreakDuration`.
**Side Effects**: Changes `currentMode`, `currentState` to `Idle`, resets `remainingTime`, stops periodic `tick` operations.

#### tick (Internal)
**Contract**: Decrements the remaining time and handles state transitions when time runs out.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1. IF `currentState` is `TimerState.Running` THEN
   1. Decrement `remainingTime` by `1` (second).
   2. IF `remainingTime` is less than or equal to `0` THEN
      1. Set `remainingTime` to `0`.
      2. Set `currentState` to `TimerState.Completed`.
      3. Stop any active periodic `tick` operations.
**Side Effects**: Decrements `remainingTime`, potentially changes `currentState` to `Completed` and stops `tick` operations.

### 🚨 Constraints
- The `remainingTime` MUST always be a non-negative integer.
- The `tick` operation MUST occur with a precision of `1` second.
- When `currentState` is `TimerState.Completed`, `startTimer` MUST NOT change the state. User input (reset or mode selection) is required to exit this state.

### ✅ Acceptance Criteria
- **Timer Start**: When `startTimer` is called from `Idle` or `Paused`, `currentState` becomes `Running` and `remainingTime` decreases by `1` second every second.
- **Timer Pause**: When `pauseTimer` is called from `Running`, `currentState` becomes `Paused` and `remainingTime` stops decreasing.
- **Timer Reset**: When `resetTimer` is called, `currentState` becomes `Idle` and `remainingTime` is restored to the duration of the `currentMode`.
- **Mode Selection**: When `selectMode` is called, `currentMode` changes, `currentState` becomes `Idle`, and `remainingTime` is set to the new mode's duration.
- **Timer Completion**: When `remainingTime` reaches `0`, `currentState` MUST transition to `Completed`, and the timer MUST stop.
- **Precision**: The timer MUST decrement `remainingTime` by exactly `1` second for each `tick` operation.

### 🧪 Test Scenarios
- **Scenario: Basic Work Cycle**
  - GIVEN `PomodoroEngine` is initialized with `workDuration: 5` seconds.
  - WHEN `startTimer` is called.
  - THEN `currentState` is `Running`.
  - AND after `5` seconds, `currentState` is `Completed` and `remainingTime` is `0`.
- **Scenario: Pause and Resume**
  - GIVEN `PomodoroEngine` is initialized with `workDuration: 10` seconds and `currentState` is `Running` with `remainingTime: 7` seconds.
  - WHEN `pauseTimer` is called.
  - THEN `currentState` is `Paused` and `remainingTime` remains `7` seconds for at least `2` seconds.
  - WHEN `startTimer` is called again.
  - THEN `currentState` is `Running` and `remainingTime` continues to decrease from `7` seconds.
- **Scenario: Reset during Running**
  - GIVEN `PomodoroEngine` is initialized with `workDuration: 10` seconds and `currentState` is `Running` with `remainingTime: 5` seconds.
  - WHEN `resetTimer` is called.
  - THEN `currentState` is `Idle` and `remainingTime` is `10` seconds.
- **Scenario: Select Mode during Running**
  - GIVEN `PomodoroEngine` is initialized with `workDuration: 10`, `shortBreakDuration: 5` seconds, `currentMode` is `Work`, `currentState` is `Running` with `remainingTime: 3` seconds.
  - WHEN `selectMode(TimerMode.ShortBreak)` is called.
  - THEN `currentMode` is `ShortBreak`, `currentState` is `Idle`, and `remainingTime` is `5` seconds.
- **Scenario: Attempt Start from Completed**
  - GIVEN `PomodoroEngine` is in `currentState: Completed` with `remainingTime: 0`.
  - WHEN `startTimer` is called.
  - THEN `currentState` remains `Completed` and `remainingTime` remains `0`.