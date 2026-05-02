# Tools overview

Map of official or supporting tools in the repository. Paths are relative to the **repository root**.

---

## Summary

| Tool | Primary purpose | Location |
|------|-----------------|----------|
| **ISL specification** | Normative language definition | [`specs/`](../specs/) |
| **VS Code extension** | Editing, snippets, diagnostics for `.isl.md` | [`tools/vscode-isl/`](../tools/vscode-isl/) |
| **ISL Builder** | Build graph, manifest, `.build.md` contexts | [`tools/vscode-isl/src/isl-builder.ts`](../tools/vscode-isl/src/isl-builder.ts) |
| **ISL Generator** | Code / signature generation toward `bin/` (LLM pipeline) | [`tools/vscode-isl/src/isl-generator.ts`](../tools/vscode-isl/src/isl-generator.ts) |
| **ISL Create** | ISL drafts from natural language | [`tools/vscode-isl/src/isl-create.ts`](../tools/vscode-isl/src/isl-create.ts) |
| **ISL Lint** | Structural validation from CLI | [`tools/isl-lint-shell/`](../tools/isl-lint-shell/) |
| **Agent compile queue** | Incremental queue aligned with `StandardRunner` | [`tools/vscode-isl/src/cli/agent-compile-queue.ts`](../tools/vscode-isl/src/cli/agent-compile-queue.ts) |
| **Agent update gen-lock** | Update `gen-lock.json` after a verified compile | [`tools/vscode-isl/src/cli/agent-update-gen-lock.ts`](../tools/vscode-isl/src/cli/agent-update-gen-lock.ts) |
| **`llm-tools/` wrappers** | Convenient invocation from repo root | [`llm-tools/`](../llm-tools/) |
| **Python resolver** | Inline-expand `Reference` links to stdout | [`tools/isl_compiler.py`](../tools/isl_compiler.py) |

---

## VS Code extension (`vscode-isl`)

Full documentation: [`tools/vscode-isl/README.md`](../tools/vscode-isl/README.md)

### Snippets

Type the prefix in any `.isl.md` file and press `Tab` or `Enter` to expand.

| Prefix | Inserted block |
|--------|---------------|
| `isl-base` | Full ISL file template (v1.6.2) |
| `isl-project` | Project header with versioning |
| `isl-component` | Component block with Role |
| `isl-cap` | Capability with Contract and Flow |
| `isl-constraint` | Normative 🚨 Constraints block |
| `isl-test` | 🧪 Test Scenarios block |
| `isl-ref` | Reference transclusion syntax |
| `isl-rules` | Canonical Rules summary |
| `isl-appearance` | Appearance / visual properties |
| `isl-interface` | API / Interface section |
| `isl-security` | Security considerations section |

### Command palette (`Ctrl+Shift+P`)

| Command | Description |
|---------|-------------|
| **ISL: Compile to Prompt** | Resolves `Reference` links and creates a merged prompt file |
| **ISL: Create New Component** | Wizard — prompts for name and role |
| **ISL: Create New Capability** | Wizard — prompts for capability name |

### Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `isl.validation.enabled` | boolean | `true` | Enable / disable real-time lint |
| `isl.validation.onSave` | boolean | `true` | Validate on file save |
| `isl.validation.strictMode` | boolean | `false` | Treat warnings as errors |

### Build & install

```bash
# Install packaging tool once
npm install -g @vscode/vsce

# Package
cd tools/vscode-isl
npm install
npx vsce package        # → isl-x.x.x.vsix

# Install in VS Code
# Extensions → ⋯ → Install from VSIX… → select the .vsix
```

---

## ISL Lint (CLI)

Full documentation: [`tools/README.md`](../tools/README.md)

### Installation

```bash
cd tools/isl-lint-shell
npm install
```

### Commands

```bash
# Validate a file
npm run lint -- <path/to/file.isl.md>

# Structured JSON output (useful for CI)
npm run lint -- <file> --json

# Strict mode – warnings become errors (exit code 1)
npm run lint -- <file> --strict

# Combined
npm run lint -- <file> --json --strict
```

### Output levels

| Symbol | Level | Meaning |
|--------|-------|---------|
| ❌ | Error | Normative rule violated — ISL is invalid |
| ⚠️ | Warning | Best-practice issue — ISL is valid but suboptimal |
| ℹ️ | Info | Statistics about the file |

### Validation rule codes

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

## ISL Builder

Resolves ISL references, computes the dependency graph, and writes:
- `build/build-manifest.json` — ordered compile units
- `*.build.md` — full context for each component (ready for an LLM)

### Usage

```bash
# From repo root
npx ts-node tools/vscode-isl/src/isl-builder.ts <stack-directory>

# Example
npx ts-node tools/vscode-isl/src/isl-builder.ts example/hq
```

The stack directory must contain a `build-manifest.json` (or the builder creates one from discovered `.isl.md` files).

---

## ISL Generator (LLM compiler)

Reads `build-manifest.json` and generates implementation code in `bin/` by sending each `.build.md` context to an LLM.

> **This tool is NOT used by in-session Cursor agents.**  
> Agents use `isl-builder` + manual edits + `agent-compile-queue` / `agent-update-gen-lock` instead.

### Usage

```bash
npx ts-node tools/vscode-isl/src/isl-generator.ts <manifest-or-dir> [output-dir] [flags]
```

### Flags

| Flag | Description |
|------|-------------|
| `--force` | Regenerate even unchanged units |
| `--debug` | Verbose LLM I/O logging |
| `--gemini` | Use Google Gemini instead of OpenAI |
| `--lmstudio` | Use a local LM Studio endpoint |
| `--stack=<id>` | Override stack (default: `react-js`) |
| `--model=<name>` | Override LLM model name |
| `--url=<endpoint>` | Override LLM base URL |

### Examples

```bash
# Default stack, OpenAI
npx ts-node tools/vscode-isl/src/isl-generator.ts example/hq

# Force-regenerate everything with Gemini
npx ts-node tools/vscode-isl/src/isl-generator.ts example/hq --force --gemini

# Custom output directory
npx ts-node tools/vscode-isl/src/isl-generator.ts example/hq/build/build-manifest.json ./out
```

---

## ISL Create

Generates an ISL draft from a natural-language description, a source file (reverse-engineering), or a requirements statement (architect mode).

### Usage

```bash
npx ts-node tools/vscode-isl/src/isl-create.ts <output-dir> "<description>" [flags]
```

### Flags

| Flag | Description |
|------|-------------|
| `--reverse` | Reverse-engineer: `<description>` is a source file path |
| `--architect` | Architect mode: generate full system from requirements |
| `--gemini` | Use Google Gemini |
| `--lmstudio` | Use a local LM Studio endpoint |
| `--model=<name>` | Override LLM model |
| `--url=<endpoint>` | Override LLM base URL |

### Examples

```bash
# Generate ISL from a description
npx ts-node tools/vscode-isl/src/isl-create.ts ./specs "A login form with email and password"

# Reverse-engineer an existing component
npx ts-node tools/vscode-isl/src/isl-create.ts ./specs ./bin/connection.jsx --reverse

# Architect mode: generate full system from requirements
npx ts-node tools/vscode-isl/src/isl-create.ts ./specs "A complete e-commerce system" --architect
```

---

## Agent compile queue (`llm-tools`)

Lists ISL units whose `bin/` artifact is stale (hash mismatch vs `gen-lock.json`). Used by Cursor agents to identify what needs re-compilation **before** changing any code.

### Usage

```bash
# From repo root — quick shortcut wrapper
node llm-tools/run-compile-queue.cjs --root example/hq

# JSON output for scripting
node llm-tools/run-compile-queue.cjs --root example/hq --json

# Direct (no wrapper)
npx ts-node tools/vscode-isl/src/cli/agent-compile-queue.ts --root example/hq
```

### Flags

| Flag | Description |
|------|-------------|
| `--root <dir>` | Stack directory (auto-resolves manifest, bin, lock paths) |
| `--manifest <path>` | Explicit path to `build-manifest.json` |
| `--bin <path>` | Explicit path to `bin/` directory |
| `--lock <path>` | Explicit path to `gen-lock.json` |
| `--stack <id>` | Stack override (default: `react-js`) |
| `--force` | Mark all units as stale regardless of hash |
| `--all --json` | Output the full manifest including up-to-date units |

---

## Agent update gen-lock (`llm-tools`)

Records that one or more compile units have been verified — updates `gen-lock.json` to reflect the current artifact hash.

> **Only use this after the `bin/` code has been aligned to the ISL spec.**  
> Updating the lock without alignment is a false claim of compliance.

### Usage

```bash
# From repo root — wrapper
node llm-tools/run-update-gen-lock.cjs --root example/hq --build-file "C:\path\to\dungeon.build.md"

# Multiple units in one call
node llm-tools/run-update-gen-lock.cjs --root example/hq \
  --build-file "C:\path\to\dungeon.build.md" \
  --build-file "C:\path\to\dungeon-board.build.md"

# Direct (no wrapper)
npx ts-node tools/vscode-isl/src/cli/agent-update-gen-lock.ts \
  --root example/hq --build-file "<abs-path>"
```

### Flags

| Flag | Description |
|------|-------------|
| `--root <dir>` | Stack directory (auto-resolves manifest and lock) |
| `--manifest <path>` | Explicit manifest path |
| `--lock <path>` | Explicit lock path |
| `--build-file <abs>` | Absolute path to a `.build.md` file (repeatable) |

---

## Agent sync-lock-manifest

Marks **all** manifest entries as up-to-date in `gen-lock.json` at once.

> ⚠️ **Use with caution.** Only run this if you are certain **every** artifact in `bin/` already reflects the current ISL — not as a shortcut.

```bash
# Wrapper
node llm-tools/run-sync-lock-manifest.cjs --root example/hq

# Direct
npx ts-node tools/vscode-isl/src/cli/agent-sync-lock-manifest.ts --root example/hq
```

---

## Python reference resolver (`isl_compiler.py`)

Standalone Python script — no dependencies beyond stdlib. Reads an `.isl.md` file, resolves all `> **Reference**: ... in [file](file)` links recursively, and writes the merged result to stdout.

Useful for pasting into an LLM chat directly.

```bash
python tools/isl_compiler.py <file.isl.md>

# Redirect to a file
python tools/isl_compiler.py specs/my-spec.isl.md > merged-prompt.md
```

---

## Builder vs Generator

| | **Builder** | **Generator (LLM)** |
|---|-------------|---------------------|
| **Typical output** | `build-manifest.json`, `*.build.md` | Files under `bin/`, optional `*.sign.ts` |
| **Requires LLM** | No | Yes |
| **When to use** | Resolve dependencies and prepare context | Produce or refresh implementation from context |

More detail: [Compilation and codegen](./compilation-workflow.md).

---

## See also

- [Getting Started](./getting-started.md)
- [Compilation and codegen](./compilation-workflow.md)
- [Documentation index](./README.md)
