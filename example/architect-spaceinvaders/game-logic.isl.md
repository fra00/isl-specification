# Project: Space Invaders Clone

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./game-logic

> **Reference**: Concepts/Capabilities in `./game-domain.isl.md`

## Component: GameLogic
### Role: Business Logic
**Signature**: (gameConfig: > **Reference**: `GameConfig` in `./game-domain.isl.md`)

### 📦 Content/Structure

#### GameState
Represents the complete current state of the game at any given moment. This structure is immutable; capabilities return new `GameState` instances reflecting updates.

- `status`: > **Reference**: `GameStatusEnum` in `./game-domain.isl.md`
- `levelNumber`: `number` (current level, starts at 1)
- `score`: `number` (current player score)
- `playerState`: > **Reference**: `PlayerState` in `./game-domain.isl.md`
- `invadersState`: `Array<` > **Reference**: `InvaderState` in `./game-domain.isl.md` `>` (list of all active invaders)
- `playerBullets`: `Array<` > **Reference**: `BulletState` in `./game-domain.isl.md` `>` (list of all active player bullets)
- `invaderBullets`: `Array<` > **Reference**: `BulletState` in `./game-domain.isl.md` `>` (list of all active invader bullets)
- `shieldStates`: `Array<` > **Reference**: `ShieldSegmentState` in `./game-domain.isl.md` `>` (list of all active shield segments)
- `lastUpdateTime`: `number` (timestamp in milliseconds of the last game state update)
- `gameConfig`: > **Reference**: `GameConfig` in `./game-domain.isl.md` (immutable global configuration for the game)
- `currentLevelConfig`: > **Reference**: `LevelConfig` in `./game-domain.isl.md` (configuration specific to the current level)
- `playerActionFlags`: `Object` (flags indicating continuous player actions)
    - `moveLeft`: `boolean` (true if player is intending to move left)
    - `moveRight`: `boolean` (true if player is intending to move right)
    - `isShooting`: `boolean` (true if player is holding the shoot button)
- `invaderDirection`: `number` (-1 for left, 1 for right, determines horizontal movement)
- `invaderMovementTimer`: `number` (time remaining until the next invader horizontal movement, in milliseconds)
- `invaderDescentTimer`: `number` (time remaining until invaders descend, in milliseconds)
- `invaderShotTimer`: `number` (time remaining until the next invader can shoot, in milliseconds)
- `playerShotCooldownTimer`: `number` (time remaining until the player can shoot again, in milliseconds)

### ⚡ Capabilities

#### initializeGame
- **Contract**: Prepares the initial game state, setting up default values and the first level's configuration.
- **Signature**: `(): GameState`
- **Flow**:
  1. Create a new `GameState` instance.
  2. Set `status` to `INITIAL`.
  3. Set `score` to `0`.
  4. Set `levelNumber` to `1`.
  5. Initialize `playerState` with default position, `GameConstants.playerLives` lives, and `lastShotTime` to `0`.
  6. Initialize `invadersState`, `playerBullets`, `invaderBullets`, `shieldStates` as empty arrays.
  7. Set `lastUpdateTime` to the current timestamp.
  8. Set `gameConfig` to the `gameConfig` provided during component instantiation.
  9. Load `currentLevelConfig` by finding the `LevelConfig` for `levelNumber = 1` from `gameConfig.levelConfigs`.
  10. Initialize `playerActionFlags` with `moveLeft: false`, `moveRight: false`, `isShooting: false`.
  11. Set `invaderDirection` to `1` (initial movement to the right).
  12. Initialize `invaderMovementTimer`, `invaderDescentTimer`, `invaderShotTimer`, `playerShotCooldownTimer` to `0`.
- **Side Effects**: None directly, returns a new `GameState` object.
- **✅ Acceptance Criteria**:
  - The returned `GameState` MUST have `status` set to `INITIAL`.
  - `score` MUST be `0`, and `levelNumber` MUST be `1`.
  - `playerState` MUST be initialized with full lives.
  - Entity arrays (`invadersState`, `playerBullets`, `invaderBullets`, `shieldStates`) MUST be empty.
  - `currentLevelConfig` MUST correspond to level 1.

#### startGame
- **Contract**: Transitions the game from `INITIAL` to `PLAYING` and sets up the first level's entities.
- **Signature**: `(initialState: GameState): GameState`
- **Flow**:
  1. Create a copy of `initialState`.
  2. IF `initialState.status` is NOT `INITIAL`, THEN return the copied state unchanged.
  3. Set `status` to `PLAYING`.
  4. Reset `score` to `0`.
  5. Reset `levelNumber` to `1`.
  6. Reset `playerState` to its initial position, `GameConstants.playerLives` lives, and `lastShotTime` to `0`.
  7. Generate `invadersState` based on `currentLevelConfig` (rows, columns, initial positions).
  8. Generate `shieldStates` based on `gameConfig` (number of shields, segments per shield, positions).
  9. Clear `playerBullets` and `invaderBullets`.
  10. Reset `invaderDirection` to `1`.
  11. Reset `invaderMovementTimer` to `0`.
  12. Reset `invaderDescentTimer` to `0`.
  13. Reset `invaderShotTimer` to `0`.
  14. Reset `playerShotCooldownTimer` to `0`.
  15. Set `lastUpdateTime` to the current timestamp.
  16. Return the updated `GameState`.
- **Side Effects**: Modifies the `GameState` to reflect the start of a new game.
- **✅ Acceptance Criteria**:
  - The returned `GameState.status` MUST be `PLAYING`.
  - Player, invaders, and shields MUST be initialized and positioned correctly.
  - Score and lives MUST be reset to starting values.

#### processPlayerInput
- **Contract**: Updates the player's action flags within the game state based on discrete player input events (key presses/releases).
- **Signature**: `(currentState: GameState, action: ` > **Reference**: `PlayerActionEnum` in `./game-domain.isl.md`, `isPressed: boolean` `): GameState`
- **Flow**:
  1. Create a copy of `currentState`.
  2. IF `action` is `MOVE_LEFT`:
     THEN set `playerActionFlags.moveLeft` to `isPressed`.
  3. ELSE IF `action` is `MOVE_RIGHT`:
     THEN set `playerActionFlags.moveRight` to `isPressed`.
  4. ELSE IF `action` is `SHOOT`:
     THEN set `playerActionFlags.isShooting` to `isPressed`.
  5. Return the updated `GameState`.
- **Side Effects**: Updates `playerActionFlags` within the `GameState`.
- **✅ Acceptance Criteria**:
  - The corresponding `playerActionFlags` in the returned `GameState` MUST be updated based on the `action` and `isPressed` value.

#### updateGame
- **Contract**: Advances the game state by one frame, handling movement, shooting, collisions, and game progression. This is the core of the game loop.
- **Signature**: `(currentState: GameState, currentTime: number): GameState`
- **Flow**:
  1. Create a copy of `currentState`.
  2. IF `currentState.status` is NOT `PLAYING`, THEN return the copied state unchanged.
  3. Calculate `deltaTime = currentTime - currentState.lastUpdateTime` (in milliseconds).
  4. Update `lastUpdateTime` to `currentTime`.
  5. Decrement `playerShotCooldownTimer` by `deltaTime`.
  6. Decrement `invaderMovementTimer` by `deltaTime`.
  7. Decrement `invaderDescentTimer` by `deltaTime`.
  8. Decrement `invaderShotTimer` by `deltaTime`.

  **Player Movement**:
  1. IF `playerActionFlags.moveLeft` is `true`:
     THEN move `playerState.position.x` left by `playerState.speed * deltaTime / 1000 (px)`.
  2. IF `playerActionFlags.moveRight` is `true`:
     THEN move `playerState.position.x` right by `playerState.speed * deltaTime / 1000 (px)`.
  3. Clamp `playerState.position.x` within `0` and `gameConfig.canvasWidth - playerState.size.width`.

  **Player Shooting**:
  1. IF `playerActionFlags.isShooting` is `true` AND `playerShotCooldownTimer` is `<= 0`:
     THEN create a new player bullet at `playerState.position` (adjusted to be centered and above player) and add it to `playerBullets`.
     THEN set `playerShotCooldownTimer` to `gameConfig.playerBulletCooldown`.

  **Invader Movement**:
  1. IF `invaderMovementTimer` is `<= 0`:
     a. Calculate invader horizontal speed based on `currentLevelConfig.invaderSpeedMultiplier` and `GameConstants.invaderBaseSpeed`.
     b. Move all `invadersState` horizontally by `invaderSpeed * invaderDirection * (GameConstants.invaderMovementInterval / 1000) (px)`.
     c. Reset `invaderMovementTimer` based on `GameConstants.invaderMovementInterval`.
     d. Check if any invader has reached the canvas edge:
        IF an invader hits the left edge (`position.x <= 0`) OR an invader hits the right edge (`position.x + size.width >= gameConfig.canvasWidth`):
           THEN reverse `invaderDirection` (`invaderDirection = -invaderDirection`).
           THEN move all invaders down by `GameConstants.invaderDescentAmount (px)`.
           THEN set `invaderDescentTimer` to `GameConstants.invaderDescentInterval`.
           THEN check for game over if any invader's `position.y + size.height` is `>= GameConstants.playerYPosition`.

  **Invader Shooting**:
  1. IF `invaderShotTimer` is `<= 0`:
     a. Select a random invader from the bottom row of each column (if available).
     b. IF an invader is selected:
        THEN create a new invader bullet at the invader's position (adjusted to be centered and below invader) and add it to `invaderBullets`.
     c. Reset `invaderShotTimer` based on `GameConstants.invaderShotBaseFrequency` multiplied by `currentLevelConfig.invaderShotFrequencyMultiplier`.

  **Bullet Movement**:
  1. Update positions of all `playerBullets` and `invaderBullets` based on their `speed` and `deltaTime`.
  2. Remove bullets that move off-screen (outside `0` to `gameConfig.canvasHeight`).

  **Collision Detection**:
  1. **Player Bullets vs. Invaders**:
     FOR EACH `playerBullet` in `playerBullets`:
       FOR EACH `invader` in `invadersState`:
         IF `playerBullet` collides with `invader` (AABB check):
           THEN remove `playerBullet`.
           THEN remove `invader`.
           THEN increment `score` by `GameConstants.invaderScoreValue`.
           THEN break (bullet can only hit one invader).
  2. **Player Bullets vs. Shields**:
     FOR EACH `playerBullet` in `playerBullets`:
       FOR EACH `shieldSegment` in `shieldStates`:
         IF `playerBullet` collides with `shieldSegment` (AABB check):
           THEN remove `playerBullet`.
           THEN decrement `shieldSegment.health`.
           THEN IF `shieldSegment.health` is `<= 0`, THEN remove `shieldSegment`.
           THEN break.
  3. **Invader Bullets vs. Player**:
     FOR EACH `invaderBullet` in `invaderBullets`:
       IF `invaderBullet` collides with `playerState` (AABB check):
         THEN remove `invaderBullet`.
         THEN decrement `playerState.lives`.
         THEN IF `playerState.lives` is `<= 0`, THEN set `status` to `GAME_OVER`.
         THEN reset `playerState.position` to its initial position.
         THEN clear all `playerBullets` and `invaderBullets`.
         THEN break.
  4. **Invader Bullets vs. Shields**:
     FOR EACH `invaderBullet` in `invaderBullets`:
       FOR EACH `shieldSegment` in `shieldStates`:
         IF `invaderBullet` collides with `shieldSegment` (AABB check):
           THEN remove `invaderBullet`.
           THEN decrement `shieldSegment.health`.
           THEN IF `shieldSegment.health` is `<= 0`, THEN remove `shieldSegment`.
           THEN break.

  **Game State Checks**:
  1. **Level Completion**:
     IF `invadersState` is empty:
       THEN IF `levelNumber` is `< gameConfig.maxLevels`:
         THEN call `loadNextLevel` with the current state to advance to the next level.
       THEN ELSE (`levelNumber` is `gameConfig.maxLevels`):
         THEN set `status` to `GAME_WON`.
  2. **Game Over (Invaders reached bottom)**:
     IF any `invader`'s `position.y + size.height` is `>= GameConstants.playerYPosition`:
       THEN set `status` to `GAME_OVER`.
  3. **Game Over (Player out of lives)**:
     IF `playerState.lives` is `<= 0`:
       THEN set `status` to `GAME_OVER`.

  9. Return the updated `GameState`.
- **Side Effects**: Modifies `GameState` significantly, including entity positions, health, scores, lives, and game status.
- **💡 Implementation Hint**: Collision detection can be optimized using spatial partitioning if performance becomes an issue with many entities.
- **🚨 Constraint**: `deltaTime` MUST be non-negative.
- **✅ Acceptance Criteria**:
  - Player, invader, and bullet positions MUST be updated correctly based on `deltaTime`.
  - Collisions MUST be detected accurately, resulting in appropriate score updates, entity removals, and life deductions.
  - Game status MUST transition to `GAME_OVER` or `GAME_WON` upon respective conditions.
  - `playerShotCooldownTimer` and `invaderShotTimer` MUST correctly regulate shooting frequency.
  - Invaders MUST move horizontally, descend, and reverse direction correctly.
  - Level progression MUST occur when all invaders are destroyed, up to `maxLevels`.

#### loadNextLevel
- **Contract**: Prepares the game for the next level, incrementing the level number, resetting entities, and applying new level configurations.
- **Signature**: `(currentState: GameState): GameState`
- **Flow**:
  1. Create a copy of `currentState`.
  2. Increment `levelNumber` by `1`.
  3. IF `levelNumber` is `> gameConfig.maxLevels`:
     THEN set `status` to `GAME_WON` and return the copied state.
  4. Load `currentLevelConfig` by finding the `LevelConfig` for the new `levelNumber` from `gameConfig.levelConfigs`.
  5. Reset `playerState.position` to its initial position.
  6. Generate new `invadersState` based on the new `currentLevelConfig`.
  7. Regenerate `shieldStates` to full health based on `gameConfig`.
  8. Clear `playerBullets` and `invaderBullets`.
  9. Reset `invaderDirection` to `1`.
  10. Reset `invaderMovementTimer` to `0`.
  11. Reset `invaderDescentTimer` to `0`.
  12. Reset `invaderShotTimer` to `0`.
  13. Reset `playerShotCooldownTimer` to `0`.
  14. Set `lastUpdateTime` to the current timestamp.
  15. Return the updated `GameState`.
- **Side Effects**: Resets game entities and updates `levelNumber` and `currentLevelConfig`.
- **✅ Acceptance Criteria**:
  - `levelNumber` MUST be incremented (unless `maxLevels` is reached).
  - New invaders and fully repaired shields MUST be generated.
  - Bullets MUST be cleared.
  - `currentLevelConfig` MUST reflect the new level's configuration.
  - If `maxLevels` is reached, `status` MUST transition to `GAME_WON`.

#### resetGame
- **Contract**: Resets the entire game state to its initial `INITIAL` status, ready for a new game start.
- **Signature**: `(currentState: GameState): GameState`
- **Flow**:
  1. Create a copy of `currentState`.
  2. Set `status` to `INITIAL`.
  3. Reset `score` to `0`.
  4. Reset `levelNumber` to `1`.
  5. Reset `playerState` to its initial position, `GameConstants.playerLives` lives, and `lastShotTime` to `0`.
  6. Clear `invadersState`, `playerBullets`, `invaderBullets`, `shieldStates`.
  7. Reset `playerActionFlags` to all `false`.
  8. Reset `invaderDirection` to `1`.
  9. Reset `invaderMovementTimer`, `invaderDescentTimer`, `invaderShotTimer`, `playerShotCooldownTimer` to `0`.
  10. Set `lastUpdateTime` to the current timestamp.
  11. Load `currentLevelConfig` for `levelNumber = 1`.
  12. Return the updated `GameState`.
- **Side Effects**: Resets the `GameState` to its default starting values.
- **✅ Acceptance Criteria**:
  - The returned `GameState.status` MUST be `INITIAL`.
  - All dynamic game elements (score, lives, entities) MUST be reset to their default starting values.

### 💡 Global Hints
- The `updateGame` capability is the heart of the game loop and should be called repeatedly with the elapsed time (`deltaTime`) to ensure smooth, frame-rate independent updates.
- Collision detection should consider the `size` and `position` of entities. A simple AABB (Axis-Aligned Bounding Box) collision check is usually sufficient for this type of game.
- Randomness for invader shooting should be introduced to make the game less predictable.
- The `GameConfig` and `GameConstants` from `game-domain.isl.md` provide all necessary numerical parameters for game mechanics.

### 🚨 Global Constraints
- All entity positions and sizes MUST remain within the `gameConfig.canvasWidth` and `gameConfig.canvasHeight` boundaries where appropriate.
- `deltaTime` passed to `updateGame` MUST be non-negative.
- The `levelNumber` MUST NOT exceed `gameConfig.maxLevels`.
- `playerState.lives` MUST NOT be negative.

### ✅ Acceptance Criteria
- The game logic MUST correctly manage the `GameStatusEnum` transitions (`INITIAL` -> `PLAYING` -> `GAME_OVER` / `GAME_WON`).
- Player movement and shooting MUST adhere to defined speeds and cooldowns.
- Invader movement patterns (horizontal, descent, reversal) and shooting frequency MUST be correctly implemented and scale with `LevelConfig`.
- All types of collisions (player bullet-invader, player bullet-shield, invader bullet-player, invader bullet-shield, invader-player/shield) MUST be detected and handled with appropriate consequences (score, damage, entity removal, lives).
- The game MUST progress through at least 10 levels, with increasing difficulty as defined by `LevelConfig` multipliers.
- Scoring and lives MUST be accurately tracked and updated.
- The game MUST correctly identify `GAME_OVER` conditions (player out of lives, invaders reach bottom).
- The game MUST correctly identify `GAME_WON` condition (all levels completed).

### 🧪 Test Scenarios
- **Scenario**: Game Initialization and Start
  - **Given**: `GameLogic` is initialized with a `GameConfig`.
  - **When**: `initializeGame` is called.
  - **Then**: `GameState.status` is `INITIAL`, `score` is `0`, `levelNumber` is `1`.
  - **When**: `startGame` is called with the initial state.
  - **Then**: `GameState.status` is `PLAYING`, player, invaders, and shields are present and correctly positioned.
- **Scenario**: Player Movement and Boundary
  - **Given**: `GameState` with player at `x=100`, `playerState.speed = 100 (px/s)`.
  - **When**: `processPlayerInput(currentState, MOVE_LEFT, true)` is called, then `updateGame(currentState, currentTime + 100 (ms))` is called.
  - **Then**: `playerState.position.x` SHOULD be approximately `90`.
  - **Given**: Player at `x=0`.
  - **When**: `processPlayerInput(currentState, MOVE_LEFT, true)` is called, then `updateGame` is called.
  - **Then**: `playerState.position.x` MUST remain `0`.
- **Scenario**: Player Shooting and Cooldown
  - **Given**: `GameState` with `playerShotCooldownTimer = 0`.
  - **When**: `processPlayerInput(currentState, SHOOT, true)` is called, then `updateGame` is called.
  - **Then**: A new player bullet MUST be added to `playerBullets`.
  - **Then**: `playerShotCooldownTimer` MUST be reset to `gameConfig.playerBulletCooldown`.
  - **When**: `updateGame` is called again immediately (before cooldown expires).
  - **Then**: NO new player bullet MUST be added.
- **Scenario**: Invader Movement and Descent
  - **Given**: `GameState` with invaders moving right, `invaderMovementTimer = 0`.
  - **When**: `updateGame` is called.
  - **Then**: Invaders MUST move right. `invaderMovementTimer` MUST be reset.
  - **Given**: Invaders at the right edge of the canvas, `invaderMovementTimer = 0`.
  - **When**: `updateGame` is called.
  - **Then**: Invaders MUST reverse direction to left.
  - **Then**: Invaders MUST descend by `GameConstants.invaderDescentAmount (px)`.
  - **Then**: `invaderDescentTimer` MUST be set.
- **Scenario**: Player Bullet vs. Invader Collision
  - **Given**: A `playerBullet` and an `invader` are at colliding positions.
  - **When**: `updateGame` is called.
  - **Then**: Both `playerBullet` and `invader` MUST be removed from their respective lists.
  - **Then**: `score` MUST increase by `GameConstants.invaderScoreValue`.
- **Scenario**: Invader Bullet vs. Player Collision
  - **Given**: An `invaderBullet` and `playerState` are at colliding positions, `playerState.lives = 1`.
  - **When**: `updateGame` is called.
  - **Then**: `invaderBullet` MUST be removed.
  - **Then**: `playerState.lives` MUST become `0`.
  - **Then**: `GameState.status` MUST transition to `GAME_OVER`.
  - **Then**: `playerState.position` MUST be reset.
  - **Then**: All bullets (player and invader) MUST be cleared.
- **Scenario**: Level Completion and Progression
  - **Given**: `GameState` with only one invader remaining, `levelNumber = 1`, `maxLevels = 10`.
  - **When**: `playerBullet` collides with the last invader, and `updateGame` is called.
  - **Then**: `invadersState` MUST be empty.
  - **Then**: `levelNumber` MUST increment to `2`.
  - **Then**: New invaders and shields for level 2 MUST be generated.
  - **Then**: `GameState.status` MUST remain `PLAYING`.
- **Scenario**: Game Over (Invaders Reach Bottom)
  - **Given**: `GameState` where an invader's `position.y` is below `GameConstants.playerYPosition`.
  - **When**: `updateGame` is called.
  - **Then**: `GameState.status` MUST transition to `GAME_OVER`.
- **Scenario**: Game Won
  - **Given**: `GameState` with `levelNumber = gameConfig.maxLevels`, and only one invader remaining.
  - **When**: `playerBullet` collides with the last invader, and `updateGame` is called.
  - **Then**: `GameState.status` MUST transition to `GAME_WON`.
- **Scenario**: Reset Game
  - **Given**: A `GameState` in `PLAYING` status with score, lives, and entities.
  - **When**: `resetGame` is called.
  - **Then**: `GameState.status` MUST be `INITIAL`.
  - **Then**: `score` MUST be `0`, `levelNumber` `1`, `playerState.lives` full.
  - **Then**: All entity arrays (`invadersState`, `playerBullets`, `invaderBullets`, `shieldStates`) MUST be empty.