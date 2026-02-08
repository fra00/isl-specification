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
export const OperationType: {
  ADD: 'ADD';
  SUBTRACT: 'SUBTRACT';
  MULTIPLY: 'MULTIPLY';
  DIVIDE: 'DIVIDE';
};

export const CalculatorStateEntity: (data?: {
  currentOperand?: string;
  previousOperand?: string;
  operator?: typeof OperationType.ADD | typeof OperationType.SUBTRACT | typeof OperationType.MULTIPLY | typeof OperationType.DIVIDE | null;
  displayValue?: string;
  waitingForNewOperand?: boolean;
  isError?: boolean;
}) => {
  currentOperand: string;
  previousOperand: string;
  operator: typeof OperationType.ADD | typeof OperationType.SUBTRACT | typeof OperationType.MULTIPLY | typeof OperationType.DIVIDE | null;
  displayValue: string;
  waitingForNewOperand: boolean;
  isError: boolean;
};

<!-- BUILD CONTEXT FOR: calculator-logic.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./calculator-logic -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- START DEPENDENCY INTERFACE: domain.ref.md -->
<!-- INTERFACE (REF) FOR: domain.isl.md -->
# Project: Domain

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./domain -->
**Implementation**: ./domain

## Domain Concepts

### OperationType
**Contract**: Defines the types of arithmetic operations supported by the calculator.
**Type**: Enum
**Values**:
- `ADD`: Represents addition.
- `SUBTRACT`: Represents subtraction.
- `MULTIPLY`: Represents multiplication.
- `DIVIDE`: Represents division.

### CalculatorStateEntity
**Contract**: Represents the complete internal state of the calculator at any given moment.
**Type**: Entity
**Properties**:
- `currentOperand`: `string` (Represents the number currently being entered or the result of the last operation. Stored as string to handle decimal input and leading zeros.)
- `previousOperand`: `string` (Represents the first operand in a pending operation. Stored as string.)
- `operator`: `OperationType` | `null` (The arithmetic operation selected by the user, or `null` if no operator is pending.)
- `displayValue`: `string` (The value currently shown on the calculator's display. Can be a number string or "Error".)
- `waitingForNewOperand`: `boolean` (Indicates if the next digit input should clear `currentOperand` or append to it. True after an operator or equals is pressed.)
- `isError`: `boolean` (Indicates if the calculator is in an error state, e.g., division by zero.)
<!-- END DEPENDENCY INTERFACE -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: Calculator Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./calculator-logic

> **Reference**: Defines domain entities and enums in `./domain.isl.md`

## Component: CalculatorEngine
### Role: Business Logic
**Signature**: No direct input props; manages internal state.

### ⚡ Capabilities

#### initializeState
**Contract**: Sets the calculator's state to its initial default values.
**Signature**: `()` => `CalculatorStateEntity`
**Flow**:
1.  Create a new `CalculatorStateEntity`.
2.  Set `currentOperand` to `"0"`.
3.  Set `previousOperand` to `""`.
4.  Set `operator` to `null`.
5.  Set `displayValue` to `"0"`.
6.  Set `waitingForNewOperand` to `false`.
7.  Set `isError` to `false`.
8.  Return the initialized `CalculatorStateEntity`.

#### processDigit
**Contract**: Processes a numeric digit input, updating the current operand and display.
**Signature**: `(state: CalculatorStateEntity, digit: string)` => `CalculatorStateEntity`
**Flow**:
1.  IF `state.isError` is `true` THEN
    1.  Return `initializeState()`.
2.  IF `state.waitingForNewOperand` is `true` THEN
    1.  Set `currentOperand` to `digit`.
    2.  Set `waitingForNewOperand` to `false`.
3.  ELSE IF `state.currentOperand` is `"0"` THEN
    1.  Set `currentOperand` to `digit`.
4.  ELSE
    1.  Append `digit` to `currentOperand`.
5.  Update `displayValue` to `currentOperand`.
6.  Return the updated `CalculatorStateEntity`.

#### processDecimal
**Contract**: Adds a decimal point to the current operand if not already present.
**Signature**: `(state: CalculatorStateEntity)` => `CalculatorStateEntity`
**Flow**:
1.  IF `state.isError` is `true` THEN
    1.  Return `initializeState()`.
2.  IF `state.waitingForNewOperand` is `true` THEN
    1.  Set `currentOperand` to `"0."`.
    2.  Set `waitingForNewOperand` to `false`.
3.  ELSE IF `currentOperand` does NOT contain `.` THEN
    1.  Append `.` to `currentOperand`.
4.  Update `displayValue` to `currentOperand`.
5.  Return the updated `CalculatorStateEntity`.

#### processOperator
**Contract**: Stores the selected operator and performs any pending calculation if a previous operator exists.
**Signature**: `(state: CalculatorStateEntity, newOperator: OperationType)` => `CalculatorStateEntity`
**Flow**:
1.  IF `state.isError` is `true` THEN
    1.  Return `initializeState()`.
2.  IF `state.previousOperand` is NOT empty AND `state.operator` is NOT `null` AND `state.waitingForNewOperand` is `false` THEN
    1.  Perform `_executeCalculation` using `state.previousOperand`, `state.currentOperand`, and `state.operator`.
    2.  IF the calculation results in an error (e.g., division by zero) THEN
        1.  Set `isError` to `true`.
        2.  Set `displayValue` to `"Error"`.
        3.  Return the error state.
    3.  Set `currentOperand` to the string representation of the calculation result.
4.  Set `previousOperand` to `currentOperand`.
5.  Set `operator` to `newOperator`.
6.  Set `waitingForNewOperand` to `true`.
7.  Update `displayValue` to `currentOperand`.
8.  Return the updated `CalculatorStateEntity`.

#### processEquals
**Contract**: Triggers the final calculation using the stored operands and operator.
**Signature**: `(state: CalculatorStateEntity)` => `CalculatorStateEntity`
**Flow**:
1.  IF `state.isError` is `true` THEN
    1.  Return `initializeState()`.
2.  IF `state.previousOperand` is NOT empty AND `state.operator` is NOT `null` THEN
    1.  Perform `_executeCalculation` using `state.previousOperand`, `state.currentOperand`, and `state.operator`.
    2.  IF the calculation results in an error (e.g., division by zero) THEN
        1.  Set `isError` to `true`.
        2.  Set `displayValue` to `"Error"`.
        3.  Return the error state.
    3.  Set `currentOperand` to the string representation of the calculation result.
    4.  Clear `previousOperand`.
    5.  Clear `operator`.
    6.  Set `waitingForNewOperand` to `true`.
    7.  Update `displayValue` to `currentOperand`.
3.  Return the updated `CalculatorStateEntity`.

#### clear
**Contract**: Resets the calculator to its initial state.
**Signature**: `(state: CalculatorStateEntity)` => `CalculatorStateEntity`
**Flow**:
1.  Return the result of `initializeState()`.

#### toggleSign
**Contract**: Changes the sign of the current operand.
**Signature**: `(state: CalculatorStateEntity)` => `CalculatorStateEntity`
**Flow**:
1.  IF `state.isError` is `true` THEN
    1.  Return `initializeState()`.
2.  Parse `state.currentOperand` as a `number`.
3.  Multiply the number by `-1`.
4.  Convert the result back to a `string`.
5.  Set `currentOperand` to this new string.
6.  Update `displayValue` to `currentOperand`.
7.  Return the updated `CalculatorStateEntity`.

#### _executeCalculation (Internal Helper)
**Contract**: Performs the actual arithmetic operation between two numbers.
**Signature**: `(operand1Str: string, operand2Str: string, operator: OperationType)` => `number` | `Error`
**Flow**:
1.  Parse `operand1Str` and `operand2Str` as `number` values.
2.  BRANCH:
    -   IF `operator` is `OperationType.ADD` THEN
        -   Return `operand1` + `operand2`.
    -   IF `operator` is `OperationType.SUBTRACT` THEN
        -   Return `operand1` - `operand2`.
    -   IF `operator` is `OperationType.MULTIPLY` THEN
        -   Return `operand1` * `operand2`.
    -   IF `operator` is `OperationType.DIVIDE` THEN
        -   IF `operand2` is `0` THEN
            -   Return an `Error` indicating division by zero.
        -   ELSE
            -   Return `operand1` / `operand2`.
3.  Return `0` if no valid operator is found (should not happen with `OperationType`).

### 🚨 Constraints
-   The `displayValue` MUST be a `string`.
-   Division by zero MUST result in `isError` being `true` and `displayValue` being `"Error"`.
-   All numeric inputs and outputs to the UI MUST be handled as `string` to preserve decimal precision and input format.
-   Internal calculations MUST use `number` types.

### ✅ Acceptance Criteria
-   Entering digits `1`, `2`, `3` then `+` then `4`, `5` then `=` MUST display `168`.
-   Entering `1`, `0`, `/` then `0` then `=` MUST display `"Error"`.
-   After an error, pressing any digit MUST clear the error and start a new calculation.
-   Entering `5`, `.` then `5` then `*` then `2` then `=` MUST display `11`.
-   Entering `1`, `0`, `+/-` then `+` then `5` then `=` MUST display `-5`.
-   Pressing `C` MUST reset the display to `0`.