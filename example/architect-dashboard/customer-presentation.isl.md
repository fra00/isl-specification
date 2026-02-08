# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./customer-presentation

> **Reference**: Concepts/Capabilities in `./customer-logic.isl.md`

## Component: CustomerPresentation
### Role: Presentation
**Description**: Contains UI components for displaying customer lists, detailed customer profiles, and customer interaction tools.
**Signature**:
- `initialPage`: `Number` (Optional, default 1) - The initial page number for the customer list.
- `pageSize`: `Number` (Optional, default 10) - The number of customers per page.

### 🔍 Appearance
The component presents a two-pane layout:
- A left pane displays a paginated list of customers with search and filter capabilities.
- A right pane displays the detailed profile of the currently selected customer.
- Loading indicators are displayed during data fetching operations.
- Error messages are displayed for failed operations.

### 📦 Content
The `CustomerPresentation` component is composed of:
- `CustomerListView`: Displays a table or list of customers, including pagination controls, search input, and sorting options. Each item in the list is selectable.
- `CustomerDetailView`: Displays comprehensive information for a single customer, including personal details, contact information, order history summary, and an option to edit the profile.

### ⚡ Capabilities

#### displayCustomerList
**Contract**: Renders a paginated list of customers based on current filters and page settings.
**Signature**:
- Input: `page: Number`, `pageSize: Number`, `searchQuery: String` (Optional), `sortField: String` (Optional), `sortOrder: 'asc' | 'desc'` (Optional)
- Output: None
**Flow**:
1.  The component requests customer data from `CustomerLogic` using `fetchCustomers`, passing the current `page`, `pageSize`, `searchQuery`, `sortField`, and `sortOrder`.
2.  Upon receiving customer data, the `CustomerListView` component updates its display to show the new list of customers and total count.
3.  If an error occurs during data fetching, an appropriate error message is displayed in the `CustomerListView`.
**Side Effects**: The `CustomerListView` component's content is updated.

#### displayCustomerDetail
**Contract**: Renders the detailed profile for a specific customer.
**Signature**:
- Input: `customerId: String`
- Output: None
**Flow**:
1.  The component requests customer data from `CustomerLogic` for the specified `customerId`.
2.  Upon receiving the customer's detailed profile, the `CustomerDetailView` component updates its display to show all relevant information.
3.  If the `customerId` is invalid or the customer is not found, an appropriate message is displayed in the `CustomerDetailView`.
4.  If an error occurs during data fetching, an appropriate error message is displayed.
**Side Effects**: The `CustomerDetailView` component's content is updated.

#### handleCustomerSelection
**Contract**: Responds to a user selecting a customer from the list, triggering the display of their detailed profile.
**Signature**:
- Input: `selectedCustomerId: String`
- Output: None
**Flow**:
1.  The `CustomerListView` component dispatches an event containing the `selectedCustomerId`.
2.  The `CustomerPresentation` component receives this event.
3.  The `CustomerPresentation` component triggers the `displayCustomerDetail` capability, passing the `selectedCustomerId`.
**Side Effects**: The `CustomerDetailView` component is updated to show the selected customer's details.

#### handleCustomerProfileUpdate
**Contract**: Allows a user to submit changes to a customer's profile.
**Signature**:
- Input: `customerId: String`, `updates: Object` (key-value pairs of fields to update)
- Output: None
**Flow**:
1.  The `CustomerDetailView` component receives user input for profile updates.
2.  The `CustomerDetailView` component performs client-side validation on the `updates`.
3.  If validation passes, the `CustomerDetailView` dispatches an event containing the `customerId` and `updates`.
4.  The `CustomerPresentation` component receives this event.
5.  The `CustomerPresentation` component requests `CustomerLogic` to update the customer profile, passing the `customerId` and `updates`.
6.  Upon successful update, a success notification is displayed, and the `displayCustomerDetail` capability is triggered for the `customerId` to refresh the view.
7.  If the update fails, an error message is displayed.
**Side Effects**: Customer data is potentially modified via `CustomerLogic`. The `CustomerDetailView` is refreshed.

#### handlePaginationChange
**Contract**: Adjusts the displayed customer list based on user interaction with pagination controls.
**Signature**:
- Input: `newPage: Number`, `newSize: Number` (Optional)
- Output: None
**Flow**:
1.  The `CustomerListView` component dispatches an event when the user changes the page number or page size.
2.  The `CustomerPresentation` component receives this event.
3.  The `CustomerPresentation` component triggers the `displayCustomerList` capability with the `newPage` and `newSize`.
**Side Effects**: The `CustomerListView` component's content is updated.

#### handleSearchAndFilter
**Contract**: Filters the customer list based on a user-provided search query or filter criteria.
**Signature**:
- Input: `searchQuery: String`, `filterCriteria: Object` (Optional)
- Output: None
**Flow**:
1.  The `CustomerListView` component dispatches an event when the user submits a search query or applies filters.
2.  The `CustomerPresentation` component receives this event.
3.  The `CustomerPresentation` component triggers the `displayCustomerList` capability, including the `searchQuery` and `filterCriteria`, resetting the page to 1.
**Side Effects**: The `CustomerListView` component's content is updated.

### 🚨 Constraints
*   The `CustomerListView` MUST always display a loading indicator when `displayCustomerList` is in progress.
*   The `CustomerDetailView` MUST always display a loading indicator when `displayCustomerDetail` is in progress.
*   All user input fields for customer profile updates MUST include client-side validation before requesting an update from `CustomerLogic`.
*   The `CustomerPresentation` MUST respect the pagination capabilities of `> **Reference**: fetchCustomers in ./customer-logic.isl.md`.
*   Sensitive customer information (e.g., full payment details) MUST NOT be displayed directly in the UI without explicit authorization and masking.

### ✅ Acceptance Criteria
*   Users can view a paginated list of all customers.
*   Users can search and filter the customer list by various criteria (e.g., name, email).
*   Users can select a customer from the list to view their detailed profile.
*   The detailed customer profile displays all relevant information.
*   Users can edit and save changes to a customer's profile.
*   The UI provides clear feedback for loading states, successful operations, and errors.
*   Pagination controls (next/previous page, page number, page size selector) are functional and update the list correctly.