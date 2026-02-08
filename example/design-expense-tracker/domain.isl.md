# Project: Domain

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./domain

## Domain Concepts

### ExpenseCategoryType
An enumeration representing the predefined categories for an expense.

**Values**:
- `FOOD`: Cibo
- `TRANSPORT`: Trasporti
- `HOUSING`: Abitazione
- `ENTERTAINMENT`: Intrattenimento
- `UTILITIES`: Utenze
- `HEALTH`: Salute
- `EDUCATION`: Istruzione
- `OTHER`: Altro

### ExpenseEntity
Represents a single financial expense recorded by the user.

**Properties**:
- `id`: `string` (UUID format) - Unique identifier for the expense.
- `amount`: `number` (positive, EUR currency) - The monetary value of the expense. MUST be greater than 0.
- `description`: `string` - A textual description of the expense.
- `date`: `string` (ISO-8601 format) - The date when the expense occurred.
- `category`: `ExpenseCategoryType` - The category to which the expense belongs.