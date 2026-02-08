# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
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
**Flow**:
1.  Display loading indicators for all dashboard widgets.
2.  Request dashboard overview data using `> **Reference**: getDashboardOverview in ./dashboard-logic.isl.md`, passing the currently selected `timeframe`, `startDate`, and `endDate`.
3.  Upon successful data retrieval:
    -   Update the `KPI Summary Cards` with `totalSales`, `totalOrders`, `averageOrderValue`, and `totalRevenue`.
    -   Render the `Sales Trend Chart` using `salesTrend` data.
    -   Render the `Order Status Distribution Chart` using `orderStatusDistribution` data.
    -   Populate the `Top Selling Products List` with `topSellingProducts` data.
    -   Populate the `Recent Orders List` with `recentOrders` data.
    -   Hide loading indicators.
4.  If data retrieval fails:
    -   Display an error message to the user.
    -   Hide loading indicators.
**Side Effects**: Updates the UI with fetched data or error messages.

#### HandleTimeframeSelection
**Contract**: Responds to user interaction with the timeframe selector, updating the dashboard's data display.
**Signature**:
- `selectedTimeframe`: `string` (e.g., "today", "last7days", "last30days", "custom")
- `startDate?`: `Date` (required if `selectedTimeframe` is "custom")
- `endDate?`: `Date` (required if `selectedTimeframe` is "custom")
**Flow**:
1.  Update the internal state to reflect the `selectedTimeframe` and, if applicable, `startDate` and `endDate`.
2.  Trigger the `onTimeframeChange` callback, passing the `selectedTimeframe`, `startDate`, and `endDate`.
3.  Initiate `LoadDashboardData` to refresh the dashboard content with data corresponding to the new timeframe.
**Side Effects**: Updates internal state, triggers `onTimeframeChange` prop, initiates data fetching.

#### HandleViewAllOrdersClick
**Contract**: Responds to the user clicking the "View All Orders" action in the Recent Orders List.
**Signature**: No direct arguments.
**Flow**:
1.  Trigger the `onViewAllOrders` callback.
**Side Effects**: Navigates the user to the full orders list.

#### HandleViewAllProductsClick
**Contract**: Responds to the user clicking the "View All Products" action in the Top Selling Products List.
**Signature**: No direct arguments.
**Flow**:
1.  Trigger the `onViewAllProducts` callback.
**Side Effects**: Navigates the user to the full products list.

### 🚨 Constraints
- The `Timeframe Selector` MUST visually indicate the currently active timeframe.
- All numerical data displayed (sales, orders, AOV, revenue) MUST be formatted appropriately for currency or count, ensuring readability and consistency.
- Chart visualizations MUST be responsive and adapt to different screen sizes.
- When `selectedTimeframe` is "custom", both `startDate` and `endDate` MUST be provided to `LoadDashboardData`.

### ✅ Acceptance Criteria
- The dashboard successfully loads and displays summary statistics, charts, and lists upon initial render.
- Changing the timeframe via the `Timeframe Selector` updates all dashboard widgets with relevant data.
- Loading indicators are shown while data is being fetched and hidden once data is available.
- Error messages are displayed clearly if data fetching fails.
- Clicking "View All Orders" triggers the `onViewAllOrders` callback.
- Clicking "View All Products" triggers the `onViewAllProducts` callback.
- All displayed data matches the output from `> **Reference**: getDashboardOverview in ./dashboard-logic.isl.md` for the selected timeframe.