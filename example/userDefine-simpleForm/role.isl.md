# Project: Page Role

Simple Mask Role Management Page

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-01-23
**Implementation**: ./role-page.jsx

---

> **Reference**: Domain Concepts in `./domain.isl.md`
> **Reference**: RoleStore in `./store.isl.md`
> **Reference**: RoleDetail in `./role-detail.isl.md`

## Component: Role Page

Main Page for Role Management

### Role: Presentation

### 📦 Content

- Title "Role Management"
- Button "Add New Role" with icon "plus"
- Data Grid displaying Roles:
  - Columns: Name, Description
  - Row Actions: Edit (icon "pencil"), Delete (icon "trash")

### ⚡ Capabilities

#### renderRoleList

**Contract**:
Displays the list of roles fetched from the store.

- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)
    **Flow**:

1. Call `RoleStore.loadRoles` to fetch data.
2. Render the Grid with the role list.

---

#### handleAddRole

**Contract**:
Triggers the navigation or display of the RoleDetail form for creating a new role.

- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)

---

#### handleEditRole

**Contract**:
Triggers the navigation or display of the RoleDetail form for editing an existing role.

- **Signature:**
  - **Input**:
    - roleId: string
  - **Output**: NONE (side effect only)

---

#### handleDeleteRole

**Contract**:
Handles the deletion of a role.

- **Signature:**
  - **Input**:
    - roleId: string
  - **Output**: NONE (side effect only)
    **Flow**:

1. Confirm deletion with the user.
2. Call `RoleStore.removeRole(roleId)`.
3. Refresh the list via `renderRoleList`.
