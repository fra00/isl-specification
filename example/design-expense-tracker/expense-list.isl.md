# Project: Expense List

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./expense-list

> **Reference**: Defines core data structures in `./domain.isl.md`

## Component: ExpenseList
### Role: Presentation
**Signature**:
- `expenses`: `ExpenseEntity[]` - The list of expenses to display.
- `total`: `number` (EUR currency) - The total sum of all expenses.

### 🔍 Appearance
- A clear heading for "Expense List".
- A section displaying the "Total Expenses" prominently.
- Each expense in the list should be displayed with its Amount, Description, Date, and Category.
- Expenses should be visually distinct and easy to read.

### 📦 Content
- A heading "Total Expenses:".
- A display element showing the `total` value, formatted as currency (e.g., "€ 123.45").
- A list container for individual expenses.
- FOR EACH `expense` IN `expenses`:
    - A list item or card displaying:
        - `expense.description`
        - `expense.amount` (formatted as currency)
        - `expense.date` (formatted for readability, e.g., "YYYY-MM-DD")
        - `expense.category`

### ⚡ Capabilities
#### updateDisplay
**Contract**: Renders or re-renders the list of expenses and the total based on the provided props.
**Signature**:
- Input: None
- Output: None
**Flow**:
1.  Update the display element for "Total Expenses" with the current `total` prop.
2.  Clear the existing list of individual expenses.
3.  FOR EACH `expense` IN `expenses` prop:
    1.  Create and add a new display element for the `expense` to the list container.
    2.  Populate the element with `expense.description`, `expense.amount`, `expense.date`, and `expense.category`.