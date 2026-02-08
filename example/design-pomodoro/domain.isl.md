# Project: Domain

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./domain

## Domain Concepts

### TimerMode
Represents the different operational modes of the Pomodoro timer.
- **Type**: Enum
- **Values**:
  - `Work`: The primary work session mode.
  - `ShortBreak`: A short break session mode.
  - `LongBreak`: A longer break session mode.

### TimerState
Represents the current operational state of the Pomodoro timer.
- **Type**: Enum
- **Values**:
  - `Idle`: The timer is ready to start or has been reset.
  - `Running`: The timer is actively counting down.
  - `Paused`: The timer countdown is temporarily suspended.
  - `Completed`: The current timer session has finished.

### TimerConfigEntity
Defines the duration settings for each timer mode.
- **Type**: Object
- **Properties**:
  - `workDuration`: The duration for the 'Work' mode.
    - **Type**: `number`
    - **Unit**: `seconds`
    - **Default**: `1500` (25 minutes)
  - `shortBreakDuration`: The duration for the 'Short Break' mode.
    - **Type**: `number`
    - **Unit**: `seconds`
    - **Default**: `300` (5 minutes)
  - `longBreakDuration`: The duration for the 'Long Break' mode.
    - **Type**: `number`
    - **Unit**: `seconds`
    - **Default**: `900` (15 minutes)