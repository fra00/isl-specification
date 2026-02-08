# Project: Kanban Ui

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./kanban-ui

> **Reference**: Domain entities in `./domain.isl.md`

## Component: KanbanBoardView
### Role: Presentation
**Signature**:
- `board: BoardEntity`
- `onAddColumn: function(title: string)`
- `onRenameColumn: function(columnId: UUID, newTitle: string)`
- `onDeleteColumn: function(columnId: UUID)`
- `onAddTask: function(columnId: UUID, taskDetails: { title: string, description: string, dueDate: string, priority: PriorityType })`
- `onUpdateTask: function(columnId: UUID, taskId: UUID, updatedDetails: { title?: string, description?: string, dueDate?: string, priority?: PriorityType })`
- `onDeleteTask: function(columnId: UUID, taskId: UUID)`
- `onMoveTask: function(currentColumnId: UUID, taskId: UUID, direction: 'left' | 'right')`

### 🔍 Appearance
- Displays the board title (if any, though not explicitly in `BoardEntity`).
- Arranges `ColumnView` components horizontally.
- Includes a section for adding new columns.

### 📦 Content
- Contains `CreateColumnFormView`.
- Contains multiple `ColumnView` components, one for each `ColumnEntity` in `board.columns`.

### ⚡ Capabilities

#### renderBoard
**Contract**: Displays the current state of the Kanban board.
**Signature**: `()` -> `void`
**Flow**:
- Display the `CreateColumnFormView`, passing `onAddColumn` as its `onSubmit` handler.
- FOR EACH `column` IN `board.columns`:
    - Determine if the `column` is the first or last in the `board.columns` array.
    - Display a `ColumnView` component for the `column`.
    - Pass `column`, `onRenameColumn`, `onDeleteColumn`, `onAddTask`, `onUpdateTask`, `onDeleteTask`, `onMoveTask`, `isFirstColumn`, and `isLastColumn` as props to `ColumnView`.

### ✅ Acceptance Criteria
- All columns from the `board` are displayed.
- The `CreateColumnFormView` is visible and allows adding new columns.
- Each `ColumnView` receives the correct data and handlers.

---

## Component: ColumnView
### Role: Presentation
**Signature**:
- `column: ColumnEntity`
- `onRenameColumn: function(columnId: UUID, newTitle: string)`
- `onDeleteColumn: function(columnId: UUID)`
- `onAddTask: function(columnId: UUID, taskDetails: { title: string, description: string, dueDate: string, priority: PriorityType })`
- `onUpdateTask: function(columnId: UUID, taskId: UUID, updatedDetails: { title?: string, description?: string, dueDate?: string, priority?: PriorityType })`
- `onDeleteTask: function(columnId: UUID, taskId: UUID)`
- `onMoveTask: function(currentColumnId: UUID, taskId: UUID, direction: 'left' | 'right')`
- `isFirstColumn: boolean`
- `isLastColumn: boolean`

### 🔍 Appearance
- Displays the column's `title`.
- Provides buttons for "Rename Column" and "Delete Column".
- Includes a section for adding new tasks.
- Arranges `TaskView` components vertically.

### 📦 Content
- Contains `CreateTaskFormView`.
- Contains multiple `TaskView` components, one for each `TaskEntity` in `column.tasks`.

### ⚡ Capabilities

#### renderColumn
**Contract**: Displays a single column and its tasks.
**Signature**: `()` -> `void`
**Flow**:
- Display the `column.title`.
- Display a "Rename Column" button that, when activated, triggers `onRenameColumn` with `column.id` and a new title.
- Display a "Delete Column" button that, when activated, triggers `onDeleteColumn` with `column.id`.
- Display the `CreateTaskFormView`, passing `column.id` and `onAddTask` as its `onSubmit` handler.
- FOR EACH `task` IN `column.tasks`:
    - Display a `TaskView` component for the `task`.
    - Pass `task`, `onUpdateTask`, `onDeleteTask`, `onMoveTask` (with `column.id` pre-filled), `isFirstColumn`, and `isLastColumn` as props to `TaskView`.

### ✅ Acceptance Criteria
- The column title is displayed.
- "Rename Column" and "Delete Column" actions are available and trigger the correct handlers.
- The `CreateTaskFormView` is visible and allows adding new tasks to this column.
- All tasks within the `column` are displayed via `TaskView` components.

---

## Component: TaskView
### Role: Presentation
**Signature**:
- `task: TaskEntity`
- `onUpdateTask: function(columnId: UUID, taskId: UUID, updatedDetails: { title?: string, description?: string, dueDate?: string, priority?: PriorityType })`
- `onDeleteTask: function(columnId: UUID, taskId: UUID)`
- `onMoveTask: function(currentColumnId: UUID, taskId: UUID, direction: 'left' | 'right')`
- `columnId: UUID`
- `isFirstColumn: boolean`
- `isLastColumn: boolean`

### 🔍 Appearance
- Displays the task's `title`, `description`, `dueDate`, and `priority`.
- Provides buttons for "Edit Task", "Delete Task", "Move Left", and "Move Right".
- "Move Left" button is disabled if `isFirstColumn` is true.
- "Move Right" button is disabled if `isLastColumn` is true.

### 📦 Content
- Displays `task.title`.
- Displays `task.description`.
- Displays `task.dueDate`.
- Displays `task.priority`.

### ⚡ Capabilities

#### renderTask
**Contract**: Displays a single task and its actions.
**Signature**: `()` -> `void`
**Flow**:
- Display `task.title`.
- Display `task.description`.
- Display `task.dueDate`.
- Display `task.priority`.
- Display an "Edit Task" button that, when activated, triggers `onUpdateTask` with `columnId`, `task.id`, and updated details.
- Display a "Delete Task" button that, when activated, triggers `onDeleteTask` with `columnId` and `task.id`.
- Display a "Move Left" button. IF `isFirstColumn` is false, THEN enable it and, when activated, trigger `onMoveTask` with `columnId`, `task.id`, and 'left'. ELSE disable it.
- Display a "Move Right" button. IF `isLastColumn` is false, THEN enable it and, when activated, trigger `onMoveTask` with `columnId`, `task.id`, and 'right'. ELSE disable it.

### ✅ Acceptance Criteria
- Task details (title, description, due date, priority) are displayed.
- "Edit Task" and "Delete Task" actions are available and trigger the correct handlers.
- "Move Left" action is available and triggers `onMoveTask` with 'left' direction, unless the task is in the first column.
- "Move Right" action is available and triggers `onMoveTask` with 'right' direction, unless the task is in the last column.

---

## Component: CreateColumnFormView
### Role: Presentation
**Signature**: `onSubmit: function(title: string)`

### 🔍 Appearance
- An input field labeled "Column Title".
- A button labeled "Add Column".

### ⚡ Capabilities

#### renderForm
**Contract**: Displays the form for creating a new column.
**Signature**: `()` -> `void`
**Flow**:
- Display an input field for the column title.
- Display an "Add Column" button.
- WHEN the "Add Column" button is activated:
    - Retrieve the value from the title input field.
    - Trigger `onSubmit` with the retrieved title.
    - Clear the input field.

### ✅ Acceptance Criteria
- The form allows entering a column title.
- Submitting the form triggers the `onSubmit` handler with the entered title.

---

## Component: CreateTaskFormView
### Role: Presentation
**Signature**:
- `columnId: UUID`
- `onSubmit: function(columnId: UUID, task: { title: string, description: string, dueDate: string, priority: PriorityType })`

### 🔍 Appearance
- Input fields for "Task Title", "Description", "Due Date".
- A dropdown/selector for "Priority" (Low, Medium, High).
- A button labeled "Add Task".

### ⚡ Capabilities

#### renderForm
**Contract**: Displays the form for creating a new task.
**Signature**: `()` -> `void`
**Flow**:
- Display an input field for the task title.
- Display an input field for the task description.
- Display an input field for the due date (suggested format `YYYY-MM-DD`).
- Display a dropdown for priority selection (options: LOW, MEDIUM, HIGH).
- Display an "Add Task" button.
- WHEN the "Add Task" button is activated:
    - Retrieve values from all input fields and the priority selector.
    - Trigger `onSubmit` with `columnId` and an object containing the task details (title, description, dueDate, priority).
    - Clear all input fields and reset priority selector.

### ✅ Acceptance Criteria
- The form allows entering task details (title, description, due date, priority).
- Submitting the form triggers the `onSubmit` handler with the `columnId` and the entered task details.