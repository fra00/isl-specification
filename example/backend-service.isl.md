# Project: E-Commerce Platform

Online store with product catalog, shopping cart, and checkout.

---

## Domain Concepts

### User

**Identity**: UUID
**Properties**:

- email: unique, for authentication
- role: enum (customer, admin)
  **Relationships**:
- Has one Cart (1:1)

### Cart

**Identity**: UUID
**Properties**:

- totalAmount: calculated sum of items
  **Relationships**:
- Belongs to one User (1:1)
- Contains many CartItems (1:N)

### CartItem

**Identity**: UUID
**Properties**:

- quantity: positive integer
- priceAtAdd: price snapshot when added
  **Relationships**:
- Belongs to one Cart (N:1)
- References one Product (N:1)

---

## Component: CartService

Manages shopping cart operations: add/remove items, calculate totals.

### Role: Backend

### 📐 Interface

- Service class (not HTTP endpoint)
- Used by CartController for HTTP API
- Methods return Promise<Result<T, Error>>

### 📦 Structure

**Dependencies**:

- CartRepository (database access)
- ProductRepository (product info)
- PricingService (price calculations)

---

### ⚡ Methods

#### addItem

**Signature:**

- **input**: { userId: UUID, productId: UUID, quantity: number }
- **output**: { cart: Cart, item: CartItem } | { error: string, code: 'PRODUCT_NOT_FOUND' | 'INSUFFICIENT_STOCK' }

**Contract**: Add product to user's cart with specified quantity, create cart if doesn't exist

**Flow**:

1. **Validate Input**: Verify quantity is positive
2. **Verify Product**: Check existence and stock
3. **Retrieve/Create Cart**: Load user's cart or create new
4. **Update Cart**:
   IF product in cart THEN increase quantity
   ELSE create new item with price snapshot
5. **Finalize**: Recalculate total and persist

**🚨 Constraint**:

- Steps 4-5 MUST execute within single database transaction (atomic)
- Item price MUST be snapshotted at time of addition
- Stock validation MUST occur before cart modification
- MUST NOT allow quantity < 1

**💡 Implementation Hint**:

```typescript
// Use transaction for atomic cart updates
async addItem(userId, productId, quantity) {
  return await db.transaction(async (trx) => {
    const product = await productRepo.findById(productId, {trx});
    // ... logic ...
    await cartRepo.save(cart, {trx});
  });
}
```

**✅ Acceptance Criteria**:

- [ ] Successfully adds new product to cart
- [ ] Successfully updates quantity if product already in cart
- [ ] Rejects invalid quantity (< 1)
- [ ] Rejects if insufficient stock
- [ ] Creates cart if user doesn't have one
- [ ] Calculates totalAmount correctly

---

#### removeItem

**Signature:**

- **input**: {userId: UUID, itemId: UUID}
- **output**: {cart: Cart} | {error: string, code: 'ITEM_NOT_FOUND'}

**Contract**: Remove item from cart and recalculate total

**Flow**:

1. Retrieve Cart
2. Locate Item (Error if not found)
3. Remove Item and Recalculate Total
4. Release reserved stock
5. Persist Changes

**🚨 Constraint**:

- MUST use database transaction
- MUST release product reserved stock
- MUST NOT allow removing items from other users' carts

**✅ Acceptance Criteria**:

- [ ] Successfully removes item from cart
- [ ] Recalculates totalAmount correctly
- [ ] Returns error if item not found
- [ ] Prevents removing items from another user's cart

---

## 💡 Global Implementation Hints

- Use dependency injection for repositories
- Consider implementing Result<T, E> type for error handling
- Use TypeScript for type safety

## 🚨 Global Constraints

- All database operations MUST use transactions
- Service MUST NOT directly access HTTP request/response
- Service MUST be stateless
- All methods MUST be unit testable
