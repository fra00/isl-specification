# Intent Specification Language (ISL) v1.6.2

**LLM-First Documentation Edition**

## Core Identity

**What**: Human-first, LLM-executable specification format for deterministic code generation
**Why**: Eliminate ambiguity in translating requirements to code
**How**: Structured Markdown with semantic contracts and canonical interpretation rules

**Version**: 1.6.2 | **Status**: Stable | **Date**: April 2026

---

## Quick Start

### Minimal Valid Specification

```markdown
# Project: TaskManager

## Domain Concepts

### Task

**Identity**: UUID
**Properties**: title (string), status (enum: todo|done)

## Component: TaskCard

Role: Presentation

⚡ toggleStatus
Contract: Toggle task between todo and done states
Trigger: Click on checkbox
```

### Key Principles

1. **Contracts over Implementation**: Define WHAT, not HOW
2. **Determinism**: Same spec → semantically equivalent code
3. **Test Integration**: Acceptance criteria built-in
4. **Role Separation**: Presentation ≠ Backend logic

---

## Canonical Rules (NORMATIVE)

### Rule 1: Semantic Markers

Sections with emoji are **NORMATIVE** (must implement exactly):

- ⚡ Capabilities/Methods
- 🚨 Constraints
- ✅ Acceptance Criteria
- 🧪 Test Scenarios

Sections without normative emoji are **INFORMATIVE** (guidance only):

- 📐 Appearance/Interface
- 📦 Content/Structure
- 💡 Implementation Hints

### Rule 2: Precedence Hierarchy

On conflict, apply this order (highest first):

1. Capability-level Constraints
2. Global Constraints
3. Acceptance Criteria
4. Contracts
5. Implementation Hints

### Rule 3: Determinism Requirements

**Same ISL → Semantically Equivalent Code**

Equivalent means:

- Identical input/output signatures
- Identical side effects
- Identical error handling
- Identical API contracts

NOT equivalent (allowed variations):

- Variable names (unless specified in Domain Concepts)
- Code comments
- Whitespace/formatting
- Internal implementation (if contract satisfied)

### Rule 4: ISL Boundary (Critical)

ISL defines **intent and behavior**, NOT implementation.

**MUST**:

- Define observable behavior
- Describe what system does
- Express logic as intent/rules/outcomes
- Remain implementation-agnostic

**MUST NOT**:

- Describe step-by-step algorithms
- Be written as pseudocode
- Act as Technical Design Document
- Contain low-level control flow tied to syntax

**Example Violation**:

```markdown
❌ INVALID (pseudocode):
Flow:

1. dx = mouse.x - prevMouse.x
2. newWidth = node.width + dx
3. if newWidth < 50 then newWidth = 50

✅ VALID (intent):
Flow:

1. User resizes node via bounding box
2. Node dimensions update respecting minimum size
3. Connections remain visually attached

🚨 Constraint:

- MUST enforce minimum size 50×50
```

### Rule 5: Role Separation

**Presentation (Role: Presentation)**

- MUST: Define visual appearance, handle UI interactions, render elements
- MUST NOT: Implement business logic, access databases directly, contain auth logic

**Backend (Role: Backend)**

- MUST: Define API contracts, implement business logic, handle persistence
- MUST NOT: Define visual properties, contain UI rendering, reference DOM

### Rule 6: Optionality Semantics

- **(OPTIONAL)**: May be omitted, but if present MUST be implemented
- **(REQUIRED)**: Must be present AND implemented

---

## Document Structure

### Hierarchy

```
Project (# Project: Name)
├── Domain Concepts (## Domain Concepts)
│   └── Entities (### EntityName)
├── Component A (## Component: Name)
│   ├── Role (### Role)
│   ├── Appearance/Interface (### 📐)
│   ├── Content/Structure (### 📦)
│   ├── Capabilities (### ⚡)
│   │   ├── Signature
│   │   ├── Contract
│   │   ├── Trigger
│   │   ├── Flow
│   │   ├── Side Effect
│   │   ├── Cleanup
│   │   ├── Implementation Hint (💡)
│   │   ├── Constraint (🚨)
│   │   └── Acceptance + Tests (✅ 🧪)
│   ├── Global Hints (### 💡)
│   ├── Global Constraints (### 🚨)
│   ├── Acceptance Criteria (### ✅)
│   └── Test Scenarios (### 🧪)
└── Component B...
```

### External References

```markdown
## Domain Concepts

> **Reference**: Core entities defined in [`./shared-domain.isl.md`](./shared-domain.isl.md)
```

LLM must treat referenced content as inline. Local definitions override external ones.

---

## Section Reference

### Domain Concepts

**Purpose**: Establish shared vocabulary

```markdown
## Domain Concepts

### User

**Identity**: UUID
**Properties**:

- email: unique authentication identifier
- displayName: user's chosen public name
- accountStatus: enum (active, suspended, deleted)
  **Relationships**:
- Has many Orders (1:N)
- Belongs to one Organization (N:1)
```

**Guidelines**:

- Use business domain terminology (not technical)
- Focus on semantic meaning, not storage
- Define relationships explicitly (1:1, 1:N, N:M)

### Component Declaration

```markdown
## Component: LoginButton

Handles user authentication via form submission

### Role: Presentation (REQUIRED)
```

**Naming**: PascalCase, specific (UserProfileCard > Card)

### Appearance/Interface

**For Presentation**:

```markdown
### 📐 Appearance (OPTIONAL)

- Primary button: blue background (#3b82f6)
- Text: white, 16px
- Border radius: 8px
- States: hover (darker), disabled (gray)
```

**For Backend**:

```markdown
### 📐 Interface (OPTIONAL)

- Method: POST
- Route: /api/auth/login
- Content-Type: application/json
- Request: {email: string, password: string}
- Response: {token: string, expiresAt: ISO8601} | {error: string}
```

### Capabilities/Methods

**Structure**:

```markdown
#### authenticateUser

**Signature**: (OPTIONAL but RECOMMENDED)

- **input**: {email: string, password: string}
- **output**: {token: string, expiresAt: datetime} | {error: string}

**Contract**: (REQUIRED)
Authenticate user credentials and generate session token valid for 24 hours

**Trigger**: (REQUIRED for Presentation)
Click on submit button

**Flow**: (OPTIONAL - REQUIRED if multi-step)

1. Validate input format
2. Query user by email
3. Verify password hash
   IF valid THEN
   a. Generate JWT token
   b. Update last login timestamp
   ELSE
   a. Return error
4. Return token with expiration

**Side Effect**: (OPTIONAL)

- Updates user.lastLogin timestamp
- Creates session record in Redis

**Cleanup**: (OPTIONAL)

- Close database connection

**💡 Implementation Hint**: (OPTIONAL)
Use bcrypt for password verification (cost factor 12)
Generate tokens with crypto.randomBytes (256 bits entropy)

**🚨 Constraint**: (OPTIONAL but RECOMMENDED)

- Password MUST be hashed before comparison (never plaintext)
- Token MUST expire after 24 hours
- MUST NOT log password in any form
- Response time MUST be < 200ms (p95)

**✅ Acceptance Criteria**: (OPTIONAL but RECOMMENDED)

- [ ] Valid credentials return JWT token
- [ ] Invalid credentials show error message
- [ ] Failed attempts increment counter
- [ ] Successful login updates lastLogin

**🧪 Test Scenarios**: (OPTIONAL but RECOMMENDED)

1. **Valid Login**:
   - Input: {email: "user@test.com", password: "Valid123!"}
   - Expected: {token: <JWT>, expiresAt: <timestamp>}
2. **Invalid Password**:
   - Input: {email: "user@test.com", password: "wrong"}
   - Expected: {error: "Invalid credentials"}
3. **Account Locked**:
   - Precondition: 5 failed attempts
   - Input: valid credentials
   - Expected: {error: "Account locked", code: 423}
```

### Type Notation

```markdown
Primitives: string, number, boolean, datetime, uuid
Collections: string[], Array<User>
Objects: {field1: type, field2: type}
Unions: Type1 | Type2
Optional: field?: type
Enums: 'value1' | 'value2' | 'value3'
```

### RFC 2119 Keywords (in Constraints)

- **MUST** / REQUIRED: Absolute requirement
- **MUST NOT**: Absolute prohibition
- **SHOULD** / RECOMMENDED: Strong preference
- **SHOULD NOT**: Strong discouragement
- **MAY** / OPTIONAL: Truly optional

---

## Complete Example

```markdown
# Project: Task Management App

## Domain Concepts

### Task

**Identity**: UUID
**Properties**:

- title: short description
- status: enum (todo, in-progress, done)
- priority: enum (low, medium, high)
  **Relationships**:
- Belongs to one Project (N:1)

---

## Component: TaskCard

Display single task with drag capability

### Role: Presentation

### 📐 Appearance

- Card: white background, 8px border radius
- Border: 1px solid gray
- Shadow on hover: subtle elevation
- Dragging state: 0.5 opacity

### 📦 Content

- Priority indicator (colored dot)
- Task title (bold)
- Assignee avatar (if assigned)

---

### ⚡ Capabilities

#### dragStart

**Contract**: Initiate drag to move task between columns

**Trigger**: MouseDown + MouseMove on card

**Flow**:

1. Create ghost element (semi-transparent copy)
2. Hide original (opacity 0.5)
3. Ghost follows cursor
4. On MouseUp:
   IF dropped on valid column THEN
   a. Update task.status
   b. Move to new column
   ELSE
   a. Animate back to origin

**Side Effect**:

- task.status updated
- Parent KanbanBoard re-renders

**Cleanup**:

- Remove ghost element
- Restore opacity to 1.0

**🚨 Constraint**:

- MUST NOT allow drag without edit permission
- Drag MUST complete in < 100ms
- MUST prevent text selection during drag

**✅ Acceptance Criteria**:

- [ ] Card draggable with mouse and touch
- [ ] Ghost element appears during drag
- [ ] Drop updates status correctly
- [ ] Invalid drop returns card to origin

**🧪 Test Scenarios**:

1. **Successful Drag**:
   - Drag from "Todo" to "In Progress"
   - Expected: status = "in-progress", card in new column
2. **Cancelled Drag**:
   - Release outside valid zone
   - Expected: card returns to origin, status unchanged

---

## 💡 Global Implementation Hints

- Use React 18+ functional component
- Consider react-beautiful-dnd for drag-drop
- Memoize with React.memo

## 🚨 Global Constraints

- Component MUST be keyboard accessible
- Component MUST work on touch devices
- Component MUST NOT make direct API calls

## ✅ Acceptance Criteria

- [ ] Renders all task properties correctly
- [ ] All capabilities functional desktop + mobile
- [ ] 90%+ test coverage
```

---

## Best Practices

### Writing Contracts

**DO**:

- Start with action verb: "Authenticate user", "Calculate total"
- Be specific: "Generate JWT token valid for 24 hours"
- Make testable: contract → assertion

**DON'T**:

- Be vague: "Handle user login"
- Mix with implementation: "Use bcrypt to hash"
- Too high-level: "Make user happy"

### Defining Constraints

**DO**:

- Use RFC 2119 keywords (MUST, SHOULD, MAY)
- Be measurable: "< 200ms", not "fast"
- Separate concerns: security, performance, functional

**DON'T**:

- Use ambiguous terms: "should be quick"
- Conflate hints with constraints

### Scoping Flows

**Include Flow when**:

- Multi-step processes (login, checkout)
- Branching logic (IF/ELSE)
- Multiple service integrations

**Omit Flow when**:

- Single atomic operation ("toggle boolean")
- Self-explanatory contract ("Validate email")
- Straightforward lookup ("Get user by ID")

### Implementation Hints vs Constraints

**Hint** (💡): Suggestion, can be ignored if alternative achieves contract
**Constraint** (🚨): Mandatory, cannot be violated

**Rule**: If violation breaks system → Constraint. If suboptimal but workable → Hint.

### Writing Test Scenarios

**Include**:

- Clear preconditions
- Specific inputs
- Expected outcomes
- Edge cases

**Example**:

```markdown
🧪 Test Scenarios:

1. **Valid Login**:
   - Precondition: User exists with email "test@example.com"
   - Input: {email: "test@example.com", password: "Valid123!"}
   - Expected: {token: <JWT>, expiresAt: <now + 24h>}
2. **Concurrent Login**:
   - Input: Same user from 2 devices
   - Expected: Both sessions valid, no invalidation
```

---

## Common Pitfalls

### Mixing Abstraction Levels

```markdown
❌ BAD (implementation details):
Contract: Hash password with bcrypt cost 12 and store in PostgreSQL

✅ GOOD (intent):
Contract: Securely store user password
🚨 Constraint: Password MUST be hashed (never plaintext)
💡 Hint: Use bcrypt with cost factor 12
```

### Over-Specifying Visual Details

```markdown
❌ BAD:
📐 Appearance:

- Font: Inter, 14px, weight 500, line-height 1.5, letter-spacing -0.01em

✅ GOOD:
📐 Appearance:

- Typography: Clear, readable body text
  💡 Hint: Consider Tailwind: text-sm font-medium
```

### Unclear Constraints

```markdown
❌ BAD:
🚨 Constraint: Must be fast

✅ GOOD:
🚨 Constraint:

- Initial load MUST complete in < 2s (p95)
- API response MUST be < 200ms (p95)
- UI MUST remain responsive (show loading state)
```

### Missing Expected Outcomes

```markdown
❌ BAD:
🧪 Test: User clicks login button

✅ GOOD:
🧪 Test:

1. **Login with Valid Credentials**:
   - Input: {email: "valid@test.com", password: "correct"}
   - Expected: Redirect to /dashboard, token stored
```

### Business Logic in Presentation

```markdown
❌ BAD (violates Rule 5):
Component: PriceDisplay
Role: Presentation
⚡ calculateDiscount
Flow: IF user.isPremium THEN discount = 0.20

✅ GOOD:
Component: PriceDisplay
Role: Presentation
⚡ displayPrice
Contract: Render formatted price with discount applied
Input: {originalPrice: number, finalPrice: number}
```

---

## FAQ

### General

**Q: What is ISL?**
A: Structured Markdown for software specifications that LLMs can deterministically convert to code. Useful for architects, developers, and AI-assisted development.

**Q: ISL vs traditional docs?**
A: Traditional docs describe what exists. ISL prescribes what should be built, with explicit contracts, constraints, and test integration.

**Q: Can I use ISL without LLMs?**
A: Yes! Valuable as detailed design docs, test plans, API documentation, and shared vocabulary. But true power emerges with LLM generators.

**Q: What languages does ISL support?**
A: Language-agnostic. Same spec can generate React, Vue, Node.js, Python, Java, Go, etc. Implementation Hints can suggest preferred stack.

### Writing Specs

**Q: How much detail?**
A: Goldilocks Principle:

- Too little → non-deterministic output
- Too much → inflexible, hard to maintain
- Just right → clear contracts, measurable constraints, suggested strategies

**Q: When to use Flow vs just Contract?**
A: Use Flow for multi-step processes, branching logic, multiple services, complex algorithms. Omit for single operations or self-explanatory contracts.

**Q: How to handle optional features?**
A: Three approaches:

1. Mark capability as (OPTIONAL)
2. Use SHOULD instead of MUST in constraints
3. Document as future enhancement

**Q: Can I reference other ISL documents?**
A: Yes, using blockquote syntax:

```markdown
## Domain Concepts

> **Reference**: Core entities in [`./domain.isl.md`](./domain.isl.md)
```

### LLM Code Generation

**Q: How to ensure deterministic generation?**
A:

1. Explicit Domain Concepts
2. Complete Contracts with signatures
3. Measurable Constraints ("< 200ms", not "fast")
4. Comprehensive Test Scenarios
5. Clear Implementation Hints

**Q: What if LLM violates constraints?**
A: Indicates:

1. Specification ambiguity → refine constraint
2. LLM non-compliance → report issue
3. Constraint impossible → relax (MUST → SHOULD)

**Q: Can ISL be version-controlled?**
A: Absolutely! Plain Markdown perfect for Git. Track evolution, review changes via PRs, link to issues.

### Integration

**Q: Development workflow integration?**
A: Common patterns:

1. **Spec-First**: Write ISL → Generate code → Implement tests → Refine
2. **Documentation-Driven**: Write ISL → Review → Implement manually → Tests from spec
3. **Hybrid**: Write ISL → Generate scaffold → Implement logic → Generate tests

**Q: Legacy code documentation?**
A: Yes! Reverse engineer: analyze code → extract contracts → document constraints → write scenarios → refine spec.

---

## Quick Reference Card

```
# ISL Quick Reference

## Structure
# Project: Name
## Domain Concepts
  ### Entity
## Component: Name
  ### Role: Presentation | Backend
  ### 📐 Appearance/Interface
  ### 📦 Content/Structure
  ### ⚡ Capabilities
    #### CapabilityName
  ### 💡 Global Hints
  ### 🚨 Global Constraints
  ### ✅ Acceptance Criteria
  ### 🧪 Test Scenarios

## Capability Structure
#### name
Signature: input/output types
Contract: Promise (REQUIRED)
Trigger: Event
Flow: Steps
Side Effect: Mutations
Cleanup: Finalization
💡 Hint: Guidance
🚨 Constraint: Rules (NORMATIVE)
✅ Acceptance: Tests (NORMATIVE)
🧪 Scenarios: Cases (NORMATIVE)

## Canonical Rules
1. ⚡🚨✅🧪 = NORMATIVE (must implement)
2. Precedence: Capability > Global > Contract > Hint
3. Determinism: Same ISL → Same Code
4. Boundary: Intent not implementation (no pseudocode)
5. Role Separation: Presentation ≠ Business Logic
6. Optionality: (OPTIONAL) = may omit, not ignore

## RFC 2119 Keywords
MUST = absolute requirement
MUST NOT = absolute prohibition
SHOULD = strong preference
MAY = truly optional
```

---

## Template

```markdown
# Project: [Name]

[Brief description]

**Version**: 1.0.0
**ISL Version**: 1.6
**Created**: YYYY-MM-DD

---

## Domain Concepts

### [EntityName]

**Identity**: UUID | Composite key
**Properties**:

- property1: description
- property2: enum (value1, value2)
  **Relationships**:
- Relationship to OtherEntity (1:N)

---

## Component: [ComponentName]

[Description]

### Role: Presentation | Backend

### 📐 Appearance / Interface (OPTIONAL)

[Presentation: CSS, colors, layout]
[Backend: Routes, schemas, headers]

### 📦 Content / Structure (OPTIONAL)

[Presentation: DOM hierarchy]
[Backend: Dependencies, class members]

---

### ⚡ Capabilities / Methods (OPTIONAL)

#### [capabilityName]

**Signature**: (OPTIONAL)

- **input**: {param: type}
- **output**: {result: type} | {error: type}

**Contract**: What this promises to do

**Trigger**: Activation event

**Flow**: (REQUIRED if multi-step)

1. Step 1
2. Step 2
   IF condition THEN
   a. Branch A
   ELSE
   b. Branch B

**Side Effect**: State mutations

**Cleanup**: Finalization

**💡 Implementation Hint**: Guidance (non-normative)

**🚨 Constraint**:

- MUST requirement
- MUST NOT prohibition
- SHOULD recommendation

**✅ Acceptance Criteria**:

- [ ] Criterion 1
- [ ] Criterion 2

**🧪 Test Scenarios**:

1. **Scenario Name**:
   - Precondition: Initial state
   - Input: Specific data
   - Expected: Precise outcome

---

### 💡 Global Implementation Hints (OPTIONAL)

- Architectural notes
- Recommended libraries

### 🚨 Global Constraints (OPTIONAL)

- Component-wide rules

### ✅ Acceptance Criteria (OPTIONAL)

- [ ] Component criterion 1

### 🧪 Test Scenarios (OPTIONAL)

1. **Integration Scenario**: Description
```

---

## Contributing

ISL is open for contributions:

1. **Propose Changes**: Open issue with enhancement
2. **Draft Specification**: Submit PR
3. **Community Review**: Gather feedback
4. **Approval**: Maintainers review
5. **Versioning**: Breaking → major, additions → minor

**Guidelines**:

- Prefer additive over breaking changes
- Be unambiguous
- Include examples
- Consider tooling impact

---

## Appendix: LLM-First Enhancements Applied

This documentation has been optimized following LLM-first principles:

### 1. Front-Loaded Critical Information

- Core Identity section at top
- Quick Start before deep theory
- Canonical Rules early (most referenced)

### 2. Progressive Disclosure

- Quick Start → Rules → Structure → Details → Advanced
- Complexity increases gradually
- Can stop reading at any point with useful knowledge

### 3. Consistent Structure

- All sections follow: Purpose → Format → Guidelines → Examples
- Predictable navigation
- Easy to reference specific patterns

### 4. Semantic Markers

- Emoji for quick visual categorization
- **Bold** for semantic anchors (entities, components)
- Code blocks for concrete examples
- Blockquotes for important notes

### 5. Practical Examples

- Every concept has concrete example
- Examples show both ❌ BAD and ✅ GOOD
- Complete working specifications provided

### 6. Self-Contained Sections

- Each section understandable independently
- Minimal forward/backward references
- Quick Reference Card for lookup

### 7. Explicit Context

- Version info at top
- Status markers (NORMATIVE, OPTIONAL)
- RFC 2119 keyword definitions inline

### 8. Reduced Redundancy

- Single source of truth for each concept
- Cross-references where needed
- Template consolidates all patterns

---

**End of LLM-First Documentation**

For questions: [Repository URL]
License: [TBD - suggest MIT/Apache 2.0]
