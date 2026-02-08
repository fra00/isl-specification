# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./dashboard-logic

## Component: DashboardLogic
### Role: Business Logic
**Signature**: No direct constructor arguments. Capabilities are accessed directly.

### ⚡ Capabilities
#### `getDashboardSummaryKPIs`
- **Contract**: Retrieves key performance indicators (KPIs) for the dashboard, including total sales, total orders, average order value, and the count of new customers within a specified period.
- **Signature**:
  - Input:
    - `period`: `String` (e.g., "last30days", "last7days", "currentMonth", "currentYear")
  - Output:
    - `DashboardKPIs`:
      - `totalSales`: `Decimal`
      - `totalOrders`: `Integer`
      - `averageOrderValue`: `Decimal`
      - `newCustomers`: `Integer`
- **Flow**:
  1. Identify the start and end dates based on the `period` input.
  2. Retrieve all `> **Reference**: Order in ./domain.isl.md` entities that fall within the identified date range.
  3. Calculate `totalSales` by summing the `totalAmount` of all relevant `> **Reference**: Order in ./domain.isl.md` entities.
  4. Calculate `totalOrders` by counting the number of relevant `> **Reference**: Order in ./domain.isl.md` entities.
  5. Calculate `averageOrderValue` by dividing `totalSales` by `totalOrders`. If `totalOrders` is zero, `averageOrderValue` is zero.
  6. Retrieve all `> **Reference**: Customer in ./domain.isl.md` entities whose `creationDate` falls within the identified date range.
  7. Calculate `newCustomers` by counting the number of relevant `> **Reference**: Customer in ./domain.isl.md` entities.
  8. Return the calculated `DashboardKPIs`.
- **Side Effects**: None.

#### `getSalesTrendData`
- **Contract**: Provides sales data aggregated over a specified time granularity (e.g., daily, weekly, monthly) for a given period.
- **Signature**:
  - Input:
    - `period`: `String` (e.g., "last30days", "last12months")
    - `granularity`: `String` (e.g., "daily", "weekly", "monthly")
  - Output:
    - `SalesTrendData`: `Array` of `{ date: String, sales: Decimal }`
- **Flow**:
  1. Determine the start and end dates based on the `period` input.
  2. Retrieve all `> **Reference**: Order in ./domain.isl.md` entities within the determined date range.
  3. Aggregate the `totalAmount` of these `> **Reference**: Order in ./domain.isl.md` entities based on the `granularity` (e.g., sum sales for each day, week, or month).
  4. Format the aggregated data into an array of objects, each containing a date/period identifier and the corresponding total sales.
  5. Return the `SalesTrendData`.
- **Side Effects**: None.

#### `getTopSellingProducts`
- **Contract**: Identifies and lists the top N products based on their total sales quantity or revenue within a specified period.
- **Signature**:
  - Input:
    - `period`: `String` (e.g., "last30days", "allTime")
    - `limit`: `Integer` (maximum number of products to return)
  - Output:
    - `TopSellingProducts`: `Array` of `{ productId: String, productName: String, totalQuantitySold: Integer, totalRevenue: Decimal }`
- **Flow**:
  1. Determine the start and end dates based on the `period` input.
  2. Retrieve all `> **Reference**: Order in ./domain.isl.md` entities within the determined date range.
  3. For each `> **Reference**: Order in ./domain.isl.md`, iterate through its `items` to extract `> **Reference**: Product in ./domain.isl.md` information, quantity, and individual item revenue.
  4. Aggregate the total quantity sold and total revenue for each unique `> **Reference**: Product in ./domain.isl.md`.
  5. Sort the aggregated products by `totalRevenue` (or `totalQuantitySold` if revenue is equal) in descending order.
  6. Limit the result to the specified `limit`.
  7. Return the `TopSellingProducts` list.
- **Side Effects**: None.

#### `getOrderStatusDistribution`
- **Contract**: Calculates the count and percentage of orders for each `> **Reference**: OrderStatus in ./domain.isl.md`.
- **Signature**:
  - Input: None
  - Output:
    - `OrderStatusDistribution`: `Array` of `{ status: String, count: Integer, percentage: Decimal }`
- **Flow**:
  1. Retrieve all `> **Reference**: Order in ./domain.isl.md` entities.
  2. Count the total number of `> **Reference**: Order in ./domain.isl.md` entities.
  3. Group `> **Reference**: Order in ./domain.isl.md` entities by their `> **Reference**: Order.status in ./domain.isl.md`.
  4. For each `> **Reference**: OrderStatus in ./domain.isl.md`, calculate the count of orders and its percentage relative to the total number of orders.
  5. Return the `OrderStatusDistribution`.
- **Side Effects**: None.

#### `getDashboardOverview`
- **Contract**: Provides a comprehensive overview of key dashboard metrics, sales trends, top-selling products, order status distribution, and recent orders for a specified timeframe or custom date range.
- **Signature**:
  - Input:
    - `timeframe`: `String` (e.g., "today", "yesterday", "last7days", "last30days", "thisMonth", "lastMonth", "thisYear", "custom")
    - `startDate`: `Optional<Date>` (Required if `timeframe` is "custom")
    - `endDate`: `Optional<Date>` (Required if `timeframe` is "custom")
  - Output:
    - `DashboardOverview`:
      - `totalSales`: `Decimal`
      - `totalOrders`: `Integer`
      - `averageOrderValue`: `Decimal`
      - `newCustomers`: `Integer`
      - `salesTrendData`: `Array` of `{ date: Date, sales: Decimal }`
      - `orderStatusDistribution`: `Array` of `{ status: String, count: Integer }`
      - `topSellingProducts`: `Array` of `{ productId: String, name: String, quantitySold: Integer, totalRevenue: Decimal }`
      - `recentOrders`: `Array` of `{ orderId: String, customerName: String, orderDate: Date, totalAmount: Decimal, status: String }`
- **Flow**:
  1. Determine the effective `startDate` and `endDate` based on the `timeframe` input. If `timeframe` is "custom", use the provided `startDate` and `endDate`.
  2. Retrieve all `> **Reference**: Order in ./domain.isl.md` entities that fall within the determined `startDate` and `endDate`.
  3. Retrieve all `> **Reference**: Customer in ./domain.isl.md` entities whose `creationDate` falls within the determined `startDate` and `endDate`.
  4. **Calculate Summary KPIs**:
     a. Calculate `totalSales` by summing the `totalAmount` of all retrieved `> **Reference**: Order in ./domain.isl.md` entities.
     b. Calculate `totalOrders` by counting the number of retrieved `> **Reference**: Order in ./domain.isl.md` entities.
     c. Calculate `averageOrderValue` by dividing `totalSales` by `totalOrders`. If `totalOrders` is zero, `averageOrderValue` is zero.
  5. **Calculate New Customers**:
     a. Calculate `newCustomers` by counting the number of relevant `> **Reference**: Customer in ./domain.isl.md` entities.
  6. **Calculate Sales Trend Data**:
     a. Aggregate the `totalAmount` of retrieved `> **Reference**: Order in ./domain.isl.md` entities by day.
     b. Format the aggregated data into an array of objects, each containing a `Date` and the corresponding total sales (`sales`).
  7. **Calculate Order Status Distribution**:
     a. Group retrieved `> **Reference**: Order in ./domain.isl.md` entities by their `> **Reference**: Order.status in ./domain.isl.md`.
     b. For each `> **Reference**: OrderStatus in ./domain.isl.md`, calculate the count of orders.
     c. Format this into an array of objects, each containing `status` and `count`.
  8. **Calculate Top Selling Products**:
     a. Initialize an empty map to aggregate product sales and quantities.
     b. For each retrieved `> **Reference**: Order in ./domain.isl.md`, iterate through its `items`:
        i. Extract `productId`, `productName`, `quantity`, and `totalPrice` for each item.
        ii. Aggregate the total `quantity` (as `quantitySold`) and total `totalPrice` (as `totalRevenue`) for each unique `productId`.
     c. Convert the aggregated map into an array of objects, each with `productId`, `name` (from `productName`), `quantitySold`, and `totalRevenue`.
     d. Sort this array by `totalRevenue` in descending order.
  9. **Retrieve Recent Orders**:
     a. Sort the retrieved `> **Reference**: Order in ./domain.isl.md` entities by `orderDate` in descending order.
     b. Select a predefined number (e.g., 10 or 20) of the most recent orders from this sorted list.
     c. For each selected `> **Reference**: Order in ./domain.isl.md`, retrieve its associated `> **Reference**: Customer in ./domain.isl.md` to get `customerName`.
     d. Format this into an array of objects, each with `orderId`, `customerName`, `orderDate`, `totalAmount`, and `status`.
  10. Return the complete `DashboardOverview` object.
- **Side Effects**: None.

### 🚨 Constraints
- All date-based calculations MUST correctly handle time zones and daylight saving times to ensure accurate aggregation.
- Calculations involving currency (e.g., `totalSales`, `averageOrderValue`, `totalRevenue`, `sales`, `revenue`) MUST use a precise decimal type to prevent floating-point inaccuracies.
- When `totalOrders` is zero, `averageOrderValue` MUST be reported as zero, not an error or undefined value.
- When `timeframe` is "custom" for `getDashboardOverview`, both `startDate` and `endDate` MUST be provided.

### ✅ Acceptance Criteria
- When `getDashboardSummaryKPIs` is requested for "last30days", it MUST return accurate total sales, total orders, average order value, and new customer count for the preceding 30 full days.
- When `getSalesTrendData` is requested for "last12months" with "monthly" granularity, it MUST return an array of 12 entries, each representing a month's total sales.
- When `getTopSellingProducts` is requested with a `limit` of 5, it MUST return at most 5 products, ordered by their total revenue in descending order.
- When `getOrderStatusDistribution` is requested, the sum of all `percentage` values in the output MUST be 100% (allowing for minor floating-point rounding).
- When `getDashboardOverview` is requested with `timeframe` "last7days", all included metrics (`totalSales`, `totalOrders`, `averageOrderValue`, `newCustomers`, `salesTrendData`, `orderStatusDistribution`, `topSellingProducts`, `recentOrders`) MUST be accurately calculated for the preceding 7 days.
- When `getDashboardOverview` is requested with `timeframe` "custom" and valid `startDate`/`endDate`, the `topSellingProducts` array MUST contain items with `productId`, `name`, `quantitySold`, and `totalRevenue`.
- When `getDashboardOverview` is requested, the `recentOrders` array MUST contain the most recent orders within the specified timeframe, each with `orderId`, `customerName`, `orderDate`, `totalAmount`, and `status`.