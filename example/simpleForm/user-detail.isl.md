# Project: User Detail Page

Form component for creating and editing users.

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-01-23
**Implementation**: ./user-detail.jsx

> **Reference**: Domain Concepts in `./domain.isl.md`
> **Reference**: UserStore in `./store.isl.md`

---

## Component: UserDetail

### Role: Presentation

### 📦 Content

- Form Title (Dynamic: "New User" or "Edit User")
- Input Field: Name (Text, Required)
- Input Field: Email (Email, Required)
- Dropdown: Role (Admin, Editor, Viewer)
- Dropdown: Status (Active, Inactive, Pending)
- Action Buttons:
  - "Save" (Primary)
  - "Cancel" (Secondary)

### ⚡ Capabilities

#### renderUserForm

**Contract**:
Renders the form populated with user data (if editing) or empty (if creating).

**Signature:**

- **Input**:
  - user: User | null
- **Output**: NONE (side effect only)

---

#### handleSave

**Contract**:
Validates and submits the form data to the store.

**Signature:**

- **Input**:
  - user: User
- **Output**: NONE (side effect only)

**Flow**:

1. Validate form fields.
2. IF valid:
   - IF user has ID: Call `UserStore.saveUser`.
   - ELSE: Call `UserStore.addUser`.
3. Fire Event on Save Success or Failure.

---

#### handleCancel

**Contract**:
Cancels the operation and returns to the user list.

**Signature:**

- **Input**: NONE
- **Output**: NONE (side effect only)

**Flow**:

1. Fire Event on Cancel.

---
