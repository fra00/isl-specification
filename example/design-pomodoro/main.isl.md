# Project: Main

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: TimerMode, TimerState, TimerConfigEntity in `./domain.isl.md`
> **Reference**: PomodoroEngine in `./logic.isl.md`
> **Reference**: TimerDisplay, ControlButtons in `./ui.isl.md`

## Component: Main
### Role: Presentation
**Signature**: None (This is the application's entry point)

### 📦 Content
- Contains a `TimerDisplay` component.
- Contains a `ControlButtons` component.

### ⚡ Capabilities

#### initializeApplication
**Contract**: Sets up the core `PomodoroEngine` and establishes initial state for the UI.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1. Create an instance of `PomodoroEngine` with default `TimerConfigEntity`:
   - `workDuration: 1500` (seconds)
   - `shortBreakDuration: 300` (seconds)
   - `longBreakDuration: 900` (seconds)
2. Call `PomodoroEngine.initialize()`.
3. Establish a mechanism to periodically trigger `PomodoroEngine.tick()` every `1` second when the engine's `currentState` is `Running`.
4. Expose `PomodoroEngine`'s `currentMode`, `currentState`, and `remainingTime` as observable properties.
5. Expose `PomodoroEngine`'s `startTimer`, `pauseTimer`, `resetTimer`, and `selectMode` capabilities as callbacks.
**Side Effects**: Initializes `PomodoroEngine`, sets up periodic `tick` mechanism, makes engine state and actions available.

#### renderApplication
**Contract**: Renders the `TimerDisplay` and `ControlButtons` components, connecting them to the `PomodoroEngine`'s state and actions.
**Signature**:
- **Input**: None
- **Output**: Rendered UI components.
**Flow**:
1. Render `TimerDisplay`:
   - Pass `PomodoroEngine.remainingTime` to `TimerDisplay.remainingTime`.
   - Pass `PomodoroEngine.currentMode` to `TimerDisplay.currentMode`.
   - Pass `PomodoroEngine.currentState` to `TimerDisplay.currentState`.
2. Render `ControlButtons`:
   - Pass `PomodoroEngine.currentState` to `ControlButtons.currentState`.
   - Pass `PomodoroEngine.startTimer` as `ControlButtons.onStart`.
   - Pass `PomodoroEngine.pauseTimer` as `ControlButtons.onPause`.
   - Pass `PomodoroEngine.resetTimer` as `ControlButtons.onReset`.
   - Pass `PomodoroEngine.selectMode` as `ControlButtons.onSelectMode`.
**Side Effects**: Displays the user interface.

### ✅ Acceptance Criteria
- The `TimerDisplay` component MUST accurately reflect the `PomodoroEngine`'s `remainingTime`, `currentMode`, and `currentState`.
- User interactions with `ControlButtons` (Start, Pause, Reset, Mode Selection) MUST correctly trigger the corresponding capabilities on the `PomodoroEngine`.
- The application MUST start with the `Work` mode selected and in an `Idle` state, displaying `25:00`.