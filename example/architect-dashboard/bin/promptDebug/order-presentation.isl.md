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

Component: ./order-logic
Signature:
export const OrderStatus: {
  PENDING: 'Pending';
  PROCESSING: 'Processing';
  SHIPPED: 'Shipped';
  DELIVERED: 'Delivered';
  CANCELLED: 'Cancelled';
  RETURNED: 'Returned';
};

export const OrderItem: (data: { productId: string; quantity: number; price: number; returnedQuantity?: number; }) => { productId: string; quantity: number; price: number; returnedQuantity: number; };

export const Order: (data: { id: string; customerId: string; status?: typeof OrderStatus[keyof typeof OrderStatus]; items?: Array<ReturnType<typeof OrderItem>>; totalAmount?: number; date?: string; }) => { id: string; customerId: string; status: typeof OrderStatus[keyof typeof OrderStatus]; items: Array<ReturnType<typeof OrderItem>>; totalAmount: number; date: string; };

export const ReturnConfirmation: (data: { orderId: string; returnedItems?: Array<{ productId: string; quantity: number; }>; refundAmount?: number; }) => { orderId: string; returnedItems: Array<{ productId: string; quantity: number; }>; refundAmount: number; };

export function fetchOrders(filters?: { status?: typeof OrderStatus[keyof typeof OrderStatus]; customerId?: string; dateRange?: { start: string; end: string; }; }, pagination?: { page?: number; pageSize?: number; }): Promise<{ orders: Array<ReturnType<typeof Order>>; totalCount: number; }>;

export function fetchOrderById(orderId: string): Promise<ReturnType<typeof Order> | null>;

export function updateOrderStatus(orderId: string, newStatus: typeof OrderStatus[keyof typeof OrderStatus]): Promise<ReturnType<typeof Order>>;

export function processOrderReturn(orderId: string, itemsToReturn: Array<{ productId: string; quantity: number; }>, returnReason: string): Promise<ReturnType<typeof ReturnConfirmation>>;

Component: ./domain
Signature:
export const ProductAvailabilityStatus: {
  IN_STOCK: 'IN_STOCK';
  OUT_OF_STOCK: 'OUT_OF_STOCK';
  LOW_STOCK: 'LOW_STOCK';
  DISCONTINUED: 'DISCONTINUED';
};

export const OrderStatus: {
  PENDING: 'PENDING';
  PROCESSING: 'PROCESSING';
  SHIPPED: 'SHIPPED';
  DELIVERED: 'DELIVERED';
  CANCELLED: 'CANCELLED';
  RETURNED: 'RETURNED';
};

export const PaymentStatus: {
  PENDING: 'PENDING';
  PAID: 'PAID';
  REFUNDED: 'REFUNDED';
  FAILED: 'FAILED';
};

export const CustomerStatus: {
  ACTIVE: 'ACTIVE';
  INACTIVE: 'INACTIVE';
  PENDING: 'PENDING';
};

export const UserRole: {
  ADMIN: 'ADMIN';
  EDITOR: 'EDITOR';
  VIEWER: 'VIEWER';
};

export const CustomerId: (value?: string) => string;

export const Address: (data?: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}) => {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export const Product: (data?: {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  category?: string;
  stockQuantity?: number;
  imageUrl?: string;
  availabilityStatus?: typeof ProductAvailabilityStatus[keyof typeof ProductAvailabilityStatus];
  createdAt?: Date;
  updatedAt?: Date;
}) => {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  stockQuantity: number;
  imageUrl: string;
  availabilityStatus: typeof ProductAvailabilityStatus[keyof typeof ProductAvailabilityStatus];
  createdAt: Date;
  updatedAt: Date;
};

export const OrderItem: (data?: {
  productId?: string;
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  subtotal?: number; // This will be calculated, but can be passed for initial data
}) => {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export const Order: (data?: {
  id?: string;
  customerId?: string;
  orderDate?: Date;
  status?: typeof OrderStatus[keyof typeof OrderStatus];
  totalAmount?: number;
  items?: Array<ReturnType<typeof OrderItem>>;
  shippingAddress?: string;
  billingAddress?: string;
  paymentStatus?: typeof PaymentStatus[keyof typeof PaymentStatus];
  createdAt?: Date;
  updatedAt?: Date;
}) => {
  id: string;
  customerId: string;
  orderDate: Date;
  status: typeof OrderStatus[keyof typeof OrderStatus];
  totalAmount: number;
  items: Array<ReturnType<typeof OrderItem>>;
  shippingAddress: string;
  billingAddress: string;
  paymentStatus: typeof PaymentStatus[keyof typeof PaymentStatus];
  createdAt: Date;
  updatedAt: Date;
};

export const Customer: (data?: {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  shippingAddress?: ReturnType<typeof Address>;
  billingAddress?: ReturnType<typeof Address>;
  status?: typeof CustomerStatus[keyof typeof CustomerStatus];
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: Date;
  updatedAt?: Date;
}) => {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: ReturnType<typeof Address>;
  billingAddress: ReturnType<typeof Address>;
  status: typeof CustomerStatus[keyof typeof CustomerStatus];
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
};

export const CustomerSummary: (data?: {
  id?: string;
  name?: string;
  email?: string;
  status?: typeof CustomerStatus[keyof typeof CustomerStatus];
}) => {
  id: string;
  name: string;
  email: string;
  status: typeof CustomerStatus[keyof typeof CustomerStatus];
};

export const CustomerProfile: (data?: {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: ReturnType<typeof Address>;
  status?: typeof CustomerStatus[keyof typeof CustomerStatus];
  totalOrders?: number;
  lastOrderDate?: Date | null;
}) => {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: ReturnType<typeof Address>;
  status: typeof CustomerStatus[keyof typeof CustomerStatus];
  totalOrders: number;
  lastOrderDate: Date | null;
};

export const CustomerFilter: (data?: {
  status?: typeof CustomerStatus[keyof typeof CustomerStatus] | null;
  searchQuery?: string | null;
}) => {
  status: typeof CustomerStatus[keyof typeof CustomerStatus] | null;
  searchQuery: string | null;
};

export const CustomerProfileUpdate: (data?: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  shippingAddress?: ReturnType<typeof Address> | null;
  billingAddress?: ReturnType<typeof Address> | null;
  status?: typeof CustomerStatus[keyof typeof CustomerStatus] | null;
}) => {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  shippingAddress: ReturnType<typeof Address> | null;
  billingAddress: ReturnType<typeof Address> | null;
  status: typeof CustomerStatus[keyof typeof CustomerStatus] | null;
};

export const User: (data?: {
  id?: string;
  username?: string;
  email?: string;
  role?: typeof UserRole[keyof typeof UserRole];
  lastLogin?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}) => {
  id: string;
  username: string;
  email: string;
  role: typeof UserRole[keyof typeof UserRole];
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

<!-- BUILD CONTEXT FOR: order-presentation.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./order-presentation -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- START DEPENDENCY INTERFACE: order-logic.ref.md -->
<!-- INTERFACE (REF) FOR: order-logic.isl.md -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./order-logic -->
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
<!-- END DEPENDENCY INTERFACE -->

<!-- START DEPENDENCY INTERFACE: domain.ref.md -->
<!-- INTERFACE (REF) FOR: domain.isl.md -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./domain -->
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
<!-- END DEPENDENCY INTERFACE -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./order-presentation

> **Reference**: Concepts/Capabilities in `./order-logic.isl.md`
> **Reference**: `Order`, `OrderStatus` in `./domain.isl.md`

## Component: OrderDashboardPage
### Role: Presentation
**Signature**:
- No direct constructor arguments. Manages its internal state for the current view.

### 🔍 Appearance
- A primary content area that dynamically renders either the `OrderListView` or the `OrderDetailView`.
- A consistent header or navigation bar that may include a title for the orders section and a mechanism to return to the order list when viewing details.

### 📦 Content
- Conditionally contains `OrderListView` when displaying the list of all orders.
- Conditionally contains `OrderDetailView` when displaying a specific order's details.

### ⚡ Capabilities
#### InitializeOrderDashboard
**Contract**: Prepares the order dashboard by fetching the initial list of orders and displaying them.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1.  Request the list of all orders from > **Reference**: `OrderLogic` in `./order-logic.isl.md`.
2.  Upon receiving the orders, update the internal state to display the `OrderListView` with the fetched data.
**Side Effects**:
- The `OrderListView` is rendered with the fetched orders.

#### NavigateToOrderDetails
**Contract**: Switches the view to display the comprehensive details of a specific order.
**Signature**:
- **Input**: `orderId: string` - The unique identifier of the order to display.
- **Output**: None
**Flow**:
1.  Request the specific order details for `orderId` from > **Reference**: `OrderLogic` in `./order-logic.isl.md`.
2.  Upon receiving the order details, update the internal state to set the `currentOrder` to the fetched order object.
3.  Render the `OrderDetailView` component, passing the `currentOrder` to it.
**Side Effects**:
- The `OrderDetailView` is rendered, replacing the `OrderListView`.

#### NavigateBackToList
**Contract**: Switches the view back to the order list from the detail view.
**Signature**:
- **Input**: None
- **Output**: None
**Flow**:
1.  Clear the `currentOrder` from the internal state.
2.  Render the `OrderListView` component, potentially re-fetching the list if necessary or using cached data.
**Side Effects**:
- The `OrderListView` is rendered, replacing the `OrderDetailView`.

---

## Component: OrderListView
### Role: Presentation
**Signature**:
- `orders: Array<Order>` - A collection of order objects to be displayed.

### 🔍 Appearance
- A tabular or grid layout presenting key information for each order (e.g., Order ID, Customer Name, Order Date, Total Amount, Current Status).
- Each row or card includes an interactive element (e.g., a button or clickable area) to navigate to the detailed view of that specific order.
- Supports pagination or infinite scrolling if the list of orders is extensive.

### 📦 Content
- A header row with descriptive column titles (e.g., "Order ID", "Customer", "Date", "Total", "Status", "Actions").
- Multiple data rows, each representing an individual > **Reference**: `Order` in `./domain.isl.md`.
- An interactive element (e.g., "View Details" button or link) within each order row/card.

### ⚡ Capabilities
#### RenderOrderList
**Contract**: Displays the provided list of orders in a structured and readable format.
**Signature**:
- **Input**: `orders: Array<Order>`
- **Output**: None
**Flow**:
1.  For each `order` in the `orders` array:
    1.  Construct a display row or card.
    2.  Populate the row/card with relevant order properties such as `order.id`, `order.customer.name`, `order.orderDate`, `order.totalAmount`, and `order.status`.
    3.  Integrate an interactive element (e.g., a button) labeled "View Details" that is associated with `order.id`.
**Side Effects**:
- The UI displays the collection of orders.

#### SelectOrder
**Contract**: Notifies the parent component that a specific order has been chosen for detailed viewing.
**Signature**:
- **Input**: `selectedOrderId: string` - The identifier of the order that the user selected.
- **Output**: None (triggers an event)
**Flow**:
1.  When a user activates the "View Details" element for an order, capture its `order.id`.
2.  Trigger the `NavigateToOrderDetails` capability on the parent `OrderDashboardPage` component, passing the `selectedOrderId`.
**Side Effects**:
- Initiates the transition to the order detail view.

---

## Component: OrderDetailView
### Role: Presentation
**Signature**:
- `order: Order` - The specific order object whose details are to be displayed.

### 🔍 Appearance
- A comprehensive layout presenting all available information for a single order.
- Distinct sections for order summary, customer information, shipping details, payment details, and a detailed list of ordered items.
- Integrates an `OrderStatusUpdateTool` component for managing the order's status.
- Includes a "Process Return" button to initiate return procedures.

### 📦 Content
- Display fields for core order attributes: `order.id`, `order.orderDate`, `order.totalAmount`, `order.status`.
- Customer information: `order.customer.name`, `order.customer.email`, `order.customer.phone`.
- Shipping details: `order.shippingAddress`.
- Payment information: `order.paymentMethod`, `order.paymentStatus`.
- A list of `order.items`, detailing `product.name`, `quantity`, `price`, and `subtotal` for each item.
- Contains the `OrderStatusUpdateTool` component, configured with the current order's ID and status.
- A button labeled "Process Return".

### ⚡ Capabilities
#### RenderOrderDetail
**Contract**: Displays the complete details of the provided order object.
**Signature**:
- **Input**: `order: Order`
- **Output**: None
**Flow**:
1.  Populate the various UI elements with the corresponding data from the `order` object.
2.  Render the `OrderStatusUpdateTool` component, providing it with `order.id` and `order.status`.
3.  Ensure the "Process Return" button is enabled and visible.
**Side Effects**:
- The UI displays the detailed information for the specified order.

#### RequestStatusUpdate
**Contract**: Forwards a request to update the order's status to the business logic layer.
**Signature**:
- **Input**: `orderId: string`, `newStatus: OrderStatus`
- **Output**: None
**Flow**:
1.  Pass the `orderId` and `newStatus` to > **Reference**: `OrderLogic` in `./order-logic.isl.md` to update the order status.
2.  Upon successful completion of the update, refresh the `OrderDetailView` to reflect the new status.
**Side Effects**:
- The order status is updated in the system.
- The `OrderDetailView` UI is refreshed to show the updated status.

#### RequestReturnProcessing
**Contract**: Initiates the process for returning items associated with the current order.
**Signature**:
- **Input**: `orderId: string`, `itemsToReturn: Array<{productId: string, quantity: number}>`
- **Output**: None
**Flow**:
1.  Present a confirmation prompt to the user to verify the return request.
2.  IF the user confirms the action:
    1.  Pass the `orderId` and the list of `itemsToReturn` to > **Reference**: `OrderLogic` in `./order-logic.isl.md` for processing the return.
    2.  Upon successful processing, display a confirmation message to the user and refresh the `OrderDetailView`.
    3.  IF the processing encounters an error, display an appropriate error message to the user.
**Side Effects**:
- A return operation is recorded and processed in the system.
- The `OrderDetailView` UI is updated or an error message is displayed.

---

## Component: OrderStatusUpdateTool
### Role: Presentation
**Signature**:
- `orderId: string` - The identifier of the order whose status is being managed.
- `currentStatus: OrderStatus` - The current status of the order.

### 🔍 Appearance
- A user interface element (e.g., a dropdown menu, radio buttons, or a series of action buttons) allowing selection of a new status.
- A confirmation button (e.g., "Update Status" or "Save") to apply the chosen status change.

### 📦 Content
- A text label indicating the "Current Status: [currentStatus]".
- A selection control (e.g., a dropdown menu) populated with valid subsequent > **Reference**: `OrderStatus` in `./domain.isl.md` values, based on the `currentStatus`.
- A button labeled "Update Status".

### ⚡ Capabilities
#### UpdateStatusSelection
**Contract**: Handles user interaction when a new status is selected from the available options.
**Signature**:
- **Input**: `selectedStatus: OrderStatus` - The status chosen by the user.
- **Output**: None
**Flow**:
1.  Update the internal state of the component to store the `selectedStatus`.
2.  Enable the "Update Status" button, making it actionable.
**Side Effects**:
- The UI visually reflects the user's selected status.

#### ConfirmStatusUpdate
**Contract**: Triggers the actual request to update the order's status by notifying the parent component.
**Signature**:
- **Input**: None
- **Output**: None (triggers an event)
**Flow**:
1.  When the "Update Status" button is activated by the user:
    1.  Retrieve the `orderId` and the currently `selectedStatus` from the component's internal state.
    2.  Trigger the `RequestStatusUpdate` capability on the parent `OrderDetailView` component, passing these values.
**Side Effects**:
- Initiates the order status update process through the parent component.