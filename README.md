# Intent Specification Language (ISL) 1.6.1

**Intent Specification Language (ISL)** is a structured, intent-first specification language designed to describe **what software should do**, not **how it should be implemented**.

ISL enables humans and Large Language Models (LLMs) to reason deterministically about software behavior, contracts, constraints, and acceptance criteria — across frontend, backend, and system boundaries.

> **ISL is a language, not a template.**
> Writing ISL-compliant documents requires understanding its canonical rules and grammar.

---

## Why ISL Exists

Modern software specifications often suffer from one or more of these problems:

- They mix intent with implementation
- They are ambiguous or non-testable
- They are hard to translate into working code
- They are unsuitable for AI-assisted development

ISL was created to solve these issues by providing:

- **Explicit contracts** (inputs, outputs, behavior)
- **Normative constraints** (MUST / SHOULD / MAY)
- **Built-in testability** (acceptance criteria and test scenarios)
- **Deterministic interpretation** for LLM-based code generation
- **Clear separation of concerns** (presentation vs business logic)
- **High token efficiency** (concise, structured format reduces context usage)

ISL is **language-agnostic**, **framework-agnostic**, and **LLM-friendly by design**.

---

## ⚠️ Read the Specification (Important)

This repository contains **the official ISL language specification**.

The README provides:

- an overview
- a minimal quick start
- a reference example

👉 **It does NOT replace the full specification.**

To write **ISL-compliant** documents, you **must read the complete specification**, including:

- Canonical Rules
- Grammar and semantics
- Section precedence
- Best practices and pitfalls

📘 **Full Specification**:
👉 [`Intent Specification Language (ISL)`](<./specs/Intent%20Specification%20Language%20(ISL)%20.md>)

---

# ISL Tools

This directory contains the official tooling ecosystem for **Intent Specification Language (ISL)**.

## 🛠️ Available Tools

- **[VS Code Extension](./tools/vscode-isl)**: The complete IDE experience with validation, snippets, and compilation.
- **[ISL Builder](./tools/vscode-isl/src/isl-builder.ts)**: Resolves dependencies, handles transclusion, and prepares build contexts.
- **[ISL Compiler](./tools/vscode-isl/src/isl-generator.ts)**: Generates executable code (`bin/`) and signatures (`.sign.json`) using LLMs.
- **ISL Test**: Generates unit tests automatically from ISL specs and implementations.
- **ISL Create**: CLI tool to generate ISL drafts from natural language descriptions.

---

## What ISL Is (and Is Not)

### ISL IS:

- A formal specification language
- A way to describe behavior, contracts, and observable effects
- Suitable for humans and LLMs
- Designed for deterministic interpretation
- A foundation for code generation, validation, and testing

### ISL IS NOT:

- A programming language
- An implementation guide
- A UI mockup format
- A database schema language (unless explicitly modeled)
- A place for algorithms or step-by-step code logic

### Key Concepts (v1.6.1)

- **Source vs Artifact**: ISL files are the source. Generated code (in `bin/`) is a read-only artifact.
- **Two-Phase Compilation**:
  1. **Builder**: Resolves dependencies and creates a deterministic build manifest.
  2. **Compiler**: Generates code and cryptographic signatures for dynamic linking.

---

## Quick Start (Minimal, ISL-Compliant)

This section allows you to **start writing ISL immediately**, using the **base model**.

> This is a minimal entry point.
> It assumes you will read the full specification.

---

### Minimal ISL Structure

```markdown
# Project: ExampleProject

**Version**: 1.0.0  
**ISL Version**: 1.6

---

## Domain Concepts

### User

**Identity**: UUID  
**Properties**:

- email: unique authentication identifier
- accountStatus: enum (active, suspended)

---

## Component: AuthenticationService

### Role: Backend

### ⚡ Capabilities

#### authenticateUser

**Contract**: Authenticate **User** credentials and return an access token

🚨 **Constraints**:

- Passwords MUST NOT be stored or compared in plaintext
- Tokens MUST expire after 24 hours

✅ **Acceptance Criteria**:

- Valid credentials return a token
- Invalid credentials return an authentication error
```

This is already **valid ISL**.

---

## ISL Grammar & Writing Rules (Essential)

ISL uses **structured Markdown with semantic conventions**.
These rules improve clarity, scanability, and deterministic interpretation.

### Semantic Formatting

- **Bold (`**term**`)**
  Indicates a **semantic anchor**:
  - Domain Concepts
  - Component names
  - Capabilities
  - Defined entities
    **Must NOT** be used for generic emphasis.

- ***Bold + Italic (`***important***`)***
  Indicates **critical emphasis** for clarifications or edge cases.
  **Must NOT** replace normative sections (🚨 Constraints, ✅ Acceptance).

- UPPERCASE
  Used **only temporarily** during review or discussion.
  **Must NOT** appear in finalized ISL documents.

---

### Section Emojis (Visual Anchors)

ISL uses emojis as **visual anchors** to reduce cognitive load and improve navigation.

| Emoji | Meaning                 |
| ----- | ----------------------- |
| ⚡    | Capabilities / behavior |
| 🚨    | Constraints (normative) |
| ✅    | Acceptance Criteria     |
| 🧪    | Test                    |

---

## Canonical Rules (Essential Summary)

ISL is governed by **Canonical Rules** that define how specifications are interpreted.

### Key Principles

- Sections marked ⚡ 🚨 ✅ 🧪 are **NORMATIVE**
- Constraints override Implementation Hints
- Capability Constraints override Global Constraints
- OPTIONAL means _may be omitted_, not _ignored if present_
- Presentation components MUST NOT implement business logic
- Backend components MUST NOT define visual properties

> These rules are always **in scope** for ISL interpreters (humans or LLMs),
> even when not repeated in every document.

📘 See the full specification for the complete and authoritative rule set.

---

## Example: Complete ISL Component

```markdown
## Component: UserProfileCard

### Role: Presentation

### ⚡ displayProfile

**Contract**: Display user profile information

**Input**:

- user: User

**Flow**:

1. Render user's display name
2. Render email address
3. Show status badge based on accountStatus

🚨 **Constraints**:

- MUST NOT fetch data directly
- MUST receive all data via input

✅ **Acceptance Criteria**:

- Displays name and email correctly
- Shows correct status badge
- Renders within 200ms

🧪 **Test Scenarios**:

1. **Active User**:
   - Input: accountStatus = active
   - Expected: green status badge
```

---

## Modular Specifications (New in v1.6.1)

ISL supports splitting specifications across multiple files to promote reuse (e.g., shared domain models).

**Syntax:**
`> **Reference**: [Description] in [Link]`

**Example:**

```markdown
## Domain Concepts

> **Reference**: Core entities are defined in [`./shared-domain.isl.md`](./shared-domain.isl.md).
```

---

## How to Use ISL in Practice

Common usage patterns:

- **Spec-first development**
- **LLM-assisted code generation**
- **Test generation from Acceptance Criteria**
- **Documentation for complex systems**
- **Reverse-engineering legacy systems**

ISL works with:

- Frontend frameworks (React, Vue, Svelte, Angular)
- Backend stacks (Node.js, Python, Java, Go, Rust)
- Mobile and distributed systems

---

## Repository Contents

```text
isl-specification
├── README.md               ← This file
├── specs/                  ← (optional) markdown versions
└── examples/               ← (optional) reference ISL documents
```

---

## Versioning

- **Major**: Breaking changes to Canonical Rules or semantics
- **Minor**: Additions (new sections, clarifications)
- **Patch**: Editorial fixes and clarifications

---

## Final Note

ISL is designed to be:

- precise, but readable
- strict, but practical
- formal, but usable

If you are using ISL with LLMs, remember:

> **Determinism comes from clarity.
> Clarity comes from respecting the specification.**

---

📘 **Read the full specification** to write ISL correctly.
