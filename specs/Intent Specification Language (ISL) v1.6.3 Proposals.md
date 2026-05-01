# Intent Specification Language (ISL) v1.6.3

**Proposal Document**

---

## Document Status

- **Target Version**: 1.6.3
- **Status**: Draft Proposal
- **Compatibility Goal**: Backward-compatible with ISL v1.6.2
- **Scope of this proposal**: Local vs Global section scope only

---

## Purpose

This proposal introduces a single focused clarification for ISL v1.6.3:

- formalize **scope semantics** for sections that may appear at both capability level and component level.

The goal is to remove ambiguity such as:

- whether `Constraints` and `Global Constraints` are alternatives or complementary;
- whether `Acceptance Criteria` and `Test Scenarios` should be interpreted locally, globally, or both.

---

## Non-Goals

This proposal does **not** change:

- role taxonomy;
- canonical precedence order (except clarifying local vs global interpretation);
- code generation protocol;
- optional/new section families introduced in v1.6.2.

---

## 1. Scope Model (Normative)

ISL v1.6.3 SHOULD recognize two explicit scopes:

- **Local Scope**: applies to a single capability (`#### CapabilityName` block).
- **Global Scope**: applies to the whole component (`## Component: Name` block).

When both scopes exist for the same section family, they are **complementary**, not mutually exclusive.

---

## 2. Section Families That Support Dual Scope

The following section families MAY appear in both scopes:

1. **Constraints**
2. **Acceptance Criteria**
3. **Test Scenarios**

### Canonical naming

- Capability-level:
  - `### 🚨 Constraints`
  - `### ✅ Acceptance Criteria`
  - `### 🧪 Test Scenarios`
- Component-level:
  - `### 🚨 Global Constraints`
  - `### ✅ Acceptance Criteria`
  - `### 🧪 Test Scenarios`

Note: capability-level headings remain unchanged; component-level constraint heading uses the explicit `Global` prefix.

---

## 3. Normative Interpretation Rules

### Rule A: Local Constraints

`### 🚨 Constraints` under a capability MUST be interpreted as binding only for that capability.

### Rule B: Global Constraints

`### 🚨 Global Constraints` under a component MUST be interpreted as binding for every capability in the component.

### Rule C: Combined Constraints

If both local and global constraints exist:

- both MUST be enforced;
- local constraints may specialize local behavior;
- global constraints remain component-wide invariants.

### Rule D: Local Acceptance Criteria and Test Scenarios

Capability-level acceptance/tests validate that specific capability contract.

### Rule E: Global Acceptance Criteria and Test Scenarios

Component-level acceptance/tests validate cross-capability consistency, integration behavior, and component boundary guarantees.

### Rule F: Conflict Handling

If a local statement conflicts with a global statement:

- the conflict MUST be reported as an authoring error;
- compliant interpreters MUST NOT silently pick one and ignore the other.

---

## 4. Precedence Clarification (Local vs Global)

This proposal keeps the existing hierarchy and clarifies scope:

1. Capability-Level Constraints (`🚨 Constraints`)
2. Global Constraints (`🚨 Global Constraints`)
3. Acceptance Criteria (`✅`)
4. Contracts
5. Implementation Hints (`💡`)

Interpretation:

- local constraints are more specific, but do not cancel global invariants;
- global constraints define the component baseline.

---

## 5. Authoring Guidance

### Use Local Scope for:

- input validation of a specific capability;
- capability-specific side-effect limits;
- per-action guard conditions.

### Use Global Scope for:

- invariants that must hold across all capabilities;
- component boundary rules (e.g., Presentation must not own business decisions);
- cross-capability consistency requirements.

---

## 6. Example

```markdown
## Component: CheckoutForm

### Role: Presentation

### 🚨 Global Constraints

- All form fields MUST be valid before final submit is allowed.
- Component MUST NOT perform payment authorization directly.

### ⚡ Capabilities

#### validateName

**Contract**: Validate customer full name.

### 🚨 Constraints

- Name MUST contain at least 2 non-space characters.

### ✅ Acceptance Criteria

- [ ] Invalid names are rejected with clear UI feedback.

### 🧪 Test Scenarios

1. **Short Name**:
   - Input: `"A"`
   - Expected: validation error shown

### ✅ Acceptance Criteria

- [ ] Global submit remains disabled while any field is invalid.

### 🧪 Test Scenarios

1. **Cross-field validity gate**:
   - Input: one invalid field, all others valid
   - Expected: submit action remains blocked
```

---

## 7. Backward Compatibility

Existing v1.6.2 documents remain valid:

- documents with only local constraints remain valid;
- documents with only global constraints remain valid;
- documents with both become explicitly well-defined by this proposal.

No mandatory rewrite is required.

---

## 8. Final Recommendation

ISL v1.6.3 SHOULD adopt this scope clarification as a small, compatibility-safe improvement that:

- resolves recurrent ambiguity;
- improves deterministic interpretation for humans and generators;
- preserves current authoring style while making intent explicit.

