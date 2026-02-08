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

Component: ./dashboard-presentation
Signature:
export default function DashboardPresentation(props: {
    initialTimeframe?: string;
    onTimeframeChange?: (timeframe: string, startDate?: Date, endDate?: Date) => void;
    onViewAllOrders?: () => void;
    onViewAllProducts?: () => void;
}): React.Element;

Component: ./product-presentation
Signature:
export const Product: (data?: {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
}) => {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
};
export function GetAllProducts(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}>>;
export function GetProductById(productId: string): Promise<{
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
} | null>;
export function AddProduct(productDetails: {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
}): Promise<{
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}>;
export function UpdateProduct(productDetails: {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
}): Promise<{
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}>;
export function DeleteProduct(productId: string): Promise<boolean>;
export default function ProductManagementPage(): React.Element;

Component: ./order-presentation
Signature:
export default function OrderDashboardPage(): React.Element;

Component: ./customer-presentation
Signature:
export default function CustomerPresentation(props: { initialPage?: number; pageSize?: number }): React.Element;

<!-- BUILD CONTEXT FOR: main.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./main -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- START DEPENDENCY INTERFACE: dashboard-presentation.ref.md -->
<!-- INTERFACE (REF) FOR: dashboard-presentation.isl.md -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./dashboard-presentation -->
**Implementation**: ./dashboard-presentation

> **Reference**: Concepts/Capabilities in `./dashboard-logic.isl.md`

## Component: DashboardPresentation
### Role: Presentation
**Signature**:
- `initialTimeframe`: `string` (e.g., "today", "last7days", "last30days", "custom"). Defaults to "last7days".
- `onTimeframeChange`: `(timeframe: string, startDate?: Date, endDate?: Date) => void` - Callback triggered when the user selects a new timeframe.
- `onViewAllOrders`: `() => void` - Callback triggered when the user requests to view all recent orders.
- `onViewAllProducts`: `() => void` - Callback triggered when the user requests to view all top products.

### 🔍 Appearance
The dashboard presents a clean, responsive layout optimized for quick data consumption.
- **Header**: Contains the title "Dashboard Overview" and a timeframe selection component.
- **Summary Cards**: A row of prominent cards displaying key performance indicators (KPIs) at the top. Each card shows a metric, its value, and a small trend indicator if applicable.
- **Charts Section**: Below the summary cards, a section dedicated to visual data representation, typically occupying more horizontal space.
- **Lists Section**: Below the charts, two distinct panels displaying tabular data for recent activities and top performers.
- **Loading States**: Visual indicators (e.g., spinners, skeleton loaders) MUST be displayed while data is being fetched.
- **Empty States**: Clear messages MUST be displayed if no data is available for a selected timeframe.

### 📦 Content
The `DashboardPresentation` component is a container that orchestrates the display of several child components and data visualizations.
- **Timeframe Selector**: A UI element (e.g., dropdown, button group) allowing users to select predefined timeframes ("Today", "Last 7 Days", "Last 30 Days", "Custom Range").
- **KPI Summary Cards**:
    - `Total Sales Card`: Displays the total sales amount.
    - `Total Orders Card`: Displays the total number of orders.
    - `Average Order Value Card`: Displays the average value per order.
    - `Total Revenue Card`: Displays the total revenue generated.
- **Sales Trend Chart**: A line chart visualizing sales over the selected timeframe.
- **Order Status Distribution Chart**: A pie or donut chart showing the breakdown of orders by their status (e.g., "Pending", "Processing", "Shipped", "Delivered", "Cancelled").
- **Top Selling Products List**: A tabular display of the top N products by sales volume or revenue, including product name, quantity sold, and total revenue generated. Includes a "View All Products" action.
- **Recent Orders List**: A tabular display of the most recent orders, including order ID, customer name, order date, total amount, and status. Includes a "View All Orders" action.

### ⚡ Capabilities
#### LoadDashboardData
**Contract**: Initiates the process of fetching and displaying dashboard data for the currently selected timeframe.
**Signature**: No direct arguments.
#### HandleTimeframeSelection
**Contract**: Responds to user interaction with the timeframe selector, updating the dashboard's data display.
**Signature**:
- `selectedTimeframe`: `string` (e.g., "today", "last7days", "last30days", "custom")
- `startDate?`: `Date` (required if `selectedTimeframe` is "custom")
- `endDate?`: `Date` (required if `selectedTimeframe` is "custom")
#### HandleViewAllOrdersClick
**Contract**: Responds to the user clicking the "View All Orders" action in the Recent Orders List.
**Signature**: No direct arguments.
#### HandleViewAllProductsClick
**Contract**: Responds to the user clicking the "View All Products" action in the Top Selling Products List.
**Signature**: No direct arguments.
<!-- END DEPENDENCY INTERFACE -->

<!-- START DEPENDENCY INTERFACE: product-presentation.ref.md -->
<!-- INTERFACE (REF) FOR: product-presentation.isl.md -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./product-presentation -->
**Implementation**: ./product-presentation

## Component: ProductListDisplay
### Role: Presentation
**Signature**:
- `products: Array<Product>` (from `domain.isl.md`)
- `onProductSelected: Function(productId: string)`
- `onAddProductRequested: Function()`
- `onEditProductRequested: Function(productId: string)`
- `onDeleteProductRequested: Function(productId: string)`

### 🔍 Appearance
- A main title "Product Management".
- A table or grid layout to display product information.
- A button labeled "Add New Product" prominently displayed.
- Each product entry in the list includes:
    - Product Name
    - Price
    - Stock
    - Category
    - Action buttons: "View Details", "Edit", "Delete".

### 📦 Content
- Contains a `ProductTable` or `ProductGrid` component.
- Contains `Button` components for "Add New Product", "View Details", "Edit", and "Delete".

### ⚡ Capabilities
#### DisplayProducts
- **Contract**: Renders the provided list of products in a structured format.
- **Flow**:
    - FOR EACH `product` IN `products`:
        - Display `product.name`, `product.price`, `product.stock`, `product.category`.
        - Display "View Details", "Edit", and "Delete" buttons associated with the `product.id`.

#### SelectProduct
- **Contract**: Notifies the parent component when a product's "View Details" button is activated.
- **Flow**:
    - WHEN a user activates the "View Details" button for a specific product:
        - Trigger `onProductSelected` with the `productId` of the selected product.

#### RequestAddProduct
- **Contract**: Notifies the parent component when the "Add New Product" button is activated.
- **Flow**:
    - WHEN a user activates the "Add New Product" button:
        - Trigger `onAddProductRequested`.

#### RequestEditProduct
- **Contract**: Notifies the parent component when a product's "Edit" button is activated.
- **Flow**:
    - WHEN a user activates the "Edit" button for a specific product:
        - Trigger `onEditProductRequested` with the `productId` of the product to be edited.

#### RequestDeleteProduct
- **Contract**: Notifies the parent component when a product's "Delete" button is activated.
- **Flow**:
    - WHEN a user activates the "Delete" button for a specific product:
        - Trigger `onDeleteProductRequested` with the `productId` of the product to be deleted.

### ✅ Acceptance Criteria
- The component MUST display all products provided in the `products` array.
- Each product entry MUST clearly show its name, price, stock, and category.
- Activating the "View Details" button for any product MUST trigger `onProductSelected` with the correct `productId`.
- Activating the "Add New Product" button MUST trigger `onAddProductRequested`.
- Activating the "Edit" button for any product MUST trigger `onEditProductRequested` with the correct `productId`.
- Activating the "Delete" button for any product MUST trigger `onDeleteProductRequested` with the correct `productId`.

---

## Component: ProductDetailDisplay
### Role: Presentation
**Signature**:
- `product: Product` (from `domain.isl.md`)
- `onEditProductRequested: Function(productId: string)`
- `onDeleteProductRequested: Function(productId: string)`
- `onBackToListRequested: Function()`

### 🔍 Appearance
- A title displaying the product's name.
- A detailed view showing product attributes (ID, Name, Description, Price, Stock, Category).
- Buttons for "Edit Product", "Delete Product", and "Back to List".

### 📦 Content
- Contains `Text` or `Label` components for each product attribute.
- Contains `Button` components for "Edit Product", "Delete Product", and "Back to List".

### ⚡ Capabilities
#### DisplayProductDetails
- **Contract**: Renders the detailed information of a single product.
- **Flow**:
    - Display `product.id`, `product.name`, `product.description`, `product.price`, `product.stock`, `product.category`.

#### RequestEditProduct
- **Contract**: Notifies the parent component when the "Edit Product" button is activated.
- **Flow**:
    - WHEN a user activates the "Edit Product" button:
        - Trigger `onEditProductRequested` with `product.id`.

#### RequestDeleteProduct
- **Contract**: Notifies the parent component when the "Delete Product" button is activated.
- **Flow**:
    - WHEN a user activates the "Delete Product" button:
        - Trigger `onDeleteProductRequested` with `product.id`.

#### RequestBackToList
- **Contract**: Notifies the parent component when the "Back to List" button is activated.
- **Flow**:
    - WHEN a user activates the "Back to List" button:
        - Trigger `onBackToListRequested`.

### ✅ Acceptance Criteria
- The component MUST display all details of the `product` provided.
- Activating the "Edit Product" button MUST trigger `onEditProductRequested` with the correct `productId`.
- Activating the "Delete Product" button MUST trigger `onDeleteProductRequested` with the correct `productId`.
- Activating the "Back to List" button MUST trigger `onBackToListRequested`.

---

## Component: ProductForm
### Role: Presentation
**Signature**:
- `initialProductDetails: Optional<Product>` (from `domain.isl.md`) - for editing existing products.
- `onSubmit: Function(productDetails: Product)`
- `onCancel: Function()`

### 🔍 Appearance
- A form with input fields for:
    - Product Name (text input)
    - Description (textarea)
    - Price (numeric input)
    - Stock (integer input)
    - Category (dropdown or text input)
- Buttons for "Save" and "Cancel".
- Validation error messages displayed next to relevant fields if input is invalid.

### 📦 Content
- Contains `TextInput`, `TextArea`, `NumberInput`, `Select` (or `TextInput` for category) components.
- Contains `Button` components for "Save" and "Cancel".
- Contains `Text` components for displaying validation errors.

### ⚡ Capabilities
#### PopulateForm
- **Contract**: Fills the form fields with `initialProductDetails` if provided.
- **Flow**:
    - IF `initialProductDetails` is provided:
        - Set the value of the Name input to `initialProductDetails.name`.
        - Set the value of the Description input to `initialProductDetails.description`.
        - Set the value of the Price input to `initialProductDetails.price`.
        - Set the value of the Stock input to `initialProductDetails.stock`.
        - Set the value of the Category input to `initialProductDetails.category`.

#### SubmitForm
- **Contract**: Gathers input from the form, performs client-side validation, and triggers `onSubmit` with valid product data.
- **Flow**:
    - WHEN a user activates the "Save" button:
        - Collect values from all input fields.
        - Perform client-side validation:
            - IF Product Name is empty:
                - Display an error message "Product Name is required."
            - IF Price is not a positive decimal value:
                - Display an error message "Price must be a positive number."
                - > **Reference**: Constraint 2 in `./product-logic.isl.md`
            - IF Stock is not a non-negative integer:
                - Display an error message "Stock must be a non-negative integer."
                - > **Reference**: Constraint 3 in `./product-logic.isl.md`
        - IF all client-side validation passes:
            - Construct a `productDetails` object from the collected values.
            - Trigger `onSubmit` with the `productDetails` object.
        - ELSE (if validation fails):
            - Prevent `onSubmit` from being triggered.

#### CancelForm
- **Contract**: Notifies the parent component that the form submission was cancelled.
- **Flow**:
    - WHEN a user activates the "Cancel" button:
        - Trigger `onCancel`.

### 🚨 Constraints
- The Product Name input field MUST NOT be empty.
- The Price input field MUST only accept positive decimal numbers.
- The Stock input field MUST only accept non-negative integer numbers.
- The "Save" button MUST be disabled or prevent submission if client-side validation fails.

### ✅ Acceptance Criteria
- If `initialProductDetails` is provided, all form fields MUST be pre-filled with the corresponding product data.
- All required input fields (Name, Price, Stock) MUST be present.
- Activating the "Save" button with valid data MUST trigger `onSubmit` with the collected product details.
- Activating the "Save" button with an empty Product Name MUST display an error and NOT trigger `onSubmit`.
- Activating the "Save" button with a non-positive Price MUST display an error and NOT trigger `onSubmit`.
- Activating the "Save" button with a negative Stock MUST display an error and NOT trigger `onSubmit`.
- Activating the "Cancel" button MUST trigger `onCancel`.

---

## Component: ProductManagementPage
### Role: Business Logic
**Signature**:
- No direct input props, manages its own state.

### 📦 Content
- Conditionally displays `ProductListDisplay`, `ProductDetailDisplay`, or `ProductForm` based on internal state.

### ⚡ Capabilities
#### Initialize
- **Contract**: Sets up the initial state and loads the product list.
- **Flow**:
    - Set internal state `currentView` to 'list'.
    - Request all products from the backend logic (e.g., `product-logic.isl.md`'s `GetAllProducts`).
    - Update internal state `products` with the retrieved list.

#### ShowProductList
- **Contract**: Transitions the view to display the list of products.
- **Flow**:
    - Set internal state `currentView` to 'list'.
    - Request all products from the backend logic (e.g., `product-logic.isl.md`'s `GetAllProducts`).
    - Update internal state `products` with the retrieved list.
    - Clear internal state `selectedProductId` and `productDetailsForView`.

#### ShowProductDetails
- **Contract**: Transitions the view to display details for a specific product.
- **Signature**: `productId: string`
- **Flow**:
    - Set internal state `currentView` to 'details'.
    - Set internal state `selectedProductId` to the provided `productId`.
    - Request product details for `productId` from the backend logic (e.g., `product-logic.isl.md`'s `GetProductById`).
    - Update internal state `productDetailsForView` with the retrieved product.

#### ShowAddProductForm
- **Contract**: Transitions the view to display the form for adding a new product.
- **Flow**:
    - Set internal state `currentView` to 'add'.
    - Clear internal state `selectedProductId` and `productDetailsForView`.

#### ShowEditProductForm
- **Contract**: Transitions the view to display the form for editing an existing product.
- **Signature**: `productId: string`
- **Flow**:
    - Set internal state `currentView` to 'edit'.
    - Set internal state `selectedProductId` to the provided `productId`.
    - Request product details for `productId` from the backend logic (e.g., `product-logic.isl.md`'s `GetProductById`).
    - Update internal state `productDetailsForView` with the retrieved product.

#### HandleProductSelected
- **Contract**: Responds to a product selection from `ProductListDisplay`.
- **Signature**: `productId: string`
- **Flow**:
    - Initiate `ShowProductDetails` with `productId`.

#### HandleAddProductRequested
- **Contract**: Responds to a request to add a new product from `ProductListDisplay`.
- **Flow**:
    - Initiate `ShowAddProductForm`.

#### HandleEditProductRequested
- **Contract**: Responds to a request to edit a product from `ProductListDisplay` or `ProductDetailDisplay`.
- **Signature**: `productId: string`
- **Flow**:
    - Initiate `ShowEditProductForm` with `productId`.

#### HandleDeleteProductRequested
- **Contract**: Responds to a request to delete a product from `ProductListDisplay` or `ProductDetailDisplay`.
- **Signature**: `productId: string`
- **Flow**:
    - Initiate deletion of the product with `productId` via the backend logic (e.g., `product-logic.isl.md`'s `DeleteProduct`).
    - IF deletion is successful:
        - Initiate `ShowProductList` to refresh the product list.
    - ELSE:
        - Display an error message to the user.

#### HandleProductFormSubmit
- **Contract**: Processes product data submitted from `ProductForm`.
- **Signature**: `productDetails: Product`
- **Flow**:
    - IF internal state `currentView` is 'add':
        - Initiate creation of the new product with `productDetails` via the backend logic (e.g., `product-logic.isl.md`'s `AddProduct`).
        - IF creation is successful:
            - Initiate `ShowProductList`.
        - ELSE:
            - Display an error message to the user.
    - ELSE IF internal state `currentView` is 'edit':
        - Initiate update of the product with `productDetails` (including `selectedProductId`) via the backend logic (e.g., `product-logic.isl.md`'s `UpdateProduct`).
        - IF update is successful:
            - Initiate `ShowProductDetails` with `selectedProductId`.
        - ELSE:
            - Display an error message to the user.

#### HandleProductFormCancel
- **Contract**: Responds to the cancellation of `ProductForm`.
- **Flow**:
    - IF internal state `selectedProductId` is present (meaning the user was editing or viewing details before):
        - Initiate `ShowProductDetails` with `selectedProductId`.
    - ELSE (meaning the user was adding a new product or came directly from the list):
        - Initiate `ShowProductList`.

#### HandleBackToListRequested
- **Contract**: Responds to a request to return to the product list from `ProductDetailDisplay`.
- **Flow**:
    - Initiate `ShowProductList`.

### ✅ Acceptance Criteria
- The component MUST initially display the `ProductListDisplay` after `Initialize`.
- Selecting a product from `ProductListDisplay` MUST transition to `ProductDetailDisplay` for that product.
- Activating "Add New Product" from `ProductListDisplay` MUST transition to `ProductForm` for creation.
- Activating "Edit" from `ProductListDisplay` or `ProductDetailDisplay` MUST transition to `ProductForm` for editing the specific product.
- Activating "Delete" from `ProductListDisplay` or `ProductDetailDisplay` MUST remove the product and refresh the list.
- Submitting `ProductForm` for a new product MUST add it via backend logic and return to the product list.
- Submitting `ProductForm` for an existing product MUST update it via backend logic and return to its details view.
- Cancelling `ProductForm` MUST return to the previous view (either the product list or the product details).
- Activating "Back to List" from `ProductDetailDisplay` MUST return to the product list.
<!-- END DEPENDENCY INTERFACE -->

<!-- START DEPENDENCY INTERFACE: order-presentation.ref.md -->
<!-- INTERFACE (REF) FOR: order-presentation.isl.md -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./order-presentation -->
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
#### NavigateToOrderDetails
**Contract**: Switches the view to display the comprehensive details of a specific order.
**Signature**:
- **Input**: `orderId: string` - The unique identifier of the order to display.
- **Output**: None
#### NavigateBackToList
**Contract**: Switches the view back to the order list from the detail view.
**Signature**:
- **Input**: None
- **Output**: None
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
#### SelectOrder
**Contract**: Notifies the parent component that a specific order has been chosen for detailed viewing.
**Signature**:
- **Input**: `selectedOrderId: string` - The identifier of the order that the user selected.
- **Output**: None (triggers an event)
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
#### RequestStatusUpdate
**Contract**: Forwards a request to update the order's status to the business logic layer.
**Signature**:
- **Input**: `orderId: string`, `newStatus: OrderStatus`
- **Output**: None
#### RequestReturnProcessing
**Contract**: Initiates the process for returning items associated with the current order.
**Signature**:
- **Input**: `orderId: string`, `itemsToReturn: Array<{productId: string, quantity: number}>`
- **Output**: None
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
#### ConfirmStatusUpdate
**Contract**: Triggers the actual request to update the order's status by notifying the parent component.
**Signature**:
- **Input**: None
- **Output**: None (triggers an event)
<!-- END DEPENDENCY INTERFACE -->

<!-- START DEPENDENCY INTERFACE: customer-presentation.ref.md -->
<!-- INTERFACE (REF) FOR: customer-presentation.isl.md -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./customer-presentation -->
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
#### displayCustomerDetail
**Contract**: Renders the detailed profile for a specific customer.
**Signature**:
- Input: `customerId: String`
- Output: None
#### handleCustomerSelection
**Contract**: Responds to a user selecting a customer from the list, triggering the display of their detailed profile.
**Signature**:
- Input: `selectedCustomerId: String`
- Output: None
#### handleCustomerProfileUpdate
**Contract**: Allows a user to submit changes to a customer's profile.
**Signature**:
- Input: `customerId: String`, `updates: Object` (key-value pairs of fields to update)
- Output: None
#### handlePaginationChange
**Contract**: Adjusts the displayed customer list based on user interaction with pagination controls.
**Signature**:
- Input: `newPage: Number`, `newSize: Number` (Optional)
- Output: None
#### handleSearchAndFilter
**Contract**: Filters the customer list based on a user-provided search query or filter criteria.
**Signature**:
- Input: `searchQuery: String`, `filterCriteria: Object` (Optional)
- Output: None
<!-- END DEPENDENCY INTERFACE -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Concepts/Capabilities in `./dashboard-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./product-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./order-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./customer-presentation.isl.md`

## Component: MainApplication
### Role: Presentation
**Description**: The root component of the E-Commerce Dashboard, responsible for overall application layout, navigation, and rendering the active section (Dashboard, Products, Orders, Customers).
**Signature**:
- No direct input props. Manages internal navigation state.

### 🔍 Appearance
- A persistent navigation sidebar or header providing links to the main sections: "Dashboard", "Products", "Orders", "Customers".
- A main content area that dynamically displays the selected section's presentation component.
- The active navigation item MUST be visually highlighted.

### 📦 Content
- Contains a `Navigation` component (conceptual, not a specific ISL component) that provides links for:
    -   Dashboard
    -   Products
    -   Orders
    -   Customers
- Contains a conditional rendering area that displays one of the following components based on the current navigation state:
    -   `DashboardPresentation`
    -   `ProductManagementPage` > **Reference**: ProductManagementPage in `./product-presentation.isl.md`
    -   `OrderDashboardPage` > **Reference**: OrderDashboardPage in `./order-presentation.isl.md`
    -   `CustomerPresentation` > **Reference**: CustomerPresentation in `./customer-presentation.isl.md`

### ⚡ Capabilities
#### initializeApplication
**Contract**: Sets the initial view of the application, typically to the Dashboard.
**Signature**: No inputs.
**Flow**:
1.  Set the internal `currentView` state to "Dashboard".

#### navigateToDashboard
**Contract**: Switches the application's main content area to display the Dashboard.
**Signature**: No inputs.
**Flow**:
1.  Update the internal `currentView` state to "Dashboard".

#### navigateToProducts
**Contract**: Switches the application's main content area to display the Product Management section.
**Signature**: No inputs.
**Flow**:
1.  Update the internal `currentView` state to "Products".

#### navigateToOrders
**Contract**: Switches the application's main content area to display the Order Management section.
**Signature**: No inputs.
**Flow**:
1.  Update the internal `currentView` state to "Orders".

#### navigateToCustomers
**Contract**: Switches the application's main content area to display the Customer Management section.
**Signature**: No inputs.
**Flow**:
1.  Update the internal `currentView` state to "Customers".

#### handleDashboardViewAllOrders
**Contract**: Responds to a request from the Dashboard to view all orders by navigating to the Orders section.
**Signature**: No inputs.
**Flow**:
1.  Trigger `navigateToOrders`.

#### handleDashboardViewAllProducts
**Contract**: Responds to a request from the Dashboard to view all products by navigating to the Products section.
**Signature**: No inputs.
**Flow**:
1.  Trigger `navigateToProducts`.

#### renderActiveView
**Contract**: Renders the appropriate presentation component based on the current internal `currentView` state.
**Signature**: No inputs.
**Flow**:
BRANCH: [currentView]
-   IF `currentView` is "Dashboard":
    -   Render `DashboardPresentation`.
    -   Pass `onViewAllOrders` as `handleDashboardViewAllOrders`.
    -   Pass `onViewAllProducts` as `handleDashboardViewAllProducts`.
    -   (Note: `onTimeframeChange` and `initialTimeframe` are managed by `DashboardPresentation` itself or a higher-level logic component, not directly by `MainApplication`'s presentation role.)
-   IF `currentView` is "Products":
    -   Render `ProductManagementPage` > **Reference**: ProductManagementPage in `./product-presentation.isl.md`.
-   IF `currentView` is "Orders":
    -   Render `OrderDashboardPage` > **Reference**: OrderDashboardPage in `./order-presentation.isl.md`.
-   IF `currentView` is "Customers":
    -   Render `CustomerPresentation` > **Reference**: CustomerPresentation in `./customer-presentation.isl.md`.

### 🚨 Constraints
- The `MainApplication` MUST always display a navigation mechanism that allows switching between the main sections.
- Only one main section (Dashboard, Products, Orders, Customers) MUST be visible at any given time in the content area.
- The navigation item corresponding to the `currentView` MUST be visually distinct (e.g., highlighted, bolded).

### ✅ Acceptance Criteria
- When the application loads, the Dashboard view is displayed by default.
- Clicking on "Products" in the navigation switches the content area to display the `ProductManagementPage`.
- Clicking on "Orders" in the navigation switches the content area to display the `OrderDashboardPage`.
- Clicking on "Customers" in the navigation switches the content area to display the `CustomerPresentation`.
- Clicking "View All Orders" within the `DashboardPresentation` successfully navigates the user to the `OrderDashboardPage`.
- Clicking "View All Products" within the `DashboardPresentation` successfully navigates the user to the `ProductManagementPage`.