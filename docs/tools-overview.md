# Tools overview

---

## Complete workflow

From a blank project to generated code.

> **One-time setup** — run from the repository root:
> ```bash
> npm install
> ```
> This installs `tsx` (the TypeScript runner used by all CLI tools below).

---

### Step 1 — Write `.isl.md` specs

Create one or more `.isl.md` files describing your project (components, capabilities, constraints).  
Use the [ISL specification](../specs/Intent%20Specification%20Language%20(ISL).md) as your reference.

**Helpers (all optional):**

| Helper | When to use | How |
|--------|------------|-----|
| **VS Code extension** | Editing, snippets, real-time validation | Build and install first — see [VS Code extension](#vs-code-extension-vscode-isl) below |
| **ISL Create** | Generate a first draft from a natural-language description | `npx tsx tools/vscode-isl/src/isl-create.ts ./specs "Description"` |
| **Python resolver** | Merge references into a single file for manual LLM paste | `python tools/isl_compiler.py path/to/file.isl.md > merged.md` |

---

### Step 2 — Build context (ISL Builder)

Resolves references, computes the dependency graph, and prepares one context file per component.

```bash
# From repository root — use either runner:
npx tsx     tools/vscode-isl/src/isl-builder.ts <project-dir>   # tsx (local)
npx ts-node tools/vscode-isl/src/isl-builder.ts <project-dir>   # ts-node (global)

# Example
npx tsx tools/vscode-isl/src/isl-builder.ts example/hq
```

**Output** (written to `<project-dir>/build/`):

| File | Contents |
|------|----------|
| `build-manifest.json` | Ordered list of components to compile |
| `<component>.build.md` | Merged context for each component (spec + existing source) |

---

### Step 3 — Generate code (ISL Generator)

Reads the manifest produced in step 2, sends each `.build.md` to an LLM, and writes the result to `bin/`.

> Requires an LLM API key. Default: OpenAI (`OPENAI_API_KEY` env var).

```bash
# From repository root — use either runner:
npx tsx     tools/vscode-isl/src/isl-generator.ts <project-dir>  # tsx (local)
npx ts-node tools/vscode-isl/src/isl-generator.ts <project-dir>  # ts-node (global)

# Example
npx tsx tools/vscode-isl/src/isl-generator.ts example/hq
```

**Output**: implementation files under `<project-dir>/bin/`.

---

### Iterating after spec changes

When `.isl.md` files change, re-run steps 2 and 3.  
The generator only regenerates components whose spec has changed (skip `--force` unless you want to regenerate everything).

```
ISL spec changes → Builder → Generator → bin/
```

---

## All TypeScript CLIs (`tools/vscode-isl/src/`)

Run from the **repository root** after `npm install`. Use **`npx tsx …`** (local) or **`npx ts-node …`** (global `ts-node`) as you prefer.

| Entry point | Role | LLM |
|-------------|------|-----|
| [`isl-builder.ts`](../tools/vscode-isl/src/isl-builder.ts) | Resolves references; writes `build-manifest.json` and `*.build.md` under `<project>/build/` | No |
| [`isl-generator.ts`](../tools/vscode-isl/src/isl-generator.ts) | Reads manifest; generates or updates files under `<project>/bin/` | Yes |
| [`isl-create.ts`](../tools/vscode-isl/src/isl-create.ts) | Creates draft `.isl.md` from a description (optional `--reverse`, `--architect`) | Yes |
| [`isl-codeReview.ts`](../tools/vscode-isl/src/isl-codeReview.ts) | Compares implementation in `bin/` to spec + signatures for one component ISL file | Yes |
| [`isl-doc.ts`](../tools/vscode-isl/src/isl-doc.ts) | Builds user-facing and technical docs under `<project>/doc/` from `build/build-manifest.json` | Yes |
| [`isl-graph.ts`](../tools/vscode-isl/src/isl-graph.ts) | Writes a Mermaid dependency graph from **non-recursive** `*.isl.md` in a single folder | No |
| [`isl-logic-test.ts`](../tools/vscode-isl/src/isl-logic-test.ts) | Generates logic-test artifacts from `.isl.md` (directory or single file) | Yes |
| [`isl-logic-test-run.ts`](../tools/vscode-isl/src/isl-logic-test-run.ts) | Runs LLM audit over specs; writes reports under `<project>/logic-test/report/` | Yes |

### `isl-codeReview.ts`

Requires a **`build-manifest.json`** (under the project root or `build/`), an entry for the chosen `.isl.md`, and the generated file under `bin/`.

```bash
npx tsx tools/vscode-isl/src/isl-codeReview.ts path/to/component.isl.md
```

Flags: `--gemini`, `--lmstudio`, `--stack=<id>`, `--model=<name>` or `--v=<name>`, `--url=<endpoint>`.

### `isl-doc.ts`

Uses **`build/build-manifest.json`**. Default project root is `.` if omitted.

```bash
npx tsx tools/vscode-isl/src/isl-doc.ts example/hq
```

Output: **`doc/`** under the project (User Guide + Technical Reference). Flag: `--gemini`.

### `isl-graph.ts`

Scans only **`*.isl.md` files in the given directory** (not subfolders). Writes **`graph/isl-dependencies.md`** there.

```bash
npx tsx tools/vscode-isl/src/isl-graph.ts example/hq
```

### `isl-logic-test.ts`

Processes one file or walks a tree (skips `build/`, `bin/`, `logic-test/`, `node_modules`).

```bash
npx tsx tools/vscode-isl/src/isl-logic-test.ts example/hq
```

Flag: `--gemini`.

### `isl-logic-test-run.ts`

Audits each `.isl.md`; aggregates report at **`logic-test/report/audit-summary.report.md`**.

```bash
npx tsx tools/vscode-isl/src/isl-logic-test-run.ts example/hq
```

Flags: `--gemini`, **`--critical`** (re-audit only files that had `[CRITICAL]` in the previous summary).

---

## Tool reference

### VS Code extension (`vscode-isl`)

Full documentation: [`tools/vscode-isl/README.md`](../tools/vscode-isl/README.md)

> **All features below require the extension to be built and installed. Follow steps 1–3 in order.**

#### 1. Build & install

```bash
# Install the packaging tool (once, globally)
npm install -g @vscode/vsce

# Build
cd tools/vscode-isl
npm install
npx vsce package        # produces isl-support-x.x.x.vsix

# Install in VS Code
# Extensions panel → ⋯ → Install from VSIX… → select the .vsix file
```

#### 2. Snippets

Type the prefix in any `.isl.md` file and press `Tab` to expand.

| Prefix | Inserted block |
|--------|---------------|
| `isl-base` | Full ISL file template (v1.6.2) |
| `isl-project` | Project header with versioning |
| `isl-component` | Component block with Role |
| `isl-cap` | Capability block with Contract |
| `isl-constraint` | Normative 🚨 Constraints block |
| `isl-test` | 🧪 Test Scenarios block |
| `isl-ref` | Reference transclusion syntax |
| `isl-rules` | Canonical Rules summary |
| `isl-appearance` | Appearance / visual properties |
| `isl-interface` | API / Interface section |
| `isl-security` | Security considerations section |

#### 3. Command palette (`Ctrl+Shift+P`)

| Command | Description |
|---------|-------------|
| **ISL: Compile to Prompt** | Resolves `Reference` links and opens a merged prompt document |
| **ISL: Create New Component** | Wizard — prompts for name and role |
| **ISL: Create New Capability** | Wizard — prompts for capability name |

#### 4. Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `isl.validation.enabled` | boolean | `true` | Enable / disable real-time lint |
| `isl.validation.onSave` | boolean | `true` | Validate on file save |
| `isl.validation.strictMode` | boolean | `false` | Treat warnings as errors |

---

### ISL Lint (CLI)

Standalone CLI validator. Run from `tools/isl-lint-shell/` after `npm install`.

```bash
# Validate a file
npm run lint -- <path/to/file.isl.md>

# Structured JSON output (useful for CI)
npm run lint -- <file> --json

# Strict mode — warnings become errors (exit code 1)
npm run lint -- <file> --strict
```

| Symbol | Level | Meaning |
|--------|-------|---------|
| ❌ | Error | Normative rule violated — ISL is invalid |
| ⚠️ | Warning | Best-practice issue — ISL is valid but suboptimal |
| ℹ️ | Info | Statistics about the file |

| Code | Level | Description |
|------|-------|-------------|
| ISL-001 | Error | Missing `# Project:` header |
| ISL-020 | Error | No Components defined |
| ISL-021 | Error | Component missing `### Role` |
| ISL-022 | Error | Invalid Role value |
| ISL-030 | Error | Capability missing `**Contract**` |
| ISL-010 | Warning | Missing `## Domain Concepts` section |
| ISL-023 | Warning | Component has no Capabilities |
| ISL-032 | Warning | Complex Capability missing Test Scenarios |
| ISL-033 | Warning | Constraints missing RFC 2119 keywords |
| ISL-034 | Warning | Reference to undefined Domain Entity |

---

### ISL Builder — flags

| Flag | Description |
|------|-------------|
| *(no flags)* | Build all components in the project directory |

---

### ISL Generator — flags

| Flag | Description |
|------|-------------|
| `--force` | Regenerate even unchanged components |
| `--debug` | Verbose LLM I/O logging |
| `--gemini` | Use Google Gemini instead of OpenAI |
| `--lmstudio` | Use a local LM Studio endpoint |
| `--stack=<id>` | Override stack (default: `react-js`) |
| `--model=<name>` | Override LLM model name |
| `--url=<endpoint>` | Override LLM base URL |

### Stacks — what they are and how to extend them

The **stack** tells the Generator how to produce code for a specific language and framework. It carries:

- the **tech stack** description fed to the LLM prompt (e.g. "React 18, TailwindCSS, JavaScript ES6+")
- the **prompt persona** (e.g. "Senior React Developer — Functional Components & Hooks")
- **file extensions** per Role (e.g. `Presentation → .jsx`, `Business Logic → .js`)
- **generation constraints** that the LLM must follow (naming conventions, import rules, hook rules, etc.)
- **safety guardrails** (null safety, async state handling, default initialization)
- the expected **signature format** written to `gen-lock.json`

The stack is selected with `--stack=<id>` (default: `react-js`) and configured in:

```
tools/vscode-isl/src/isl-generator/stacks.config.ts
```

#### Built-in stacks

| Stack id | Language / Framework | Default extension |
|----------|----------------------|-------------------|
| `react-js` | React 18 + TailwindCSS + JavaScript ES6+ + Fetch API | `.jsx` |
| `python-fastapi` | Python 3.10 + FastAPI + Pydantic | `.py` |
| `python` | Python 3.10 (generic) | `.py` |

#### Adding a new stack

Open `tools/vscode-isl/src/isl-generator/stacks.config.ts` and add a new entry to the `STACKS` object following the `StackConfig` interface:

```typescript
"my-stack": {
  id: "my-stack",
  techStack: ["Go 1.22", "net/http"],
  extensions: {
    default: ".go",
    Backend: ".go",
    Domain: ".go",
  },
  promptPersona: "Senior Go Developer",
  constraints: [
    "Use standard library where possible",
    "Structs and interfaces instead of classes",
    // add language-specific rules here
  ],
  safetyConstraints: [
    ...UNIVERSAL_SAFETY_CONSTRAINTS,
    // add language-specific safety rules here
  ],
  signatureFormat: `Output signatures as Go function stubs.
Example: \`func Calculate(a int) int\``,
},
```

Then pass `--stack=my-stack` to the Generator. The LLM will receive the persona, constraints, and signature rules specific to your language.

---

### ISL Create — flags

| Flag | Description |
|------|-------------|
| `--reverse` | Reverse-engineer an existing source file into ISL |
| `--architect` | Architect mode: generate full system from requirements |
| `--gemini` | Use Google Gemini |
| `--lmstudio` | Use a local LM Studio endpoint |
| `--model=<name>` | Override LLM model |
| `--url=<endpoint>` | Override LLM base URL |

---

### Python reference resolver (`isl_compiler.py`)

Standalone Python script — no dependencies beyond stdlib.  
Reads an `.isl.md` file, resolves all `Reference` links recursively, and writes merged output to stdout.

```bash
python tools/isl_compiler.py path/to/file.isl.md

# Save to a file
python tools/isl_compiler.py path/to/file.isl.md > merged-prompt.md
```

---

## See also

- [Getting Started](./getting-started.md)
- [Compilation and codegen](./compilation-workflow.md)
- [Documentation index](./README.md)
