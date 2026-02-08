# Project: Domain

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./domain

## Domain Concepts

### PriorityType
An enumeration representing the urgency level of a task.

- **LOW**: Indicates a task with low urgency.
- **MEDIUM**: Indicates a task with medium urgency.
- **HIGH**: Indicates a task with high urgency.

### TaskEntity
Represents a single task within a Kanban column.

- **id**: `UUID` - A unique identifier for the task.
- **title**: `string` - The title of the task. MUST NOT be empty.
- **description**: `string` - A detailed description of the task. MAY be empty.
- **dueDate**: `ISO-8601 Date string` - The target completion date for the task. Format MUST be `YYYY-MM-DD`. MAY be empty.
- **priority**: `PriorityType` - The urgency level of the task.

### ColumnEntity
Represents a column on the Kanban board, containing a collection of tasks.

- **id**: `UUID` - A unique identifier for the column.
- **title**: `string` - The title of the column. MUST NOT be empty.
- **tasks**: `array<TaskEntity>` - An ordered list of tasks within this column.

### BoardEntity
Represents the entire Kanban board, comprising multiple columns.

- **id**: `UUID` - A unique identifier for the board.
- **columns**: `array<ColumnEntity>` - An ordered list of columns on the board.