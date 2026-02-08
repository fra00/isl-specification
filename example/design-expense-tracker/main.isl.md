# Project: Main

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Defines core data structures in `./domain.isl.md`
> **Reference**: Manages expense business logic in `./expense-logic.isl.md`
> **Reference**: Provides UI for adding expenses in `./expense-form.isl.md`
> **Reference**: Provides UI for displaying expenses in `./expense-list.isl.md`

## Component: Main
### Role: Presentation
**Signature**: None

### 🔍 Appearance
- The `ExpenseForm` component should be prominently displayed, allowing users to easily add new expenses.
- The `ExpenseList` component should be displayed below or alongside the form, showing the current expenses and total.
- The overall layout should be clean and intuitive for personal finance tracking.

### 📦 Content
- Contains an instance of `ExpenseForm`.
- Contains an instance of `ExpenseList`.

### ⚡ Capabilities
#### initializeApplication
**Contract**: Sets up the initial state of the application and renders the initial UI.
**Signature**:
- Input: None
- Output: None
**Flow**:
1.  Initialize `ExpenseLogic` to manage expenses.
2.  Retrieve the initial list of expenses from `ExpenseLogic.getExpenses`.
3.  Calculate the initial total from `ExpenseLogic.getTotalExpenses`.
4.  Render `ExpenseForm`, passing `handleNewExpense` as the `onAddExpense` callback.
5.  Render `ExpenseList`, passing the initial expenses and total.

#### handleNewExpense
**Contract**: Processes a new expense submitted by the `ExpenseForm` and updates the display.
**Signature**:
- Input: `{ amount: number, description: string, date: string, category: ExpenseCategoryType }`
- Output: None
**Flow**:
1.  Pass the received expense data to `ExpenseLogic.addExpense`.
2.  Request the updated list of expenses from `ExpenseLogic.getExpenses`.
3.  Request the updated total expenses from `ExpenseLogic.getTotalExpenses`.
4.  Trigger `ExpenseList` to update its display with the new list of expenses and the new total.