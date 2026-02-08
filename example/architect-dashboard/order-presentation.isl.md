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