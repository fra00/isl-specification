# Project: Main

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Domain concepts in `./domain.isl.md`
> **Reference**: Business logic in `./logic.isl.md`
> **Reference**: UI components in `./ui.isl.md`

## Component: Main

### Role: Presentation

**Signature**: None

### 🔍 Appearance

- Arranges the `SizeSelector`, `ColorPicker`, `Toolbar`, `DrawingCanvas`, and `IconPreview` components in a coherent layout.
- The `DrawingCanvas` is the primary interactive area.
- The `IconPreview` is displayed prominently, typically smaller than the canvas.
- Controls (size, color, clear) are accessible.

### 📦 Content

- Contains:
  - `SizeSelector`
  - `ColorPicker`
  - `Toolbar`
  - `DrawingCanvas`
  - `IconPreview`

### ⚡ Capabilities

#### initializeApplication

**Contract**: Sets up the initial state of the icon editor.
**Signature**:

- Input: None
- Output: None
  **Flow**:

1. Initialize the `IconEditorEngine` with a default `IconSize` (e.g., 16) and a default `PixelColor` (e.g., "#000000").
2. Request the engine to `initializeGrid` with the default size.
3. Set the initial application state based on the engine's current grid, size, and color.
   **Side Effects**:

- Instantiates `IconEditorEngine`.
- Sets initial application state for UI components.

#### handleSizeChange

**Contract**: Updates the icon editor when the user selects a new icon size.
**Signature**:

- Input: `newSize`: IconSize
- Output: None
  **Flow**:

1. Request the `IconEditorEngine` to `initializeGrid` with `newSize`.
2. Update the application state to reflect the new grid and size from the engine.
   **Side Effects**:

- Modifies the `IconEditorEngine`'s internal grid and size.
- Triggers re-rendering of `DrawingCanvas` and `IconPreview`.

#### handlePixelClick

**Contract**: Processes a click event on a pixel in the `DrawingCanvas`.
**Signature**:

- Input:
  - `x`: Number, the horizontal coordinate of the clicked pixel.
  - `y`: Number, the vertical coordinate of the clicked pixel.
- Output: None
  **Flow**:

1. Retrieve the `currentDrawingColor` from the `IconEditorEngine`.
2. Request the `IconEditorEngine` to `setPixel` at (`x`, `y`) with the `currentDrawingColor`.
3. Update the application state to reflect the new grid from the engine.
   **Side Effects**:

- Modifies the `IconEditorEngine`'s internal grid.
- Triggers re-rendering of `DrawingCanvas` and `IconPreview`.

#### handleColorChange

**Contract**: Updates the active drawing color when the user selects a new color.
**Signature**:

- Input: `newColor`: PixelColor
- Output: None
  **Flow**:

1. Request the `IconEditorEngine` to `setDrawingColor` with `newColor`.
2. Update the application state to reflect the new drawing color from the engine.
   **Side Effects**:

- Modifies the `IconEditorEngine`'s internal drawing color.
- Triggers re-rendering of `ColorPicker`.

#### handleClearGrid

**Contract**: Clears the entire icon grid.
**Signature**:

- Input: None
- Output: None
  **Flow**:

1. Request the `IconEditorEngine` to `resetGrid`.
2. Update the application state to reflect the cleared grid from the engine.
   **Side Effects**:

- Modifies the `IconEditorEngine`'s internal grid.
- Triggers re-rendering of `DrawingCanvas` and `IconPreview`.

### ✅ Acceptance Criteria

- The application MUST initialize with a default grid size and drawing color.
- Changing the size via `SizeSelector` MUST clear the `DrawingCanvas` and `IconPreview` and set them to the new dimensions.
- Drawing on the `DrawingCanvas` MUST update the `IconPreview` in real-time.
- Changing the color via `ColorPicker` MUST change the color used for subsequent drawing operations.
- Clicking the "Clear Grid" button in `Toolbar` MUST reset the `DrawingCanvas` and `IconPreview` to an empty state of the current size.
