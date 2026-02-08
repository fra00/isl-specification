# Project: Game Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./game-logic

> **Reference**: Defines core data structures in `./domain.isl.md`

## Component: GameEngine
### Role: Business Logic
**Signature**:
- `config`: `GameConfig` - Configuration for the game board and behavior.

### ⚡ Capabilities

#### initializeGame
**Contract**: Sets up the game board with a shuffled set of cards, ensuring an even number of pairs.
**Signature**: `()` -> `void`
**Flow**:
1.  Generate `gridSize[0] * gridSize[1]` cards.
2.  Assign `value` to cards such that each value appears exactly twice.
3.  Assign a unique `id` to each card.
4.  Set initial `state` of all cards to `CardState.Covered`.
5.  Randomly shuffle the order of cards.
6.  Reset `moves` to 0.
7.  Reset `timerSeconds` to 0.
8.  Set `gameStatus` to `GameStatus.NotStarted`.
**Side Effects**: Updates internal `cards`, `moves`, `timerSeconds`, and `gameStatus` state.

#### flipCard
**Contract**: Handles the logic when a user attempts to flip a card. Manages card states, match checking, and non-matching card reset.
**Signature**: `(cardId: UUID)` -> `void`
**Flow**:
1.  IF `gameStatus` is not `GameStatus.Playing`, THEN do nothing.
2.  Retrieve the `CardEntity` corresponding to `cardId`.
3.  IF the card's `state` is `CardState.Flipped` or `CardState.Solved`, THEN do nothing.
4.  Update the card's `state` to `CardState.Flipped`.
5.  Add the card to the list of currently `flippedCards`.
6.  IF the number of `flippedCards` is 2:
    1.  Increment `moves` counter.
    2.  Retrieve the two `flippedCards`.
    3.  IF the `value` of the two `flippedCards` match:
        1.  Update the `state` of both `flippedCards` to `CardState.Solved`.
        2.  Clear the list of `flippedCards`.
        3.  Check if all cards are `CardState.Solved`. IF true, THEN set `gameStatus` to `GameStatus.Won`.
    4.  ELSE (values do not match):
        1.  After `config.matchDelayMs` delay:
            1.  Update the `state` of both `flippedCards` back to `CardState.Covered`.
            2.  Clear the list of `flippedCards`.
**Side Effects**: Updates internal `cards`, `flippedCards`, `moves`, and `gameStatus` state. May trigger a delayed state change.

#### resetGame
**Contract**: Resets the game to its initial state, allowing a new game to begin.
**Signature**: `()` -> `void`
**Flow**:
1.  Stop the game timer.
2.  Call `initializeGame`.
**Side Effects**: Resets all game state and stops any active timers.

#### startGameTimer
**Contract**: Initiates the game timer, incrementing `timerSeconds` every second.
**Signature**: `()` -> `void`
**Flow**:
1.  IF `gameStatus` is `GameStatus.NotStarted` or `GameStatus.Paused`:
    1.  Set `gameStatus` to `GameStatus.Playing`.
    2.  Start a recurring process that increments `timerSeconds` by 1 every 1000 milliseconds.
**Side Effects**: Updates `timerSeconds` and `gameStatus`.

#### stopGameTimer
**Contract**: Halts the game timer.
**Signature**: `()` -> `void`
**Flow**:
1.  IF `gameStatus` is `GameStatus.Playing`:
    1.  Stop the recurring process that increments `timerSeconds`.
    2.  Set `gameStatus` to `GameStatus.Paused`.
**Side Effects**: Stops `timerSeconds` updates and updates `gameStatus`.

### 🚨 Constraints
- The `GameEngine` MUST ensure that only two cards can be in `CardState.Flipped` at any given time (excluding `CardState.Solved` cards).
- A card MUST NOT be flipped if its `state` is already `CardState.Flipped` or `CardState.Solved`.
- The `gridSize` MUST result in an even number of total cards to ensure all cards can form pairs.
- The `matchDelayMs` MUST be a positive integer.

### ✅ Acceptance Criteria
- When `initializeGame` is called, the `cards` array contains `gridSize[0] * gridSize[1]` cards, all `Covered`, with values forming pairs.
- When `flipCard` is called on a `Covered` card, its state changes to `Flipped`.
- When two `Flipped` cards match, their state changes to `Solved` and they remain visible.
- When two `Flipped` cards do not match, they return to `Covered` state after `matchDelayMs`.
- The `moves` counter increments only when a second card is flipped in a pair attempt.
- The `timerSeconds` increments by 1 every second when `startGameTimer` is active.
- `gameStatus` changes to `Won` when all cards are `Solved`.

### 🧪 Test Scenarios
- **Scenario: Initial Game State**
    - GIVEN `GameEngine` is initialized with `gridSize: [2,2]`.
    - WHEN `initializeGame` is called.
    - THEN `cards` contains 4 `CardEntity` objects, all `CardState.Covered`.
    - AND `moves` is 0.
    - AND `timerSeconds` is 0.
    - AND `gameStatus` is `GameStatus.NotStarted`.
- **Scenario: Successful Match**
    - GIVEN `GameEngine` is initialized and `gameStatus` is `GameStatus.Playing`.
    - AND two `Covered` cards (CardA, CardB) have matching `value`.
    - WHEN `flipCard(CardA.id)` is called.
    - AND `flipCard(CardB.id)` is called.
    - THEN `moves` increments by 1.
    - AND `CardA.state` and `CardB.state` eventually become `CardState.Solved`.
- **Scenario: Unsuccessful Match**
    - GIVEN `GameEngine` is initialized and `gameStatus` is `GameStatus.Playing`.
    - AND two `Covered` cards (CardX, CardY) have non-matching `value`.
    - WHEN `flipCard(CardX.id)` is called.
    - AND `flipCard(CardY.id)` is called.
    - THEN `moves` increments by 1.
    - AND after `config.matchDelayMs`, `CardX.state` and `CardY.state` eventually become `CardState.Covered`.
- **Scenario: Flipping a Solved Card**
    - GIVEN `GameEngine` is initialized and `gameStatus` is `GameStatus.Playing`.
    - AND a card (CardS) is in `CardState.Solved`.
    - WHEN `flipCard(CardS.id)` is called.
    - THEN `CardS.state` remains `CardState.Solved`.
    - AND `moves` does not increment.
- **Scenario: Game Win Condition**
    - GIVEN `GameEngine` is initialized and `gameStatus` is `GameStatus.Playing`.
    - AND all but one pair of cards are `Solved`.
    - WHEN the last matching pair is successfully flipped.
    - THEN `gameStatus` becomes `GameStatus.Won`.
- **Scenario: Timer Operation**
    - GIVEN `GameEngine` is initialized.
    - WHEN `startGameTimer` is called.
    - THEN `gameStatus` becomes `GameStatus.Playing`.
    - AND `timerSeconds` increments by 1 after 1 second.
    - WHEN `stopGameTimer` is called.
    - THEN `gameStatus` becomes `GameStatus.Paused`.
    - AND `timerSeconds` stops incrementing.