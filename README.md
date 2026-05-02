# Intent Specification Language (ISL) 1.6.2

**Intent Specification Language (ISL)** is a structured, intent-first specification language designed to describe **what software should do**, not **how it should be implemented**.

ISL enables humans and Large Language Models (LLMs) to reason deterministically about software behavior, contracts, constraints, and acceptance criteria т?? across frontend, backend, and system boundaries.

> **ISL is a language, not a template.**
> Writing ISL-compliant documents requires understanding its canonical rules and grammar.

---

## Ё??? Documentation

Guides for getting started, tooling, compilation workflow, examples, and tutorials:

Ё??? **[`docs/`](./docs/README.md)**

| Doc | Description |
|-----|-------------|
| [Getting Started](./docs/getting-started.md) | Prerequisites, VS Code extension, first file, lint |
| [Tools overview](./docs/tools-overview.md) | Every tool at a glance |
| [Compilation and codegen](./docs/compilation-workflow.md) | Builder т?? codegen workflow |
| [Examples catalog](./docs/examples-catalog.md) | How to navigate `example/` |
| [Tutorial: first component](./docs/tutorial-first-component.md) | 15-min hands-on exercise |

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

## т?ая╕П Read the Specification

This repository contains **the official ISL language specification**.

Ё??? **Full Specification**: [`specs/Intent Specification Language (ISL) .md`](<./specs/Intent%20Specification%20Language%20(ISL)%20.md>)

To write ISL-compliant documents, read the complete specification, including:

- Canonical Rules
- Grammar and semantics
- Section precedence
- Best practices and pitfalls

The README provides an overview and a quick reference. It **does not** replace the full specification.

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

### Key Concepts (v1.6.2)

- **Source vs Artifact**: ISL files are the source. Generated code (in `bin/`) is a read-only artifact.
- **Two-Phase Compilation**:
  1. **Builder**: Resolves dependencies and creates a deterministic build manifest.
  2. **Compiler**: Generates code and cryptographic signatures for dynamic linking.

---

## Quick Start

### Minimal ISL structure

```markdown
# Project: ExampleProject

**Version**: 1.0.0
**ISL Version**: 1.6.2

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

### т?б Capabilities

#### authenticateUser

**Contract**: Authenticate **User** credentials and return an access token.

Ё??и **Constraints**:

- Passwords MUST NOT be stored or compared in plaintext.
- Tokens MUST expire after 24 hours.

т?? **Acceptance Criteria**:

- Valid credentials return a token.
- Invalid credentials return an authentication error.
```

This is already **valid ISL**. Run the linter to confirm:

```bash
cd tools/isl-lint-shell && npm install
npm run lint -- ../../your-file.isl.md
```

---

## ISL Grammar Essentials

### Semantic Formatting

| Format | Meaning | When to use |
|--------|---------|-------------|
| `**bold**` | Semantic anchor | Domain concepts, component names, capability names, defined entities. **Never** generic emphasis. |
| `***bold-italic***` | Critical emphasis | Edge-case clarifications only. MUST NOT replace normative sections. |
| `UPPERCASE` | Temporary marker | Review only. MUST NOT appear in finalized documents. |

### Section Emojis (Visual Anchors)

| Emoji | Meaning |
|-------|---------|
| т?б | Capabilities / behavior |
| Ё??и | Constraints (normative) |
| т?? | Acceptance Criteria |
| Ё?зк | Test Scenarios |

### Canonical Rules (Essential Summary)

- Sections marked т?б Ё??и т?? Ё?зк are **NORMATIVE**.
- Constraints override Implementation Hints.
- Capability Constraints override Global Constraints.
- OPTIONAL means _may be omitted_, not _ignored if present_.
- Presentation components MUST NOT implement business logic.
- Backend components MUST NOT define visual properties.

> These rules are always in scope for ISL interpreters (humans or LLMs), even when not repeated in every document.

### Modular Specifications (v1.6.2)

Split large specs across files:

```markdown
> **Reference**: Core entities are defined in [`./shared-domain.isl.md`](./shared-domain.isl.md).
```

---

## Ё??ая╕П Tooling Quick Reference

Full details and CLI syntax: [`docs/tools-overview.md`](./docs/tools-overview.md).

| Tool | Command / Location | Purpose |
|------|-------------------|---------|
| **VS Code extension** | `tools/vscode-isl/` | Syntax highlighting, snippets, real-time lint, wizards |
| **ISL Lint** | `cd tools/isl-lint-shell && npm run lint -- <file>` | Structural and normative validation |
| **ISL Builder** | `npx tsx tools/vscode-isl/src/isl-builder.ts <stack-dir>` or `npx ts-node ...` | Build graph, manifest, `.build.md` contexts |
| **ISL Generator** | `npx tsx tools/vscode-isl/src/isl-generator.ts <stack-dir>` or `npx ts-node ...` | LLM code generation toward `bin/` |
| **ISL Create** | `npx tsx tools/vscode-isl/src/isl-create.ts <outdir> "<description>"` or `npx ts-node ...` | ISL draft from natural language |
| **Python resolver** | `python tools/isl_compiler.py <file.isl.md>` | Inline-expand `Reference` links to stdout |

---

## How to Use ISL in Practice

Common usage patterns:

- **Spec-first development** т?? write ISL, generate code, iterate on the spec
- **LLM-assisted code generation** т?? feed `.build.md` context to any LLM
- **Test generation** from Acceptance Criteria
- **Documentation** for complex systems
- **Reverse-engineering** legacy systems into ISL specs

ISL works with:

- Frontend frameworks (React, Vue, Svelte, Angular)
- Backend stacks (Node.js, Python, Java, Go, Rust)
- Mobile and distributed systems

---

## Repository Contents

```text
ISL (repository)
т??т??т?? README.md           т?Р This file
т??т??т?? docs/               т?Р Operational guides (getting started, tools, compilation, tutorials)
т??т??т?? specs/              т?Р Official ISL language specification (normative)
т??т??т?? example/            т?Р Sample projects: hq, architect-*, design-*, userDefine-*, т?ж
т??т??т?? tools/
    т??т??т?? vscode-isl/     т?Р VS Code extension, ISL Builder, Generator, Create
    т??т??т?? isl-lint-shell/ т?Р Standalone CLI linter
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

Ё??? **Read the full specification** т?? [`specs/`](<./specs/Intent%20Specification%20Language%20(ISL)%20.md>)  
Ё??? **Operational docs** т?? [`docs/`](./docs/README.md)
