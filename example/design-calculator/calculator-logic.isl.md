# Project: Calculator Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./calculator-logic

> **Reference**: Defines domain entities and enums in `./domain.isl.md`

## Component: CalculatorEngine
### Role: Business Logic
**Signature**: No direct input props; manages internal state.

### ⚡ Capabilities

#### initializeState
**Contract**: Sets the calculator's state to its initial default values.
**Signature**: `()` => `CalculatorStateEntity`
**Flow**:
1.  Create a new `CalculatorStateEntity`.
2.  Set `currentOperand` to `"0"`.
3.  Set `previousOperand` to `""`.
4.  Set `operator` to `null`.
5.  Set `displayValue` to `"0"`.
6.  Set `waitingForNewOperand` to `false`.
7.  Set `isError` to `false`.
8.  Return the initialized `CalculatorStateEntity`.

#### processDigit
**Contract**: Processes a numeric digit input, updating the current operand and display.
**Signature**: `(state: CalculatorStateEntity, digit: string)` => `CalculatorStateEntity`
**Flow**:
1.  IF `state.isError` is `true` THEN
    1.  Return `initializeState()`.
2.  IF `state.waitingForNewOperand` is `true` THEN
    1.  Set `currentOperand` to `digit`.
    2.  Set `waitingForNewOperand` to `false`.
3.  ELSE IF `state.currentOperand` is `"0"` THEN
    1.  Set `currentOperand` to `digit`.
4.  ELSE
    1.  Append `digit` to `currentOperand`.
5.  Update `displayValue` to `currentOperand`.
6.  Return the updated `CalculatorStateEntity`.

#### processDecimal
**Contract**: Adds a decimal point to the current operand if not already present.
**Signature**: `(state: CalculatorStateEntity)` => `CalculatorStateEntity`
**Flow**:
1.  IF `state.isError` is `true` THEN
    1.  Return `initializeState()`.
2.  IF `state.waitingForNewOperand` is `true` THEN
    1.  Set `currentOperand` to `"0."`.
    2.  Set `waitingForNewOperand` to `false`.
3.  ELSE IF `currentOperand` does NOT contain `.` THEN
    1.  Append `.` to `currentOperand`.
4.  Update `displayValue` to `currentOperand`.
5.  Return the updated `CalculatorStateEntity`.

#### processOperator
**Contract**: Stores the selected operator and performs any pending calculation if a previous operator exists.
**Signature**: `(state: CalculatorStateEntity, newOperator: OperationType)` => `CalculatorStateEntity`
**Flow**:
1.  IF `state.isError` is `true` THEN
    1.  Return `initializeState()`.
2.  IF `state.previousOperand` is NOT empty AND `state.operator` is NOT `null` AND `state.waitingForNewOperand` is `false` THEN
    1.  Perform `_executeCalculation` using `state.previousOperand`, `state.currentOperand`, and `state.operator`.
    2.  IF the calculation results in an error (e.g., division by zero) THEN
        1.  Set `isError` to `true`.
        2.  Set `displayValue` to `"Error"`.
        3.  Return the error state.
    3.  Set `currentOperand` to the string representation of the calculation result.
4.  Set `previousOperand` to `currentOperand`.
5.  Set `operator` to `newOperator`.
6.  Set `waitingForNewOperand` to `true`.
7.  Update `displayValue` to `currentOperand`.
8.  Return the updated `CalculatorStateEntity`.

#### processEquals
**Contract**: Triggers the final calculation using the stored operands and operator.
**Signature**: `(state: CalculatorStateEntity)` => `CalculatorStateEntity`
**Flow**:
1.  IF `state.isError` is `true` THEN
    1.  Return `initializeState()`.
2.  IF `state.previousOperand` is NOT empty AND `state.operator` is NOT `null` THEN
    1.  Perform `_executeCalculation` using `state.previousOperand`, `state.currentOperand`, and `state.operator`.
    2.  IF the calculation results in an error (e.g., division by zero) THEN
        1.  Set `isError` to `true`.
        2.  Set `displayValue` to `"Error"`.
        3.  Return the error state.
    3.  Set `currentOperand` to the string representation of the calculation result.
    4.  Clear `previousOperand`.
    5.  Clear `operator`.
    6.  Set `waitingForNewOperand` to `true`.
    7.  Update `displayValue` to `currentOperand`.
3.  Return the updated `CalculatorStateEntity`.

#### clear
**Contract**: Resets the calculator to its initial state.
**Signature**: `(state: CalculatorStateEntity)` => `CalculatorStateEntity`
**Flow**:
1.  Return the result of `initializeState()`.

#### toggleSign
**Contract**: Changes the sign of the current operand.
**Signature**: `(state: CalculatorStateEntity)` => `CalculatorStateEntity`
**Flow**:
1.  IF `state.isError` is `true` THEN
    1.  Return `initializeState()`.
2.  Parse `state.currentOperand` as a `number`.
3.  Multiply the number by `-1`.
4.  Convert the result back to a `string`.
5.  Set `currentOperand` to this new string.
6.  Update `displayValue` to `currentOperand`.
7.  Return the updated `CalculatorStateEntity`.

#### _executeCalculation (Internal Helper)
**Contract**: Performs the actual arithmetic operation between two numbers.
**Signature**: `(operand1Str: string, operand2Str: string, operator: OperationType)` => `number` | `Error`
**Flow**:
1.  Parse `operand1Str` and `operand2Str` as `number` values.
2.  BRANCH:
    -   IF `operator` is `OperationType.ADD` THEN
        -   Return `operand1` + `operand2`.
    -   IF `operator` is `OperationType.SUBTRACT` THEN
        -   Return `operand1` - `operand2`.
    -   IF `operator` is `OperationType.MULTIPLY` THEN
        -   Return `operand1` * `operand2`.
    -   IF `operator` is `OperationType.DIVIDE` THEN
        -   IF `operand2` is `0` THEN
            -   Return an `Error` indicating division by zero.
        -   ELSE
            -   Return `operand1` / `operand2`.
3.  Return `0` if no valid operator is found (should not happen with `OperationType`).

### 🚨 Constraints
-   The `displayValue` MUST be a `string`.
-   Division by zero MUST result in `isError` being `true` and `displayValue` being `"Error"`.
-   All numeric inputs and outputs to the UI MUST be handled as `string` to preserve decimal precision and input format.
-   Internal calculations MUST use `number` types.

### ✅ Acceptance Criteria
-   Entering digits `1`, `2`, `3` then `+` then `4`, `5` then `=` MUST display `168`.
-   Entering `1`, `0`, `/` then `0` then `=` MUST display `"Error"`.
-   After an error, pressing any digit MUST clear the error and start a new calculation.
-   Entering `5`, `.` then `5` then `*` then `2` then `=` MUST display `11`.
-   Entering `1`, `0`, `+/-` then `+` then `5` then `=` MUST display `-5`.
-   Pressing `C` MUST reset the display to `0`.