# Project: Domain

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./domain

## Domain Concepts

### OperationType
**Contract**: Defines the types of arithmetic operations supported by the calculator.
**Type**: Enum
**Values**:
- `ADD`: Represents addition.
- `SUBTRACT`: Represents subtraction.
- `MULTIPLY`: Represents multiplication.
- `DIVIDE`: Represents division.

### CalculatorStateEntity
**Contract**: Represents the complete internal state of the calculator at any given moment.
**Type**: Entity
**Properties**:
- `currentOperand`: `string` (Represents the number currently being entered or the result of the last operation. Stored as string to handle decimal input and leading zeros.)
- `previousOperand`: `string` (Represents the first operand in a pending operation. Stored as string.)
- `operator`: `OperationType` | `null` (The arithmetic operation selected by the user, or `null` if no operator is pending.)
- `displayValue`: `string` (The value currently shown on the calculator's display. Can be a number string or "Error".)
- `waitingForNewOperand`: `boolean` (Indicates if the next digit input should clear `currentOperand` or append to it. True after an operator or equals is pressed.)
- `isError`: `boolean` (Indicates if the calculator is in an error state, e.g., division by zero.)