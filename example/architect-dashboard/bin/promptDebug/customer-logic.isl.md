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

<!-- BUILD CONTEXT FOR: customer-logic.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./customer-logic -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

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
**Implementation**: ./customer-logic

> **Reference**: Concepts/Capabilities in `./domain.isl.md`

## Component: CustomerLogic
### Role: Business Logic
**Description**: Manages business logic for customer data, including fetching customer profiles and managing customer-related actions.

### ⚡ Capabilities

#### `fetchCustomers`
**Contract**: Retrieves a paginated list of customer profiles, optionally filtered.
**Signature**: `(page: number, pageSize: number, filters?: object) => { customers: > Customer in ./domain.isl.md[], totalCount: number }`
**Flow**:
1.  Request customer data from the underlying data store.
2.  Apply pagination based on `page` and `pageSize`.
3.  Apply any provided `filters` to the customer data.
4.  Count the total number of customers matching the filters, ignoring pagination.
5.  Return the list of `Customer` objects and the `totalCount`.
**Side Effects**: None directly observable by other components; interacts with data persistence.

#### `fetchCustomerProfile`
**Contract**: Retrieves a single customer's detailed profile by their unique identifier.
**Signature**: `(customerId: string) => > Customer in ./domain.isl.md`
**Flow**:
1.  Request a specific customer's data using the `customerId`.
2.  IF the customer is not found THEN indicate an error.
3.  Return the `Customer` object.
**Side Effects**: None.

#### `updateCustomerProfile`
**Contract**: Updates an existing customer's information.
**Signature**: `(customerId: string, updates: object) => > Customer in ./domain.isl.md`
**Flow**:
1.  Validate the `updates` data against the expected structure for a `Customer` profile.
2.  Locate the customer by `customerId`.
3.  IF the customer is not found THEN indicate an error.
4.  Apply the `updates` to the customer's profile.
5.  Persist the updated customer data in the data store.
6.  Return the updated `Customer` object.
**Side Effects**: Modifies customer data in the data store.

#### `deactivateCustomer`
**Contract**: Marks a customer's profile as inactive, preventing further active interactions.
**Signature**: `(customerId: string) => > Customer in ./domain.isl.md`
**Flow**:
1.  Locate the customer by `customerId`.
2.  IF the customer is not found THEN indicate an error.
3.  Update the customer's status to 'inactive'.
4.  Persist the change in the data store.
5.  Return the updated `Customer` object.
**Side Effects**: Modifies customer data in the data store, changing their active status.

### 🚨 Constraints
*   All customer data operations MUST respect data privacy regulations.
*   `customerId` MUST be a unique identifier for each customer.
*   When updating a customer profile, all provided `updates` MUST be valid fields for a `Customer` entity.
*   `fetchCustomers` MUST support pagination to prevent excessive data transfer.

### ✅ Acceptance Criteria
*   A request to `fetchCustomers` with valid `page` and `pageSize` parameters returns a list of customers and the total count.
*   A request to `fetchCustomerProfile` with a valid `customerId` returns the corresponding customer's detailed profile.
*   A request to `fetchCustomerProfile` with an invalid `customerId` results in an error indicating the customer was not found.
*   A request to `updateCustomerProfile` with a valid `customerId` and valid `updates` successfully modifies the customer's data and returns the updated profile.
*   A request to `updateCustomerProfile` with an invalid `customerId` or invalid `updates` results in an appropriate error.
*   A request to `deactivateCustomer` with a valid `customerId` successfully marks the customer as inactive and returns the updated profile.
*   A request to `deactivateCustomer` with an invalid `customerId` results in an error indicating the customer was not found.