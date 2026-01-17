# Project: E-Commerce Core Domain

Shared vocabulary and entity definitions for the entire platform.
Components should reference these definitions to ensure consistency.

---

## Domain Concepts

### User

**Identity**: UUID
**Properties**:

- email: unique, for authentication
- passwordHash: bcrypt hashed password
- role: enum (customer, admin, support)
- preferences: JSON object (marketing settings, theme)
  **Relationships**:
- Has one Cart (1:1)
- Has many Orders (1:N)
- Has many SavedAddresses (1:N)

### Product

**Identity**: UUID (SKU as secondary key)
**Properties**:

- name: localized string
- price: decimal (precision 2)
- currency: ISO 4217 code
- stockLevel: integer (non-negative)
- isActive: boolean
  **Relationships**:
- Belongs to many Categories (N:M)

### Order

**Identity**: UUID
**Properties**:

- orderNumber: human-readable reference (e.g., ORD-2024-001)
- status: enum (pending, paid, shipped, delivered, cancelled, refunded)
- totalAmount: decimal
- shippingAddress: embedded Address
  **Relationships**:
- Belongs to one User (N:1)
- Contains many OrderItems (1:N)

### Address (Value Object)

**Properties**:

- street: string
- city: string
- countryCode: ISO 3166-1 alpha-2
