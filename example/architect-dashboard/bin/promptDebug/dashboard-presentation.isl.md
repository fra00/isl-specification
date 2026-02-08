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

Component: ./dashboard-logic
Signature:
export function getDashboardSummaryKPIs(period: string): { totalSales: number; totalOrders: number; averageOrderValue: number; newCustomers: number };
export function getSalesTrendData(period: string, granularity: string): Array<{ date: string; sales: number }>;
export function getTopSellingProducts(period: string, limit: number): Array<{ productId: string; productName: string; totalQuantitySold: number; totalRevenue: number }>;
export function getOrderStatusDistribution(): Array<{ status: string; count: number; percentage: number }>;
export function getDashboardOverview(timeframe: string, startDate?: Date, endDate?: Date): { totalSales: number; totalOrders: number; averageOrderValue: number; newCustomers: number; salesTrendData: Array<{ date: Date; sales: number }>; orderStatusDistribution: Array<{ status: string; count: number }>; topSellingProducts: Array<{ productId: string; name: string; quantitySold: number; totalRevenue: number }>; recentOrders: Array<{ orderId: string; customerName: string; orderDate: Date; totalAmount: number; status: string }>; };

<!-- BUILD CONTEXT FOR: dashboard-presentation.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./dashboard-presentation -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- START DEPENDENCY INTERFACE: dashboard-logic.ref.md -->
<!-- INTERFACE (REF) FOR: dashboard-logic.isl.md -->
# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./dashboard-logic -->
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
<!-- END DEPENDENCY INTERFACE -->

<!-- SOURCE FILE TO IMPLEMENT -->
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