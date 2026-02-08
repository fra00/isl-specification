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