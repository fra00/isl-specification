# Intent Specification Language (ISL) v1.6.2

**Proposal Document**

---

## Document Status

- **Target Version**: 1.6.2
- **Status**: Draft Proposal
- **Compatibility Goal**: Backward-compatible with ISL v1.6.1
- **Primary Input**: Lessons extracted from the Dungeon project (`example/dungeon`), the current official specification, and the current builder/generator workflow

---

## Purpose

This document proposes a focused evolution of **ISL v1.6.1** toward **v1.6.2**.

The goal is **not** to redesign the language from scratch. The goal is to:

- keep the current Markdown-first and human-writable nature of ISL
- preserve existing documents wherever possible
- formalize patterns that are already used successfully in complex real projects
- reduce ambiguity in areas where current projects rely too heavily on convention or tool-specific behavior

The Dungeon project demonstrates that ISL already scales to a non-trivial system with:

- multi-file domain modeling
- complex UI orchestration
- stateful runtime boundaries
- embedded runtime DSL behavior
- logic-test specifications at project scale

This proposal captures what that case study suggests should become explicit in the language.

---

## Design Goals For v1.6.2

### 1. Preserve Backward Compatibility

Existing v1.6.1 documents SHOULD remain valid without mandatory rewrites.

### 2. Formalize Real-World Usage

Patterns already used in mature projects SHOULD become first-class or officially recommended.

### 3. Reduce Hidden Conventions

Critical semantics such as state ownership, mutation boundaries, operational rules, and testing structure SHOULD no longer depend only on prose habits.

### 4. Improve Generator Determinism

The language SHOULD better expose the distinctions between:

- stable domain contracts
- transient UI state
- persistent state mutation boundaries
- operational semantics required for deterministic generation

### 5. Keep ISL Human-First

ISL v1.6.2 SHOULD remain Markdown-based and readable. The proposal favors **new standard sections and patterns** before introducing heavy new syntax.

---

## Non-Goals

ISL v1.6.2 does NOT aim to:

- become a programming language
- replace generated code with executable inline syntax
- introduce a fully formal grammar for every domain-specific runtime
- force all projects to use all new patterns
- break existing Presentation/Backend-oriented documents

---

## Summary Of Proposed Changes

ISL v1.6.2 SHOULD introduce or formalize the following areas:

1. Expanded role taxonomy
2. State modeling sections
3. Mutation boundary pattern
4. Operational semantics pattern
5. Embedded DSL pattern
6. Decision rules pattern
7. Effect lifecycle pattern
8. Testing structure improvements
9. Clarified Flow semantics
10. Tooling/protocol alignment fixes

---

## 1. Expanded Role Taxonomy

### Problem

The current base format still presents `Presentation / Backend` as the required role pair, while real projects already use additional roles such as:

- `Domain`
- `Business Logic`
- `Test`

These roles are already meaningful, stable, and widely useful.

### Proposal

ISL v1.6.2 SHOULD officially recognize the following standard roles:

- `Presentation`
- `Backend`
- `Domain`
- `Business Logic`
- `Test`

### Intended Semantics

- **Presentation**: UI rendering, interaction surfaces, visual behavior
- **Backend**: API contracts, persistence, service orchestration, integration boundaries
- **Domain**: entities, value structures, enumerations, static rules, shared concepts
- **Business Logic**: deterministic use cases, state transitions, orchestration rules, non-visual runtime behavior
- **Test**: scenario specifications, fixtures, assertions, behavior validation inputs for test generation or audit

### Compatibility Rule

Documents using only `Presentation` and `Backend` remain valid.

---

## 2. State Model Sections

### Problem

Complex projects repeatedly need to distinguish among:

- persisted state
- transient UI/process state
- derived state

Today this distinction is usually expressed via prose inside `Content/Structure`, `Capabilities`, or ad hoc notes.

### Proposal

ISL v1.6.2 SHOULD add the following optional standard sections for components that own or interpret state:

- `### 🗂 State Model`
- `### 🗂 Persistent State`
- `### 🗂 Transient State`
- `### 🗂 Derived State`

### Example

```markdown
### 🗂 State Model

#### Persistent State

- `gameSession`: authoritative persisted dungeon snapshot

#### Transient State

- `hoveredPath`: current pointer path preview
- `isMoving`: movement animation flag

#### Derived State

- `canAttack`: derived from visible enemies and effective stats
```

### Intended Benefit

This improves generator clarity around what must be persisted, what must remain local, and what must be recalculated.

---

## 3. Mutation Boundary Pattern

### Problem

Complex stateful applications often centralize persistence inside one component or boundary. Current ISL can describe this, but only informally.

### Proposal

ISL v1.6.2 SHOULD standardize a **Mutation Boundary** pattern for components that own authoritative state writes.

Recommended optional section:

- `### 🔒 Mutation Boundary`

### Example

```markdown
### 🔒 Mutation Boundary

- This component owns all persistent writes to `@GameSession`.
- Downstream components MUST delegate durable mutations through this boundary.
- Callers MAY hold transient local state, but MUST NOT persist directly.
```

### Additional Recommendation

The spec SHOULD explicitly recognize the **functional updater** pattern as a deterministic state-mutation strategy.

---

## 4. Operational Semantics Pattern

### Problem

Some behaviors are too complex to be expressed only as high-level intent, yet they are still specification-level and not implementation noise. Current rules can mistakenly classify them as too algorithmic.

### Proposal

ISL v1.6.2 SHOULD distinguish between:

- forbidden low-level pseudocode tied to language syntax
- acceptable **operational semantics** required for deterministic behavior

Recommended optional section:

- `### ⚙ Operational Semantics`

### Clarification

Operational Semantics MAY describe:

- event matching rules
- evaluation order
- transition rules
- normalization rules
- deterministic execution contracts

Operational Semantics MUST NOT become framework-specific source code.

### Example

```markdown
### ⚙ Operational Semantics

- Scripts are evaluated in map order.
- One-time entries execute at most once per stable script key.
- Condition blocks are evaluated depth-first.
```

---

## 5. Embedded DSL Pattern

### Problem

Some systems embed secondary languages or command formats inside the runtime domain. Current ISL can describe them, but there is no standard pattern for doing so.

### Proposal

ISL v1.6.2 SHOULD introduce a standard pattern for embedded domain-specific languages.

Recommended optional sections:

- `### 🧩 Embedded DSL`
- `### 🧩 Grammar`
- `### 🧩 Opcodes`
- `### 🧩 Conditions`
- `### 🧩 Execution Rules`

### Example

```markdown
### 🧩 Embedded DSL

- This component interprets mission script commands stored in map data.

### 🧩 Opcodes

- `msg`: emit notification text
- `aggoro`: add gold to active hero
- `fineturno`: force end of turn

### 🧩 Execution Rules

- Unknown statements are treated as implicit messages.
- Nested blocks close with `end`.
```

### Intended Benefit

This pattern makes internal runtime DSLs auditable and spec-native without pretending they are ordinary UI/backend capabilities.

---

## 6. Decision Rules Pattern

### Problem

Several complex domains require explicit decision policies rather than simple action contracts. Examples include AI targeting, walkability, visibility transitions, spawn priority, and exit conditions.

### Proposal

ISL v1.6.2 SHOULD add a standard optional section:

- `### 🧭 Decision Rules`

### Example

```markdown
### 🧭 Decision Rules

- Prefer visible cells in the same area before searching globally.
- Treat door transitions as legal topology crossings.
- If multiple valid targets exist, choose the nearest one.
```

### Intended Benefit

This gives a better home to deterministic selection policy than overloading `Flow` or `Implementation Hint`.

---

## 7. Effect Lifecycle Pattern

### Problem

Temporary effects such as buffs, debuffs, spell states, cooldowns, and one-shot traversal permissions require explicit lifecycle semantics. Current ISL usually describes these through scattered capability prose.

### Proposal

ISL v1.6.2 SHOULD introduce a standard optional section:

- `### 🔄 Effect Lifecycle`

Recommended structure:

- `Apply`
- `Active While`
- `Expires When`
- `Cleanup`

### Example

```markdown
### 🔄 Effect Lifecycle

- `RockSkin`
  - Apply: when the spell is cast on a hero
  - Active While: hero has not yet suffered damage
  - Expires When: hero receives damage greater than 0
  - Cleanup: remove status from `activeStatus`
```

---

## 8. Testing Structure Improvements

### Problem

Large test suites currently require repetitive wrappers and verbose prose to express fixtures, repeated guards, and assertion intent.

### Proposal

ISL v1.6.2 SHOULD formally support `Role: Test` and define a lightweight testing extension model.

Recommended optional sections:

- `### 🧪 Fixtures`
- `### 🧪 Scenario Groups`
- `### 🧪 Assertions`
- `### 🧪 Parameter Sets`

### Conservative Strategy

These SHOULD begin as **standard optional sections**, not hard mandatory syntax.

### Example

```markdown
### 🧪 Fixtures

- `defaultSession`: two heroes, one monster, visible room

### 🧪 Scenario Groups

#### Walkability Rules

1. **Hero Cannot End On Occupied Cell**:
   - Given: `defaultSession`
   - When: destination is occupied by another hero
   - Assert: move is rejected
```

### Future Candidate

If these patterns stabilize, a later version MAY introduce first-class fixture and parametrization syntax.

---

## 9. Clarified Flow Semantics

### Problem

Current guidance correctly avoids source-code pseudocode, but in practice some complex runtime behavior needs more precise sequencing than simple contract language.

### Proposal

ISL v1.6.2 SHOULD clarify that `Flow` is valid when it describes:

- business-visible sequencing
- state-transition order
- evaluation order that affects observable behavior
- deterministic branching policy

ISL v1.6.2 SHOULD clarify that `Flow` is invalid when it describes:

- language-specific syntax
- variable-by-variable implementation mechanics
- framework lifecycle trivia with no behavioral impact

### Practical Rule

`Flow` MAY be procedural in structure, but MUST remain semantic rather than code-like.

---

## 10. Tooling And Protocol Alignment

### Problem

Some documentation and protocol descriptions no longer perfectly match the current toolchain behavior.

### Proposal

ISL v1.6.2 SHOULD align supporting documentation with the real builder/generator pipeline.

Areas to normalize:

- signature artifact naming
- manifest/build terminology
- stateful incremental compilation terminology
- dependency-signature injection terminology

### Recommendation

The language spec itself SHOULD stay tool-agnostic where possible, but the companion protocol document SHOULD accurately describe current behavior.

---

## Recommended New Standard Sections

The following sections are proposed as **official optional sections** for v1.6.2:

- `### 🗂 State Model`
- `### 🗂 Persistent State`
- `### 🗂 Transient State`
- `### 🗂 Derived State`
- `### 🔒 Mutation Boundary`
- `### ⚙ Operational Semantics`
- `### 🧩 Embedded DSL`
- `### 🧩 Grammar`
- `### 🧩 Opcodes`
- `### 🧩 Conditions`
- `### 🧩 Execution Rules`
- `### 🧭 Decision Rules`
- `### 🔄 Effect Lifecycle`
- `### 🧪 Fixtures`
- `### 🧪 Scenario Groups`
- `### 🧪 Assertions`
- `### 🧪 Parameter Sets`

These sections SHOULD remain optional and composable.

---

## Recommended Canonical Rule Adjustments

### Rule Adjustment A: Role Recognition

The Canonical Rules SHOULD recognize `Domain`, `Business Logic`, and `Test` as official roles in addition to `Presentation` and `Backend`.

### Rule Adjustment B: Behavioral Precision

The Boundary rule SHOULD explicitly allow **operational semantics** when needed to preserve deterministic behavior.

### Rule Adjustment C: State Ownership

When a component declares a Mutation Boundary or State Model, compliant generators SHOULD respect those declarations as normative guidance for state placement and mutation routing.

### Rule Adjustment D: Test Role

For `Role: Test`, scenario structure and assertion semantics SHOULD be treated as normative for test generation and audit workflows.

---

## Migration Guidance

### Existing Documents

Existing v1.6.1 documents SHOULD continue to work unchanged.

### Gradual Upgrade Path

Projects MAY adopt v1.6.2 progressively:

1. keep existing roles and sections unchanged
2. add `Domain`, `Business Logic`, and `Test` where already used in practice
3. introduce `State Model` only for stateful components
4. introduce `Operational Semantics` only where deterministic execution requires it
5. introduce test extensions only in dedicated test specifications

### Priority Migration Candidates

The following component types are the best early adopters:

- session/state boundaries
- orchestration hooks
- embedded interpreters
- AI decision systems
- logic-test files with repeated scenario boilerplate

---

## Suggested Example Domains For v1.6.2 Documentation

The official documentation SHOULD include at least one example for each of the following:

1. A `Domain` role file
2. A `Business Logic` orchestration file
3. A `Test` role file
4. A stateful component using `State Model`
5. A deterministic embedded DSL interpreter using `Operational Semantics`
6. A temporary-effect example using `Effect Lifecycle`

---

## Open Questions

The following questions should be resolved before finalizing v1.6.2:

1. Should `State Model` be one umbrella section, or should `Persistent/Transient/Derived` always be separate subsections?
2. Should `Operational Semantics` be normative by default, or only when explicitly marked as such?
3. Should `Role: Test` remain scenario-prose-only in 1.6.2, or should basic assertion markers already be standardized?
4. Should embedded DSLs remain purely descriptive, or should ISL define a small common grammar schema for them?
5. Should the code-generation protocol document use abstract signature artifacts, or name current concrete file formats explicitly?

---

## Final Recommendation

ISL v1.6.2 SHOULD be treated as a **stabilization and formalization release**, not as a disruptive redesign.

The best path forward is:

- formalize patterns already proven in complex projects
- clarify where high-precision behavior is allowed and desirable
- strengthen state, testing, and runtime semantics
- keep the language readable and backward-compatible

This approach would let ISL mature naturally from a strong specification format into a more complete system-design language without losing the simplicity that currently makes it effective.
