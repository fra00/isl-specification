# Project: Main

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Defines core data structures in `./domain.isl.md`
> **Reference**: Defines `GameEngine` in `./game-logic.isl.md`
> **Reference**: Defines `GameBoardComponent` in `./game-board.isl.md`
> **Reference**: Defines `ScoreBoardComponent` in `./score-board.isl.md`

## Component: Main
### Role: Presentation
**Signature**: None

### 🔍 Appearance
- Arranges the `ScoreBoardComponent` and `GameBoardComponent` in a coherent layout (e.g., scoreboard above the game board).

### 📦 Content
- Contains one instance of `ScoreBoardComponent`.
- Contains one instance of `GameBoardComponent`.

### ⚡ Capabilities

#### initializeGame
**Contract**: Initializes the game engine and starts the game.
**Signature**: `()` -> `void`
**Flow**:
1.  Request `GameEngine` to `initializeGame`.
2.  Request `GameEngine` to `startGameTimer`.
**Side Effects**: Updates the internal state of the `GameEngine`.

#### handleCardFlip
**Contract**: Passes a card flip event to the game engine.
**Signature**: `(cardId: UUID)` -> `void`
**Flow**:
1.  Request `GameEngine` to `flipCard` with `cardId`.
**Side Effects**: Updates the internal state of the `GameEngine`.

#### handleResetGame
**Contract**: Resets the game through the game engine.
**Signature**: `()` -> `void`
**Flow**:
1.  Request `GameEngine` to `resetGame`.
2.  Request `GameEngine` to `startGameTimer`.
**Side Effects**: Resets the internal state of the `GameEngine`.

### 🚨 Constraints
- The `Main` component MUST act as the central orchestrator, connecting the `GameEngine`'s state and actions to the UI components.
- The `Main` component MUST NOT contain direct game logic, delegating all such responsibilities to the `GameEngine`.

### ✅ Acceptance Criteria
- The `Main` component successfully renders `ScoreBoardComponent` and `GameBoardComponent`.
- `ScoreBoardComponent` receives `moves`, `timerSeconds`, `gameStatus`, and `onResetGame` from the `Main` component's state/callbacks.
- `GameBoardComponent` receives `cards`, `gridSize`, and `onCardFlip` from the `Main` component's state/callbacks.
- Clicking a card in `GameBoardComponent` correctly triggers `handleCardFlip` in `Main`.
- Clicking the reset button in `ScoreBoardComponent` correctly triggers `handleResetGame` in `Main`.
- Upon initial load, the game is initialized and the timer starts.