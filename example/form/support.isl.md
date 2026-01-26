# Project: FormUser Support

**Version**: 1.0.0
**ISL Version**: 1.6.1

> **Reference**: Domain Concepts in [domain.isl.md](domain.isl.md)

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
