# Project: SimpleForm Store

Business Logic and State Management for User and Role.

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-01-23
**Implementation**: ./store.jsx

> **Reference**: Domain Concepts in `./domain.isl.md`
> **Reference**: ApiUser in `./api.isl.md`
> **Reference**: ApiRole in `./api.isl.md`

---

## Component: useUserStore

### Role: Business Logic

### ⚡ Capabilities

#### loadUsers

**Contract**:
Calls ApiUser to fetch all users and updates the application state.

- **Signature:**
  - **Input**: NONE
  - **Output**:
    - users: list<User>
    - error: string | null

---

#### addUser

**Contract**:
Validates and sends a new user to ApiUser.

- **Signature:**
  - **Input**:
    - user: User
  - **Output**:
    - success: boolean
    - error: string | null

---

#### saveUser

**Contract**:
Updates an existing user via ApiUser.

- **Signature:**
  - **Input**:
    - userId: string
    - user: User
  - **Output**:
    - success: boolean
    - error: string | null

---

#### removeUser

**Contract**:
Removes a user via ApiUser and updates the local list.

- **Signature:**
  - **Input**:
    - userId: string
  - **Output**:
    - success: boolean
    - error: string | null

---

## Component: useRoleStore

### Role: Business Logic

### ⚡ Capabilities

#### loadRoles

**Contract**:
Calls ApiRole to fetch all roles.

- **Signature:**
  - **Input**: NONE
  - **Output**:
    - roles: list<Role>
    - error: string | null

---

#### addRole

**Contract**:
Adds a new role via ApiRole.

- **Signature:**
  - **Input**:
    - role: Role
  - **Output**:
    - success: boolean
    - error: string | null

---

#### saveRole

**Contract**:
Updates an existing role via ApiRole.

- **Signature:**
  - **Input**:
    - roleId: string
    - role: Role
  - **Output**:
    - success: boolean
    - error: string | null

---

#### removeRole

**Contract**:
Removes a role via ApiRole.

- **Signature:**
  - **Input**:
    - roleId: string
  - **Output**:
    - success: boolean
    - error: string | null
