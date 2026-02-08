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



<!-- BUILD CONTEXT FOR: dashboard-logic.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./dashboard-logic -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- SOURCE FILE TO IMPLEMENT -->
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