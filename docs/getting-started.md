# Getting Started

Minimal guide to using this repository: read the spec, write valid ISL, and (optionally) use the tools under `tools/`.

---

## 1. Prerequisites

- **Read** the ISL specification in [`specs/Intent Specification Language (ISL).md`](../specs/Intent%20Specification%20Language%20(ISL).md). The root README is an overview and **does not** replace the canonical rules.
- For local tooling: **Node.js** (LTS recommended, e.g. 18+) if you will run lint, the extension in dev mode, or TypeScript scripts under `tools/vscode-isl/`.

---

## 2. Minimal structure of an `.isl.md` file

Every ISL document should include at least:

- Project header (`# Project: …`), **Version**, **ISL Version** (aligned with the spec you target, e.g. `1.6.2`).
- Conceptual sections (`## Domain Concepts`, components, capabilities with ⚡ 🚨 ✅ where the spec requires them).

Starter snippet (excerpt): see the repository root README for a fuller template.

---

## 3. VS Code extension (recommended)

Location: [`tools/vscode-isl/`](../tools/vscode-isl/).

- **Typical features**: syntax highlighting for `.isl.md`, snippets (`isl-base`, `isl-component`, …), real-time validation, quick fixes.
- **Development install**: `npm install` in the extension folder, then `F5` for Extension Development Host.
- **`.vsix` package**: from `tools/vscode-isl`, run `vsce package` (see the extension README).

Commands and settings: [`tools/vscode-isl/README.md`](../tools/vscode-isl/README.md).

---

## 4. Validating specifications (lint)

CLI validator for CI or local use: see [`tools/README.md`](../tools/README.md) (ISL Lint section) and the `tools/isl-lint-shell/` folder.

Typical usage (adjust the path to your file):

```bash
cd tools/isl-lint-shell
npm install
npm run lint -- path/to/file.isl.md
```

---

## 5. Next step: compilation / codegen

If your project has a **stack** with `build-manifest`, `.build.md` files, and a `bin/` folder:

- Read [Compilation and codegen](./compilation-workflow.md).
- Do not confuse **updating `gen-lock.json`** with a real compile unless code in `bin/` actually reflects the ISL.

---

## 6. Examples in this repository

The [`example/`](../example/) folder contains many sample projects (simple forms, dashboards, **HQ** dungeon, etc.). Short orientation: [Examples catalog](./examples-catalog.md).

---

## See also

- [Tools overview](./tools-overview.md)
- [Documentation index](./README.md)
