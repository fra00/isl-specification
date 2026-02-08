# Project: E-Commerce Dashboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./domain

## Domain Concept: Product
### Role: Domain
**Description**: Represents a single product available for sale in the e-commerce system.

### 📦 Content/Structure
*   **id**: Unique identifier for the product. (Type: String)
*   **name**: Name of the product. (Type: String)
*   **description**: Detailed description of the product. (Type: String)
*   **price**: Current selling price of the product. (Type: Decimal)
*   **sku**: Stock Keeping Unit, a unique identifier for the product variant. (Type: String)
*   **category**: Category the product belongs to (e.g., "Electronics", "Apparel"). (Type: String)
*   **stockQuantity**: Number of units currently in stock. (Type: Integer)
*   **imageUrl**: URL to the primary image of the product. (Type: String)
*   **availabilityStatus**: Current availability status of the product. (Type: > **Reference**: ProductAvailabilityStatus in ./domain.isl.md)
*   **createdAt**: Timestamp when the product was first added. (Type: DateTime)
*   **updatedAt**: Timestamp of the last update to the product details. (Type: DateTime)

## Domain Concept: Order
### Role: Domain
**Description**: Represents a customer's purchase transaction.

### 📦 Content/Structure
*   **id**: Unique identifier for the order. (Type: String)
*   **customerId**: Identifier of the customer who placed the order. (Type: String)
*   **orderDate**: Date and time when the order was placed. (Type: DateTime)
*   **status**: Current status of the order. (Type: > **Reference**: OrderStatus in ./domain.isl.md)
*   **totalAmount**: Total monetary value of the order, including shipping and taxes. (Type: Decimal)
*   **items**: A list of products included in the order. (Type: List of > **Reference**: OrderItem in ./domain.isl.md)
*   **shippingAddress**: The address where the order is to be shipped. (Type: String)
*   **billingAddress**: The address associated with the payment method. (Type: String)
*   **paymentStatus**: Current status of the order's payment. (Type: > **Reference**: PaymentStatus in ./domain.isl.md)
*   **createdAt**: Timestamp when the order was created in the system. (Type: DateTime)
*   **updatedAt**: Timestamp of the last update to the order details or status. (Type: DateTime)

## Domain Concept: OrderItem
### Role: Domain
**Description**: Represents a single product item within an order.

### 📦 Content/Structure
*   **productId**: Identifier of the product purchased. (Type: String)
*   **productName**: Name of the product at the time of purchase. (Type: String)
*   **quantity**: Number of units of this product in the order. (Type: Integer)
*   **unitPrice**: Price of a single unit of the product at the time of purchase. (Type: Decimal)
*   **subtotal**: `quantity` * `unitPrice` for this item. (Type: Decimal)

## Domain Concept: Customer
### Role: Domain
**Description**: Represents a registered customer of the e-commerce system.

### 📦 Content/Structure
*   **id**: Unique identifier for the customer. (Type: > **Reference**: CustomerId)
*   **firstName**: Customer's first name. (Type: String)
*   **lastName**: Customer's last name. (Type: String)
*   **email**: Customer's primary email address. (Type: String)
*   **phoneNumber**: Customer's primary phone number. (Type: String)
*   **shippingAddress**: Default shipping address for the customer. (Type: > **Reference**: Address)
*   **billingAddress**: Default billing address for the customer. (Type: > **Reference**: Address)
*   **status**: Current account status of the customer. (Type: > **Reference**: CustomerStatus)
*   **totalOrders**: Total number of orders placed by the customer. (Type: Integer)
*   **totalSpent**: Total monetary amount spent by the customer across all orders. (Type: Decimal)
*   **createdAt**: Timestamp when the customer account was created. (Type: DateTime)
*   **updatedAt**: Timestamp of the last update to the customer's profile. (Type: DateTime)

## Domain Concept: CustomerId
### Role: Domain
**Description**: A unique identifier type for customers.

### 📦 Content/Structure
*   (Type: String)

## Domain Concept: CustomerStatus
### Role: Domain
**Description**: Enumeration of possible account statuses for a customer.

### 📦 Content/Structure
*   **ACTIVE**: Customer account is active and can place orders.
*   **INACTIVE**: Customer account is temporarily or permanently disabled.
*   **PENDING**: Customer account is awaiting activation or verification.

## Domain Concept: Address
### Role: Domain
**Description**: Represents a physical address.

### 📦 Content/Structure
*   **street**: Street name and house number. (Type: String)
*   **city**: City. (Type: String)
*   **state**: State or province. (Type: String)
*   **zipCode**: Postal or ZIP code. (Type: String)
*   **country**: Country. (Type: String)

## Domain Concept: CustomerSummary
### Role: Domain
**Description**: A lightweight representation of a customer, typically for lists or quick views.

### 📦 Content/Structure
*   **id**: Unique identifier for the customer. (Type: > **Reference**: CustomerId)
*   **name**: Full name of the customer. (Type: String)
*   **email**: Customer's primary email address. (Type: String)
*   **status**: Current account status of the customer. (Type: > **Reference**: CustomerStatus)

## Domain Concept: CustomerProfile
### Role: Domain
**Description**: A detailed representation of a customer's profile.

### 📦 Content/Structure
*   **id**: Unique identifier for the customer. (Type: > **Reference**: CustomerId)
*   **name**: Full name of the customer. (Type: String)
*   **email**: Customer's primary email address. (Type: String)
*   **phone**: Customer's primary phone number. (Type: String)
*   **address**: The customer's primary address. (Type: > **Reference**: Address)
*   **status**: Current account status of the customer. (Type: > **Reference**: CustomerStatus)
*   **totalOrders**: Total number of orders placed by the customer. (Type: Integer)
*   **lastOrderDate**: Date of the customer's last order. (Type: DateTime, Optional)

## Domain Concept: CustomerFilter
### Role: Domain
**Description**: Criteria for filtering a list of customers.

### 📦 Content/Structure
*   **status**: Filter by customer account status. (Type: > **Reference**: CustomerStatus, Optional)
*   **searchQuery**: General search term for customer name or email. (Type: String, Optional)

## Domain Concept: CustomerProfileUpdate
### Role: Domain
**Description**: Represents a partial update request for a customer's profile.

### 📦 Content/Structure
*   **firstName**: Customer's first name. (Type: String, Optional)
*   **lastName**: Customer's last name. (Type: String, Optional)
*   **email**: Customer's primary email address. (Type: String, Optional)
*   **phoneNumber**: Customer's primary phone number. (Type: String, Optional)
*   **shippingAddress**: Default shipping address for the customer. (Type: > **Reference**: Address, Optional)
*   **billingAddress**: Default billing address for the customer. (Type: > **Reference**: Address, Optional)
*   **status**: Current account status of the customer. (Type: > **Reference**: CustomerStatus, Optional)

## Domain Concept: User
### Role: Domain
**Description**: Represents an administrative user of the E-Commerce Dashboard.

### 📦 Content/Structure
*   **id**: Unique identifier for the user. (Type: String)
*   **username**: Unique username for login. (Type: String)
*   **email**: User's email address. (Type: String)
*   **role**: The administrative role assigned to the user. (Type: > **Reference**: UserRole in ./domain.isl.md)
*   **lastLogin**: Timestamp of the user's last successful login. (Type: DateTime)
*   **createdAt**: Timestamp when the user account was created. (Type: DateTime)
*   **updatedAt**: Timestamp of the last update to the user's profile. (Type: DateTime)

## Domain Concept: OrderStatus
### Role: Domain
**Description**: Enumeration of possible statuses for an order.

### 📦 Content/Structure
*   **PENDING**: Order has been placed but not yet processed.
*   **PROCESSING**: Order is being prepared for shipment.
*   **SHIPPED**: Order has left the warehouse.
*   **DELIVERED**: Order has been received by the customer.
*   **CANCELLED**: Order was cancelled before fulfillment.
*   **RETURNED**: Order items have been returned by the customer.

## Domain Concept: ProductAvailabilityStatus
### Role: Domain
**Description**: Enumeration of possible availability statuses for a product.

### 📦 Content/Structure
*   **IN_STOCK**: Product is readily available.
*   **OUT_OF_STOCK**: Product is currently unavailable.
*   **LOW_STOCK**: Product quantity is below a predefined threshold.
*   **DISCONTINUED**: Product is no longer offered for sale.

## Domain Concept: PaymentStatus
### Role: Domain
**Description**: Enumeration of possible payment statuses for an order.

### 📦 Content/Structure
*   **PENDING**: Payment has been initiated but not yet confirmed.
*   **PAID**: Payment has been successfully processed.
*   **REFUNDED**: Payment has been returned to the customer.
*   **FAILED**: Payment attempt was unsuccessful.

## Domain Concept: UserRole
### Role: Domain
**Description**: Enumeration of possible roles for an administrative user.

### 📦 Content/Structure
*   **ADMIN**: Full access to all dashboard features and settings.
*   **EDITOR**: Can create, update, and delete content (e.g., products, orders) but may have restricted access to settings or sensitive data.
*   **VIEWER**: Can view all data but cannot make any modifications.