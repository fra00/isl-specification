# Project: Space Invaders Clone

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./game-board-presentation

> **Reference**: Concepts/Capabilities in `./game-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./game-domain.isl.md`

## Component: GameBoardPresentation
### Role: Presentation
**Signature**: (gameState: > **Reference**: `GameState` in `./game-domain.isl.md`, gameConfig: > **Reference**: `GameConfig` in `./game-domain.isl.md`, onPlayerAction: (action: > **Reference**: `PlayerActionEnum` in `./game-domain.isl.md`, isPressed: boolean) => void)
### 📐 Appearance
- The game board occupies the main central area of the screen.
- It is a rectangular canvas with dimensions specified by `gameConfig.canvasWidth` and `gameConfig.canvasHeight`.
- The background is a solid dark color (e.g., black) to represent space.
- Player ship: A distinct, recognizable sprite or shape, positioned at `playerState.position`.
- Invader fleet: Multiple invader sprites or shapes, varying by type if applicable, positioned at their respective `invaderState.position`.
- Player bullets: Small, fast-moving projectiles, typically upward-moving, originating from the player.
- Invader bullets: Small, fast-moving projectiles, typically downward-moving, originating from invaders.
- Shields: Segmented barriers, visually indicating their health level (e.g., by color degradation or missing segments).
### 📦 Content
- Contains a single interactive canvas element that serves as the drawing surface for all game entities.
### ⚡ Capabilities
#### renderGameElements
**Contract**: Draws all active game entities (player, invaders, bullets, shields) onto the game board canvas based on the current game state.
- **Signature**: `(gameState: > **Reference**: `GameState` in `./game-domain.isl.md`, gameConfig: > **Reference**: `GameConfig` in `./game-domain.isl.md`): void`
- **Flow**:
  1. Clear the entire canvas area to prepare for the new frame.
  2. Draw the player ship at `gameState.playerState.position` with `gameState.playerState.size`.
  3. FOR EACH `invader` in `gameState.invadersState`:
     Draw the invader at `invader.position` with `invader.size`.
  4. FOR EACH `playerBullet` in `gameState.playerBullets`:
     Draw the player bullet at `playerBullet.position` with `playerBullet.size`.
  5. FOR EACH `invaderBullet` in `gameState.invaderBullets`:
     Draw the invader bullet at `invaderBullet.position` with `invaderBullet.size`.
  6. FOR EACH `shieldSegment` in `gameState.shieldStates`:
     Draw the shield segment at `shieldSegment.position` with `shieldSegment.size`. The visual representation of the segment MUST reflect its `shieldSegment.health` (e.g., by changing color or opacity).
- **Side Effects**: Updates the visual content of the game canvas.
- **✅ Acceptance Criteria**:
  - The canvas MUST be cleared before drawing each frame.
  - The player ship, all active invaders, all active player bullets, all active invader bullets, and all active shield segments MUST be rendered at their correct `position` and `size` as specified in the `GameState`.
  - Shield segments MUST visually indicate their remaining `health`.

#### handleKeyboardInput
**Contract**: Captures keyboard events (key presses and releases) and translates them into abstract player actions, then dispatches these actions via the `onPlayerAction` callback.
- **Signature**: `(onPlayerAction: (action: > **Reference**: `PlayerActionEnum` in `./game-domain.isl.md`, isPressed: boolean) => void): void`
- **Trigger**:
  - On Physical Key 'ArrowLeft' or 'A' Press
  - On Physical Key 'ArrowLeft' or 'A' Release
  - On Physical Key 'ArrowRight' or 'D' Press
  - On Physical Key 'ArrowRight' or 'D' Release
  - On Physical Key 'Space' Press
  - On Physical Key 'Space' Release
- **Flow**:
  1. When a relevant key is pressed:
     - IF the key is 'ArrowLeft' or 'A': Dispatch `onPlayerAction` with `action: > **Reference**: `PlayerActionEnum.MOVE_LEFT` in `./game-domain.isl.md` and `isPressed: true`.
     - IF the key is 'ArrowRight' or 'D': Dispatch `onPlayerAction` with `action: > **Reference**: `PlayerActionEnum.MOVE_RIGHT` in `./game-domain.isl.md` and `isPressed: true`.
     - IF the key is 'Space': Dispatch `onPlayerAction` with `action: > **Reference**: `PlayerActionEnum.SHOOT` in `./game-domain.isl.md` and `isPressed: true`.
  2. When a relevant key is released:
     - IF the key is 'ArrowLeft' or 'A': Dispatch `onPlayerAction` with `action: > **Reference**: `PlayerActionEnum.MOVE_LEFT` in `./game-domain.isl.md` and `isPressed: false`.
     - IF the key is 'ArrowRight' or 'D': Dispatch `onPlayerAction` with `action: > **Reference**: `PlayerActionEnum.MOVE_RIGHT` in `./game-domain.isl.md` and `isPressed: false`.
     - IF the key is 'Space': Dispatch `onPlayerAction` with `action: > **Reference**: `PlayerActionEnum.SHOOT` in `./game-domain.isl.md` and `isPressed: false`.
- **Side Effects**: Triggers the `onPlayerAction` callback provided during component instantiation, which typically updates the game state via `GameLogic.processPlayerInput`.
- **✅ Acceptance Criteria**:
  - Pressing 'ArrowLeft' or 'A' MUST trigger `onPlayerAction` with `MOVE_LEFT` and `true`. Releasing MUST trigger `MOVE_LEFT` and `false`.
  - Pressing 'ArrowRight' or 'D' MUST trigger `onPlayerAction` with `MOVE_RIGHT` and `true`. Releasing MUST trigger `MOVE_RIGHT` and `false`.
  - Pressing 'Space' MUST trigger `onPlayerAction` with `SHOOT` and `true`. Releasing MUST trigger `SHOOT` and `false`.
  - No actions MUST be dispatched for irrelevant key presses.
### 🚨 Global Constraints
- All rendered entities MUST remain within the `gameConfig.canvasWidth` and `gameConfig.canvasHeight` boundaries.
- The presentation layer MUST NOT modify the `GameState` directly; all state changes MUST be initiated through the `onPlayerAction` callback or by receiving an updated `GameState` from its parent.
### ✅ Acceptance Criteria
- The component MUST correctly render all dynamic game elements (player, invaders, bullets, shields) based on the provided `GameState`.
- The component MUST accurately capture and dispatch player input events (move left, move right, shoot) to the `onPlayerAction` callback.
- The rendering MUST be performant enough to maintain a smooth visual experience during gameplay.