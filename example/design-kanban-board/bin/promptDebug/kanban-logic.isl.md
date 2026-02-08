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

<!-- BUILD CONTEXT FOR: kanban-logic.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./kanban-logic -->
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