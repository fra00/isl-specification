# Project: FormUser Business Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1

> **Reference**: Domain Concepts in [domain.isl.md](domain.isl.md)
> **Reference**: ApiUser in [api.isl.md](api.isl.md)

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

## Component: StoreRoleForm
### Role: Business Logic
### ⚡ Capabilities
#### saveRole
**Contract**:
Persisti i dati del ruolo dal **FormState** al sistema di backend tramite ApiRole.
- **Signature:**
  - **Input**:
    - formState: FormState
  - **Output**:
    - success: boolean
    - errorMessage: string | null

---
#### loadRole
**Contract**:
Recupera i dati del ruolo dal sistema di backend tramite ApiRole e popola il **FormState**.
- **Signature:**
  - **Input**:
    - roleId: string
  - **Output**:
    - formState: FormState
    - errorMessage: string | null

---
#### listRoles
**Contract**:
Recupera la lista di tutti i ruoli dal sistema di backend tramite ApiRole.
- **Signature:**
  - **Input**: NONE
  - **Output**:
    - roles: list<Role>
    - errorMessage: string | null

---
#### updateRole
**Contract**:
Aggiorna i dati di un ruolo esistente nel sistema di backend tramite ApiRole.
- **Signature:**
  - **Input**:
    - roleId: string
    - formState: FormState
    - **Output**:
    - success: boolean
    - errorMessage: string | null
---
#### deleteRole
**Contract**:
Elimina un ruolo esistente dal sistema di backend tramite ApiRole.
- **Signature:**
  - **Input**:
    - roleId: string
  - **Output**:
    - success: boolean
    - errorMessage: string | null
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

## Component: FormRoleValidator
### Role: Business Logic
### ⚡ Capabilities
#### validateFormField
**Contract**:
Valida un singolo campo del form ruolo.
- **Signature:**
  - **Input**:
    - fieldId: string
    - value: any
  - **Output**:
    - valid: boolean
    - error: string | null
**🚨 Constraint**:
- If fieldId == "name": MUST be non-empty string, min length 3.
- If fieldId == "description": OPTIONAL, max length 200.