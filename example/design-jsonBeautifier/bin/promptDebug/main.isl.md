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

Component: ./logic
Signature:
export function beautifyJson(rawJson: string): string;
export function copyToClipboard(text: string): Promise<void>;

Component: ./ui
Signature:
export function JsonInputArea(props: { value: string; onChange: (newValue: string) => void }): React.ReactElement;
export function JsonOutputArea(props: { value: string; onCopy: () => void }): React.ReactElement;
export function BeautifyButton(props: { onClick: () => void }): React.ReactElement;

<!-- BUILD CONTEXT FOR: main.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./main -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- START DEPENDENCY INTERFACE: logic.ref.md -->
<!-- INTERFACE (REF) FOR: logic.isl.md -->
# Project: Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./logic -->
**Implementation**: ./logic

> **Reference**: Defines core JSON processing and clipboard operations.

## Component: JsonBeautifierService
### Role: Business Logic
**Signature**: None

### ⚡ Capabilities
#### beautifyJson
**Contract**: Parses a raw JSON string and returns a formatted, human-readable JSON string with a standard indentation.
**Signature**:
  - Input: `rawJson: string` (The unformatted JSON string)
  - Output: `beautifiedJson: string` (The formatted JSON string)
#### copyToClipboard
**Contract**: Copies the provided text string to the user's clipboard.
**Signature**:
  - Input: `text: string` (The text to be copied)
  - Output: `void`
<!-- END DEPENDENCY INTERFACE -->

<!-- START DEPENDENCY INTERFACE: ui.ref.md -->
<!-- INTERFACE (REF) FOR: ui.isl.md -->
# Project: Ui

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./ui -->
**Implementation**: ./ui

> **Reference**: Defines the presentation components for JSON input and output.
> **Reference**: Depends on `JsonBeautifierService` for copy functionality in `JsonOutputArea`. See `./logic.isl.md`

## Component: JsonInputArea
### Role: Presentation
**Signature**:
  - `value: string` (The current content of the input area)
  - `onChange: (newValue: string) => void` (Callback function triggered when the input value changes)

### 🔍 Appearance
- A multi-line text input field (textarea).
- Label: "Raw JSON"
- Width: Occupies available space within its container.
- Height: Sufficient to display multiple lines of text.
### 📦 Content
- A `textarea` HTML element.
### ⚡ Capabilities
#### updateValue
**Contract**: Updates the internal value of the input area and notifies the parent component of the change.
**Signature**:
  - Input: `event: Event` (Browser input event containing the new value)
  - Output: `void`
## Component: JsonOutputArea
### Role: Presentation
**Signature**:
  - `value: string` (The content to display in the output area)
  - `onCopy: () => void` (Callback function triggered when the copy button is clicked)

### 🔍 Appearance
- A multi-line text display area (textarea, read-only).
- Label: "Beautified JSON"
- Width: Occupies available space within its container.
- Height: Sufficient to display multiple lines of text.
- A `Button` element positioned below or next to the text area.
  - Button Text: "Copy JSON"
### 📦 Content
- A `textarea` HTML element (read-only).
- A `Button` element.
### ⚡ Capabilities
#### triggerCopy
**Contract**: Notifies the parent component that the copy action has been requested.
**Signature**:
  - Input: None
  - Output: `void`
## Component: BeautifyButton
### Role: Presentation
**Signature**:
  - `onClick: () => void` (Callback function triggered when the button is clicked)

### 🔍 Appearance
- A standard button element.
- Button Text: "Beautify JSON"
### 📦 Content
- A `Button` HTML element.
### ⚡ Capabilities
#### triggerBeautify
**Contract**: Notifies the parent component that the beautify action has been requested.
**Signature**:
  - Input: None
  - Output: `void`
<!-- END DEPENDENCY INTERFACE -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: Main

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Orchestrates the UI and business logic for the JSON beautifier application.
> **Reference**: Uses `JsonBeautifierService` for logic. See `./logic.isl.md`
> **Reference**: Uses `JsonInputArea`, `JsonOutputArea`, and `BeautifyButton` for UI. See `./ui.isl.md`

## Component: Main
### Role: Presentation
**Signature**: None (This is the application's entry point)

### 🔍 Appearance
- A main container that holds all other components.
- Layout: Two primary columns.
  - Left Column: Contains the `JsonInputArea`.
  - Right Column: Contains the `JsonOutputArea`.
- A `BeautifyButton` positioned centrally between or below the two columns.
- Overall padding and spacing for readability.
### 📦 Content
- `JsonInputArea` component.
- `JsonOutputArea` component.
- `BeautifyButton` component.

### ⚡ Capabilities
#### initializeState
**Contract**: Sets the initial state for the raw and beautified JSON.
**Signature**:
  - Input: None
  - Output: `void`
**Flow**:
  1. Initialize `rawJsonState: string` to an empty string.
  2. Initialize `beautifiedJsonState: string` to an empty string.
**Side Effects**:
  - Sets the initial internal state variables.

#### handleRawJsonChange
**Contract**: Updates the `rawJsonState` when the user types in the input area.
**Signature**:
  - Input: `newRawJson: string` (The updated raw JSON string from `JsonInputArea`)
  - Output: `void`
**Flow**:
  1. Update `rawJsonState` with `newRawJson`.
**Side Effects**:
  - `rawJsonState` is updated.

#### handleBeautifyRequest
**Contract**: Processes the `rawJsonState` to produce a beautified version and updates `beautifiedJsonState`.
**Signature**:
  - Input: None
  - Output: `void`
**Flow**:
  1. Request `JsonBeautifierService.beautifyJson` with `rawJsonState`.
  2. Update `beautifiedJsonState` with the result from `JsonBeautifierService.beautifyJson`.
**Side Effects**:
  - `beautifiedJsonState` is updated.

#### handleCopyRequest
**Contract**: Copies the current `beautifiedJsonState` to the user's clipboard.
**Signature**:
  - Input: None
  - Output: `void`
**Flow**:
  1. Request `JsonBeautifierService.copyToClipboard` with `beautifiedJsonState`.
**Side Effects**:
  - The user's clipboard content is updated.

### 🚨 Constraints
- The `JsonInputArea` MUST display `rawJsonState`.
- The `JsonOutputArea` MUST display `beautifiedJsonState`.
- The `JsonInputArea`'s `onChange` callback MUST be connected to `handleRawJsonChange`.
- The `BeautifyButton`'s `onClick` callback MUST be connected to `handleBeautifyRequest`.
- The `JsonOutputArea`'s `onCopy` callback MUST be connected to `handleCopyRequest`.
### ✅ Acceptance Criteria
- When the application loads, both input and output areas are empty.
- Typing in the `JsonInputArea` updates its content.
- Clicking "Beautify JSON" formats the content of `JsonInputArea` and displays it in `JsonOutputArea`.
- If the content in `JsonInputArea` is invalid JSON, clicking "Beautify JSON" displays an error message in `JsonOutputArea`.
- Clicking "Copy JSON" copies the content of `JsonOutputArea` to the clipboard.