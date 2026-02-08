# Project: Game Board

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./game-board

> **Reference**: Defines core data structures in `./domain.isl.md`
> **Reference**: Defines `CardComponent` in `./ui.isl.md`

## Component: GameBoardComponent
### Role: Presentation
**Signature**:
- `cards`: `CardEntity[]` - An array of all cards to display.
- `gridSize`: `number[]` - The `[rows, columns]` dimensions for the grid layout.
- `onCardFlip`: `(cardId: UUID) => void` - Callback for when a card is flipped.

### 🔍 Appearance
- Arranges `CardComponent` instances in a grid layout based on `gridSize`.
- Each cell in the grid contains one `CardComponent`.
- The grid maintains consistent spacing between cards.

### 📦 Content
- Contains `gridSize[0] * gridSize[1]` instances of `CardComponent`.

### 🚨 Constraints
- The `GameBoardComponent` MUST NOT contain any game logic. Its sole responsibility is to render the cards and pass click events.

### ✅ Acceptance Criteria
- Renders a grid of `CardComponent` instances matching `gridSize`.
- Each `CardComponent` receives its corresponding `CardEntity` from the `cards` array.
- Each `CardComponent` receives the `onCardFlip` callback.