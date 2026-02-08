# Project: Calculator Ui

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./calculator-ui

> **Reference**: Defines domain entities and enums in `./domain.isl.md`

## Component: CalculatorDisplay
### Role: Presentation
**Signature**: `(value: string)`

### 🔍 Appearance
-   Displays text in a large font size.
-   Text is right-aligned within its container.
-   Background color is dark.
-   Text color is white.

### 📦 Content
-   A single text element displaying the `value` prop.

### 🚨 Constraints
-   MUST NOT contain any business logic.
-   MUST display the exact `value` string provided.

## Component: CalculatorButton
### Role: Presentation
**Signature**: `(label: string, type: 'digit' | 'operator' | 'action', onClick: () => void)`

### 🔍 Appearance
-   Button with `label` text.
-   Styling varies based on `type`:
    -   `digit`: Standard numeric button style.
    -   `operator`: Distinct style for arithmetic operators.
    -   `action`: Distinct style for clear, equals, decimal, sign toggle.

### 📦 Content
-   A single button element displaying the `label` prop.

### ⚡ Capabilities
#### onClick
**Contract**: Triggers the provided callback function when the button is pressed.
**Signature**: `()` => `void`
**Flow**:
1.  Trigger the `onClick` callback.

### 🚨 Constraints
-   MUST NOT contain any business logic.
-   MUST only trigger the `onClick` handler.

## Component: CalculatorKeypad
### Role: Presentation
**Signature**: `(onDigit: (digit: string) => void, onOperator: (op: OperationType) => void, onEquals: () => void, onClear: () => void, onDecimal: () => void, onToggleSign: () => void)`

### 🔍 Appearance
-   A grid layout arranging `CalculatorButton` components.

### 📦 Content
-   Contains multiple `CalculatorButton` components arranged in a 4x5 grid (or similar).
-   Buttons for digits `0` through `9`.
-   Buttons for operators `+`, `-`, `*`, `/`.
-   Buttons for `.` (decimal), `=` (equals), `C` (clear), `+/-` (toggle sign).
-   Each `CalculatorButton` passes its specific value/type to the corresponding handler from props.
    -   Example: `CalculatorButton` for '1' triggers `onDigit("1")`.
    -   Example: `CalculatorButton` for '+' triggers `onOperator(OperationType.ADD)`.

### 🚨 Constraints
-   MUST NOT contain any business logic.
-   MUST only dispatch events to the provided handlers.

## Component: CalculatorApp
### Role: Presentation
**Signature**: `(displayValue: string, onDigit: (digit: string) => void, onOperator: (op: OperationType) => void, onEquals: () => void, onClear: () => void, onDecimal: () => void, onToggleSign: () => void)`

### 🔍 Appearance
-   A container that visually groups the display and keypad.
-   The `CalculatorDisplay` is positioned above the `CalculatorKeypad`.

### 📦 Content
-   Contains one `CalculatorDisplay` component.
-   Contains one `CalculatorKeypad` component.

### 🚨 Constraints
-   MUST NOT contain any business logic.
-   MUST only pass `displayValue` to `CalculatorDisplay` and event handlers to `CalculatorKeypad`.