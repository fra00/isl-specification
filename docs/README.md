# ISL documentation (this repository)

This is the index for **operational** documentation: orientation, tooling, and compilation flows. The normative language definition remains under [`specs/`](../specs/).

---

## Quick links

| Document | Description |
|----------|-------------|
| [Getting Started](./getting-started.md) | Setup, minimal and richer `.isl.md` examples, Builder, Generator. |
| [Tools overview](./tools-overview.md) | Every CLI and VS Code feature (Builder, Generator, Graph, logic-test, doc, code review, …). |
| [Compilation and codegen](./compilation-workflow.md) | Builder and Generator in depth, artifacts, locks, related tools. |
| [Examples catalog](./examples-catalog.md) | How to read the `example/` folder and what to expect from each project type. |

---

## Language specification (normative)

- **Full ISL**: [`specs/Intent Specification Language (ISL).md`](../specs/Intent%20Specification%20Language%20(ISL).md)
- **Code generation protocol** (if present in your tree): [`specs/Code Generation Protocol.md`](../specs/Code%20Generation%20Protocol.md)

---

## Useful links in the repo

| Path | Notes |
|------|--------|
| [`tools/vscode-isl/README.md`](../tools/vscode-isl/README.md) | VS Code extension: snippets, commands, `.vsix` install. |
| [`tools/README.md`](../tools/README.md) | ISL Lint (CLI) and tool references. |

---

## Contributing to documentation

- Keep a **single story** across the root README, `docs/`, and tool READMEs: the spec lives in `specs/`; here we describe **how to work** with the repository.
- Update this index when you add new guides.
