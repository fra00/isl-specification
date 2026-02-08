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



<!-- BUILD CONTEXT FOR: product-logic.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./product-logic -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./product-logic

## Component: ProductLogic
### Role: Business Logic

### ⚡ Capabilities

#### FetchAllProducts
- **Contract**: Retrieves a list of all products available in the system.
- **Signature**:
    - Input: None
    - Output: `List<Product>`
- **Flow**:
    1.  The system requests all product records.
    2.  The system compiles the retrieved records into a list of `Product` objects.
- **Side Effects**: None.

#### FetchProductById
- **Contract**: Retrieves a single product by its unique identifier.
- **Signature**:
    - Input: `productId: ProductId`
    - Output: `Product | null` (returns `null` if no product is found with the given ID)
- **Flow**:
    1.  The system searches for a product record matching the provided `productId`.
    2.  If a matching record is found, the system constructs a `Product` object.
    3.  If no matching record is found, the system indicates absence.
- **Side Effects**: None.

#### AddProduct
- **Contract**: Creates a new product record in the system.
- **Signature**:
    - Input: `productDetails: { name: String, description: String, price: Decimal, stock: Integer, category: String, imageUrl: String }` (all fields of `Product` > **Reference**: `Product` in `./domain.isl.md` except `id`)
    - Output: `Product` (the newly created product, including its generated `id`)
- **Flow**:
    1.  The system validates the `productDetails` against business rules.
    2.  If validation passes, the system generates a unique `ProductId`.
    3.  The system persists a new product record using the provided details and the generated `ProductId`.
    4.  The system returns the complete `Product` object.
- **Side Effects**: A new product record is added to the system's persistent storage.

#### UpdateProduct
- **Contract**: Modifies an existing product's details.
- **Signature**:
    - Input: `productId: ProductId`, `updateDetails: { name?: String, description?: String, price?: Decimal, stock?: Integer, category?: String, imageUrl?: String }` (partial fields of `Product` > **Reference**: `Product` in `./domain.isl.md`)
    - Output: `Product` (the updated product)
- **Flow**:
    1.  The system locates the existing product record using `productId`.
    2.  If the product is found, the system validates the `updateDetails` against business rules.
    3.  If validation passes, the system applies the changes to the product record.
    4.  The system persists the modified product record.
    5.  The system returns the complete, updated `Product` object.
- **Side Effects**: An existing product record in the system's persistent storage is modified.

#### DeleteProduct
- **Contract**: Removes a product record from the system.
- **Signature**:
    - Input: `productId: ProductId`
    - Output: `boolean` (true if deletion was successful, false otherwise)
- **Flow**:
    1.  The system locates the existing product record using `productId`.
    2.  If the product is found, the system removes the product record.
    3.  The system confirms the outcome of the deletion attempt.
- **Side Effects**: An existing product record is removed from the system's persistent storage.

### 🚨 Constraints

- **Constraint 1**: Product names MUST be unique across all active products.
- **Constraint 2**: Product `price` MUST be a positive decimal value.
- **Constraint 3**: Product `stock` MUST be a non-negative integer.
- **Constraint 4**: An `AddProduct` operation MUST fail if any required `productDetails` are missing or invalid.
- **Constraint 5**: An `UpdateProduct` or `DeleteProduct` operation MUST only proceed if the specified `productId` corresponds to an existing product.

### ✅ Acceptance Criteria

- **AC 1**: The system successfully retrieves a list of all products when `FetchAllProducts` is requested.
- **AC 2**: The system successfully retrieves a specific product when `FetchProductById` is requested with a valid `productId`.
- **AC 3**: The system returns `null` when `FetchProductById` is requested with a `productId` that does not exist.
- **AC 4**: The system successfully adds a new product and returns the complete product object with a generated ID when `AddProduct` is requested with valid details.
- **AC 5**: The system rejects an `AddProduct` request if the product name already exists, or if `price` or `stock` are invalid, and provides an appropriate indication of failure.
- **AC 6**: The system successfully updates an existing product's details and returns the updated product object when `UpdateProduct` is requested with a valid `productId` and valid `updateDetails`.
- **AC 7**: The system rejects an `UpdateProduct` request if the `productId` does not exist, or if `updateDetails` contain invalid values (e.g., negative price), and provides an appropriate indication of failure.
- **AC 8**: The system successfully deletes an existing product when `DeleteProduct` is requested with a valid `productId`, and returns `true`.
- **AC 9**: The system returns `false` when `DeleteProduct` is requested with a `productId` that does not exist.