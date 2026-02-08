# Project: Kanban Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./kanban-logic

> **Reference**: Domain entities in `./domain.isl.md`

## Component: KanbanLogic
### Role: Business Logic
**Signature**: `initialBoardState: BoardEntity`

### ⚡ Capabilities

#### initializeBoard
**Contract**: Initializes the Kanban board state with the provided initial data.
**Signature**: `()` -> `BoardEntity`
**Flow**:
- Set the internal board state to `initialBoardState`.
- Return the current `BoardEntity`.

#### addColumn
**Contract**: Adds a new column to the board.
**Signature**: `(title: string)` -> `BoardEntity`
**Flow**:
- Create a new `ColumnEntity` with a unique `id` and the provided `title`.
- Add the new `ColumnEntity` to the end of the `columns` array in the `BoardEntity`.
- Update the internal board state.
- Return the updated `BoardEntity`.
**Side Effects**: The board state is updated.

#### renameColumn
**Contract**: Renames an existing column.
**Signature**: `(columnId: UUID, newTitle: string)` -> `BoardEntity`
**Flow**:
- Locate the `ColumnEntity` with the matching `columnId`.
- Update its `title` to `newTitle`.
- Update the internal board state.
- Return the updated `BoardEntity`.
**Side Effects**: The board state is updated.

#### deleteColumn
**Contract**: Deletes a column and all its tasks from the board.
**Signature**: `(columnId: UUID)` -> `BoardEntity`
**Flow**:
- Remove the `ColumnEntity` with the matching `columnId` from the `columns` array in the `BoardEntity`.
- Update the internal board state.
- Return the updated `BoardEntity`.
**Side Effects**: The board state is updated.

#### addTask
**Contract**: Adds a new task to a specified column.
**Signature**: `(columnId: UUID, taskDetails: { title: string, description: string, dueDate: string, priority: PriorityType })` -> `BoardEntity`
**Flow**:
- Create a new `TaskEntity` with a unique `id` and the provided `taskDetails`.
- Locate the `ColumnEntity` with the matching `columnId`.
- Add the new `TaskEntity` to the end of the `tasks` array within that `ColumnEntity`.
- Update the internal board state.
- Return the updated `BoardEntity`.
**Side Effects**: The board state is updated.

#### updateTask
**Contract**: Updates the details of an existing task.
**Signature**: `(columnId: UUID, taskId: UUID, updatedDetails: { title?: string, description?: string, dueDate?: string, priority?: PriorityType })` -> `BoardEntity`
**Flow**:
- Locate the `ColumnEntity` with the matching `columnId`.
- Locate the `TaskEntity` with the matching `taskId` within that column.
- Update the `TaskEntity` properties with the provided `updatedDetails`.
- Update the internal board state.
- Return the updated `BoardEntity`.
**Side Effects**: The board state is updated.

#### deleteTask
**Contract**: Deletes a task from a specified column.
**Signature**: `(columnId: UUID, taskId: UUID)` -> `BoardEntity`
**Flow**:
- Locate the `ColumnEntity` with the matching `columnId`.
- Remove the `TaskEntity` with the matching `taskId` from the `tasks` array within that `ColumnEntity`.
- Update the internal board state.
- Return the updated `BoardEntity`.
**Side Effects**: The board state is updated.

#### moveTask
**Contract**: Moves a task from its current column to an adjacent column (left or right).
**Signature**: `(currentColumnId: UUID, taskId: UUID, direction: 'left' | 'right')` -> `BoardEntity`
**Flow**:
- Locate the `currentColumnId` within the `BoardEntity.columns` array to find its index.
- IF `direction` is 'left' THEN
    - Calculate `targetColumnIndex` as `currentColumnIndex - 1`.
- ELSE IF `direction` is 'right' THEN
    - Calculate `targetColumnIndex` as `currentColumnIndex + 1`.
- IF `targetColumnIndex` is valid (within the bounds of `BoardEntity.columns` array) THEN
    - Extract the `TaskEntity` with `taskId` from the `currentColumnId`.
    - Insert the `TaskEntity` into the `tasks` array of the column at `targetColumnIndex`.
    - Update the internal board state.
- Return the updated `BoardEntity`.
**Side Effects**: The board state is updated.

#### getBoardState
**Contract**: Retrieves the current state of the Kanban board.
**Signature**: `()` -> `BoardEntity`
**Flow**:
- Return the current internal `BoardEntity`.

### 🚨 Constraints
- Column titles MUST be unique across the board.
- Task IDs MUST be unique across the entire board.
- `dueDate` values MUST conform to the `ISO-8601 Date string` format (`YYYY-MM-DD`) if provided.
- `priority` values MUST be one of the `PriorityType` enum values.
- Moving a task 'left' from the first column MUST NOT change its position.
- Moving a task 'right' from the last column MUST NOT change its position.

### ✅ Acceptance Criteria
- A new column can be added with a unique title.
- An existing column's title can be updated.
- A column and all its tasks can be deleted.
- A new task can be added to any column with specified details.
- An existing task's details (title, description, due date, priority) can be updated.
- A task can be deleted from a column.
- A task can be moved from its current column to the adjacent column on its left, unless it's already in the leftmost column.
- A task can be moved from its current column to the adjacent column on its right, unless it's already in the rightmost column.
- The `getBoardState` capability accurately reflects the current state after any modification.