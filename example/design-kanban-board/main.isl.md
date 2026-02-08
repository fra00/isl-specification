# Project: Main

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Domain entities in `./domain.isl.md`
> **Reference**: Kanban Logic in `./kanban-logic.isl.md`
> **Reference**: Kanban UI in `./kanban-ui.isl.md`

## Component: Main
### Role: Presentation
**Signature**: None

### 🔍 Appearance
- Provides the main application layout, containing the Kanban board.

### 📦 Content
- Contains `KanbanBoardView`.

### ⚡ Capabilities

#### initializeApplication
**Contract**: Sets up the application by loading initial state and initializing logic.
**Signature**: `()` -> `void`
**Flow**:
- Declare a variable `persistedBoardState` to simulate persistent storage.
- TRY to load `BoardEntity` from `persistedBoardState`.
- CATCH if `persistedBoardState` is empty or invalid:
    - Create a default `BoardEntity` with a single column titled "To Do".
    - Set `persistedBoardState` to this default `BoardEntity`.
- Initialize `KanbanLogic` with the loaded or default `BoardEntity`.
- Set up a mechanism to listen for state changes from `KanbanLogic`.
- WHEN `KanbanLogic` indicates a state change:
    - Retrieve the updated `BoardEntity` from `KanbanLogic` using `getBoardState`.
    - Update `persistedBoardState` with the new `BoardEntity`.
    - Trigger a re-render of the `KanbanBoardView`.

#### renderKanbanBoard
**Contract**: Renders the main Kanban board UI.
**Signature**: `()` -> `void`
**Flow**:
- Retrieve the current `BoardEntity` from `KanbanLogic` using `getBoardState`.
- Display the `KanbanBoardView` component.
- Pass the current `BoardEntity` as `board` prop to `KanbanBoardView`.
- Pass the following `KanbanLogic` capabilities as props to `KanbanBoardView`:
    - `KanbanLogic.addColumn` as `onAddColumn`.
    - `KanbanLogic.renameColumn` as `onRenameColumn`.
    - `KanbanLogic.deleteColumn` as `onDeleteColumn`.
    - `KanbanLogic.addTask` as `onAddTask`.
    - `KanbanLogic.updateTask` as `onUpdateTask`.
    - `KanbanLogic.deleteTask` as `onDeleteTask`.
    - `KanbanLogic.moveTask` as `onMoveTask`.

### ✅ Acceptance Criteria
- The application initializes with a board state, either loaded from simulated persistence or a default.
- The `KanbanBoardView` is displayed.
- All actions performed on the UI (add/rename/delete column, add/update/delete/move task) correctly update the `KanbanLogic` state.
- Changes in `KanbanLogic` state trigger a re-render of the `KanbanBoardView`.
- The board state is "persisted" (simulated) across application reloads.

### 💡 Implementation Hints
- The `KanbanLogic` component can be designed as a class or a module that exposes its capabilities and allows subscription to state changes.
- Simulated persistence can be a simple JavaScript object or a global variable within the `Main` component's scope that holds the `BoardEntity` and is updated on every state change.
- The `Main` component will manage its own internal state to hold the `BoardEntity` retrieved from `KanbanLogic`, triggering re-renders when this state changes.