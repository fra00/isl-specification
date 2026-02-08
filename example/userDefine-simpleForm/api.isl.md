# Project: SimpleForm API

Mock API definition for User and Role management.

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-01-23
**Implementation**: ./api.jsx

> **Reference**: Domain Concepts in `./domain.isl.md`

---

## Component: useApiUser

Mock API layer for User management.

### Role: Backend

### ⚡ Capabilities

#### fetchAllUsers

**Contract**:
Retrieves the list of all users.

- **Signature:**
  - **Input**: NONE
  - **Output**:
    - users: list<User>
    - errorMessage: string | null

---

#### createUser

**Contract**:
Creates a new user.

- **Signature:**
  - **Input**:
    - user: User
  - **Output**:
    - success: boolean
    - errorMessage: string | null

---

#### updateUser

**Contract**:
Updates an existing user.

- **Signature:**
  - **Input**:
    - userId: string
    - user: User
  - **Output**:
    - success: boolean
    - errorMessage: string | null

---

#### deleteUser

**Contract**:
Deletes a user.

- **Signature:**
  - **Input**:
    - userId: string
  - **Output**:
    - success: boolean
    - errorMessage: string | null

**🚨 Constraint**:

- Il Mock NON DEVE essere statico (stateless).
- Deve simulare una persistenza in-memory (stateful).requirement
- La persistenza in-memory deve esssere garantita a livello di single page session (es. usando una variabile globale o simile).

---

## Component: useApiRole

Mock API layer for Role management.
Simulates data persistence and retrival for roles.

### Role: Backend

### ⚡ Capabilities

#### fetchAllRoles

**Contract**:
Retrieves the list of all roles.

- **Signature:**
  - **Input**: NONE
  - **Output**:
    - roles: list<Role>
    - errorMessage: string | null

#### createRole

**Contract**:
Creates a new role.

**Signature:**

- **Input**:
  - role: Role
- **Output**:
  - success: boolean
  - errorMessage: string | null

#### updateRole

**Contract**:
Updates an existing role.

- **Signature:**
  - **Input**:
    - roleId: string
    - role: Role
  - **Output**:
    - success: boolean
    - errorMessage: string | null

#### deleteRole

**Contract**:
Deletes a role.

**Signature:**

- **Input**:
  - roleId: string
- **Output**:
  - success: boolean
  - errorMessage: string | null

**🚨 Constraint**:

- Il Mock NON DEVE essere statico (stateless).
- Deve simulare una persistenza in-memory (stateful).requirement
- La persistenza in-memory deve esssere garantita a livello di single page session (es. usando una variabile globale o simile).

---
