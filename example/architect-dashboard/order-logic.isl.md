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