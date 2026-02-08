# Project: Page User

Simple Mask User Management Page

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-01-23
**Implementation**: ./user-page.jsx

---

> **Reference**: Domain Concepts in `./domain.isl.md`
> **Reference**: UserStore in `./store.isl.md`
> **Reference**: UserDetail in `./user-detail.isl.md`

## Component: User Page

Main Page for User Management

### Role: Presentation

### 📦 Content

- Title "User Management"
- Button "Add New User" with icon "plus"
- Data Grid displaying Users:
  - Columns: Name, Email, Role, Status, Created At
  - Row Actions: Edit (icon "pencil"), Delete (icon "trash")

### ⚡ Capabilities

#### renderUserList

**Contract**:
Displays the list of users fetched from the store.

- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)
    **Flow**:

1. Call `UserStore.loadUsers` to fetch data.
2. Render the Grid with the user list.

---

#### handleAddUser

**Contract**:
Triggers the navigation or display of the UserDetail form for creating a new user.

- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)

---

#### handleEditUser

**Contract**:
Triggers the navigation or display of the UserDetail form for editing an existing user.

- **Signature:**
  - **Input**:
    - userId: string
  - **Output**: NONE (side effect only)

---

#### handleDeleteUser

**Contract**:
Handles the deletion of a user.

- **Signature:**
  - **Input**:
    - userId: string
  - **Output**: NONE (side effect only)
    **Flow**:

1. Confirm deletion with the user.
2. Call `UserStore.removeUser(userId)`.
3. Refresh the list via `renderUserList`.
