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