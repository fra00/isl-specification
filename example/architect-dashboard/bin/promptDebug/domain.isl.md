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



<!-- BUILD CONTEXT FOR: domain.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./domain -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./domain

## Domain Concept: Product
### Role: Domain
**Description**: Represents a single product available for sale in the e-commerce system.

### 📦 Content/Structure
*   **id**: Unique identifier for the product. (Type: String)
*   **name**: Name of the product. (Type: String)
*   **description**: Detailed description of the product. (Type: String)
*   **price**: Current selling price of the product. (Type: Decimal)
*   **sku**: Stock Keeping Unit, a unique identifier for the product variant. (Type: String)
*   **category**: Category the product belongs to (e.g., "Electronics", "Apparel"). (Type: String)
*   **stockQuantity**: Number of units currently in stock. (Type: Integer)
*   **imageUrl**: URL to the primary image of the product. (Type: String)
*   **availabilityStatus**: Current availability status of the product. (Type: > **Reference**: ProductAvailabilityStatus in ./domain.isl.md)
*   **createdAt**: Timestamp when the product was first added. (Type: DateTime)
*   **updatedAt**: Timestamp of the last update to the product details. (Type: DateTime)

## Domain Concept: Order
### Role: Domain
**Description**: Represents a customer's purchase transaction.

### 📦 Content/Structure
*   **id**: Unique identifier for the order. (Type: String)
*   **customerId**: Identifier of the customer who placed the order. (Type: String)
*   **orderDate**: Date and time when the order was placed. (Type: DateTime)
*   **status**: Current status of the order. (Type: > **Reference**: OrderStatus in ./domain.isl.md)
*   **totalAmount**: Total monetary value of the order, including shipping and taxes. (Type: Decimal)
*   **items**: A list of products included in the order. (Type: List of > **Reference**: OrderItem in ./domain.isl.md)
*   **shippingAddress**: The address where the order is to be shipped. (Type: String)
*   **billingAddress**: The address associated with the payment method. (Type: String)
*   **paymentStatus**: Current status of the order's payment. (Type: > **Reference**: PaymentStatus in ./domain.isl.md)
*   **createdAt**: Timestamp when the order was created in the system. (Type: DateTime)
*   **updatedAt**: Timestamp of the last update to the order details or status. (Type: DateTime)

## Domain Concept: OrderItem
### Role: Domain
**Description**: Represents a single product item within an order.

### 📦 Content/Structure
*   **productId**: Identifier of the product purchased. (Type: String)
*   **productName**: Name of the product at the time of purchase. (Type: String)
*   **quantity**: Number of units of this product in the order. (Type: Integer)
*   **unitPrice**: Price of a single unit of the product at the time of purchase. (Type: Decimal)
*   **subtotal**: `quantity` * `unitPrice` for this item. (Type: Decimal)

## Domain Concept: Customer
### Role: Domain
**Description**: Represents a registered customer of the e-commerce system.

### 📦 Content/Structure
*   **id**: Unique identifier for the customer. (Type: > **Reference**: CustomerId)
*   **firstName**: Customer's first name. (Type: String)
*   **lastName**: Customer's last name. (Type: String)
*   **email**: Customer's primary email address. (Type: String)
*   **phoneNumber**: Customer's primary phone number. (Type: String)
*   **shippingAddress**: Default shipping address for the customer. (Type: > **Reference**: Address)
*   **billingAddress**: Default billing address for the customer. (Type: > **Reference**: Address)
*   **status**: Current account status of the customer. (Type: > **Reference**: CustomerStatus)
*   **totalOrders**: Total number of orders placed by the customer. (Type: Integer)
*   **totalSpent**: Total monetary amount spent by the customer across all orders. (Type: Decimal)
*   **createdAt**: Timestamp when the customer account was created. (Type: DateTime)
*   **updatedAt**: Timestamp of the last update to the customer's profile. (Type: DateTime)

## Domain Concept: CustomerId
### Role: Domain
**Description**: A unique identifier type for customers.

### 📦 Content/Structure
*   (Type: String)

## Domain Concept: CustomerStatus
### Role: Domain
**Description**: Enumeration of possible account statuses for a customer.

### 📦 Content/Structure
*   **ACTIVE**: Customer account is active and can place orders.
*   **INACTIVE**: Customer account is temporarily or permanently disabled.
*   **PENDING**: Customer account is awaiting activation or verification.

## Domain Concept: Address
### Role: Domain
**Description**: Represents a physical address.

### 📦 Content/Structure
*   **street**: Street name and house number. (Type: String)
*   **city**: City. (Type: String)
*   **state**: State or province. (Type: String)
*   **zipCode**: Postal or ZIP code. (Type: String)
*   **country**: Country. (Type: String)

## Domain Concept: CustomerSummary
### Role: Domain
**Description**: A lightweight representation of a customer, typically for lists or quick views.

### 📦 Content/Structure
*   **id**: Unique identifier for the customer. (Type: > **Reference**: CustomerId)
*   **name**: Full name of the customer. (Type: String)
*   **email**: Customer's primary email address. (Type: String)
*   **status**: Current account status of the customer. (Type: > **Reference**: CustomerStatus)

## Domain Concept: CustomerProfile
### Role: Domain
**Description**: A detailed representation of a customer's profile.

### 📦 Content/Structure
*   **id**: Unique identifier for the customer. (Type: > **Reference**: CustomerId)
*   **name**: Full name of the customer. (Type: String)
*   **email**: Customer's primary email address. (Type: String)
*   **phone**: Customer's primary phone number. (Type: String)
*   **address**: The customer's primary address. (Type: > **Reference**: Address)
*   **status**: Current account status of the customer. (Type: > **Reference**: CustomerStatus)
*   **totalOrders**: Total number of orders placed by the customer. (Type: Integer)
*   **lastOrderDate**: Date of the customer's last order. (Type: DateTime, Optional)

## Domain Concept: CustomerFilter
### Role: Domain
**Description**: Criteria for filtering a list of customers.

### 📦 Content/Structure
*   **status**: Filter by customer account status. (Type: > **Reference**: CustomerStatus, Optional)
*   **searchQuery**: General search term for customer name or email. (Type: String, Optional)

## Domain Concept: CustomerProfileUpdate
### Role: Domain
**Description**: Represents a partial update request for a customer's profile.

### 📦 Content/Structure
*   **firstName**: Customer's first name. (Type: String, Optional)
*   **lastName**: Customer's last name. (Type: String, Optional)
*   **email**: Customer's primary email address. (Type: String, Optional)
*   **phoneNumber**: Customer's primary phone number. (Type: String, Optional)
*   **shippingAddress**: Default shipping address for the customer. (Type: > **Reference**: Address, Optional)
*   **billingAddress**: Default billing address for the customer. (Type: > **Reference**: Address, Optional)
*   **status**: Current account status of the customer. (Type: > **Reference**: CustomerStatus, Optional)

## Domain Concept: User
### Role: Domain
**Description**: Represents an administrative user of the E-Commerce Dashboard.

### 📦 Content/Structure
*   **id**: Unique identifier for the user. (Type: String)
*   **username**: Unique username for login. (Type: String)
*   **email**: User's email address. (Type: String)
*   **role**: The administrative role assigned to the user. (Type: > **Reference**: UserRole in ./domain.isl.md)
*   **lastLogin**: Timestamp of the user's last successful login. (Type: DateTime)
*   **createdAt**: Timestamp when the user account was created. (Type: DateTime)
*   **updatedAt**: Timestamp of the last update to the user's profile. (Type: DateTime)

## Domain Concept: OrderStatus
### Role: Domain
**Description**: Enumeration of possible statuses for an order.

### 📦 Content/Structure
*   **PENDING**: Order has been placed but not yet processed.
*   **PROCESSING**: Order is being prepared for shipment.
*   **SHIPPED**: Order has left the warehouse.
*   **DELIVERED**: Order has been received by the customer.
*   **CANCELLED**: Order was cancelled before fulfillment.
*   **RETURNED**: Order items have been returned by the customer.

## Domain Concept: ProductAvailabilityStatus
### Role: Domain
**Description**: Enumeration of possible availability statuses for a product.

### 📦 Content/Structure
*   **IN_STOCK**: Product is readily available.
*   **OUT_OF_STOCK**: Product is currently unavailable.
*   **LOW_STOCK**: Product quantity is below a predefined threshold.
*   **DISCONTINUED**: Product is no longer offered for sale.

## Domain Concept: PaymentStatus
### Role: Domain
**Description**: Enumeration of possible payment statuses for an order.

### 📦 Content/Structure
*   **PENDING**: Payment has been initiated but not yet confirmed.
*   **PAID**: Payment has been successfully processed.
*   **REFUNDED**: Payment has been returned to the customer.
*   **FAILED**: Payment attempt was unsuccessful.

## Domain Concept: UserRole
### Role: Domain
**Description**: Enumeration of possible roles for an administrative user.

### 📦 Content/Structure
*   **ADMIN**: Full access to all dashboard features and settings.
*   **EDITOR**: Can create, update, and delete content (e.g., products, orders) but may have restricted access to settings or sensitive data.
*   **VIEWER**: Can view all data but cannot make any modifications.