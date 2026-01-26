# Project: FormUser

Form di gestione utente

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-01-22

---

## Domain Concepts
### User
**Identity**: userId
**Properties**:
- name: string
- email: string
- role: enum (admin, editor, viewer)    
- status: enum (active, inactive, pending)
- createdAt: datetime
- updatedAt: datetime
---
### FormField
**Identity**: fieldId
**Properties**:
- value: any
- visible: boolean
- required: boolean
- valid: boolean
- error: string | null
---
### FormState
**Properties**:
- fields: map<FormField.fieldId, FormField>
- submitEnabled: boolean
---
### FormIntent
**Properties**:
- type: enum (change, submit)
- fieldId: string (optional)
- value (optional)
---
## Component: StoreUserForm
### Role: Business Logic
### ⚡ Capabilities
#### saveUser
**Contract**:
Persisti i dati dell'utente dal **FormState** al sistema di backend tramite ApiUser.
- **Signature:**
  - **Input**:
    - formState: FormState
  - **Output**:
    - success: boolean
    - errorMessage: string | null

---
#### loadUser
**Contract**:
Recupera i dati dell'utente dal sistema di backend tramite ApiUser e popola il **FormState**.
- **Signature:**
  - **Input**:
    - userId: string
  - **Output**:
    - formState: FormState
    - errorMessage: string | null

---
#### listUsers
**Contract**:
Recupera la lista di tutti gli utenti dal sistema di backend tramite ApiUser.
- **Signature:**
  - **Input**: NONE
  - **Output**:
    - users: list<User>
    - errorMessage: string | null

---
#### updateUser
**Contract**:
Aggiorna i dati di un utente esistente nel sistema di backend tramite ApiUser.
- **Signature:**
  - **Input**:
    - userId: string
    - formState: FormState
    - **Output**:
    - success: boolean
    - errorMessage: string | null
---
#### deleteUser
**Contract**:
Elimina un utente esistente dal sistema di backend tramite ApiUser.
- **Signature:**
  - **Input**:
    - userId: string
  - **Output**:
    - success: boolean
    - errorMessage: string | null
---

### Component: ApiUser
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
## Component: FormUserDetail
### Role: Presentation
### 📦 Content
- Form per la creazione/modifica di un utente
- Campi: Name, Email, Role, Status
### ⚡ Capabilities
#### displayUserForm
**Contract**:
Visualizza il form per la creazione o modifica di un utente con i dati correnti.
- **Signature:**
  - **Input**:
    - formState: FormState
  - **Output**: NONE (side effect only)
---
#### handleFieldChange
**Contract**:
Gestisce il cambio di un campo nel form utente.
- **Signature:**
  - **Input**:
    - fieldId: string
    - value: any
  - **Output**: NONE (side effect only)
---
#### handleSubmitForm
**Contract**:
Gestisce l'invio del form utente.
- **Signature:**
  - **Input**:
    - formState: FormState
  - **Output**: NONE (side effect only)
---
#### handleCancelForm
**Contract**:
Gestisce la cancellazione del form utente.
- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)
---
## Component: FormStateResolver
### Role: Business Logic
### ⚡ Capabilities
#### resolve
**Contract**:
Derive a new **FormState** from the previous state and a **FormIntent**.    
- **Signature:**
  - **Input**:
    - previousState: FormState
    - intent: FormIntent
  - **Output**:
    - nextState: FormState
**🚨 Constraint**:
- MUST be a pure function
- MUST NOT mutate previousState
- MUST recompute all derived properties
- MUST produce deterministic output
**✅ Acceptance Criteria**:
- Identical inputs produce identical outputs
- nextState is always complete
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
2. Chiama `ApiUser.fetchAllUsers`.
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
---
#### handleCreateNewUser
**Contract**:   
Gestisce l'inizio della creazione di un nuovo utente.
- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)
---
#### handleFormSubmission
**Contract**:
Gestisce l'invio del form utente.
- **Signature:**
  - **Input**:
    - formState: FormState
  - **Output**: NONE (side effect only)
---
#### handleFormCancellation
**Contract**:
Gestisce la cancellazione del form utente.
- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)
---
## Component: FormUserValidator
### Role: Business Logic
### ⚡ Capabilities
#### validateFormField
**Contract**:
Valida un singolo campo del form utente.
- **Signature:**
  - **Input**:
    - fieldId: string
    - value: any
  - **Output**:
    - valid: boolean
    - error: string | null
**🚨 Constraint**:
- If fieldId == "name": MUST be non-empty string, min length 2.
- If fieldId == "email": MUST be valid email format.
- If fieldId == "role": MUST be one of [admin, editor, viewer].
- If fieldId == "status": MUST be one of [active, inactive, pending].
---
#### validateFormState
**Contract**:
Valida l'intero **FormState**
- **Signature:**
  - **Input**:
    - formState: FormState
  - **Output**:
    - isValid: boolean
    - fieldErrors: map<fieldId, string | null>
**🚨 Constraint**:
- MUST validate all fields present in FormState.
- isValid MUST be true only if all fields are valid.
---
#### validateForm
**Contract**:
Valida il form utente prima dell'invio.
- **Signature:**
  - **Input**:
    - formState: FormState
  - **Output**:
    - isValid: boolean
    - fieldErrors: map<fieldId, string | null>
**🚨 Constraint**:
- MUST validate all visible and required fields.
- isValid MUST be true only if no validation errors exist.
---

## Component: FormUserNotifications
### Role: Notification Logic
### ⚡ Capabilities
#### notifyUserCreated
**Contract**:
Invia una notifica quando un nuovo utente viene creato.
- **Signature:**
  - **Input**:
    - user: User
  - **Output**: NONE (side effect only)
---
#### notifyUserUpdated
**Contract**:
Invia una notifica quando un utente viene aggiornato.
- **Signature:**
  - **Input**:
    - user: User
  - **Output**: NONE (side effect only)
---
#### notifyUserDeleted
**Contract**:
Invia una notifica quando un utente viene eliminato.
- **Signature:**
  - **Input**:
    - userId: string
  - **Output**: NONE (side effect only)
---
#### notifyError
**Contract**:
Invia una notifica di errore.
- **Signature:**
  - **Input**:
    - message: string
  - **Output**: NONE (side effect only)
---
#### notifySuccess
**Contract**:   
Invia una notifica di successo.
- **Signature:**
  - **Input**:
    - message: string
  - **Output**: NONE (side effect only)
---
## Component: FormUserLogger
### Role: Logging Logic
### ⚡ Capabilities
#### logUserAction
**Contract**:
Registra un'azione utente.
- **Signature:**
  - **Input**:
    - action: string
    - userId: string
    - **Output**: NONE (side effect only)
---
#### logError
**Contract**:
Registra un errore.
- **Signature:**
  - **Input**:
    - message: string
    - **Output**: NONE (side effect only)
--- 
#### logFormSubmission
**Contract**:
Registra l'invio del form utente.
- **Signature:**
  - **Input**:
    - formState: FormState
    - **Output**: NONE (side effect only)
---
- **Signature:**
  - **Input**:
    - formState: FormState
    - **Output**: NONE (side effect only)
---
