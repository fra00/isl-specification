# Project: FormUser Domain

**Version**: 1.0.0
**ISL Version**: 1.6.1

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

### Role
**Identity**: roleId
**Properties**:
- name: string
- description: string

### FormField
**Identity**: fieldId
**Properties**:
- value: any
- visible: boolean
- required: boolean
- valid: boolean
- error: string | null

### FormState
**Properties**:
- fields: map<FormField.fieldId, FormField>
- submitEnabled: boolean

### FormIntent
**Properties**:
- type: enum (change, submit)
- fieldId: string (optional)
- value (optional)