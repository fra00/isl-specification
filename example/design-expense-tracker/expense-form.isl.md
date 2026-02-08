# Project: Expense Form

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./expense-form

> **Reference**: Defines core data structures in `./domain.isl.md`

## Component: ExpenseForm
### Role: Presentation
**Signature**:
- `onAddExpense`: `(expenseData: { amount: number, description: string, date: string, category: ExpenseCategoryType }) => void` - Callback triggered when a new expense is submitted.

### 🔍 Appearance
- A form with distinct input fields for Amount, Description, Date, and Category.
- A button labeled "Add Expense" to submit the form.
- Input fields should clearly indicate their purpose.

### 📦 Content
- An input field for `Amount` (type `number`).
- An input field for `Description` (type `text`).
- An input field for `Date` (type `date`, displaying ISO-8601 format).
- A dropdown (select) field for `Category`, populated with `ExpenseCategoryType` values.
- A submit button.

### ⚡ Capabilities
#### submitForm
**Contract**: Gathers input values and triggers the `onAddExpense` callback.
**Signature**:
- Input: None
- Output: None
**Flow**:
1.  Retrieve the current values from the Amount, Description, Date, and Category input fields.
2.  Validate the collected values against constraints.
3.  IF validation passes:
    1.  Pass the collected `{ amount, description, date, category }` object to the `onAddExpense` callback.
    2.  Clear the form input fields.
4.  ELSE:
    1.  Display an error message to the user indicating invalid input.

### 🚨 Constraints
- The `Amount` input field MUST only accept positive numeric values.
- The `Description` input field MUST NOT be empty.
- The `Date` input field MUST be a valid date in ISO-8601 format.
- The `Category` dropdown MUST have a selected value from `ExpenseCategoryType`.