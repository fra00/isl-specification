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



<!-- BUILD CONTEXT FOR: product-presentation.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./product-presentation -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
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