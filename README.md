# 📚 Intent Specification Language (ISL) 1.6.2

**Intent Specification Language (ISL)** is a structured, intent-first specification language designed to describe **what software should do**, not **how it should be implemented**.

ISL enables humans and Large Language Models (LLMs) to reason deterministically about software behavior, contracts, constraints, and acceptance criteria across frontend, backend, and system boundaries.

**ISL is a specification-to-code workflow.** You write structured .isl.md files that describe what each component must do (contracts, constraints, capabilities). A two-step pipeline then turns those specs into real implementation files:

```
.isl.md specs  →  Builder  →  .build.md contexts  →  Generator (LLM)  →  bin/ (your code)
```

The generated code targets the language and framework you choose (React, Python, FastAPI, …). When the spec changes, re-run the pipeline and only the affected components are regenerated.

> **ISL is a language, not a template.**
> Writing ISL-compliant documents requires understanding its canonical rules and grammar.

---

## 📖 Documentation

Guides for getting started, tooling, compilation workflow, examples, and deeper guides:

**[`docs/`](./docs/README.md)**

| Doc | Description |
|-----|-------------|
| [Getting Started](./docs/getting-started.md) | Setup, first `.isl.md` examples, Builder, Generator |
| [Tools overview](./docs/tools-overview.md) | All CLI tools (Builder, Generator, Graph, logic-test, doc, code review, etc.) |
| [Compilation and codegen](./docs/compilation-workflow.md) | Builder and Generator in depth, artifacts under `build/` and `bin/` |
| [Examples catalog](./docs/examples-catalog.md) | How to navigate `example/` |

---

## ⚠️ Read the specification

This repository contains **the official ISL language specification**.

**Full specification:** [`specs/Intent Specification Language (ISL).md`](./specs/Intent%20Specification%20Language%20(ISL).md)

To write ISL-compliant documents, read the complete specification, including canonical rules, grammar, section precedence, and best practices.

The README is an overview and quick reference. It **does not** replace the full specification.

---

## What ISL is (and is not)

### ISL is

- A formal specification language
- A way to describe behavior, contracts, and observable effects
- Suitable for humans and LLMs
- Designed for deterministic interpretation
- A foundation for code generation, validation, and testing

### ISL is not

- A programming language
- An implementation guide
- A UI mockup format
- A database schema language (unless explicitly modeled)
- A place for algorithms or step-by-step code logic

### Key concepts (v1.6.2)

- **Source vs artifact**: ISL files are the source. Generated code (in `bin/`) is an artifact aligned with the spec.
- **Two-phase workflow**: **Builder** resolves dependencies and writes `build/`; **Generator** (LLM) emits or refreshes code under `bin/`.

---

## Quick start

### Minimal ISL structure

Normative section prefixes (emoji anchors) are defined in the spec. Example shape:

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

### ⚡ Capabilities

#### authenticateUser

**Contract**: Authenticate **User** credentials and return an access token.

🚨 **Constraints**:

- Passwords MUST NOT be stored or compared in plaintext.
- Tokens MUST expire after 24 hours.

✅ **Acceptance Criteria**:

- Valid credentials return a token.
- Invalid credentials return an authentication error.
```

Use the canonical emoji prefixes from [`specs/Intent Specification Language (ISL).md`](./specs/Intent%20Specification%20Language%20(ISL).md) for Capabilities, Constraints, Acceptance Criteria, and Test Scenarios in real documents.

Optional structural check with the CLI linter:

```bash
cd tools/isl-lint-shell && npm install
npm run lint -- ../../your-file.isl.md
```

---

## ISL grammar essentials

### Semantic formatting

| Format | Meaning | When to use |
|--------|---------|-------------|
| `**bold**` | Semantic anchor | Domain concepts, component names, capability names, defined entities. **Never** generic emphasis. |
| `***bold-italic***` | Critical emphasis | Edge-case clarifications only. MUST NOT replace normative sections. |
| `UPPERCASE` | Temporary marker | Review only. MUST NOT appear in finalized documents. |

### Section anchors (visual)

The specification assigns normative meaning to specific emoji-prefixed sections (Capabilities, Constraints, Acceptance Criteria, Test Scenarios). See the full spec for the exact glyphs and rules.

### Canonical rules (essential summary)

- Normative capability and constraint sections override implementation hints.
- Capability constraints override global constraints where applicable.
- OPTIONAL means *may be omitted*, not *ignored if present*.
- Presentation components MUST NOT implement business logic.
- Backend components MUST NOT define visual properties.

> These rules apply to every ISL interpreter (human or LLM), even when not repeated in every document.

### Modular specifications (v1.6.2)

Split large specs across files:

```markdown
> **Reference**: Core entities are defined in [`./shared-domain.isl.md`](./shared-domain.isl.md).
```

---

## 🛠️ Tooling quick reference

Full CLI list: [`docs/tools-overview.md`](./docs/tools-overview.md).

| Tool | Command / location | Purpose |
|------|-------------------|---------|
| **VS Code extension** | `tools/vscode-isl/` | Highlighting, snippets, validation, wizards |
| **ISL Lint** | `cd tools/isl-lint-shell && npm run lint -- <file>` | Structural validation |
| **ISL Builder** | `npx tsx tools/vscode-isl/src/isl-builder.ts <stack-dir>` or `npx ts-node ...` | Manifest and `.build.md` under `build/` |
| **ISL Generator** | `npx tsx tools/vscode-isl/src/isl-generator.ts <stack-dir>` or `npx ts-node ...` | LLM codegen toward `bin/` |
| **ISL Create** | `npx tsx tools/vscode-isl/src/isl-create.ts <outdir> "<description>"` or `npx ts-node ...` | Draft ISL from natural language |
| **Python resolver** | `python tools/isl_compiler.py <file.isl.md>` | Expand `Reference` links to stdout |

---

## How to use ISL in practice

- **Spec-first development** -- write ISL, generate code, iterate on the spec
- **LLM-assisted code generation** -- feed `.build.md` context to any LLM
- **Test generation** from acceptance criteria
- **Documentation** for complex systems
- **Reverse-engineering** legacy systems into ISL specs

ISL works with frontend frameworks, backend stacks, mobile, and distributed systems.

---

## Repository contents

```text
ISL (repository)
+- README.md           (this file)
+- docs/               (operational guides)
+- specs/              (normative ISL specification)
+- example/            (sample stacks: dungeon, architect-*, design-*, userDefine-*, ...)
+- tools/
   +- vscode-isl/       (extension, Builder, Generator, logic-test, doc, ...)
   +- isl-lint-shell/   (CLI linter)
```

---

## Versioning

- **Major**: Breaking changes to canonical rules or semantics
- **Minor**: Additions (new sections, clarifications)
- **Patch**: Editorial fixes and clarifications

---

## Final note

ISL is designed to be precise but readable, strict but practical, formal but usable.

If you are using ISL with LLMs, remember:

> **Determinism comes from clarity.
> Clarity comes from respecting the specification.**

---

📘 **Read the full specification:** [`specs/`](./specs/Intent%20Specification%20Language%20(ISL).md)  
📂 **Operational docs:** [`docs/`](./docs/README.md)
