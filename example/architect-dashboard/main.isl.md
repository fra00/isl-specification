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