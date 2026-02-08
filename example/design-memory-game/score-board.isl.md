# Project: Score Board

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./score-board

> **Reference**: Defines core data structures in `./domain.isl.md`

## Component: ScoreBoardComponent
### Role: Presentation
**Signature**:
- `moves`: `number` - The current count of moves.
- `timerSeconds`: `number` - The current game time in seconds.
- `gameStatus`: `GameStatus` - The current status of the game.
- `onResetGame`: `() => void` - Callback function triggered when the reset button is clicked.

### 🔍 Appearance
- Displays the current `moves` count.
- Displays the `timerSeconds` formatted as `MM:SS`.
- Displays a "Reset Game" button.
- May display a message indicating `gameStatus` (e.g., "You Won!").

### 📦 Content
- Text label for "Moves: ".
- Text display for `moves`.
- Text label for "Time: ".
- Text display for `timerSeconds` (formatted).
- A button labeled "Reset Game".
- Optional text display for `gameStatus` messages.

### ⚡ Capabilities

#### handleResetClick
**Contract**: Triggers the `onResetGame` callback.
**Signature**: `()` -> `void`
**Flow**:
1.  Trigger `onResetGame`.
**Side Effects**: None directly on `ScoreBoardComponent` state; dispatches an event.

### 🚨 Constraints
- The `ScoreBoardComponent` MUST NOT contain any game logic. Its sole responsibility is to display game statistics and trigger a reset.

### ✅ Acceptance Criteria
- Displays the `moves` count accurately.
- Displays `timerSeconds` formatted as `MM:SS`.
- A "Reset Game" button is present and triggers `onResetGame` when clicked.
- If `gameStatus` is `GameStatus.Won`, a "You Won!" message is displayed.