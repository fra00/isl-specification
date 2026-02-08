# Project: Role Detail Page

Form component for creating and editing roles.

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-01-23
**Implementation**: ./role-detail.jsx

> **Reference**: Domain Concepts in `./domain.isl.md`
> **Reference**: RoleStore in `./store.isl.md`

---

## Component: RoleDetail

### Role: Presentation

### 📦 Content

- Form Title (Dynamic: "New Role" or "Edit Role")
- Input Field: Name (Text, Required)
- Input Field: Description (Text, Optional)
- Action Buttons:
  - "Save" (Primary)
  - "Cancel" (Secondary)

### ⚡ Capabilities

#### renderRoleForm

**Contract**:
Renders the form populated with role data (if editing) or empty (if creating).

- **Signature:**
  - **Input**:
    - role: Role | null
  - **Output**: NONE (side effect only)

---

#### handleSave

**Contract**:
Validates and submits the form data to the store.

**Signature:**

- **Input**:
  - role: Role
- **Output**: NONE (side effect only)
  **Flow**:

1. Validate form fields.
2. IF valid:
   - IF role has ID: Call `RoleStore.saveRole`.
   - ELSE: Call `RoleStore.addRole`.
3. Fire Event on Save Success or Failure.

---

#### handleCancel

**Contract**:
Cancels the operation and returns to the role list.

**Signature:**

- **Input**: NONE
- **Output**: NONE (side effect only)

**Flow**:

1. Fire Event on Cancel.

---
