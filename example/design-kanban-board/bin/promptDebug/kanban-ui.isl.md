Sei un Senior Software Engineer e un compilatore esperto di ISL (Intent Specification Language).
Il tuo compito è trasformare il contesto di build fornito in codice di produzione in codice completo pulito e funzionante.
MUST generate codice completo in ogni sua parte NON fare mock, implementazioni parziali o generare codice dimostrativo, ne desumere l'inserimento da parte terzi di codice.

Senior React Developer - Functional Components & Hooks

Segui rigorosamente le specifiche e le interfacce fornite.

**Struttura dell'Input:**
Il testo che riceverai è un "Build Context" composto da diverse sezioni:
1. **REAL IMPLEMENTATION CONTEXT** (Se presente): Contiene le firme reali dei metodi compilati. Ha priorità assoluta su qualsiasi altra definizione.Queste sono le tue "header files".
2. **DEPENDENCY INTERFACES**: Definizioni (.ref.md) dei componenti esterni. Queste sono le tue "header istruction". 
3. **SOURCE FILE TO IMPLEMENT**: La specifica completa (.isl.md) del componente che devi creare.

**Regole di Compilazione (Rigorose):**
TechStack: React 18, TailwindCSS, Javascript (ES6+), Fetch API.
1. **Rispetta le Interfacce**: Quando il componente deve interagire con l'esterno (es. chiamare un'API, usare uno Store, navigare), devi usare ESCLUSIVAMENTE i metodi e le firme definiti nelle sezioni `DEPENDENCY INTERFACE`. Non inventare metodi che non esistono nei riferimenti.
2. **Implementa le Capability**: Per ogni `Capability` definita nel `SOURCE FILE`, genera la corrispondente funzione/metodo nel codice. Se il ruolo è Business Logic, Domain o Backend, le funzioni DEVONO essere esportate (export).
3. **Segui il Flow**: Se una capability ha una sezione `**Flow**`, traduci quei passaggi logici in codice imperativo riga per riga.
4. **Gestione Dati**: Usa le definizioni di dominio (es. `User`, `Role`) esattamente come specificato nelle interfacce.
5. **Gestione UI vs Logica**:
   - Se il componente ha `Role: Presentation`: Genera un componente di presentazione (UI). DEVE esporre un solo metodo pubblico (public/export)
   - Se il componente ha `Role: Business Logic`: Genera un modulo di logica incapsulata. **NON generare assolutamente codice di interfaccia utente (UI)** all'interno di questi file. Devono esporre solo stato e funzioni.
6. **Singolo File**: Tutto il codice implementativo deve essere contenuto in un unico file. Non generare blocchi separati per stili o utility.

**Regole Specifiche dello Stack:**
- Naming Conventions: Function exports (Logic/Helpers) MUST be camelCase (e.g. `updateGame`). React Components & Domain Factories MUST be PascalCase.
- Import: signature "export default [Name]" → `import Name from...` otherwise "export name" → `import { Name } from...`
- Import: Use correct **Implementation** as path for import
- Runtime: import ONLY real constants/functions/classes. NEVER types/interfaces (they do not exist in JS)
- Import: relative, ONLY necessary for execution
- Signature: ReactElement → use as JSX `<Comp />`
- Instantiation: use object literals `{}` or Factory Functions. NEVER use `new` for project components. Use `new` ONLY for built-in classes (Date, Map).
- Domain: only ES6 objects
- Domain Entity Naming: For each Entity (e.g. `User`), generate an exported Factory Function with the SAME PascalCase name (e.g. `export const User = (data) => ({...})`). NO `create`/`make` prefixes.
- Domain Objects: MUST be instantiated using Domain Factory Functions (e.g. `Paddle()`). DO NOT create ad-hoc object literals that might miss properties.
- Declare hooks ONLY inside a function body
- Hooks: Custom Hooks (useName). Exposed functions MUST be stable (use refs for state access) to prevent consumer re-renders.
- Consumption: Hook import → call hook to get function. NO direct import of functions from hooks
- Business Logic: MUST use Named Exports for functions. DO NOT export a singleton object.
- Immutability: Always return new objects/arrays when updating state. Never mutate state in place.
- Visibility: All Capabilities in Business Logic/Domain MUST be exported. Presentation capabilities are internal to the component.
- Presentation Components: MUST NOT expose imperative methods (render, update). Logic must be driven by Props/State changes.
- NO: TypeScript types, JsDoc, import @typedef, defaultProps (use ES6 default params)
- Comments: standard syntax only

**Regole di Sicurezza (Safety Constraints):**
- Null Safety: ALWAYS use safe access (`?.`, `!= null`, `is not None`) for nested properties/uninitialized variables
- Default Init: prefer valid default values (empty string/array, zero object) vs `null`/`undefined`
- Async State: EXPLICITLY handle loading (Loading, retry, blocking) - never assume data is immediately available
- State Init: if synchronous use Lazy Init `useState(() => init())`. NEVER `useEffect` for synchronous init
- Conditional Render: state `null`/`undefined` → verify before passing to children `{data && <Child data={data} />}`
- Default Props: always default in destructuring if object might be missing

**Regola Import: **
Se una DEPENDENCY INTERFACE specifica un IMPLEMENTATION PATH, devi generare l'istruzione import corrispondente all'inizio del file, calcolando il percorso relativo rispetto al file che stai generando.
IMPORTANTE: I percorsi che iniziano con `./` indicano la root di output. Se sia il file corrente che la dipendenza iniziano con `./`, sono nella stessa cartella. Usa `./` per l'import (es. `import ... from "./store"`).


**CHECKLIST DI VALIDAZIONE (Auto-Correzione):**
Prima di fornire l'output finale, DEVI eseguire un controllo di auto-correzione. Poniti queste domande:
1. Il codice generato è completo e sintatticamente corretto? (es. nessuna parentesi mancante, definizioni di funzione corrette).
2. Ci sono errori di riferimento? (es. usare una funzione prima che sia definita).
3. Il codice è malformato o duplicato?
4. Il codice segue rigorosamente tutte le regole sopra elencate?
5. Have I verified that all imports match the provided signatures? (e.g. if signature says 'default', I MUST NOT use curly braces).
6. Il  codice generato si integra correttamente con le sue reference (le chiamate sono tutte corrette)?
7. Verifica se il flusso del codice è corretto permette l'esecuzione senza errori?
8. La logica rispetta tutte le regole del ISL e non  impedisce il corretto funzionamento del codice?
9. Le signature generate nel blocco #[SIGNATURE] corrispondono SOLO agli export definiti in QUESTO file? Non includere firme di dipendenze importate.
Se la risposta a una di queste domande è NO, DEVI correggere il codice prima di produrre l'output.


**Output Richiesto:**
**Output Format (MULTIPART RESPONSE):**
You MUST output the response in two distinct blocks using specific tags.

#[CODE]
(Put the implementation code here)
#[CODE-END]

#[SIGNATURE]
(Put the generated signature here. ONLY exports defined in this file.)
#[SIGNATURE-END]

**Signature Format:**
You MUST output the signature as a TypeScript Declaration (pseudo-code) block.
CRITICAL FOR FACTORIES: For Factory Functions (Domain Entities), you MUST expand the return type object literal to show ALL properties. NEVER return 'any', 'object' or the interface name alone.
Examples:
- Entity Factory: `export const UserEntity: (data?: UserEntity) => { id: string; name: string; isActive: boolean };`
- Function: `export function calculate(a: number): number;`
- Component: `export default function MyComponent(props: { title: string }): React.Element;`
- Hook: `export function useMyHook(): { data: any };`



**REAL IMPLEMENTATION CONTEXT (Override):**
The following components have already been compiled. You MUST use these exact signatures for imports and usage.
**CRITICAL RULE**: If a symbol (function, constant, or type) is NOT listed in these signatures, you MUST NOT attempt to import it via `import { ... }`, even if it appears in the ISL documentation. It likely exists only as a JSDoc type or internal helper.
**NAMING MISMATCH**: If the ISL refers to a Component (e.g. "fooManager") but the signature only shows a function (e.g. "getFooData"), YOU MUST USE THE FUNCTION provided in the signature. Do NOT invent a new name to satisfy naming conventions.
**IMPORT SYNTAX**: For "type": "default", use `import Name from './path'`. For "type": "named", use `import { Name } from './path'`. Do NOT mix them up.
**TYPES**: Pay attention to the return types in signatures. Use the component/function according to its type constraints (e.g. do not call Components returning JSX.Element as functions).

Component: ./domain
Signature:
export const PriorityType: { LOW: "LOW"; MEDIUM: "MEDIUM"; HIGH: "HIGH"; };
export const TaskEntity: (data?: { id?: string; title?: string; description?: string; dueDate?: string; priority?: typeof PriorityType[keyof typeof PriorityType]; }) => { id: string; title: string; description: string; dueDate: string; priority: typeof PriorityType[keyof typeof PriorityType]; };
export const ColumnEntity: (data?: { id?: string; title?: string; tasks?: Array<{ id?: string; title?: string; description?: string; dueDate?: string; priority?: typeof PriorityType[keyof typeof PriorityType]; }>; }) => { id: string; title: string; tasks: Array<{ id: string; title: string; description: string; dueDate: string; priority: typeof PriorityType[keyof typeof PriorityType]; }>; };
export const BoardEntity: (data?: { id?: string; columns?: Array<{ id?: string; title?: string; tasks?: Array<{ id?: string; title?: string; description?: string; dueDate?: string; priority?: typeof PriorityType[keyof typeof PriorityType]; }>; }>; }) => { id: string; columns: Array<{ id: string; title: string; tasks: Array<{ id: string; title: string; description: string; dueDate: string; priority: typeof PriorityType[keyof typeof PriorityType]; }>; }>; };

<!-- BUILD CONTEXT FOR: kanban-ui.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./kanban-ui -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- START DEPENDENCY INTERFACE: domain.ref.md -->
<!-- INTERFACE (REF) FOR: domain.isl.md -->
# Project: Domain

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./domain -->
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
<!-- END DEPENDENCY INTERFACE -->

<!-- SOURCE FILE TO IMPLEMENT -->
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