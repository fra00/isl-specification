# Project: Domain

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./domain

## Domain Concepts

### CardState
An enumeration representing the possible visual states of a card.
- `Covered`: The card's value is hidden.
- `Flipped`: The card's value is visible, awaiting a match.
- `Solved`: The card's value is visible and permanently matched.

### CardEntity
Represents a single card on the game board.
- `id`: `UUID` - A unique identifier for the card instance.
- `value`: `string` - The identifier for the card's symbol or image.
- `state`: `CardState` - The current visual state of the card.

### GameStatus
An enumeration representing the overall state of the game.
- `NotStarted`: The game is initialized but not yet active.
- `Playing`: The game is actively in progress.
- `Paused`: The game is temporarily suspended.
- `Won`: All card pairs have been matched.

### GameConfig
Configuration parameters for the Memory game.
- `gridSize`: `number[]` - An array `[rows, columns]` defining the dimensions of the card grid (e.g., `[4, 4]`).
- `matchDelayMs`: `number` (milliseconds) - The duration cards remain `Flipped` if they do not match, before returning to `Covered` state.