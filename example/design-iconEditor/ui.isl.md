# Project: Ui

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./ui

> **Reference**: Domain concepts in `./domain.isl.md`
> **Reference**: Business logic in `./logic.isl.md`

## Component: DrawingCanvas
### Role: Presentation
**Signature**:
- `grid`: IconGrid, the current icon data to display.
- `cellSize`: Number, the size in pixels for each grid cell in the UI.
- `onPixelClick`: `(x: number, y: number) => void`, a callback triggered when a pixel is clicked.

### 🔍 Appearance
- Displays a square grid of cells.
- Each cell's background color corresponds to its `GridCell.color`.
- Cells are visually distinct (e.g., with borders) to indicate their individual nature.
- The overall canvas dimensions are `grid.length * cellSize` by `grid.length * cellSize`.

### 📦 Content
- Contains a collection of interactive `GridCell` elements.

### ⚡ Capabilities

#### handleCellClick
**Contract**: Responds to a user clicking on a specific grid cell.
**Signature**:
- Input:
  - `x`: Number, the horizontal coordinate of the clicked cell.
  - `y`: Number, the vertical coordinate of the clicked cell.
- Output: None
**Flow**:
1. Trigger the `onPixelClick` callback, passing the `x` and `y` coordinates.
**Side Effects**: None (delegates interaction to parent).

### 🚨 Constraints
- `cellSize` MUST be a positive number.
- The `grid` prop MUST be a valid `IconGrid` structure.

### ✅ Acceptance Criteria
- When `grid` prop changes, the displayed cells' colors MUST update accordingly.
- Clicking on a cell at (`x`, `y`) MUST trigger `onPixelClick` with `x` and `y` as arguments.

---

## Component: IconPreview
### Role: Presentation
**Signature**:
- `grid`: IconGrid, the current icon data to display.
- `previewSize`: Number, the desired pixel dimension for the entire preview (e.g., 64 for a 64x64px preview).

### 🔍 Appearance
- Displays a smaller, scaled-down version of the icon grid.
- Each cell's background color corresponds to its `GridCell.color`.
- No individual cell borders are visible, creating a unified image.
- The overall preview dimensions are `previewSize` by `previewSize`.

### 📦 Content
- Contains a scaled representation of the `IconGrid`.

### 🚨 Constraints
- `previewSize` MUST be a positive number.
- The `grid` prop MUST be a valid `IconGrid` structure.

### ✅ Acceptance Criteria
- When `grid` prop changes, the displayed preview image MUST update to reflect the new icon state.
- The preview MUST maintain the aspect ratio of the original grid.

---

## Component: SizeSelector
### Role: Presentation
**Signature**:
- `currentSize`: IconSize, the currently selected icon dimension.
- `onSizeChange`: `(newSize: IconSize) => void`, a callback triggered when a new size is selected.

### 🔍 Appearance
- Provides a user interface element (e.g., a dropdown or a set of radio buttons) to choose an `IconSize`.
- The option corresponding to `currentSize` is visually indicated as selected.

### 📦 Content
- Contains selectable options for each value in the `IconSize` enum.

### ⚡ Capabilities

#### handleSizeSelection
**Contract**: Responds to a user selecting a new icon size.
**Signature**:
- Input: `selectedSize`: IconSize
- Output: None
**Flow**:
1. Trigger the `onSizeChange` callback, passing the `selectedSize`.
**Side Effects**: None (delegates interaction to parent).

### 🚨 Constraints
- `currentSize` MUST be one of the defined `IconSize` enum values.

### ✅ Acceptance Criteria
- Selecting a new size option MUST trigger `onSizeChange` with the chosen `IconSize` value.
- The UI MUST correctly display `currentSize` as the active selection.

---

## Component: ColorPicker
### Role: Presentation
**Signature**:
- `currentColor`: PixelColor, the currently selected drawing color.
- `onColorChange`: `(newColor: PixelColor) => void`, a callback triggered when a new color is chosen.

### 🔍 Appearance
- Displays a color input element (e.g., a color swatch, a hex input field, or a color palette).
- The displayed color MUST reflect `currentColor`.

### 📦 Content
- Contains a color input control.

### ⚡ Capabilities

#### handleColorInput
**Contract**: Responds to a user selecting a new drawing color.
**Signature**:
- Input: `selectedColor`: PixelColor
- Output: None
**Flow**:
1. Trigger the `onColorChange` callback, passing the `selectedColor`.
**Side Effects**: None (delegates interaction to parent).

### 🚨 Constraints
- `currentColor` MUST be a valid `PixelColor` string.

### ✅ Acceptance Criteria
- Changing the color input MUST trigger `onColorChange` with the new `PixelColor` value.
- The UI MUST correctly display `currentColor` as the active selection.

---

## Component: Toolbar
### Role: Presentation
**Signature**:
- `onClear`: `() => void`, a callback triggered when the clear button is pressed.

### 🔍 Appearance
- Displays a button labeled "Clear Grid" or similar.

### 📦 Content
- Contains a button element.

### ⚡ Capabilities

#### handleClearClick
**Contract**: Responds to a user clicking the clear button.
**Signature**:
- Input: None
- Output: None
**Flow**:
1. Trigger the `onClear` callback.
**Side Effects**: None (delegates interaction to parent).

### ✅ Acceptance Criteria
- Clicking the "Clear Grid" button MUST trigger the `onClear` callback.