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
export const CardState: {
  Covered: 'Covered';
  Flipped: 'Flipped';
  Solved: 'Solved';
};

export const CardEntity: (data?: {
  id?: string;
  value?: string;
  state?: typeof CardState[keyof typeof CardState];
}) => {
  id: string;
  value: string;
  state: typeof CardState[keyof typeof CardState];
};

export const GameStatus: {
  NotStarted: 'NotStarted';
  Playing: 'Playing';
  Paused: 'Paused';
  Won: 'Won';
};

export const GameConfig: (data?: {
  gridSize?: number[];
  matchDelayMs?: number;
}) => {
  gridSize: number[];
  matchDelayMs: number;
};

<!-- BUILD CONTEXT FOR: game-logic.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./game-logic -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- START DEPENDENCY INTERFACE: domain.ref.md -->
<!-- INTERFACE (REF) FOR: domain.isl.md -->
# Project: Domain

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./domain -->
**Implementation**: ./domain

## Domain Concepts

### CardState
An enumeration representing the possible visual states of a card.
- `Covered`: The card's value is hidden.
- `Flipped`: The card's value is visible, awaiting a match.
- `Solved`: The card's value is visible and permanently matched.

### CardEntity
Represents a single card on the game board.
- `id`: `UUID` - A unique identifier for the card instance.
- `value`: `string` - The identifier for the card's symbol or image.
- `state`: `CardState` - The current visual state of the card.

### GameStatus
An enumeration representing the overall state of the game.
- `NotStarted`: The game is initialized but not yet active.
- `Playing`: The game is actively in progress.
- `Paused`: The game is temporarily suspended.
- `Won`: All card pairs have been matched.

### GameConfig
Configuration parameters for the Memory game.
- `gridSize`: `number[]` - An array `[rows, columns]` defining the dimensions of the card grid (e.g., `[4, 4]`).
- `matchDelayMs`: `number` (milliseconds) - The duration cards remain `Flipped` if they do not match, before returning to `Covered` state.
<!-- END DEPENDENCY INTERFACE -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: Game Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./game-logic

> **Reference**: Defines core data structures in `./domain.isl.md`

## Component: GameEngine
### Role: Business Logic
**Signature**:
- `config`: `GameConfig` - Configuration for the game board and behavior.

### ⚡ Capabilities

#### initializeGame
**Contract**: Sets up the game board with a shuffled set of cards, ensuring an even number of pairs.
**Signature**: `()` -> `void`
**Flow**:
1.  Generate `gridSize[0] * gridSize[1]` cards.
2.  Assign `value` to cards such that each value appears exactly twice.
3.  Assign a unique `id` to each card.
4.  Set initial `state` of all cards to `CardState.Covered`.
5.  Randomly shuffle the order of cards.
6.  Reset `moves` to 0.
7.  Reset `timerSeconds` to 0.
8.  Set `gameStatus` to `GameStatus.NotStarted`.
**Side Effects**: Updates internal `cards`, `moves`, `timerSeconds`, and `gameStatus` state.

#### flipCard
**Contract**: Handles the logic when a user attempts to flip a card. Manages card states, match checking, and non-matching card reset.
**Signature**: `(cardId: UUID)` -> `void`
**Flow**:
1.  IF `gameStatus` is not `GameStatus.Playing`, THEN do nothing.
2.  Retrieve the `CardEntity` corresponding to `cardId`.
3.  IF the card's `state` is `CardState.Flipped` or `CardState.Solved`, THEN do nothing.
4.  Update the card's `state` to `CardState.Flipped`.
5.  Add the card to the list of currently `flippedCards`.
6.  IF the number of `flippedCards` is 2:
    1.  Increment `moves` counter.
    2.  Retrieve the two `flippedCards`.
    3.  IF the `value` of the two `flippedCards` match:
        1.  Update the `state` of both `flippedCards` to `CardState.Solved`.
        2.  Clear the list of `flippedCards`.
        3.  Check if all cards are `CardState.Solved`. IF true, THEN set `gameStatus` to `GameStatus.Won`.
    4.  ELSE (values do not match):
        1.  After `config.matchDelayMs` delay:
            1.  Update the `state` of both `flippedCards` back to `CardState.Covered`.
            2.  Clear the list of `flippedCards`.
**Side Effects**: Updates internal `cards`, `flippedCards`, `moves`, and `gameStatus` state. May trigger a delayed state change.

#### resetGame
**Contract**: Resets the game to its initial state, allowing a new game to begin.
**Signature**: `()` -> `void`
**Flow**:
1.  Stop the game timer.
2.  Call `initializeGame`.
**Side Effects**: Resets all game state and stops any active timers.

#### startGameTimer
**Contract**: Initiates the game timer, incrementing `timerSeconds` every second.
**Signature**: `()` -> `void`
**Flow**:
1.  IF `gameStatus` is `GameStatus.NotStarted` or `GameStatus.Paused`:
    1.  Set `gameStatus` to `GameStatus.Playing`.
    2.  Start a recurring process that increments `timerSeconds` by 1 every 1000 milliseconds.
**Side Effects**: Updates `timerSeconds` and `gameStatus`.

#### stopGameTimer
**Contract**: Halts the game timer.
**Signature**: `()` -> `void`
**Flow**:
1.  IF `gameStatus` is `GameStatus.Playing`:
    1.  Stop the recurring process that increments `timerSeconds`.
    2.  Set `gameStatus` to `GameStatus.Paused`.
**Side Effects**: Stops `timerSeconds` updates and updates `gameStatus`.

### 🚨 Constraints
- The `GameEngine` MUST ensure that only two cards can be in `CardState.Flipped` at any given time (excluding `CardState.Solved` cards).
- A card MUST NOT be flipped if its `state` is already `CardState.Flipped` or `CardState.Solved`.
- The `gridSize` MUST result in an even number of total cards to ensure all cards can form pairs.
- The `matchDelayMs` MUST be a positive integer.

### ✅ Acceptance Criteria
- When `initializeGame` is called, the `cards` array contains `gridSize[0] * gridSize[1]` cards, all `Covered`, with values forming pairs.
- When `flipCard` is called on a `Covered` card, its state changes to `Flipped`.
- When two `Flipped` cards match, their state changes to `Solved` and they remain visible.
- When two `Flipped` cards do not match, they return to `Covered` state after `matchDelayMs`.
- The `moves` counter increments only when a second card is flipped in a pair attempt.
- The `timerSeconds` increments by 1 every second when `startGameTimer` is active.
- `gameStatus` changes to `Won` when all cards are `Solved`.

### 🧪 Test Scenarios
- **Scenario: Initial Game State**
    - GIVEN `GameEngine` is initialized with `gridSize: [2,2]`.
    - WHEN `initializeGame` is called.
    - THEN `cards` contains 4 `CardEntity` objects, all `CardState.Covered`.
    - AND `moves` is 0.
    - AND `timerSeconds` is 0.
    - AND `gameStatus` is `GameStatus.NotStarted`.
- **Scenario: Successful Match**
    - GIVEN `GameEngine` is initialized and `gameStatus` is `GameStatus.Playing`.
    - AND two `Covered` cards (CardA, CardB) have matching `value`.
    - WHEN `flipCard(CardA.id)` is called.
    - AND `flipCard(CardB.id)` is called.
    - THEN `moves` increments by 1.
    - AND `CardA.state` and `CardB.state` eventually become `CardState.Solved`.
- **Scenario: Unsuccessful Match**
    - GIVEN `GameEngine` is initialized and `gameStatus` is `GameStatus.Playing`.
    - AND two `Covered` cards (CardX, CardY) have non-matching `value`.
    - WHEN `flipCard(CardX.id)` is called.
    - AND `flipCard(CardY.id)` is called.
    - THEN `moves` increments by 1.
    - AND after `config.matchDelayMs`, `CardX.state` and `CardY.state` eventually become `CardState.Covered`.
- **Scenario: Flipping a Solved Card**
    - GIVEN `GameEngine` is initialized and `gameStatus` is `GameStatus.Playing`.
    - AND a card (CardS) is in `CardState.Solved`.
    - WHEN `flipCard(CardS.id)` is called.
    - THEN `CardS.state` remains `CardState.Solved`.
    - AND `moves` does not increment.
- **Scenario: Game Win Condition**
    - GIVEN `GameEngine` is initialized and `gameStatus` is `GameStatus.Playing`.
    - AND all but one pair of cards are `Solved`.
    - WHEN the last matching pair is successfully flipped.
    - THEN `gameStatus` becomes `GameStatus.Won`.
- **Scenario: Timer Operation**
    - GIVEN `GameEngine` is initialized.
    - WHEN `startGameTimer` is called.
    - THEN `gameStatus` becomes `GameStatus.Playing`.
    - AND `timerSeconds` increments by 1 after 1 second.
    - WHEN `stopGameTimer` is called.
    - THEN `gameStatus` becomes `GameStatus.Paused`.
    - AND `timerSeconds` stops incrementing.