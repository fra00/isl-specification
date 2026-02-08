# Project: Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./logic

> **Reference**: Domain concepts in `./domain.isl.md`

## Component: IconEditorEngine
### Role: Business Logic
**Signature**:
- `initialSize`: IconSize, the starting size for the icon grid.
- `initialColor`: PixelColor, the starting drawing color.

### ⚡ Capabilities

#### initializeGrid
**Contract**: Creates a new empty icon grid of the specified size, filling all cells with a default transparent color.
**Signature**:
- Input: `size`: IconSize
- Output: None
**Side Effects**:
- Updates the internal `IconGrid` state.
- Updates the internal `IconSize` state.

#### setPixel
**Contract**: Changes the color of a specific pixel in the icon grid.
**Signature**:
- Input:
  - `x`: Number, the horizontal coordinate.
  - `y`: Number, the vertical coordinate.
  - `color`: PixelColor, the new color for the pixel.
- Output: None
**Flow**:
1. IF `x` is less than 0 OR `x` is greater than or equal to the current icon size THEN
   - Do nothing.
2. IF `y` is less than 0 OR `y` is greater than or equal to the current icon size THEN
   - Do nothing.
3. THEN
   - Update the `GridCell` at (`x`, `y`) in the internal `IconGrid` with the provided `color`.
**Side Effects**:
- Modifies the internal `IconGrid` state.

#### getGrid
**Contract**: Provides the current state of the icon grid.
**Signature**:
- Input: None
- Output: `IconGrid`
**Side Effects**: None

#### getIconSize
**Contract**: Provides the current size of the icon grid.
**Signature**:
- Input: None
- Output: IconSize
**Side Effects**: None

#### resetGrid
**Contract**: Clears the current icon grid, re-initializing it to the current size with a default transparent color.
**Signature**:
- Input: None
- Output: None
**Flow**:
1. Retrieve the current `IconSize`.
2. Initialize a new grid of that size, filling all cells with a default transparent color.
3. Update the internal `IconGrid` state with the new grid.
**Side Effects**:
- Resets the internal `IconGrid` state.

#### getCurrentDrawingColor
**Contract**: Provides the currently selected drawing color.
**Signature**:
- Input: None
- Output: PixelColor
**Side Effects**: None

#### setDrawingColor
**Contract**: Sets the active drawing color.
**Signature**:
- Input: `color`: PixelColor
- Output: None
**Side Effects**:
- Updates the internal `PixelColor` state for drawing.

### 🚨 Constraints
- The `IconGrid` MUST always be a square (width equals height).
- Pixel coordinates (`x`, `y`) provided to `setPixel` MUST be within the bounds of the current `IconGrid` dimensions.
- `PixelColor` values MUST be valid color representations (e.g., hex codes).

### ✅ Acceptance Criteria
- When `initializeGrid` is called, the `IconGrid` MUST be created with the specified dimensions and all cells set to a default transparent color.
- When `setPixel` is called with valid coordinates and color, `getGrid` MUST reflect the updated pixel color at those coordinates.
- When `setPixel` is called with invalid coordinates, the `IconGrid` MUST NOT change.
- When `resetGrid` is called, `getGrid` MUST return a grid of the current size with all cells set to the default transparent color.
- `getIconSize` MUST return the size last set by `initializeGrid`.
- `getCurrentDrawingColor` MUST return the color last set by `setDrawingColor`.