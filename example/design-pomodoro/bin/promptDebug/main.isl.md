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
export const TimerMode: {
  Work: 'Work';
  ShortBreak: 'ShortBreak';
  LongBreak: 'LongBreak';
};

export const TimerState: {
  Idle: 'Idle';
  Running: 'Running';
  Paused: 'Paused';
  Completed: 'Completed';
};

export const TimerConfigEntity: (data?: {
  workDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
}) => {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
};

Component: ./logic
Signature:
import { TimerMode, TimerState, TimerConfigEntity } from "./domain";

export const PomodoroEngine: (
  initialConfig?: {
    workDuration?: number;
    shortBreakDuration?: number;
    longBreakDuration?: number;
  }
) => {
  initialize: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  selectMode: (mode: typeof TimerMode[keyof typeof TimerMode]) => void;
  getCurrentMode: () => typeof TimerMode[keyof typeof TimerMode];
  getCurrentState: () => typeof TimerState[keyof typeof TimerState];
  getRemainingTime: () => number;
  getConfig: () => {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
  };
};

Component: ./ui
Signature:
export default function TimerDisplay(props: {
  remainingTime?: number;
  currentMode?: 'Work' | 'ShortBreak' | 'LongBreak';
  currentState?: 'Idle' | 'Running' | 'Paused' | 'Completed';
}): React.Element;

export function ControlButtons(props: {
  currentState?: 'Idle' | 'Running' | 'Paused' | 'Completed';
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onSelectMode?: (mode: 'Work' | 'ShortBreak' | 'LongBreak') => void;
}): React.Element;

<!-- BUILD CONTEXT FOR: main.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./main -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- START DEPENDENCY INTERFACE: domain.ref.md -->
<!-- INTERFACE (REF) FOR: domain.isl.md -->
# Project: Domain

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./domain -->
**Implementation**: ./domain

## Domain Concepts

### TimerMode
Represents the different operational modes of the Pomodoro timer.
- **Type**: Enum
- **Values**:
  - `Work`: The primary work session mode.
  - `ShortBreak`: A short break session mode.
  - `LongBreak`: A longer break session mode.

### TimerState
Represents the current operational state of the Pomodoro timer.
- **Type**: Enum
- **Values**:
  - `Idle`: The timer is ready to start or has been reset.
  - `Running`: The timer is actively counting down.
  - `Paused`: The timer countdown is temporarily suspended.
  - `Completed`: The current timer session has finished.

### TimerConfigEntity
Defines the duration settings for each timer mode.
- **Type**: Object
- **Properties**:
  - `workDuration`: The duration for the 'Work' mode.
    - **Type**: `number`
    - **Unit**: `seconds`
    - **Default**: `1500` (25 minutes)
  - `shortBreakDuration`: The duration for the 'Short Break' mode.
    - **Type**: `number`
    - **Unit**: `seconds`
    - **Default**: `300` (5 minutes)
  - `longBreakDuration`: The duration for the 'Long Break' mode.
    - **Type**: `number`
    - **Unit**: `seconds`
    - **Default**: `900` (15 minutes)
<!-- END DEPENDENCY INTERFACE -->

<!-- START DEPENDENCY INTERFACE: logic.ref.md -->
<!-- INTERFACE (REF) FOR: logic.isl.md -->
# Project: Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./logic -->
**Implementation**: ./logic

> **Reference**: TimerMode, TimerState, TimerConfigEntity in `./domain.isl.md`

## Component: PomodoroEngine
### Role: Business Logic
**Signature**:
- `initialConfig`: `TimerConfigEntity` - The initial configuration for timer durations.

### ⚡ Capabilities

#### initialize
**Contract**: Sets up the initial state of the timer based on the provided configuration.
**Signature**:
- **Input**: None
- **Output**: None
#### startTimer
**Contract**: Initiates the countdown for the current timer mode.
**Signature**:
- **Input**: None
- **Output**: None
#### pauseTimer
**Contract**: Suspends the countdown of the current timer mode.
**Signature**:
- **Input**: None
- **Output**: None
#### resetTimer
**Contract**: Resets the current timer mode to its initial duration and `Idle` state.
**Signature**:
- **Input**: None
- **Output**: None
#### selectMode
**Contract**: Changes the active timer mode and resets the timer to the new mode's initial duration.
**Signature**:
- **Input**:
  - `mode`: `TimerMode` - The new mode to switch to.
- **Output**: None
#### tick (Internal)
**Contract**: Decrements the remaining time and handles state transitions when time runs out.
**Signature**:
- **Input**: None
- **Output**: None
<!-- END DEPENDENCY INTERFACE -->

<!-- START DEPENDENCY INTERFACE: ui.ref.md -->
<!-- INTERFACE (REF) FOR: ui.isl.md -->
# Project: Ui

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./ui -->
**Implementation**: ./ui

> **Reference**: TimerMode, TimerState in `./domain.isl.md`

## Component: TimerDisplay
### Role: Presentation
**Signature**:
- `remainingTime`: `number` (seconds) - The time left to display.
- `currentMode`: `TimerMode` - The active timer mode.
- `currentState`: `TimerState` - The current state of the timer.

### 🔍 Appearance
- Displays the `remainingTime` in `MM:SS` format.
- Displays the `currentMode` name (e.g., "Work", "Short Break").
- The display color or style MAY change based on `currentState` (e.g., red for `Completed`).

### 📦 Content
- A primary text element showing the formatted time (e.g., "24:59").
- A secondary text element indicating the current mode (e.g., "Work Session").

### ⚡ Capabilities

#### formatTime
**Contract**: Converts total seconds into a `MM:SS` string format.
**Signature**:
- **Input**: `totalSeconds`: `number` (seconds)
- **Output**: `string` (format: "MM:SS")
## Component: ControlButtons
### Role: Presentation
**Signature**:
- `currentState`: `TimerState` - The current state of the timer, used to enable/disable buttons.
- `onStart`: `() => void` - Callback to trigger timer start.
- `onPause`: `() => void` - Callback to trigger timer pause.
- `onReset`: `() => void` - Callback to trigger timer reset.
- `onSelectMode`: `(mode: TimerMode) => void` - Callback to trigger mode selection.

### 🔍 Appearance
- Buttons for "Start", "Pause", "Reset".
- Buttons or tabs for "Work", "Short Break", "Long Break" mode selection.
- Buttons MUST be enabled/disabled based on `currentState`.

### 📦 Content
- Button: "Start" (or "Resume")
- Button: "Pause"
- Button: "Reset"
- Button: "Work"
- Button: "Short Break"
- Button: "Long Break"

### 🚨 Constraints
- The "Start" button MUST be disabled if `currentState` is `Running`.
- The "Pause" button MUST be disabled if `currentState` is `Idle`, `Paused`, or `Completed`.
- The "Reset" button MUST be enabled in all states except `Idle` (unless it's also the only way to exit `Completed`).
- Mode selection buttons MUST be enabled in `Idle`, `Paused`, or `Completed` states. They SHOULD be disabled when `currentState` is `Running`.

### ✅ Acceptance Criteria
- Clicking "Start" MUST trigger the `onStart` callback.
- Clicking "Pause" MUST trigger the `onPause` callback.
- Clicking "Reset" MUST trigger the `onReset` callback.
- Clicking "Work" mode button MUST trigger `onSelectMode(TimerMode.Work)`.
- When `currentState` is `Running`, the "Start" button MUST be visually disabled.
- When `currentState` is `Paused`, the "Pause" button MUST be visually disabled.
<!-- END DEPENDENCY INTERFACE -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: Main

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: TimerMode, TimerState, TimerConfigEntity in `./domain.isl.md`
> **Reference**: PomodoroEngine in `./logic.isl.md`
> **Reference**: TimerDisplay, ControlButtons in `./ui.isl.md`

## Component: Main
### Role: Presentation
**Signature**: None (This is the application's entry point)

### 📦 Content
- Contains a `TimerDisplay` component.
- Contains a `ControlButtons` component.

### ⚡ Capabilities

#### initializeApplication
**Contract**: Sets up the core `PomodoroEngine` and establishes initial state for the UI.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1. Create an instance of `PomodoroEngine` with default `TimerConfigEntity`:
   - `workDuration: 1500` (seconds)
   - `shortBreakDuration: 300` (seconds)
   - `longBreakDuration: 900` (seconds)
2. Call `PomodoroEngine.initialize()`.
3. Establish a mechanism to periodically trigger `PomodoroEngine.tick()` every `1` second when the engine's `currentState` is `Running`.
4. Expose `PomodoroEngine`'s `currentMode`, `currentState`, and `remainingTime` as observable properties.
5. Expose `PomodoroEngine`'s `startTimer`, `pauseTimer`, `resetTimer`, and `selectMode` capabilities as callbacks.
**Side Effects**: Initializes `PomodoroEngine`, sets up periodic `tick` mechanism, makes engine state and actions available.

#### renderApplication
**Contract**: Renders the `TimerDisplay` and `ControlButtons` components, connecting them to the `PomodoroEngine`'s state and actions.
**Signature**:
- **Input**: None
- **Output**: Rendered UI components.
**Flow**:
1. Render `TimerDisplay`:
   - Pass `PomodoroEngine.remainingTime` to `TimerDisplay.remainingTime`.
   - Pass `PomodoroEngine.currentMode` to `TimerDisplay.currentMode`.
   - Pass `PomodoroEngine.currentState` to `TimerDisplay.currentState`.
2. Render `ControlButtons`:
   - Pass `PomodoroEngine.currentState` to `ControlButtons.currentState`.
   - Pass `PomodoroEngine.startTimer` as `ControlButtons.onStart`.
   - Pass `PomodoroEngine.pauseTimer` as `ControlButtons.onPause`.
   - Pass `PomodoroEngine.resetTimer` as `ControlButtons.onReset`.
   - Pass `PomodoroEngine.selectMode` as `ControlButtons.onSelectMode`.
**Side Effects**: Displays the user interface.

### ✅ Acceptance Criteria
- The `TimerDisplay` component MUST accurately reflect the `PomodoroEngine`'s `remainingTime`, `currentMode`, and `currentState`.
- User interactions with `ControlButtons` (Start, Pause, Reset, Mode Selection) MUST correctly trigger the corresponding capabilities on the `PomodoroEngine`.
- The application MUST start with the `Work` mode selected and in an `Idle` state, displaying `25:00`.