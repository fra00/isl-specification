# Getting Started

The base flow is: write ISL specs, run the **Builder**, run the **Generator**, get code under `bin/`.

---

## Prerequisites

- **Node.js** 18+
- For **Generator** (and other LLM tools): an API key as required by the tool (default for Generator: `OPENAI_API_KEY`)

---

## 1. Setup (once)

From the repository root:

```bash
npm install
```

This installs `tsx`, used by the examples below. You can use **`npx tsx`** (local) or **`npx ts-node`** (global install: `npm install -g ts-node`) interchangeably.

---

## 2. Create a project folder

Example layout:

```text
my-project/
+-- specs/
    +-- my-component.isl.md
```

Every `.isl.md` file needs at minimum a project header, a component with a **Role**, and at least one capability with a **Contract**. Canonical section prefixes (emoji anchors) are defined in [`specs/Intent Specification Language (ISL).md`](../specs/Intent%20Specification%20Language%20(ISL).md).

---

## 3. Minimal examples

### Backend-oriented (compact)

File `specs/my-component.isl.md`:

```markdown
# Project: MyProject

**Version**: 1.0.0
**ISL Version**: 1.6.2

## Component: MyComponent

Brief description.

### Role: Backend

### ⚡ Capabilities

#### doSomething

**Contract**: Returns a greeting for the given name.

**Signature:**
- **input**: { name: string }
- **output**: { message: string }
```

The examples above use the normative emoji section prefixes as they appear in real documents.

### Presentation-oriented (richer)

File `specs/greeting-panel.isl.md`:

```markdown
# Project: HelloFeature

**Version**: 1.0.0
**ISL Version**: 1.6.2
**Created**: 2026-01-01

---

## Domain Concepts

- `message`: text string displayed to the user.

---

## Component: GreetingPanel

A panel that displays a welcome message.

### Role: Presentation

### 🔍 Appearance

- Renders the message text prominently in the center of the panel.

### ⚡ Capabilities

#### displayMessage

**Contract**: Displays the welcome message received as input.

**Trigger**: Component mount or message prop change.

**Side Effects**:

- Renders `message` as visible text in the UI.

### 🚨 Constraints

- MUST NOT fetch data from APIs or databases.

### ✅ Acceptance Criteria

- [ ] Displayed text matches the `message` input.

### 🧪 Test Scenarios

1. **Non-empty message**:
   - Input: `message = "Hello"`
   - Expected: UI shows `"Hello"`.
```

Replace plain headings (`### Capabilities`) with the spec’s emoji-prefixed headings in production specs.

---

## 4. Run the Builder

```bash
npx tsx tools/vscode-isl/src/isl-builder.ts my-project
# or:
npx ts-node tools/vscode-isl/src/isl-builder.ts my-project
```

The Builder resolves **Reference** links, orders components, and writes **`my-project/build/`**:

| Output | Contents |
|--------|----------|
| `build-manifest.json` | Ordered compile units |
| `<component>.build.md` | Merged context per component (input to the Generator or to a manual LLM) |

---

## 5. Run the Generator

```bash
npx tsx tools/vscode-isl/src/isl-generator.ts my-project
# or:
npx ts-node tools/vscode-isl/src/isl-generator.ts my-project
```

Reads the manifest, sends each `.build.md` to the configured LLM, and writes the generated files under **`my-project/bin/`**. After this step you will find one implementation file per component in that folder (e.g. `bin/my-component.jsx` for a React stack).

#### Stack — choosing the target language

The **`--stack`** flag tells the Generator which language and framework to target. It controls the LLM persona, file extensions, naming conventions, and generation rules.

| Stack id | Language / Framework |
|----------|----------------------|
| `react-js` *(default)* | React 18 + JavaScript ES6+ + TailwindCSS |
| `python-fastapi` | Python 3.10 + FastAPI + Pydantic |
| `python` | Python 3.10 (generic) |

```bash
# Generate React JSX (default — no flag needed)
npx tsx tools/vscode-isl/src/isl-generator.ts my-project

# Generate Python (FastAPI)
npx tsx tools/vscode-isl/src/isl-generator.ts my-project --stack=python-fastapi

# Generate generic Python
npx tsx tools/vscode-isl/src/isl-generator.ts my-project --stack=python
```

To add support for another language (Go, Java, Node.js, …) add a new entry in `tools/vscode-isl/src/isl-generator/stacks.config.ts`. See [Tools overview — Stacks](./tools-overview.md#stacks--what-they-are-and-how-to-extend-them) for instructions.

| Flag | Effect |
|------|--------|
| `--stack=<id>` | Target language / framework (default: `react-js`) |
| `--force` | Regenerate everything, even unchanged units |
| `--gemini` | Use Google Gemini |
| `--lmstudio` | Use LM Studio locally |

---

## 6. Iterate

After editing `.isl.md` files:

```bash
npx tsx tools/vscode-isl/src/isl-builder.ts my-project
npx tsx tools/vscode-isl/src/isl-generator.ts my-project
```

The Generator skips unchanged units unless you pass **`--force`**.

---

## Optional helpers

| Helper | Use |
|--------|-----|
| **VS Code extension** | Highlighting, snippets, diagnostics — build `.vsix` from `tools/vscode-isl/` ([Tools overview](./tools-overview.md#vs-code-extension-vscode-isl)) |
| **ISL Create** | Draft specs from natural language: `npx tsx tools/vscode-isl/src/isl-create.ts ./specs "description"` |
| **Python resolver** | Merge references to stdout: `python tools/isl_compiler.py path/to/file.isl.md` |
| **Other CLI tools** | Graph, logic-test, documentation export, code review — see [Tools overview](./tools-overview.md) |

---

## See also

- [Tools overview](./tools-overview.md)
- [Compilation and codegen](./compilation-workflow.md)
- [Documentation index](./README.md)
