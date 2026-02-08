# Project: Expense Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./expense-logic

> **Reference**: Defines core data structures in `./domain.isl.md`

## Component: ExpenseLogic
### Role: Business Logic
**Signature**: None (Manages internal state)

### ⚡ Capabilities
#### addExpense
**Contract**: Records a new expense into the system.
**Signature**:
- Input: `{ amount: number, description: string, date: string, category: ExpenseCategoryType }`
- Output: `ExpenseEntity` (The newly created expense)
**Flow**:
1.  Generate a unique `id` (UUID).
2.  Create a new `ExpenseEntity` using the provided input and the generated `id`.
3.  Add the new `ExpenseEntity` to the internal list of expenses.
4.  Return the created `ExpenseEntity`.
**Side Effects**:
- The internal list of expenses is updated.

#### getExpenses
**Contract**: Retrieves all recorded expenses, sorted by date in descending order.
**Signature**:
- Input: None
- Output: `ExpenseEntity[]`
**Flow**:
1.  Retrieve the current internal list of `ExpenseEntity` objects.
2.  Sort the list by the `date` property in descending order (most recent first).
3.  Return the sorted list.

#### getTotalExpenses
**Contract**: Calculates the sum of all amounts from the recorded expenses.
**Signature**:
- Input: None
- Output: `number` (EUR currency)
**Flow**:
1.  Retrieve the current internal list of `ExpenseEntity` objects.
2.  Initialize `total` to 0.
3.  FOR EACH `expense` IN the list:
    1.  Add `expense.amount` to `total`.
4.  Return `total`.

### 🚨 Constraints
- The `amount` provided to `addExpense` MUST be a positive number (greater than 0).
- The `date` provided to `addExpense` MUST be a valid ISO-8601 formatted string.
- The `category` provided to `addExpense` MUST be one of the `ExpenseCategoryType` values.