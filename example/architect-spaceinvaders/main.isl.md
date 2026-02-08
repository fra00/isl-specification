# Project: Space Invaders Clone

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Concepts/Capabilities in `./game-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./game-board-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./hud-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./start-game-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./game-domain.isl.md`

## Component: Main
### Role: Presentation
**Signature**: Void

### 📦 Content
This component orchestrates the display and interaction of the following child presentation components:
- `GameBoardPresentation`: Renders the main game area, including the player, invaders, bullets, and shields.
- `HudPresentation`: Displays essential game statistics such as score, remaining lives, and the current level number.
- `StartGamePresentation`: Manages the display of the initial start screen, game over screen, and game won screen, handling user interactions to start or restart the game.

### 💡 Global Hints
- The `gameConfig` object defines the global parameters for the game, including canvas dimensions, level configurations, and shield properties. This configuration is passed to the `GameLogic` component upon initialization.
- The game loop uses `requestAnimationFrame` for smooth, browser-optimized animation, ensuring frame-rate independent updates through `deltaTime`.
- State management is centralized in the `Main` component, which holds the single source of truth (`gameState`) and updates it via `GameLogic` capabilities.

### 🚨 Global Constraints
- The `gameConfig` MUST adhere to the structure and constraints defined in > **Reference**: `GameConfig` in `./game-domain.isl.md`.
- The game loop MUST ensure `deltaTime` is correctly calculated and passed to `GameLogic.updateGame` to maintain frame-rate independent physics.
- All interactions with `GameLogic` MUST be through its defined capabilities, ensuring business logic integrity and separation of concerns.

### ⚡ Capabilities
#### initializeApplication
**Contract**: Sets up the initial game configuration, initializes the game logic, and prepares the application for starting the game loop. This is the primary entry point for the entire application.
- **Signature**: `(): void`
- **Flow**:
  1. Define a `gameConfig` object (type: > **Reference**: `GameConfig` in `./game-domain.isl.md`) with the following properties:
     - `canvasWidth`: 800 (px)
     - `canvasHeight`: 600 (px)
     - `playerBulletCooldown`: 500 (ms)
     - `maxLevels`: 10
     - `levelConfigs`: An array of 10 > **Reference**: `LevelConfig` in `./game-domain.isl.md` objects, each defining `levelNumber`, `invaderRows`, `invaderCols`, `invaderSpeedMultiplier`, and `invaderShotFrequencyMultiplier`.
       - Level 1: `invaderRows: 5`, `invaderCols: 10`, `invaderSpeedMultiplier: 1.0`, `invaderShotFrequencyMultiplier: 1.0`
       - Level 2: `invaderRows: 5`, `invaderCols: 10`, `invaderSpeedMultiplier: 1.1`, `invaderShotFrequencyMultiplier: 0.95`
       - Level 3: `invaderRows: 6`, `invaderCols: 10`, `invaderSpeedMultiplier: 1.2`, `invaderShotFrequencyMultiplier: 0.9`
       - Level 4: `invaderRows: 6`, `invaderCols: 11`, `invaderSpeedMultiplier: 1.3`, `invaderShotFrequencyMultiplier: 0.85`
       - Level 5: `invaderRows: 7`, `invaderCols: 11`, `invaderSpeedMultiplier: 1.4`, `invaderShotFrequencyMultiplier: 0.8`
       - Level 6: `invaderRows: 7`, `invaderCols: 12`, `invaderSpeedMultiplier: 1.5`, `invaderShotFrequencyMultiplier: 0.75`
       - Level 7: `invaderRows: 8`, `invaderCols: 12`, `invaderSpeedMultiplier: 1.6`, `invaderShotFrequencyMultiplier: 0.7`
       - Level 8: `invaderRows: 8`, `invaderCols: 13`, `invaderSpeedMultiplier: 1.7`, `invaderShotFrequencyMultiplier: 0.65`
       - Level 9: `invaderRows: 9`, `invaderCols: 13`, `invaderSpeedMultiplier: 1.8`, `invaderShotFrequencyMultiplier: 0.6`
       - Level 10: `invaderRows: 9`, `invaderCols: 14`, `invaderSpeedMultiplier: 2.0`, `invaderShotFrequencyMultiplier: 0.55`
     - `shieldConfig`: `numShields: 4`, `segmentsPerShield: 10`, `shieldHealth: 3`
  2. Instantiate the `GameLogic` component, passing the defined `gameConfig`.
  3. Obtain the initial `gameState` by requesting `GameLogic.initializeGame()`.
  4. Instantiate `GameBoardPresentation`, passing the initial `gameState`, `gameConfig`, and a callback to `handlePlayerAction`.
  5. Instantiate `HudPresentation`, passing the initial `gameState`.
  6. Instantiate `StartGamePresentation`, passing the initial `gameState`, a callback to `handleStartGameRequest`, and a callback to `handleResetGameRequest`.
  7. Request `GameBoardPresentation.handleKeyboardInput`, passing the `handlePlayerAction` callback.
  8. Initiate the `startGameLoop`.
- **Side Effects**: Initializes all game components, sets up global configuration, and starts the main game loop.
- **✅ Acceptance Criteria**:
  - `GameLogic` MUST be initialized with a valid `GameConfig` instance.
  - The initial `GameState` MUST be obtained from `GameLogic.initializeGame`.
  - All presentation components (`GameBoardPresentation`, `HudPresentation`, `StartGamePresentation`) MUST be instantiated with the correct initial `GameState` and appropriate callbacks.
  - Keyboard input handling MUST be delegated to `GameBoardPresentation` with the `handlePlayerAction` callback.
  - The `startGameLoop` MUST be initiated.

#### startGameLoop
**Contract**: The central game loop responsible for continuously updating the game state and rendering all presentation components. This loop runs continuously while the application is active.
- **Signature**: `(): void`
- **Trigger**: Initiated by `initializeApplication` and recursively called via an animation frame mechanism.
- **Flow**:
  1. Obtain the current timestamp.
  2. Update the `gameState` by requesting `GameLogic.updateGame`, passing the current `gameState` and the current timestamp.
  3. Request `GameBoardPresentation.renderGameElements`, passing the updated `gameState` and `gameConfig`.
  4. Request `HudPresentation.updateHudDisplay`, passing the updated `gameState`.
  5. Request `StartGamePresentation.render`, passing the updated `gameState`.
  6. Schedule the next execution of `startGameLoop` using an animation frame mechanism (e.g., `requestAnimationFrame`).
- **Side Effects**: Continuously updates the game's internal state and refreshes the visual display of all game elements and UI.
- **✅ Acceptance Criteria**:
  - `GameLogic.updateGame` MUST be called in each iteration with the latest `gameState` and `currentTime`.
  - All presentation components (`GameBoardPresentation`, `HudPresentation`, `StartGamePresentation`) MUST be requested to render/update with the latest `gameState` in each iteration.
  - The loop MUST be self-perpetuating via an animation frame mechanism.

#### handlePlayerAction
**Contract**: A callback function provided to `GameBoardPresentation` to process player input events (key presses/releases) and update the game state accordingly.
- **Signature**: `(action: > **Reference**: `PlayerActionEnum` in `./game-domain.isl.md`, isPressed: boolean): void`
- **Trigger**: Dispatched by `GameBoardPresentation.handleKeyboardInput` when a relevant player key is pressed or released.
- **Flow**:
  1. Update the `gameState` by requesting `GameLogic.processPlayerInput`, passing the current `gameState`, the `action`, and `isPressed` status.
- **Side Effects**: Modifies the `playerActionFlags` within the `gameState` to reflect the player's intended actions.
- **✅ Acceptance Criteria**:
  - `GameLogic.processPlayerInput` MUST be requested with the correct `action` and `isPressed` values.
  - The `gameState` MUST be updated to reflect the player's action flags.

#### handleStartGameRequest
**Contract**: A callback function provided to `StartGamePresentation` to initiate a new game when the user interacts with the "START GAME" button.
- **Signature**: `(stateToStart: > **Reference**: `GameState` in `./game-domain.isl.md`): void`
- **Trigger**: Dispatched by `StartGamePresentation.handleStartButtonClick`.
- **Flow**:
  1. Update the `gameState` by requesting `GameLogic.startGame`, passing the `stateToStart`.
- **Side Effects**: Transitions the game status to `PLAYING`, resets score and lives, and initializes game entities for the first level.
- **✅ Acceptance Criteria**:
  - `GameLogic.startGame` MUST be requested with the current `gameState`.
  - The `gameState` MUST transition to `PLAYING` status and be populated with initial game entities.

#### handleResetGameRequest
**Contract**: A callback function provided to `StartGamePresentation` to reset the game to its initial state when the user interacts with the "PLAY AGAIN" button (after a Game Over or Game Won state).
- **Signature**: `(stateToReset: > **Reference**: `GameState` in `./game-domain.isl.md`): void`
- **Trigger**: Dispatched by `StartGamePresentation.handleRestartButtonClick`.
- **Flow**:
  1. Update the `gameState` by requesting `GameLogic.resetGame`, passing the `stateToReset`.
- **Side Effects**: Transitions the game status to `INITIAL`, clears all dynamic game entities, and resets score and lives to default values.
- **✅ Acceptance Criteria**:
  - `GameLogic.resetGame` MUST be requested with the current `gameState`.
  - The `gameState` MUST transition to `INITIAL` status, ready for a new game to begin.