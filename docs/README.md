# ISL documentation (this repository)

This is the index for **operational** documentation: orientation, tooling, and compilation flows. The normative language definition remains under [`specs/`](../specs/).

---

## Quick links

| Document | Description |
|----------|-------------|
| [Getting Started](./getting-started.md) | Prerequisites, official spec, VS Code extension, first `.isl.md` file. |
| [Tools overview](./tools-overview.md) | What each tool does, where it lives, when to use it. |
| [Compilation and codegen](./compilation-workflow.md) | Builder vs LLM generator, `bin/`, `gen-lock.json`, agent scripts, and cautions. |
| [Examples catalog](./examples-catalog.md) | How to read the `example/` folder and what to expect from each project type. |
| [Tutorial: first component](./tutorial-first-component.md) | Short exercise: one end-to-end validatable `.isl.md` file. |

---

## Language specification (normative)

- **Full ISL**: [`specs/Intent Specification Language (ISL).md`](../specs/Intent%20Specification%20Language%20(ISL).md)
- **Code generation protocol** (if present in your tree): [`specs/Code Generation Protocol.md`](../specs/Code%20Generation%20Protocol.md)

---

## Useful links in the repo

| Path | Notes |
|------|--------|
| [`tools/vscode-isl/README.md`](../tools/vscode-isl/README.md) | VS Code extension: snippets, commands, `.vsix` install. |
| [`tools/README.md`](../tools/README.md) | ISL Lint (CLI) and legacy references. |
| [`llm-tools/README.md`](../llm-tools/README.md) | Agent compile queue, `gen-lock`, Node wrappers. |
| [`.cursor/skills/isl-code-generation/SKILL.md`](../.cursor/skills/isl-code-generation/SKILL.md) | Agent rules (align ISL ↔ `bin/` before updating the lock). |

---

## Contributing to documentation

- Keep a **single story** across the root README, `docs/`, and tool READMEs: the spec lives in `specs/`; here we describe **how to work** with the repository.
- Update this index when you add new guides.
