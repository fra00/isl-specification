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

<!-- BUILD CONTEXT FOR: logic.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./logic -->
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

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
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
**Flow**:
1. Set `currentMode` to `TimerMode.Work`.
2. Set `currentState` to `TimerState.Idle`.
3. Set `remainingTime` to `initialConfig.workDuration`.
4. Store `initialConfig` as the active `config`.
**Side Effects**: Updates internal state properties (`currentMode`, `currentState`, `remainingTime`, `config`).

#### startTimer
**Contract**: Initiates the countdown for the current timer mode.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1. IF `currentState` is `TimerState.Idle` OR `TimerState.Paused` THEN
   1. Set `currentState` to `TimerState.Running`.
   2. Trigger a periodic `tick` operation every `1` second.
2. ELSE IF `currentState` is `TimerState.Completed` THEN
   1. No action. The timer must be reset or a new mode selected to exit `Completed` state.
**Side Effects**: Changes `currentState` to `Running`, initiates periodic `tick` operations.

#### pauseTimer
**Contract**: Suspends the countdown of the current timer mode.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1. IF `currentState` is `TimerState.Running` THEN
   1. Set `currentState` to `TimerState.Paused`.
   2. Stop any active periodic `tick` operations.
**Side Effects**: Changes `currentState` to `Paused`, stops periodic `tick` operations.

#### resetTimer
**Contract**: Resets the current timer mode to its initial duration and `Idle` state.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1. Stop any active periodic `tick` operations.
2. Set `currentState` to `TimerState.Idle`.
3. IF `currentMode` is `TimerMode.Work` THEN
   1. Set `remainingTime` to `config.workDuration`.
4. ELSE IF `currentMode` is `TimerMode.ShortBreak` THEN
   1. Set `remainingTime` to `config.shortBreakDuration`.
5. ELSE IF `currentMode` is `TimerMode.LongBreak` THEN
   1. Set `remainingTime` to `config.longBreakDuration`.
**Side Effects**: Changes `currentState` to `Idle`, resets `remainingTime`, stops periodic `tick` operations.

#### selectMode
**Contract**: Changes the active timer mode and resets the timer to the new mode's initial duration.
**Signature**:
- **Input**:
  - `mode`: `TimerMode` - The new mode to switch to.
- **Output**: None
**Flow**:
1. Stop any active periodic `tick` operations.
2. Set `currentMode` to `mode`.
3. Set `currentState` to `TimerState.Idle`.
4. IF `mode` is `TimerMode.Work` THEN
   1. Set `remainingTime` to `config.workDuration`.
5. ELSE IF `mode` is `TimerMode.ShortBreak` THEN
   1. Set `remainingTime` to `config.shortBreakDuration`.
6. ELSE IF `mode` is `TimerMode.LongBreak` THEN
   1. Set `remainingTime` to `config.longBreakDuration`.
**Side Effects**: Changes `currentMode`, `currentState` to `Idle`, resets `remainingTime`, stops periodic `tick` operations.

#### tick (Internal)
**Contract**: Decrements the remaining time and handles state transitions when time runs out.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1. IF `currentState` is `TimerState.Running` THEN
   1. Decrement `remainingTime` by `1` (second).
   2. IF `remainingTime` is less than or equal to `0` THEN
      1. Set `remainingTime` to `0`.
      2. Set `currentState` to `TimerState.Completed`.
      3. Stop any active periodic `tick` operations.
**Side Effects**: Decrements `remainingTime`, potentially changes `currentState` to `Completed` and stops `tick` operations.

### 🚨 Constraints
- The `remainingTime` MUST always be a non-negative integer.
- The `tick` operation MUST occur with a precision of `1` second.
- When `currentState` is `TimerState.Completed`, `startTimer` MUST NOT change the state. User input (reset or mode selection) is required to exit this state.

### ✅ Acceptance Criteria
- **Timer Start**: When `startTimer` is called from `Idle` or `Paused`, `currentState` becomes `Running` and `remainingTime` decreases by `1` second every second.
- **Timer Pause**: When `pauseTimer` is called from `Running`, `currentState` becomes `Paused` and `remainingTime` stops decreasing.
- **Timer Reset**: When `resetTimer` is called, `currentState` becomes `Idle` and `remainingTime` is restored to the duration of the `currentMode`.
- **Mode Selection**: When `selectMode` is called, `currentMode` changes, `currentState` becomes `Idle`, and `remainingTime` is set to the new mode's duration.
- **Timer Completion**: When `remainingTime` reaches `0`, `currentState` MUST transition to `Completed`, and the timer MUST stop.
- **Precision**: The timer MUST decrement `remainingTime` by exactly `1` second for each `tick` operation.

### 🧪 Test Scenarios
- **Scenario: Basic Work Cycle**
  - GIVEN `PomodoroEngine` is initialized with `workDuration: 5` seconds.
  - WHEN `startTimer` is called.
  - THEN `currentState` is `Running`.
  - AND after `5` seconds, `currentState` is `Completed` and `remainingTime` is `0`.
- **Scenario: Pause and Resume**
  - GIVEN `PomodoroEngine` is initialized with `workDuration: 10` seconds and `currentState` is `Running` with `remainingTime: 7` seconds.
  - WHEN `pauseTimer` is called.
  - THEN `currentState` is `Paused` and `remainingTime` remains `7` seconds for at least `2` seconds.
  - WHEN `startTimer` is called again.
  - THEN `currentState` is `Running` and `remainingTime` continues to decrease from `7` seconds.
- **Scenario: Reset during Running**
  - GIVEN `PomodoroEngine` is initialized with `workDuration: 10` seconds and `currentState` is `Running` with `remainingTime: 5` seconds.
  - WHEN `resetTimer` is called.
  - THEN `currentState` is `Idle` and `remainingTime` is `10` seconds.
- **Scenario: Select Mode during Running**
  - GIVEN `PomodoroEngine` is initialized with `workDuration: 10`, `shortBreakDuration: 5` seconds, `currentMode` is `Work`, `currentState` is `Running` with `remainingTime: 3` seconds.
  - WHEN `selectMode(TimerMode.ShortBreak)` is called.
  - THEN `currentMode` is `ShortBreak`, `currentState` is `Idle`, and `remainingTime` is `5` seconds.
- **Scenario: Attempt Start from Completed**
  - GIVEN `PomodoroEngine` is in `currentState: Completed` with `remainingTime: 0`.
  - WHEN `startTimer` is called.
  - THEN `currentState` remains `Completed` and `remainingTime` remains `0`.