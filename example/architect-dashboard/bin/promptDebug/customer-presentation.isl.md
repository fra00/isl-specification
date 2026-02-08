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

Component: ./customer-logic
Signature:
export function fetchCustomers(page: number, pageSize: number, filters?: {
  status?: "ACTIVE" | "INACTIVE" | "PENDING" | null;
  searchQuery?: string | null;
}): {
  customers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
    billingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
    status: "ACTIVE" | "INACTIVE" | "PENDING";
    totalOrders: number;
    totalSpent: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  totalCount: number;
};

export function fetchCustomerProfile(customerId: string): {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
  billingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
};

export function updateCustomerProfile(customerId: string, updates: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  shippingAddress?: { street?: string; city?: string; state?: string; zipCode?: string; country?: string; } | null;
  billingAddress?: { street?: string; city?: string; state?: string; zipCode?: string; country?: string; } | null;
  status?: "ACTIVE" | "INACTIVE" | "PENDING" | null;
}): {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
  billingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
};

export function deactivateCustomer(customerId: string): {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
  billingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
};

<!-- BUILD CONTEXT FOR: customer-presentation.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./customer-presentation -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- START DEPENDENCY INTERFACE: customer-logic.ref.md -->
<!-- INTERFACE (REF) FOR: customer-logic.isl.md -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./customer-logic -->
**Implementation**: ./customer-logic

> **Reference**: Concepts/Capabilities in `./domain.isl.md`

## Component: CustomerLogic
### Role: Business Logic
**Description**: Manages business logic for customer data, including fetching customer profiles and managing customer-related actions.

### ⚡ Capabilities

#### `fetchCustomers`
**Contract**: Retrieves a paginated list of customer profiles, optionally filtered.
**Signature**: `(page: number, pageSize: number, filters?: object) => { customers: > Customer in ./domain.isl.md[], totalCount: number }`
#### `fetchCustomerProfile`
**Contract**: Retrieves a single customer's detailed profile by their unique identifier.
**Signature**: `(customerId: string) => > Customer in ./domain.isl.md`
#### `updateCustomerProfile`
**Contract**: Updates an existing customer's information.
**Signature**: `(customerId: string, updates: object) => > Customer in ./domain.isl.md`
#### `deactivateCustomer`
**Contract**: Marks a customer's profile as inactive, preventing further active interactions.
**Signature**: `(customerId: string) => > Customer in ./domain.isl.md`
<!-- END DEPENDENCY INTERFACE -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./customer-presentation

> **Reference**: Concepts/Capabilities in `./customer-logic.isl.md`

## Component: CustomerPresentation
### Role: Presentation
**Description**: Contains UI components for displaying customer lists, detailed customer profiles, and customer interaction tools.
**Signature**:
- `initialPage`: `Number` (Optional, default 1) - The initial page number for the customer list.
- `pageSize`: `Number` (Optional, default 10) - The number of customers per page.

### 🔍 Appearance
The component presents a two-pane layout:
- A left pane displays a paginated list of customers with search and filter capabilities.
- A right pane displays the detailed profile of the currently selected customer.
- Loading indicators are displayed during data fetching operations.
- Error messages are displayed for failed operations.

### 📦 Content
The `CustomerPresentation` component is composed of:
- `CustomerListView`: Displays a table or list of customers, including pagination controls, search input, and sorting options. Each item in the list is selectable.
- `CustomerDetailView`: Displays comprehensive information for a single customer, including personal details, contact information, order history summary, and an option to edit the profile.

### ⚡ Capabilities

#### displayCustomerList
**Contract**: Renders a paginated list of customers based on current filters and page settings.
**Signature**:
- Input: `page: Number`, `pageSize: Number`, `searchQuery: String` (Optional), `sortField: String` (Optional), `sortOrder: 'asc' | 'desc'` (Optional)
- Output: None
**Flow**:
1.  The component requests customer data from `CustomerLogic` using `fetchCustomers`, passing the current `page`, `pageSize`, `searchQuery`, `sortField`, and `sortOrder`.
2.  Upon receiving customer data, the `CustomerListView` component updates its display to show the new list of customers and total count.
3.  If an error occurs during data fetching, an appropriate error message is displayed in the `CustomerListView`.
**Side Effects**: The `CustomerListView` component's content is updated.

#### displayCustomerDetail
**Contract**: Renders the detailed profile for a specific customer.
**Signature**:
- Input: `customerId: String`
- Output: None
**Flow**:
1.  The component requests customer data from `CustomerLogic` for the specified `customerId`.
2.  Upon receiving the customer's detailed profile, the `CustomerDetailView` component updates its display to show all relevant information.
3.  If the `customerId` is invalid or the customer is not found, an appropriate message is displayed in the `CustomerDetailView`.
4.  If an error occurs during data fetching, an appropriate error message is displayed.
**Side Effects**: The `CustomerDetailView` component's content is updated.

#### handleCustomerSelection
**Contract**: Responds to a user selecting a customer from the list, triggering the display of their detailed profile.
**Signature**:
- Input: `selectedCustomerId: String`
- Output: None
**Flow**:
1.  The `CustomerListView` component dispatches an event containing the `selectedCustomerId`.
2.  The `CustomerPresentation` component receives this event.
3.  The `CustomerPresentation` component triggers the `displayCustomerDetail` capability, passing the `selectedCustomerId`.
**Side Effects**: The `CustomerDetailView` component is updated to show the selected customer's details.

#### handleCustomerProfileUpdate
**Contract**: Allows a user to submit changes to a customer's profile.
**Signature**:
- Input: `customerId: String`, `updates: Object` (key-value pairs of fields to update)
- Output: None
**Flow**:
1.  The `CustomerDetailView` component receives user input for profile updates.
2.  The `CustomerDetailView` component performs client-side validation on the `updates`.
3.  If validation passes, the `CustomerDetailView` dispatches an event containing the `customerId` and `updates`.
4.  The `CustomerPresentation` component receives this event.
5.  The `CustomerPresentation` component requests `CustomerLogic` to update the customer profile, passing the `customerId` and `updates`.
6.  Upon successful update, a success notification is displayed, and the `displayCustomerDetail` capability is triggered for the `customerId` to refresh the view.
7.  If the update fails, an error message is displayed.
**Side Effects**: Customer data is potentially modified via `CustomerLogic`. The `CustomerDetailView` is refreshed.

#### handlePaginationChange
**Contract**: Adjusts the displayed customer list based on user interaction with pagination controls.
**Signature**:
- Input: `newPage: Number`, `newSize: Number` (Optional)
- Output: None
**Flow**:
1.  The `CustomerListView` component dispatches an event when the user changes the page number or page size.
2.  The `CustomerPresentation` component receives this event.
3.  The `CustomerPresentation` component triggers the `displayCustomerList` capability with the `newPage` and `newSize`.
**Side Effects**: The `CustomerListView` component's content is updated.

#### handleSearchAndFilter
**Contract**: Filters the customer list based on a user-provided search query or filter criteria.
**Signature**:
- Input: `searchQuery: String`, `filterCriteria: Object` (Optional)
- Output: None
**Flow**:
1.  The `CustomerListView` component dispatches an event when the user submits a search query or applies filters.
2.  The `CustomerPresentation` component receives this event.
3.  The `CustomerPresentation` component triggers the `displayCustomerList` capability, including the `searchQuery` and `filterCriteria`, resetting the page to 1.
**Side Effects**: The `CustomerListView` component's content is updated.

### 🚨 Constraints
*   The `CustomerListView` MUST always display a loading indicator when `displayCustomerList` is in progress.
*   The `CustomerDetailView` MUST always display a loading indicator when `displayCustomerDetail` is in progress.
*   All user input fields for customer profile updates MUST include client-side validation before requesting an update from `CustomerLogic`.
*   The `CustomerPresentation` MUST respect the pagination capabilities of `> **Reference**: fetchCustomers in ./customer-logic.isl.md`.
*   Sensitive customer information (e.g., full payment details) MUST NOT be displayed directly in the UI without explicit authorization and masking.

### ✅ Acceptance Criteria
*   Users can view a paginated list of all customers.
*   Users can search and filter the customer list by various criteria (e.g., name, email).
*   Users can select a customer from the list to view their detailed profile.
*   The detailed customer profile displays all relevant information.
*   Users can edit and save changes to a customer's profile.
*   The UI provides clear feedback for loading states, successful operations, and errors.
*   Pagination controls (next/previous page, page number, page size selector) are functional and update the list correctly.