# Project: Space Invaders Clone

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./start-game-presentation

> **Reference**: Concepts/Capabilities in `./game-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./game-domain.isl.md`

## Component: StartGamePresentation
### Role: Presentation
**Signature**: (gameState: > **Reference**: `GameState` in `./game-domain.isl.md`, onStartGame: `(stateToStart: > **Reference**: `GameState` in `./game-domain.isl.md`) => void`, onResetGame: `(stateToReset: > **Reference**: `GameState` in `./game-domain.isl.md`) => void`)

### 📐 Appearance
- **Initial Screen**:
  - Centered title "SPACE INVADERS" (large, prominent font).
  - Centered subtitle "Press Start" (smaller font below title).
  - A button labeled "START GAME" below the subtitle.
- **Game Over Screen**:
  - Centered title "GAME OVER" (large, red font).
  - Centered text "SCORE: [current score]" (below title).
  - A button labeled "PLAY AGAIN" below the score.
- **Game Won Screen**:
  - Centered title "YOU WON!" (large, green font).
  - Centered text "SCORE: [current score]" (below title).
  - A button labeled "PLAY AGAIN" below the score.
- **General**:
  - All text and buttons should be clearly visible against a dark background, typically centered on the game canvas.

### 📦 Content
- Contains a title text element.
- Contains a score display text element (for game over/won screens).
- Contains a button element for starting/restarting the game.

### ⚡ Capabilities
#### render
**Contract**: Displays the appropriate screen (start, game over, or game won) based on the current game state.
- **Signature**: `(gameState: > **Reference**: `GameState` in `./game-domain.isl.md`): void`
- **Flow**:
  1. IF `gameState.status` is `INITIAL` (> **Reference**: `GameStatusEnum` in `./game-domain.isl.md`):
     THEN Display "SPACE INVADERS" title.
     THEN Display "Press Start" subtitle.
     THEN Display "START GAME" button.
  2. ELSE IF `gameState.status` is `GAME_OVER` (> **Reference**: `GameStatusEnum` in `./game-domain.isl.md`):
     THEN Display "GAME OVER" title.
     THEN Display "SCORE: " followed by `gameState.score`.
     THEN Display "PLAY AGAIN" button.
  3. ELSE IF `gameState.status` is `GAME_WON` (> **Reference**: `GameStatusEnum` in `./game-domain.isl.md`):
     THEN Display "YOU WON!" title.
     THEN Display "SCORE: " followed by `gameState.score`.
     THEN Display "PLAY AGAIN" button.
  4. ELSE (e.g., `PLAYING`):
     THEN Hide all elements of this presentation component.
- **Side Effects**: Renders or hides UI elements on the screen.
- **✅ Acceptance Criteria**:
  - The correct title and message MUST be displayed for `INITIAL`, `GAME_OVER`, and `GAME_WON` states.
  - The current score MUST be displayed on `GAME_OVER` and `GAME_WON` screens.
  - The appropriate button ("START GAME" or "PLAY AGAIN") MUST be displayed.
  - No elements from this component MUST be visible when the game status is `PLAYING`.

#### handleStartButtonClick
**Contract**: Responds to the user's action to start a new game from the initial screen.
- **Signature**: `(): void`
- **Trigger**: User interaction (e.g., click) on the "START GAME" button.
- **Flow**:
  1. Request `onStartGame` with the current `gameState`.
- **Side Effects**: Triggers a state change in the game logic to begin gameplay.
- **✅ Acceptance Criteria**:
  - `onStartGame` MUST be requested when the "START GAME" button is activated.

#### handleRestartButtonClick
**Contract**: Responds to the user's action to reset the game after a game over or game won state, preparing for a new game.
- **Signature**: `(): void`
- **Trigger**: User interaction (e.g., click) on the "PLAY AGAIN" button.
- **Flow**:
  1. Request `onResetGame` with the current `gameState`.
- **Side Effects**: Triggers a full game reset in the game logic, which will cause the parent component to update the `gameState` to `INITIAL`.
- **✅ Acceptance Criteria**:
  - `onResetGame` MUST be requested when the "PLAY AGAIN" button is activated.