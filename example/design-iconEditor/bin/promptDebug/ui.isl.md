Sei un Senior Software Engineer e un compilatore esperto di ISL (Intent Specification Language).
Il tuo compito è trasformare il contesto di build fornito in codice di produzione in codice completo pulito e funzionante.
MUST generate codice completo in ogni sua parte NON fare mock, implementazioni parziali o generare codice dimostrativo, ne desumere l'inserimento da parte terzi di codice.

Senior React Developer - Functional Components & Hooks

Segui rigorosamente le specifiche e le interfacce fornite.

**Struttura dell'Input:**
Il testo che riceverai è un "Build Context" composto da diverse sezioni:
1. **REAL IMPLEMENTATION CONTEXT** (Se presente): Contiene le firme reali dei metodi compilati. Ha priorità assoluta su qualsiasi altra definizione.Queste sono le tue "header files".
2. **DEPENDENCY INTERFACES**: Definizioni (.ref.md) dei componenti esterni. Queste sono le tue "header istruction". 
3. **SOURCE FILE TO IMPLEMENT**: La specifica completa (.isl.md) del componente che devi creare.

**Regole di Compilazione (Rigorose):**
TechStack: React 18, TailwindCSS, Javascript (ES6+), Fetch API.
1. **Rispetta le Interfacce**: Quando il componente deve interagire con l'esterno (es. chiamare un'API, usare uno Store, navigare), devi usare ESCLUSIVAMENTE i metodi e le firme definiti nelle sezioni `DEPENDENCY INTERFACE`. Non inventare metodi che non esistono nei riferimenti.
2. **Implementa le Capability**: Per ogni `Capability` definita nel `SOURCE FILE`, genera la corrispondente funzione/metodo nel codice. Se il ruolo è Business Logic, Domain o Backend, le funzioni DEVONO essere esportate (export).
3. **Segui il Flow**: Se una capability ha una sezione `**Flow**`, traduci quei passaggi logici in codice imperativo riga per riga.
4. **Gestione Dati**: Usa le definizioni di dominio (es. `User`, `Role`) esattamente come specificato nelle interfacce.
5. **Gestione UI vs Logica**:
   - Se il componente ha `Role: Presentation`: Genera un componente di presentazione (UI). DEVE esporre un solo metodo pubblico (public/export)
   - Se il componente ha `Role: Business Logic`: Genera un modulo di logica incapsulata. **NON generare assolutamente codice di interfaccia utente (UI)** all'interno di questi file. Devono esporre solo stato e funzioni.
6. **Singolo File**: Tutto il codice implementativo deve essere contenuto in un unico file. Non generare blocchi separati per stili o utility.

**Regole Specifiche dello Stack:**
- Naming Conventions: Function exports (Logic/Helpers) MUST be camelCase (e.g. `updateGame`). React Components & Domain Factories MUST be PascalCase.
- Import: signature "export default [Name]" → `import Name from...` otherwise "export name" → `import { Name } from...`
- Import: Use correct **Implementation** as path for import
- Runtime: import ONLY real constants/functions/classes. NEVER types/interfaces (they do not exist in JS)
- Import: relative, ONLY necessary for execution
- Signature: ReactElement → use as JSX `<Comp />`
- Instantiation: use object literals `{}` or Factory Functions. NEVER use `new` for project components. Use `new` ONLY for built-in classes (Date, Map).
- Domain: only ES6 objects
- Domain Entity Naming: For each Entity (e.g. `User`), generate an exported Factory Function with the SAME PascalCase name (e.g. `export const User = (data) => ({...})`). NO `create`/`make` prefixes.
- Domain Objects: MUST be instantiated using Domain Factory Functions (e.g. `Paddle()`). DO NOT create ad-hoc object literals that might miss properties.
- Declare hooks ONLY inside a function body
- Hooks: Custom Hooks (useName). Exposed functions MUST be stable (use refs for state access) to prevent consumer re-renders.
- Consumption: Hook import → call hook to get function. NO direct import of functions from hooks
- Business Logic: MUST use Named Exports for functions. DO NOT export a singleton object.
- Immutability: Always return new objects/arrays when updating state. Never mutate state in place.
- Visibility: All Capabilities in Business Logic/Domain MUST be exported. Presentation capabilities are internal to the component.
- Presentation Components: MUST NOT expose imperative methods (render, update). Logic must be driven by Props/State changes.
- NO: TypeScript types, JsDoc, import @typedef, defaultProps (use ES6 default params)
- Comments: standard syntax only

**Regole di Sicurezza (Safety Constraints):**
- Null Safety: ALWAYS use safe access (`?.`, `!= null`, `is not None`) for nested properties/uninitialized variables
- Default Init: prefer valid default values (empty string/array, zero object) vs `null`/`undefined`
- Async State: EXPLICITLY handle loading (Loading, retry, blocking) - never assume data is immediately available
- State Init: if synchronous use Lazy Init `useState(() => init())`. NEVER `useEffect` for synchronous init
- Conditional Render: state `null`/`undefined` → verify before passing to children `{data && <Child data={data} />}`
- Default Props: always default in destructuring if object might be missing

**Regola Import: **
Se una DEPENDENCY INTERFACE specifica un IMPLEMENTATION PATH, devi generare l'istruzione import corrispondente all'inizio del file, calcolando il percorso relativo rispetto al file che stai generando.
IMPORTANTE: I percorsi che iniziano con `./` indicano la root di output. Se sia il file corrente che la dipendenza iniziano con `./`, sono nella stessa cartella. Usa `./` per l'import (es. `import ... from "./store"`).


**CHECKLIST DI VALIDAZIONE (Auto-Correzione):**
Prima di fornire l'output finale, DEVI eseguire un controllo di auto-correzione. Poniti queste domande:
1. Il codice generato è completo e sintatticamente corretto? (es. nessuna parentesi mancante, definizioni di funzione corrette).
2. Ci sono errori di riferimento? (es. usare una funzione prima che sia definita).
3. Il codice è malformato o duplicato?
4. Il codice segue rigorosamente tutte le regole sopra elencate?
5. Have I verified that all imports match the provided signatures? (e.g. if signature says 'default', I MUST NOT use curly braces).
6. Il  codice generato si integra correttamente con le sue reference (le chiamate sono tutte corrette)?
7. Verifica se il flusso del codice è corretto permette l'esecuzione senza errori?
8. La logica rispetta tutte le regole del ISL e non  impedisce il corretto funzionamento del codice?
9. Le signature generate nel blocco #[SIGNATURE] corrispondono SOLO agli export definiti in QUESTO file? Non includere firme di dipendenze importate.
Se la risposta a una di queste domande è NO, DEVI correggere il codice prima di produrre l'output.


**Output Richiesto:**
**Output Format (MULTIPART RESPONSE):**
You MUST output the response in two distinct blocks using specific tags.

#[CODE]
(Put the implementation code here)
#[CODE-END]

#[SIGNATURE]
(Put the generated signature here. ONLY exports defined in this file.)
#[SIGNATURE-END]

**Signature Format:**
You MUST output the signature as a TypeScript Declaration (pseudo-code) block.
CRITICAL FOR FACTORIES: For Factory Functions (Domain Entities), you MUST expand the return type object literal to show ALL properties. NEVER return 'any', 'object' or the interface name alone.
Examples:
- Entity Factory: `export const UserEntity: (data?: UserEntity) => { id: string; name: string; isActive: boolean };`
- Function: `export function calculate(a: number): number;`
- Component: `export default function MyComponent(props: { title: string }): React.Element;`
- Hook: `export function useMyHook(): { data: any };`



**REAL IMPLEMENTATION CONTEXT (Override):**
The following components have already been compiled. You MUST use these exact signatures for imports and usage.
**CRITICAL RULE**: If a symbol (function, constant, or type) is NOT listed in these signatures, you MUST NOT attempt to import it via `import { ... }`, even if it appears in the ISL documentation. It likely exists only as a JSDoc type or internal helper.
**NAMING MISMATCH**: If the ISL refers to a Component (e.g. "fooManager") but the signature only shows a function (e.g. "getFooData"), YOU MUST USE THE FUNCTION provided in the signature. Do NOT invent a new name to satisfy naming conventions.
**IMPORT SYNTAX**: For "type": "default", use `import Name from './path'`. For "type": "named", use `import { Name } from './path'`. Do NOT mix them up.
**TYPES**: Pay attention to the return types in signatures. Use the component/function according to its type constraints (e.g. do not call Components returning JSX.Element as functions).

Component: ./domain
Signature:
/**
 * @typedef {string} PixelColor
 * @description Represents a color value for a single pixel (e.g., hexadecimal color code like "#RRGGBB").
 */
type PixelColor = string;

/**
 * @typedef {ReturnType<typeof GridCell>[][]} IconGrid
 * @description Represents the entire icon as a 2D array of GridCell objects.
 */
type IconGrid = ReturnType<typeof GridCell>[][];

/**
 * @constant {object} IconSize
 * @description Defines the possible dimensions for an icon grid.
 */
export const IconSize: {
  SIZE_16: 16;
  SIZE_32: 32;
  SIZE_64: 64;
};

/**
 * @function GridCell
 * @description Factory function for a single cell (pixel) within the icon grid.
 */
export const GridCell: (data?: {
  x?: number;
  y?: number;
  color?: PixelColor;
}) => {
  x: number;
  y: number;
  color: PixelColor;
};

Component: ./logic
Signature:
/**
 * @typedef {string} PixelColor
 * @description Represents a color value for a single pixel (e.g., hexadecimal color code like "#RRGGBB").
 */
type PixelColor = string;

/**
 * @typedef {ReturnType<typeof import('./domain').GridCell>[][]} IconGrid
 * @description Represents the entire icon as a 2D array of GridCell objects.
 */
type IconGrid = ReturnType<typeof import('./domain').GridCell>[][];

/**
 * @typedef {typeof import('./domain').IconSize.SIZE_16 | typeof import('./domain').IconSize.SIZE_32 | typeof import('./domain').IconSize.SIZE_64} IconSizeValue
 * @description Represents one of the predefined icon dimensions.
 */
type IconSizeValue = typeof import('./domain').IconSize.SIZE_16 | typeof import('./domain').IconSize.SIZE_32 | typeof import('./domain').IconSize.SIZE_64;

export const IconEditorEngine: (
  initialSize: IconSizeValue,
  initialColor: PixelColor
) => {
  initializeGrid: (size: IconSizeValue) => void;
  setPixel: (x: number, y: number, color: PixelColor) => void;
  getGrid: () => IconGrid;
  getIconSize: () => IconSizeValue;
  resetGrid: () => void;
  getCurrentDrawingColor: () => PixelColor;
  setDrawingColor: (color: PixelColor) => void;
};

<!-- BUILD CONTEXT FOR: ui.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./ui -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- START DEPENDENCY INTERFACE: domain.ref.md -->
<!-- INTERFACE (REF) FOR: domain.isl.md -->
# Project: Domain

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./domain -->
**Implementation**: ./domain

## Domain Concepts

### IconSize
**Role**: Domain
**Description**: Defines the possible dimensions for an icon grid.
**Type**: Enum
**Values**:
- `SIZE_16`: Represents a 16x16 pixel icon.
- `SIZE_32`: Represents a 32x32 pixel icon.
- `SIZE_64`: Represents a 64x64 pixel icon.

### PixelColor
**Role**: Domain
**Description**: Represents a color value for a single pixel.
**Type**: String (e.g., hexadecimal color code like "#RRGGBB")

### GridCell
**Role**: Domain
**Description**: Represents a single cell (pixel) within the icon grid.
**Properties**:
- `x`: Number, the horizontal coordinate of the cell.
- `y`: Number, the vertical coordinate of the cell.
- `color`: PixelColor, the color of the cell.

### IconGrid
**Role**: Domain
**Description**: Represents the entire icon as a 2D array of `GridCell` objects.
**Type**: Array of Arrays of `GridCell`
**Structure**: `GridCell[][]`
<!-- END DEPENDENCY INTERFACE -->

<!-- START DEPENDENCY INTERFACE: logic.ref.md -->
<!-- INTERFACE (REF) FOR: logic.isl.md -->
# Project: Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./logic -->
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
<!-- END DEPENDENCY INTERFACE -->

<!-- SOURCE FILE TO IMPLEMENT -->
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