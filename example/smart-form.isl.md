# Project: SmartFormPOC

**Version**: 0.1.0  
**ISL Version**: 1.6.1

---

## Domain Concepts

### FormField

**Identity**: fieldId  
**Properties**:

- value
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

## Component: SmartFormView

### Role: Presentation

### ⚡ Capabilities

#### render

**Contract**:
Render the form exclusively from FormState.

**🚨 Constraint**:

- MUST NOT derive business logic
- MUST NOT infer validation rules
- MUST NOT store form state internally

**✅ Acceptance Criteria**:

- Visible fields match FormState
- Required fields match FormState
- Submit enabled state matches FormState

---

## Form Definition

```markdown
Fields:

- userType
- email
- codiceFiscale
- piva
```

---

## Component: FormRules

### Role: Business Logic

### ⚡ Capabilities

#### applyUserTypeRules

**Contract**:
Derive visibility and requirement based on userType.

**🚨 Constraint**:

- If userType == "privato":
  codiceFiscale MUST be visible and required
  piva MUST be hidden and optional

- If userType == "azienda":
  piva MUST be visible and required
  codiceFiscale MUST be hidden and optional

**✅ Acceptance Criteria**:

- Only relevant fields are visible
- Required flags are mutually exclusive

---

## Component: EmailValidation

### Role: Business Logic

### ⚡ Capabilities

#### validate

**Contract**:  
Validate email field.

**🚨 Constraint**:

- email.valid MUST be false if value is not a valid email
- email.error MUST be set when invalid

**✅ Acceptance Criteria**:

- Invalid email blocks submission

---

## Component: SubmitEligibility

### Role: Business Logic

### ⚡ Capabilities

#### compute

**Contract**:
Determine whether form can be submitted.

**🚨 Constraint**:
submitEnabled MUST be true only if all visible required fields are valid

**✅ Acceptance Criteria**:
submitEnabled is never true when a required field is invalid

## 🧪 Test Scenarios

### Scenario: Switch User Type

**Given**:

- userType = "privato"

**When**:

- intent.type = change
- intent.fieldId = userType
- intent.value = "azienda"

**Then**:

- codiceFiscale.visible == false
- piva.visible == true
- submitEnabled == false
