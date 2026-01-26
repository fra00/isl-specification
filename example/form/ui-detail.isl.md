# Project: FormUser UI Detail

**Version**: 1.0.0
**ISL Version**: 1.6.1

> **Reference**: Domain Concepts in [domain.isl.md](domain.isl.md)

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

## Component: FormRoleDetail

### Role: Presentation

### 📦 Content

- Form per la creazione/modifica di un ruolo
- Campi: Name, Description

### ⚡ Capabilities

#### displayRoleForm

**Contract**:
Visualizza il form per la creazione o modifica di un ruolo.

- **Signature:**
  - **Input**:
    - formState: FormState
  - **Output**: NONE (side effect only)

---

#### handleFieldChange

**Contract**:
Gestisce il cambio di un campo nel form ruolo.

- **Signature:**
  - **Input**:
    - fieldId: string
    - value: any
  - **Output**: NONE (side effect only)

---

#### handleSubmitForm

**Contract**:
Gestisce l'invio del form ruolo.

- **Signature:**
  - **Input**:
    - formState: FormState
  - **Output**: NONE (side effect only)

---

#### handleCancelForm

**Contract**:
Gestisce la cancellazione del form ruolo.

- **Signature:**
  - **Input**: NONE
  - **Output**: NONE (side effect only)
