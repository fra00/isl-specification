# Project: FormUser UI Grid

**Version**: 1.0.0
**ISL Version**: 1.6.1

> **Reference**: Domain Concepts in [domain.isl.md](domain.isl.md)

---

## Component: FormUserGrid

### Role: Presentation

### 📦 Content

- Tabella con lista utenti
- Colonne: Name, Email, Role, Status, Actions (Edit, Delete)
- ordinamento e filtro per colonne

### ⚡ Capabilities

#### displayUserList

**Contract**:
Visualizza la lista degli utenti in una tabella con funzionalità di ordinamento e filtro.

- **Signature:**
  - **Input**:
    - users: list<User>
    - isLoading: boolean
  - **Output**: NONE (side effect only)

---

#### handleEditUser

**Contract**:
Inizia la modifica di un utente selezionato.

- **Signature:**
  - **Input**:
    - userId: string
  - **Output**: NONE (side effect only)

---

#### handleDeleteUser

**Contract**:
Inizia l'eliminazione di un utente selezionato.

- **Signature:**
  - **Input**:
    - userId: string
  - **Output**: NONE (side effect only)

---

## Component: FormRoleGrid
### Role: Presentation
### 📦 Content
- Tabella con lista ruoli
- Colonne: Name, Description, Actions (Edit, Delete)

### ⚡ Capabilities
#### displayRoleList
**Contract**:
Visualizza la lista dei ruoli in una tabella.
- **Signature:**
  - **Input**:
    - roles: list<Role>
    - isLoading: boolean
  - **Output**: NONE (side effect only)
--- 
#### handleEditRole
**Contract**:
Inizia la modifica di un ruolo selezionato.
- **Signature:**
  - **Input**:
    - roleId: string
  - **Output**: NONE (side effect only)
---
#### handleDeleteRole
**Contract**:
Inizia l'eliminazione di un ruolo selezionato.
- **Signature:**
  - **Input**:
    - roleId: string
  - **Output**: NONE (side effect only)
