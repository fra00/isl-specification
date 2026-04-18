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
- state ownership and mutation boundaries
- Logic & Execution Rules required for deterministic generation

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

ISL v1.6.2 SHOULD introduce or formalize the following areas. The highest-priority changes for this release are:

1. Expanded role taxonomy
2. Internal state guidance
3. Logic & Execution Rules pattern
4. Effect lifecycle pattern
5. Clarified Flow semantics

The remaining areas are still valuable and useful, but should be considered complementary improvements:

3. Mutation boundary pattern
4. Embedded DSL pattern
5. Decision rules pattern
6. Testing structure improvements
7. Tooling/protocol alignment fixes

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

## 2. Internal State Section

### Problem

Complex projects sometimes need to clarify:

- which values arrive from outside the component
- which values are owned locally
- which values must be derived rather than stored

Today this distinction is usually implicit in `Content/Structure`, `Capabilities`, `Flow`, or ad hoc notes. A heavy taxonomy can be redundant for human authors and can create contradictions when the same distinction is already deducible elsewhere in the specification.

### Proposal

ISL v1.6.2 SHOULD add a lightweight optional section for components where state ownership or derivation is not obvious:

- `### 🗂 Internal State`

Entries in this section MAY use lightweight qualifiers such as:

- `**external**`: value provided by props, context, shared application state, or the hosting engine
- `**internal**`: value owned locally by the component
- `**calculated**`: value derived from other values and SHOULD NOT be stored independently unless explicitly required

### Example

```markdown
### 🗂 Internal State

- `stateApplication` **external**: shared application state provided by the engine
- `isVisible` **internal**: local visibility flag for this component
- `canAttack` **calculated** from `stateApplication.currentHero`, visible enemies, and active rules
```

### Intended Benefit

This gives generators extra clarity where ownership or derivation is ambiguous, without forcing authors to duplicate information that is already obvious from the rest of the specification.

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

## 4. Logic & Execution Rules Pattern

### Problem

Some behaviors are too complex to be expressed only as high-level intent, and the legacy term "operational semantics" (now `Logic & Execution Rules`) has been interpreted inconsistently. Authors often wonder whether these rules are public capabilities, Flow steps, or private implementation notes.

### Proposal

ISL v1.6.2 SHOULD distinguish between:

- forbidden low-level pseudocode tied to language syntax
- acceptable **Logic & Execution Rules** required for deterministic behavior and consistent generation

Recommended optional section:

- `### ⚙ Logic & Execution Rules (operational semantics — normative execution constraints)`

### Clarification

`Logic & Execution Rules` captures the normative rules and checks that an implementation must respect to produce the same observable behaviour across different runtimes. These rules typically cover:

- event matching rules and handlers
- evaluation/evaluation-order constraints
- transition and normalization rules
- idempotency and "one‑time" application semantics
- rounding and numeric normalization
- commit/rollback and atomicity rules at mutation boundaries
- synchronization between UI gating and backend commits

Important constraints:

- `Logic & Execution Rules` MUST NOT contain framework-specific source code, concrete API names, or line‑by‑line implementation algorithms.
- `Logic & Execution Rules` SHOULD specify what is normative (use `MUST`/`SHOULD`) versus what is an `Implementation Note` (non-normative guidance).
- Implementations and generators MAY translate a `Logic & Execution Rules` rule into a function, module or inline logic; the spec does NOT mandate function names or code structure. If a stable mapping to runtime artifacts is required, record that mapping in a companion protocol document or an `Implementation Notes` section.

### How this relates to `Flow` and `Capabilities`

- `Flow` describes the observable sequence (the "what" a user or system experiences).
- `Capabilities` describe the public contract (what the component exposes).
- `Logic & Execution Rules` describes the normative "how" required for deterministic behaviour (order, idempotency, synchronization). Use `Flow` for UX/business sequencing and reference `Logic & Execution Rules` rules from Flow when the ordering or guarantees affect observable results.

Recommendation for referencing: in a `Flow` step add a short reference, e.g. `(ops: DamageCalc, InputGating)`, and define those tags under `### ⚙ Logic & Execution Rules`.

### Example — Damage and Input Gating

```markdown
### Flow

1. Player clicks "Attack".
2. Start attack animation.
3. UI: set `inputDisabled = true`. (ops: DamageCalc, InputGating)
4. System: apply damage to target.
5. Show result (HP change, floating numbers).
6. Re-enable input when `animationEnd && commitSuccess`.

### ⚙ Logic & Execution Rules (operational semantics — normative execution constraints)

#### DamageCalc

- Evaluation order: base -> additive -> multiplicative -> resistances.
- Rounding: apply `floor` after all multipliers.
- Clamp: final damage = max(0, floor(result)).
- Idempotency: operations tagged with a `stableScriptKey` execute at most once.
- Commit: writes to `@GameSession.hp` are atomic and occur at the declared `@MutationBoundary`.

#### InputGating

- On accept: set `inputDisabled = true` immediately.
- Re-enable: only when `animationEnd && commitSuccess`.
- On commit failure: set `inputDisabled = false` and surface an error to the user.

#### Synchronization / Ordering

- The final HP displayed MUST reflect the post-commit state.
- Re-enable MUST wait for `commitSuccess` unless an explicit fail-flow exists.
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

## 11. Symbol Reference Notation

### Problem

Complex specifications use both type references and variable references, but these are often indistinguishable in prose. This ambiguity can cause generators to treat stable domain types as local variables, leading to duplicated code generation and loss of determinism.

### Proposal

ISL v1.6.2 SHOULD standardize two symbols for distinguishing between stable domain contracts and transient local values:

- `@TypeName`: Refers to a domain type, state structure, or reusable entity (defined in Domain or Business Logic roles)
- `` `variableName` ``: Refers to a local variable, parameter, field, or temporary value in Flow or signatures

### Example

```markdown
### Role: Business Logic

- `gameSession`: @GameSession
- `spell`: @Spell

### Flow

1. Find `targetMonster` in `gameSession.monsters`.
2. Apply spell damage to `targetMonster`.
3. Persist changes via `commitSessionUpdate`.
```

In this example:

- `@GameSession` and `@Spell` are domain types defined elsewhere
- `targetMonster`, `gameSession`, `spell` are local variables or parameters

### Intended Benefit

This notation helps generators understand the difference between:

- **Contracts** (`@Type`): reusable, stable, should be referenced not duplicated
- **Values** (`` `var` ``): transient, local scope, should not be assumed as reusable

Deterministic code generation depends on this distinction: a generator that treats `@GameSession` as a local variable might regenerate it instead of reusing the shared instance.

### Backward Compatibility

- Documents using only backticks or plain text remain valid
- Authors MAY adopt this notation gradually
- Generators that see `@Type` MUST treat it as a reference to an externally-defined type

---

## Recommended New Standard Sections

The following sections are proposed as **official optional sections** for v1.6.2.

### Core optional sections for this release

- `### 🗂 Internal State`
- `### ⚙ Logic & Execution Rules (operational semantics — normative execution constraints)`
- `### 🔄 Effect Lifecycle`
- `### 🧭 Decision Rules`
- `### 🧪 Fixtures`
- `### 🧪 Scenario Groups`
- `### 🧪 Assertions`

### Complementary optional sections

- `### 🔒 Mutation Boundary`
- `### 🧩 Embedded DSL`
- `### 🧩 Grammar`
- `### 🧩 Opcodes`
- `### 🧩 Conditions`
- `### 🧩 Execution Rules`
- `### 🧪 Parameter Sets`

These sections SHOULD remain optional and composable.

---

## Recommended Canonical Rule Adjustments

### Rule Adjustment A: Role Recognition

The Canonical Rules SHOULD recognize `Domain`, `Business Logic`, and `Test` as official roles in addition to `Presentation` and `Backend`.

### Rule Adjustment B: Behavioral Precision

The Boundary rule SHOULD explicitly allow **Logic & Execution Rules** when needed to preserve deterministic behavior.

### Rule Adjustment C: State Ownership

When a component declares a Mutation Boundary or Internal State section, compliant generators SHOULD respect those declarations as normative guidance for state ownership, derivation, and mutation routing.

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
3. introduce `Internal State` only where ownership or derivation is not obvious
4. introduce `Logic & Execution Rules` only where deterministic execution requires it
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
4. A component using `Internal State` to clarify non-obvious state ownership
5. A deterministic embedded DSL interpreter using `Logic & Execution Rules`
6. A temporary-effect example using `Effect Lifecycle`

---

## Open Questions

The following questions should be resolved before finalizing v1.6.2:

1. Should `Internal State` remain a single lightweight section with inline qualifiers, or should grouped subsections also be allowed?
2. Should `Logic & Execution Rules` be normative by default, or only when explicitly marked as such?
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
