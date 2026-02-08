# Project: Space Invaders Clone

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./hud-presentation

> **Reference**: Concepts/Capabilities in `./game-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./game-domain.isl.md`

## Component: HudPresentation
### Role: Presentation
**Signature**: (gameState: > **Reference**: `GameState` in `./game-domain.isl.md`)

### 📐 Appearance
The HUD elements are displayed at the top of the game canvas.
- **Score**: Positioned in the top-left corner.
- **Lives**: Positioned in the top-right corner, typically represented by a number and/or small player ship icons.
- **Level**: Positioned centrally at the top.
- All text elements use a clear, readable font and a contrasting color (e.g., white or green).

### 📦 Content
The `HudPresentation` component contains the following visual elements:
- A text display for the current score.
- A text display for the remaining player lives.
- A text display for the current level number.

### ⚡ Capabilities
#### updateHudDisplay
**Contract**: Renders or updates the Head-Up Display elements based on the provided game state.
- **Signature**: `(gameState: > **Reference**: `GameState` in `./game-domain.isl.md`): Void`
- **Flow**:
  1. Retrieve `score` from `gameState`.
  2. Retrieve `playerState.lives` from `gameState`.
  3. Retrieve `levelNumber` from `gameState`.
  4. Display the `score` value in the designated score area.
  5. Display the `playerState.lives` value (and/or corresponding icons) in the designated lives area.
  6. Display the `levelNumber` value in the designated level area.
- **Side Effects**: Updates the visual representation of the HUD on the screen.
- **✅ Acceptance Criteria**:
  - The displayed score MUST accurately reflect `gameState.score`.
  - The displayed lives count MUST accurately reflect `gameState.playerState.lives`.
  - The displayed level number MUST accurately reflect `gameState.levelNumber`.
  - The HUD elements MUST be visible and clearly readable at their designated positions.