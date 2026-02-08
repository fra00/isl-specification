# Project: FormUser Orchestration

**Version**: 1.0.0
**ISL Version**: 1.6.1

> **Reference**: Domain Concepts in [domain.isl.md](domain.isl.md)
> **Reference**: ApiUser in [api.isl.md](api.isl.md)
> **Reference**: FormUserGrid in [ui-grid.isl.md](ui-grid.isl.md)
> **Reference**: FormUserDetail in [ui-detail.isl.md](ui-detail.isl.md)
> **Reference**: StoreUserForm in [business.isl.md](business.isl.md)
> **Reference**: FormStateResolver in [business.isl.md](business.isl.md)
> **Reference**: ApiRole in [api.isl.md](api.isl.md)
> **Reference**: FormRoleGrid in [ui-grid.isl.md](ui-grid.isl.md)
> **Reference**: FormRoleDetail in [ui-detail.isl.md](ui-detail.isl.md)
> **Reference**: StoreRoleForm in [business.isl.md](business.isl.md)
> **Reference**: FormRoleValidator in [business.isl.md](business.isl.md)

---

## Component: FormUserApp

### Role: Application Orchestration

### ⚡ Capabilities

#### initializeApp

**Contract**:
Inizializza l'applicazione caricando la lista utenti e impostando lo stato iniziale.

- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)
    **Flow**:

1. Imposta `isLoading` = true.
2. Chiama `StoreUserForm.listUsers`.
3. Imposta `isLoading` = false.
4. Aggiorna la lista utenti in `FormUserGrid`.

---

#### handleUserSelection

**Contract**:
Gestisce la selezione di un utente nella tabella.

- **Signature:**
  - **Input**:
    - userId: string
  - **Output**: NONE (side effect only)
    **Flow**:

1. Imposta `isLoading` = true.
2. Chiama `StoreUserForm.loadUser(userId)`.
3. Imposta `isLoading` = false.
4. Imposta la vista dell'applicazione su "Detail".
5. Passa lo stato caricato a `FormUserDetail`.

---

#### handleCreateNewUser

**Contract**:  
Gestisce l'inizio della creazione di un nuovo utente.

- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)
    **Flow**:

1. Crea un nuovo `FormState` vuoto (o usa `FormStateResolver` per inizializzarlo).
2. Imposta la vista dell'applicazione su "Detail".
3. Passa il nuovo stato a `FormUserDetail`.

---

#### handleFormSubmission

**Contract**:
Gestisce l'invio del form utente.

- **Signature:**
  - **Input**:
    - formState: FormState
  - **Output**: NONE (side effect only)
    **Flow**:

1. Chiama `StoreUserForm.saveUser` (se nuovo) o `StoreUserForm.updateUser` (se esistente).
2. SE l'operazione ha successo:
   a. Chiama `initializeApp` per aggiornare la lista.
   b. Imposta la vista dell'applicazione su "Grid".

---

#### handleFormCancellation

**Contract**:
Gestisce la cancellazione del form utente.

- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)
    **Flow**:

1. Imposta la vista dell'applicazione su "Grid".

---

## Component: FormRoleApp

### Role: Application Orchestration

### ⚡ Capabilities

#### initializeApp

**Contract**:
Inizializza l'applicazione ruoli caricando la lista.

- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)
    **Flow**:

1. Imposta `isLoading` = true.
2. Chiama `ApiRole.fetchAllRoles`.
3. Imposta `isLoading` = false.
4. Aggiorna la lista ruoli in `FormRoleGrid`.

---

#### handleCreateNewRole

**Contract**:  
Gestisce l'inizio della creazione di un nuovo ruolo.

- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)
    **Flow**:

1. Crea un nuovo `FormState` vuoto.
2. Imposta la vista dell'applicazione su "Detail".
3. Passa il nuovo stato a `FormRoleDetail`.

---

#### handleRoleSelection

**Contract**:
Gestisce la selezione di un ruolo per la modifica.

- **Signature:**
  - **Input**:
    - roleId: string
  - **Output**: NONE (side effect only)
    **Flow**:

1. Imposta `isLoading` = true.
2. Chiama `StoreRoleForm.loadRole(roleId)`.
3. Imposta `isLoading` = false.
4. Imposta la vista dell'applicazione su "Detail".
5. Passa lo stato caricato a `FormRoleDetail`.

---

#### handleFormSubmission

**Contract**:
Gestisce l'invio del form ruolo.

- **Signature:**
  - **Input**:
    - formState: FormState
  - **Output**: NONE (side effect only)
    **Flow**:

1. Chiama `StoreRoleForm.saveRole` (se nuovo) o `StoreRoleForm.updateRole` (se esistente).
2. SE l'operazione ha successo:
   a. Chiama `initializeApp` per aggiornare la lista.
   b. Imposta la vista dell'applicazione su "Grid".

---

#### handleFormCancellation

**Contract**:
Gestisce la cancellazione del form ruolo.

- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)
    **Flow**:

1. Imposta la vista dell'applicazione su "Grid".
