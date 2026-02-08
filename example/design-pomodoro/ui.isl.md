# Project: Ui

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./ui

> **Reference**: TimerMode, TimerState in `./domain.isl.md`

## Component: TimerDisplay
### Role: Presentation
**Signature**:
- `remainingTime`: `number` (seconds) - The time left to display.
- `currentMode`: `TimerMode` - The active timer mode.
- `currentState`: `TimerState` - The current state of the timer.

### 🔍 Appearance
- Displays the `remainingTime` in `MM:SS` format.
- Displays the `currentMode` name (e.g., "Work", "Short Break").
- The display color or style MAY change based on `currentState` (e.g., red for `Completed`).

### 📦 Content
- A primary text element showing the formatted time (e.g., "24:59").
- A secondary text element indicating the current mode (e.g., "Work Session").

### ⚡ Capabilities

#### formatTime
**Contract**: Converts total seconds into a `MM:SS` string format.
**Signature**:
- **Input**: `totalSeconds`: `number` (seconds)
- **Output**: `string` (format: "MM:SS")
**Flow**:
1. Calculate `minutes` as `floor(totalSeconds / 60)`.
2. Calculate `seconds` as `totalSeconds % 60`.
3. Format `minutes` to always be two digits (e.g., "05").
4. Format `seconds` to always be two digits (e.g., "09").
5. Return the formatted string `minutes:seconds`.

### ✅ Acceptance Criteria
- The `remainingTime` of `1500` seconds MUST be displayed as "25:00".
- The `remainingTime` of `305` seconds MUST be displayed as "05:05".
- The `currentMode` `TimerMode.Work` MUST be displayed as "Work Session" or similar descriptive text.

## Component: ControlButtons
### Role: Presentation
**Signature**:
- `currentState`: `TimerState` - The current state of the timer, used to enable/disable buttons.
- `onStart`: `() => void` - Callback to trigger timer start.
- `onPause`: `() => void` - Callback to trigger timer pause.
- `onReset`: `() => void` - Callback to trigger timer reset.
- `onSelectMode`: `(mode: TimerMode) => void` - Callback to trigger mode selection.

### 🔍 Appearance
- Buttons for "Start", "Pause", "Reset".
- Buttons or tabs for "Work", "Short Break", "Long Break" mode selection.
- Buttons MUST be enabled/disabled based on `currentState`.

### 📦 Content
- Button: "Start" (or "Resume")
- Button: "Pause"
- Button: "Reset"
- Button: "Work"
- Button: "Short Break"
- Button: "Long Break"

### 🚨 Constraints
- The "Start" button MUST be disabled if `currentState` is `Running`.
- The "Pause" button MUST be disabled if `currentState` is `Idle`, `Paused`, or `Completed`.
- The "Reset" button MUST be enabled in all states except `Idle` (unless it's also the only way to exit `Completed`).
- Mode selection buttons MUST be enabled in `Idle`, `Paused`, or `Completed` states. They SHOULD be disabled when `currentState` is `Running`.

### ✅ Acceptance Criteria
- Clicking "Start" MUST trigger the `onStart` callback.
- Clicking "Pause" MUST trigger the `onPause` callback.
- Clicking "Reset" MUST trigger the `onReset` callback.
- Clicking "Work" mode button MUST trigger `onSelectMode(TimerMode.Work)`.
- When `currentState` is `Running`, the "Start" button MUST be visually disabled.
- When `currentState` is `Paused`, the "Pause" button MUST be visually disabled.