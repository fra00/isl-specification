# Project: Main

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Defines domain entities and enums in `./domain.isl.md`
> **Reference**: Defines calculator business logic in `./calculator-logic.isl.md`
> **Reference**: Defines calculator UI components in `./calculator-ui.isl.md`

## Component: Main
### Role: Presentation
**Signature**: No input props.

### ⚡ Capabilities

#### render
**Contract**: Renders the main calculator application, connecting the UI components with the business logic.
**Signature**: `()` => `ReactElement` (representing the `CalculatorApp` component)
**Flow**:
1.  Initialize the calculator's state using `CalculatorEngine.initializeState()`.
2.  Maintain the `CalculatorStateEntity` as internal component state.
3.  Define handler functions for each user interaction:
    -   `handleDigit(digit: string)`:
        1.  Update the internal `CalculatorStateEntity` by passing the current state and `digit` to `CalculatorEngine.processDigit()`.
    -   `handleDecimal()`:
        1.  Update the internal `CalculatorStateEntity` by passing the current state to `CalculatorEngine.processDecimal()`.
    -   `handleOperator(op: OperationType)`:
        1.  Update the internal `CalculatorStateEntity` by passing the current state and `op` to `CalculatorEngine.processOperator()`.
    -   `handleEquals()`:
        1.  Update the internal `CalculatorStateEntity` by passing the current state to `CalculatorEngine.processEquals()`.
    -   `handleClear()`:
        1.  Update the internal `CalculatorStateEntity` by passing the current state to `CalculatorEngine.clear()`.
    -   `handleToggleSign()`:
        1.  Update the internal `CalculatorStateEntity` by passing the current state to `CalculatorEngine.toggleSign()`.
4.  Render the `CalculatorApp` component.
5.  Pass the `displayValue` from the current `CalculatorStateEntity` to `CalculatorApp`.
6.  Pass the defined handler functions (`handleDigit`, `handleOperator`, `handleEquals`, `handleClear`, `handleDecimal`, `handleToggleSign`) to `CalculatorApp`.

### 🚨 Constraints
-   MUST be the root component that orchestrates the calculator application.
-   MUST manage the `CalculatorStateEntity` and pass it to `CalculatorEngine` capabilities for state transitions.
-   MUST pass the resulting `displayValue` and event handlers to the `CalculatorApp` presentation component.