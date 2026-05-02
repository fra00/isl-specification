# Tools overview

Map of official or supporting tools in the repository. Paths are relative to the **repository root**.

---

## Summary

| Tool | Primary purpose | Location |
|------|-----------------|----------|
| **ISL specification** | Normative language definition | [`specs/`](../specs/) |
| **VS Code extension** | Editing, snippets, diagnostics for `.isl.md` | [`tools/vscode-isl/`](../tools/vscode-isl/) |
| **ISL Builder** | Build graph, manifest, `.build.md` contexts (does not emit full app code to `bin/` by itself) | [`tools/vscode-isl/src/isl-builder.ts`](../tools/vscode-isl/src/isl-builder.ts) |
| **ISL Generator** (“LLM compiler”) | Code / signatures generation toward `bin/` (LLM pipeline) | [`tools/vscode-isl/src/isl-generator.ts`](../tools/vscode-isl/src/isl-generator.ts) |
| **Compiler core** | Shared compilation logic | [`tools/vscode-isl/src/compiler.ts`](../tools/vscode-isl/src/compiler.ts) |
| **ISL Lint** | Structural validation from CLI | [`tools/isl-lint-shell/`](../tools/isl-lint-shell/), docs in [`tools/README.md`](../tools/README.md) |
| **ISL Create** | ISL drafts from natural language (wizard / strategies) | [`tools/vscode-isl/src/isl-create.ts`](../tools/vscode-isl/src/isl-create.ts) |
| **ISL Graph** | Dependency graph utility (TS under `tools/`) | [`tools/isl-graph.ts`](../tools/isl-graph.ts) |
| **Logic test / auditor** | Logic-spec test support | [`tools/vscode-isl/src/isl-logic-test.ts`](../tools/vscode-isl/src/isl-logic-test.ts) |
| **Agent compile queue** | Incremental queue aligned with `StandardRunner` (hash, lock) | [`tools/vscode-isl/src/cli/agent-compile-queue.ts`](../tools/vscode-isl/src/cli/agent-compile-queue.ts) |
| **Agent update gen-lock** | Updates `gen-lock.json` for one or more `--build-file` entries | [`tools/vscode-isl/src/cli/agent-update-gen-lock.ts`](../tools/vscode-isl/src/cli/agent-update-gen-lock.ts) |
| **`llm-tools/` wrappers** | Convenient invocation from repo root | [`llm-tools/`](../llm-tools/) |

---

## VS Code extension (`vscode-isl`)

- **README**: [`tools/vscode-isl/README.md`](../tools/vscode-isl/README.md)
- **Build**: TypeScript compiled to `out/`; dependencies in `package.json`.
- **Commands**: ISL command palette (prompt compile, wizards, etc.—see `package.json` → `contributes.commands` for the current list).

---

## Builder vs Generator

| | **Builder** | **Generator (LLM)** |
|---|-------------|---------------------|
| **Typical output** | `build/build-manifest.json`, `*.build.md`, `.ref.md` | Files under `bin/`, optional `*.sign.ts` |
| **Requires LLM** | No | Yes (configured pipeline) |
| **When to use** | Resolve dependencies and per-component context | Produce or refresh implementation from context |

More detail: [Compilation and codegen](./compilation-workflow.md).

---

## Legacy Python script

[`tools/isl_compiler.py`](../tools/isl_compiler.py) (referenced in `tools/README.md`) supports reference resolution / prompt flows; day-to-day work around VS Code and TypeScript primarily lives in `tools/vscode-isl/`.

---

## Cursor / agents

The skill [`.cursor/skills/isl-code-generation/SKILL.md`](../.cursor/skills/isl-code-generation/SKILL.md) describes in-session compilation rules (align code to ISL before updating the lock).

---

## See also

- [Getting Started](./getting-started.md)
- [Compilation and codegen](./compilation-workflow.md)
- [Documentation index](./README.md)
