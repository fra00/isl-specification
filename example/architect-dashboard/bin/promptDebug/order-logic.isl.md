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



<!-- BUILD CONTEXT FOR: order-logic.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./order-logic -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./order-logic

## Component: OrderLogic
### Role: Business Logic
**Signature**:
- No direct constructor arguments. Operates on data provided via its capabilities.

### ⚡ Capabilities

#### `fetchOrders`
- **Contract**: Retrieves a collection of orders based on specified criteria.
- **Signature**:
  - **Input**:
    - `filters`: Optional object containing criteria such as `status` (> **Reference**: `OrderStatus` in `./domain.isl.md`), `customerId`, `dateRange`.
    - `pagination`: Optional object containing `page` (number) and `pageSize` (number).
  - **Output**:
    - `orders`: An array of `Order` objects (> **Reference**: `Order` in `./domain.isl.md`).
    - `totalCount`: The total number of orders matching the filters, regardless of pagination.
- **Flow**:
  1.  Receive filtering and pagination parameters.
  2.  Query the underlying data store for orders that match the provided `filters`.
  3.  Apply `pagination` to the results.
  4.  Return the paginated list of `Order` objects and the `totalCount`.
- **Side Effects**: None.

#### `fetchOrderById`
- **Contract**: Retrieves a single order by its unique identifier.
- **Signature**:
  - **Input**:
    - `orderId`: A unique identifier for the order (string).
  - **Output**:
    - `order`: The requested `Order` object (> **Reference**: `Order` in `./domain.isl.md`), or null if not found.
- **Flow**:
  1.  Receive the `orderId`.
  2.  Query the underlying data store for an order matching the `orderId`.
  3.  Return the found `Order` object or indicate its absence.
- **Side Effects**: None.

#### `updateOrderStatus`
- **Contract**: Modifies the status of an existing order.
- **Signature**:
  - **Input**:
    - `orderId`: The unique identifier of the order to update (string).
    - `newStatus`: The desired new status for the order (> **Reference**: `OrderStatus` in `./domain.isl.md`).
  - **Output**:
    - `updatedOrder`: The `Order` object (> **Reference**: `Order` in `./domain.isl.md`) with its new status, or an error if the update fails.
- **Flow**:
  1.  Receive the `orderId` and `newStatus`.
  2.  Retrieve the existing order using `orderId`.
  3.  Validate that the `newStatus` is a valid transition from the current order status.
  4.  Update the order's status to `newStatus`.
  5.  Persist the updated order information to the data store.
  6.  Return the `updatedOrder`.
- **Side Effects**:
  - Modifies the status of an `Order` in the data store.
  - May trigger notifications or other downstream processes depending on the status change (e.g., "Shipped" status might trigger shipping notifications).

#### `processOrderReturn`
- **Contract**: Initiates or processes a return for specific items within an order or the entire order.
- **Signature**:
  - **Input**:
    - `orderId`: The unique identifier of the order (string).
    - `itemsToReturn`: An array of objects, each specifying `productId` (string) and `quantity` (number) to be returned.
    - `returnReason`: A descriptive string explaining the reason for the return.
  - **Output**:
    - `returnConfirmation`: An object containing `orderId`, `returnedItems` (list of items successfully marked for return), and `refundAmount` (number).
- **Flow**:
  1.  Receive `orderId`, `itemsToReturn`, and `returnReason`.
  2.  Retrieve the existing order using `orderId`.
  3.  Validate that the specified `itemsToReturn` exist within the order and their quantities are available for return.
  4.  Calculate the `refundAmount` based on the returned items and original purchase prices.
  5.  Update the order's internal state to reflect the returned items (e.g., adjust item quantities, mark items as returned).
  6.  Persist the updated order information.
  7.  Generate a `returnConfirmation` record.
  8.  Return the `returnConfirmation`.
- **Side Effects**:
  - Modifies the state of an `Order` in the data store.
  - May trigger a financial refund process.
  - May update inventory levels for returned products.

### 🚨 Constraints
- An order's status MUST only transition to valid subsequent states (e.g., "Pending" -> "Processing", "Processing" -> "Shipped" or "Cancelled", but not "Shipped" -> "Pending").
- A return MUST NOT be processed for items that have already been returned or for quantities exceeding what was originally purchased and not yet returned.
- All order updates MUST maintain data integrity and consistency across related entities.

### ✅ Acceptance Criteria
- When `fetchOrders` is called with no filters, it MUST return all available orders, respecting pagination.
- When `fetchOrderById` is called with a valid `orderId`, it MUST return the corresponding `Order` object.
- When `updateOrderStatus` is called with a valid `orderId` and a valid `newStatus`, the order's status MUST be updated and reflected in subsequent `fetchOrderById` calls.
- When `processOrderReturn` is called with valid `orderId` and `itemsToReturn`, the system MUST record the return, update the order's state, and provide a `returnConfirmation` including the calculated `refundAmount`.
- Attempts to update an order with an invalid status transition MUST result in an error and MUST NOT alter the order's status.
- Attempts to process a return for invalid items or quantities MUST result in an error and MUST NOT alter the order's state.