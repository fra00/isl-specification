# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./customer-logic

> **Reference**: Concepts/Capabilities in `./domain.isl.md`

## Component: CustomerLogic
### Role: Business Logic
**Description**: Manages business logic for customer data, including fetching customer profiles and managing customer-related actions.

### ⚡ Capabilities

#### `fetchCustomers`
**Contract**: Retrieves a paginated list of customer profiles, optionally filtered.
**Signature**: `(page: number, pageSize: number, filters?: object) => { customers: > Customer in ./domain.isl.md[], totalCount: number }`
**Flow**:
1.  Request customer data from the underlying data store.
2.  Apply pagination based on `page` and `pageSize`.
3.  Apply any provided `filters` to the customer data.
4.  Count the total number of customers matching the filters, ignoring pagination.
5.  Return the list of `Customer` objects and the `totalCount`.
**Side Effects**: None directly observable by other components; interacts with data persistence.

#### `fetchCustomerProfile`
**Contract**: Retrieves a single customer's detailed profile by their unique identifier.
**Signature**: `(customerId: string) => > Customer in ./domain.isl.md`
**Flow**:
1.  Request a specific customer's data using the `customerId`.
2.  IF the customer is not found THEN indicate an error.
3.  Return the `Customer` object.
**Side Effects**: None.

#### `updateCustomerProfile`
**Contract**: Updates an existing customer's information.
**Signature**: `(customerId: string, updates: object) => > Customer in ./domain.isl.md`
**Flow**:
1.  Validate the `updates` data against the expected structure for a `Customer` profile.
2.  Locate the customer by `customerId`.
3.  IF the customer is not found THEN indicate an error.
4.  Apply the `updates` to the customer's profile.
5.  Persist the updated customer data in the data store.
6.  Return the updated `Customer` object.
**Side Effects**: Modifies customer data in the data store.

#### `deactivateCustomer`
**Contract**: Marks a customer's profile as inactive, preventing further active interactions.
**Signature**: `(customerId: string) => > Customer in ./domain.isl.md`
**Flow**:
1.  Locate the customer by `customerId`.
2.  IF the customer is not found THEN indicate an error.
3.  Update the customer's status to 'inactive'.
4.  Persist the change in the data store.
5.  Return the updated `Customer` object.
**Side Effects**: Modifies customer data in the data store, changing their active status.

### 🚨 Constraints
*   All customer data operations MUST respect data privacy regulations.
*   `customerId` MUST be a unique identifier for each customer.
*   When updating a customer profile, all provided `updates` MUST be valid fields for a `Customer` entity.
*   `fetchCustomers` MUST support pagination to prevent excessive data transfer.

### ✅ Acceptance Criteria
*   A request to `fetchCustomers` with valid `page` and `pageSize` parameters returns a list of customers and the total count.
*   A request to `fetchCustomerProfile` with a valid `customerId` returns the corresponding customer's detailed profile.
*   A request to `fetchCustomerProfile` with an invalid `customerId` results in an error indicating the customer was not found.
*   A request to `updateCustomerProfile` with a valid `customerId` and valid `updates` successfully modifies the customer's data and returns the updated profile.
*   A request to `updateCustomerProfile` with an invalid `customerId` or invalid `updates` results in an appropriate error.
*   A request to `deactivateCustomer` with a valid `customerId` successfully marks the customer as inactive and returns the updated profile.
*   A request to `deactivateCustomer` with an invalid `customerId` results in an error indicating the customer was not found.