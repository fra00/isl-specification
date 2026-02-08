# Project: FormUser API

**Version**: 1.0.0
**ISL Version**: 1.6.1

> **Reference**: Domain Concepts in [domain.isl.md](domain.isl.md)

---

## Component: ApiUser

Strato api (tutte le chiamate api sono dei mock , sono asincrone ma ritornano dati casuali dopo un delay simulato)

### Role: Backend

### ⚡ Capabilities

#### fetchUser

**Contract**:
Recupera i dati di un utente specifico dal database.

- **Signature:**
  - **Input**:
    - userId: string
  - **Output**:
    - user: User | null
    - errorMessage: string | null

---

#### fetchAllUsers

**Contract**:
Recupera la lista di tutti gli utenti dal database.

- **Signature:**
  - **Input**: NONE
  - **Output**:
    - users: list<User>
    - errorMessage: string | null

---

#### createUser

**Contract**:
Crea un nuovo utente nel database.

- **Signature:**
  - **Input**:
    - user: User
  - **Output**:
    - success: boolean
    - errorMessage: string | null

---

#### modifyUser

**Contract**:
Aggiorna i dati di un utente esistente nel database.

- **Signature:**
  - **Input**:
    - userId: string
    - user: User
  - **Output**:
    - success: boolean
    - errorMessage: string | null

---

#### removeUser

**Contract**:
Elimina un utente specifico dal database.

- **Signature:**
  - **Input**:
    - userId: string
  - **Output**:
    - success: boolean
    - errorMessage: string | null

---

## Component: ApiRole
Strato api per la gestione dei ruoli.
### Role: Backend
### ⚡ Capabilities
#### fetchRole
**Contract**:
Recupera i dati di un ruolo specifico.
- **Signature:**
  - **Input**:
    - roleId: string
  - **Output**:
    - role: Role | null
    - errorMessage: string | null
---
#### fetchAllRoles
**Contract**:
Recupera la lista di tutti i ruoli.
- **Signature:**
  - **Input**: NONE
  - **Output**:
    - roles: list<Role>
    - errorMessage: string | null
---
#### createRole
**Contract**:
Crea un nuovo ruolo.
- **Signature:**
  - **Input**:
    - role: Role
  - **Output**:
    - success: boolean
    - errorMessage: string | null
---
#### modifyRole
**Contract**:
Aggiorna un ruolo esistente.
- **Signature:**
  - **Input**:
    - roleId: string
    - role: Role
  - **Output**:
    - success: boolean
    - errorMessage: string | null
---
#### removeRole
**Contract**:
Elimina un ruolo.
- **Signature:**
  - **Input**:
    - roleId: string
  - **Output**:
    - success: boolean
    - errorMessage: string | null
