# Project: Ui

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./ui

> **Reference**: Defines core data structures in `./domain.isl.md`

## Component: CardComponent
### Role: Presentation
**Signature**:
- `card`: `CardEntity` - The card data to display.
- `onFlip`: `(cardId: UUID) => void` - Callback function triggered when the card is clicked.

### 🔍 Appearance
- Displays a square visual element.
- If `card.state` is `CardState.Covered`, shows a generic card back.
- If `card.state` is `CardState.Flipped` or `CardState.Solved`, shows the `card.value` (e.g., an image or symbol).
- `CardState.Solved` cards may have a distinct visual style (e.g., slightly faded).
- Provides a visual indication for hover states.

### 📦 Content
- A visual representation of the card's back.
- A visual representation of the `card.value` (e.g., an `<img>` tag or a text symbol).

### ⚡ Capabilities

#### handleClick
**Contract**: Triggers the `onFlip` callback if the card is in a flippable state.
**Signature**: `()` -> `void`
**Flow**:
1.  IF `card.state` is `CardState.Covered`:
    1.  THEN trigger `onFlip` with `card.id`.
**Side Effects**: None directly on `CardComponent` state; dispatches an event.

### 🚨 Constraints
- The `CardComponent` MUST NOT contain any game logic beyond determining if it's clickable.

### ✅ Acceptance Criteria
- When `card.state` is `Covered`, the card back is visible.
- When `card.state` is `Flipped` or `Solved`, the `card.value` is visible.
- Clicking a `Covered` card triggers `onFlip` with its `id`.
- Clicking a `Flipped` or `Solved` card does not trigger `onFlip`.