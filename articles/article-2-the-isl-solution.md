# Engineering Intent: The Anatomy of ISL

_Part 2 of 3 — Engineering Intent Series_

In the first part of this series, we identified the "Ambiguity Tax" — the inherent cost of inconsistent code produced by treating LLMs as creative assistants rather than deterministic engines. Today, we dive into the anatomy of the solution: **ISL (Intent Specification Language)**.

---

## Beyond Prompting: The Contract Layer

Standard prompt engineering relies on "hope." You hope the model interprets your bullet points correctly. ISL shifts this paradigm by introducing a **formal contract layer**. It's less like talking to a developer and more like writing an IKEA manual for software.

An IKEA manual doesn't describe the molecular structure of the wood. It tells you:

1. **What parts** you must have (**Domain**)
2. **What actions** to perform in which order (**Capabilities & Flows**)
3. **How to verify** the result (**Acceptance Criteria**)

Regardless of who reads the manual, the finished table looks exactly the same. The goal isn't byte-for-byte identical code — LLMs are still probabilistic — but **reliable semantic consistency**. Same spec, same behavior, every time.

---

## The Three Pillars of an ISL Component

Every ISL specification is built on three normative pillars, marked by semantic anchors that guide the LLM's reasoning:

### 1. ⚡ Capabilities: The "What"

Capabilities define observable behavior. Each capability includes a **Contract**, a **Trigger**, and a **Flow**.

The Flow describes logical state transitions in natural language — not algorithms. Instead of writing a loop, you specify: _"Calculate the final price including the regional tax rate."_ This allows the LLM to generate idiomatic code for the target language — TypeScript, Go, Python — while strictly adhering to the business rule.

### 2. 🚨 Constraints: The Non-Negotiables

ISL uses **RFC 2119** keywords (MUST, SHOULD, MAY) to establish a hierarchy of rules:

- `MUST NOT store passwords in plaintext` — a hard stop for the generator, regardless of language.
- `SHOULD use async/await for I/O operations` — architectural guidance, not a mandate.

These keywords explicitly restrict the model's "creativity" in areas where consistency is critical.

### 3. ✅ Acceptance Criteria: The Ground Truth

Acceptance criteria are testable outcomes. If a behavior cannot be verified by an acceptance criterion, it isn't fully specified — it's hoped for. These criteria are the primary reference the **Auditor** uses to validate generated code (more on that in Part 3).

---

## Constraints vs. Implementation Hints

One of the most powerful distinctions in ISL is between a mandatory **Constraint** (🚨) and a non-binding **Implementation Hint** (💡).

- **Constraint (🚨)** — if violated, the system is broken or insecure.
  _Example: "Passwords MUST be hashed before storage."_

- **Hint (💡)** — a suggestion the LLM can ignore if it finds a more idiomatic approach that still satisfies the contract.
  _Example: "Consider using bcrypt for hashing."_

This distinction is what gives ISL the "senior developer" quality. If the LLM decides that Argon2 is a better fit for the target environment, it can use it — as long as the mandatory constraint (hashing) is satisfied. We are constraining the **outcome**, not micro-managing the **implementation**.

---

## Role Separation: Preventing Logic Leaks

The most common source of technical debt in AI-assisted development is "logic leaking" — business rules buried in UI components, database details polluting service layers.

ISL enforces separation of concerns through **Roles**:

- **Role: Domain** — pure data structures and enums. No logic allowed.
- **Role: Business Logic** — pure state management and calculations. No UI or DB knowledge.
- **Role: Presentation** — maps user input to logic triggers and renders state. Nothing else.

By declaring a Role at the top of each spec file, we provide the LLM with a restricted mental model. A Presentation component is structurally prevented from making database calls because its grammar doesn't allow it. Architectural drift is eliminated before a single line of code is generated.

---

## The Boundary Rule (Rule 4): Intent, Not Implementation

The most important principle of ISL is **Rule 4: Intent, not Implementation**. When describing a flow, avoid low-level control flow and syntax entirely.

**❌ Invalid — this is pseudocode, not a spec:**

```
FOR (i = 0; i < list.length; i++) {
  if (list[i].active) count++
}
```

This locks the LLM into a specific implementation. It can't generate idiomatic Kotlin, Python, or Go — it just transcribes your pseudocode.

**✅ Valid — this is intent:**

```markdown
**Flow**:

1. Count all active items in the list

🚨 Constraint:

- MUST include only items where status = active
- MUST NOT modify the original list

✅ Acceptance Criteria:

- Returns correct count for a list with mixed active/inactive items
- Returns 0 for an empty list
- Returns 0 when no items are active
```

Same logic. Zero implementation details. The LLM generates idiomatic code in any target language — and you can verify it against the acceptance criteria automatically.

---

## Putting It Together: A Real ISL Component

Here's what all three pillars look like in a single, complete spec:

```markdown
## Component: UserAuthService

### Role: Business Logic

### ⚡ Capabilities

#### authenticateUser

**Contract**: Authenticate user credentials and return a session token

**Trigger**: Called by LoginForm on submit

**Flow**:

1. Validate credential format
2. Verify credentials against stored record
3. IF valid → generate session token
   IF invalid → return structured error

**💡 Implementation Hint**:
Consider bcrypt (cost factor 12) for password verification

**🚨 Constraints**:

- Passwords MUST NOT be compared in plaintext
- Tokens MUST expire after 24 hours
- MUST NOT log passwords in any form
- Response time MUST be < 200ms (p95)

**✅ Acceptance Criteria**:

- [ ] Valid credentials return a token
- [ ] Invalid credentials return an authentication error
- [ ] Expired token returns 401, not 403

**🧪 Test Scenarios**:

1. **Valid Login**: {email: "user@test.com", password: "Valid123!"} → token returned
2. **Wrong Password**: {email: "user@test.com", password: "wrong"} → authentication error
3. **Locked Account**: 5 failed attempts → {error: "Account locked", code: 423}
```

Notice what's not here: no JWT library choice, no bcrypt rounds hardcoded in the flow, no database query structure. The LLM decides the how. The spec owns the what.

---

> **Note**: This article is a summary. For the full, formal documentation, visit the [Complete ISL Specification](<https://github.com/fra00/isl-specification/blob/main/specs/Intent%20Specification%20Language%20(ISL).md>).
> Notably, the ISL specification itself can be used as a **tool-as-prompt** or **skill** for other LLMs, providing them with the necessary framework to reason about software behavior with high precision and consistency.

---

## What's Next

In Part 3, we go inside the engine that transforms this spec into production code — Builder, Compiler, cryptographic signatures, and the Auditor that verifies the result.

**[Part 3: The Tooling Engine →](./article-3-the-tooling-engine.md)**

---

**Tags:** #ISL #LLM #Determinism #AIGeneratedCode #Architecture
