# Getting Started

The base flow is: write ISL specs → run the Builder → run the Generator → get code in `bin/`.

---

## Prerequisites

- **Node.js** 18+ installed
- An LLM API key for the Generator step (default: OpenAI — set `OPENAI_API_KEY` in your environment)

---

## 1. Setup (once)

From the repository root:

```bash
npm install
```

This installs `tsx`, the TypeScript runner used by the Builder and Generator.

---

## 2. Create a project folder

```
my-project/
└── specs/
    └── my-component.isl.md
```

Every `.isl.md` file needs at minimum a project header, a component with a Role, and at least one capability with a Contract.

Minimal example (`my-component.isl.md`):

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

Full ISL syntax: [`specs/Intent Specification Language (ISL).md`](../specs/Intent%20Specification%20Language%20(ISL).md).

---

## 3. Run the Builder

```bash
# with tsx (local, installed by npm install at repo root)
npx tsx tools/vscode-isl/src/isl-builder.ts my-project

# with ts-node (if installed globally: npm install -g ts-node)
npx ts-node tools/vscode-isl/src/isl-builder.ts my-project
```

The Builder resolves references between ISL files, computes the dependency order, and writes to `my-project/build/`:

| Output file | Contents |
|-------------|----------|
| `build-manifest.json` | Ordered list of components to compile |
| `<component>.build.md` | Full context for that component (ready for the Generator) |

---

## 4. Run the Generator

```bash
# with tsx (local)
npx tsx tools/vscode-isl/src/isl-generator.ts my-project

# with ts-node (global)
npx ts-node tools/vscode-isl/src/isl-generator.ts my-project
```

The Generator reads `build-manifest.json`, sends each `.build.md` to an LLM, and writes the result to `my-project/bin/`.

Useful flags:

| Flag | Effect |
|------|--------|
| `--force` | Regenerate all components, even unchanged ones |
| `--gemini` | Use Google Gemini instead of OpenAI |
| `--lmstudio` | Use a local LM Studio endpoint |

---

## 5. Iterate

When you change a `.isl.md` file, re-run Builder then Generator:

```bash
npx tsx tools/vscode-isl/src/isl-builder.ts my-project    # or: npx ts-node ...
npx tsx tools/vscode-isl/src/isl-generator.ts my-project  # or: npx ts-node ...
```

The Generator only regenerates components whose spec has changed.

---

## Optional tools

| Tool | What it adds | Where |
|------|-------------|-------|
| **VS Code extension** | Syntax highlighting, snippets, real-time validation | Build and install — see [Tools overview](./tools-overview.md#vs-code-extension-vscode-isl) |
| **ISL Create** | Generate an ISL draft from a natural-language description | `npx tsx tools/vscode-isl/src/isl-create.ts ./specs "description"` |
| **Python resolver** | Merge all references into one file for manual LLM paste | `python tools/isl_compiler.py path/to/file.isl.md > merged.md` |

---

## See also

- [Tools overview](./tools-overview.md) — complete CLI reference
- [Compilation and codegen](./compilation-workflow.md) — deeper explanation of Builder and Generator
- [Documentation index](./README.md)
