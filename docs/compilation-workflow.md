# Compilation and codegen

How to go from `.isl.md` specifications to artifacts in `bin/`, and how to use manifests and locks **without** confusing metadata with implementation.

---

## Concepts

| Artifact | Role |
|----------|------|
| **`*.isl.md`** | Normative source (contracts, capabilities, constraints). |
| **`build/build-manifest.json`** | Ordered list of build units for the stack (e.g. one component → one output). |
| **`*.build.md`** | Merged compilation context (includes the “source to implement” block). |
| **`bin/`** | Generated or hand-maintained code aligned with the spec; often treated as an ISL-derived artifact. |
| **`gen-lock.json`** | Per–build-unit hashes: records that the context at that point has been **translated** into coherent code. |

---

## Two typical phases

### 1. ISL Builder

- **Script**: [`tools/vscode-isl/src/isl-builder.ts`](../tools/vscode-isl/src/isl-builder.ts)
- **Example** (from repo root):

```bash
npx ts-node tools/vscode-isl/src/isl-builder.ts example/hq
```

- **What it does**: resolves references, produces/updates the manifest and `.build.md` files under `<stack>/build/`.
- **What it does not do**: it does not write the full application implementation in `bin/` by itself (it is not the final “code generator”).

Use it when ISL dependencies change or you need full context before implementing or running the generator.

### 2. Codegen to `bin/`

- **LLM pipeline**: [`tools/vscode-isl/src/isl-generator.ts`](../tools/vscode-isl/src/isl-generator.ts) (and related runners), often via extension commands or project scripts.
- Uses the context prepared by the Builder (or equivalent) to emit code in the stack’s output folder (e.g. React → `.jsx`).

Shared planning/skip logic also lives in [`compile-plan.ts`](../tools/vscode-isl/src/isl-generator/compile-plan.ts) and [`standard-runner`](../tools/vscode-isl/src/isl-generator/runners/standard-runner.ts).

---

## Incremental queue and `gen-lock` (agent / CI)

Further detail: [`llm-tools/README.md`](../llm-tools/README.md).

Conceptual flow:

1. **Discover work**: e.g.  
   `node llm-tools/run-compile-queue.cjs --root example/hq`  
   (lists what is stale vs lock/manifest).

2. **Align code** in `bin/` with the ISL (manually, agent, or LLM generator)—**semantic** obligation, not merely “file exists”.

3. **Only then** update the lock for that unit:  
   `node llm-tools/run-update-gen-lock.cjs --root example/hq --build-file "<absolute-path-to-.build.md>"`

### Important warning

Updating `gen-lock.json` **without** `bin/` truly reflecting ISL contracts and behavior makes the queue **falsely empty** and breaks the meaning of the lock. If the lock is “too optimistic”, remove or regenerate it per project policy (see the skill linked below).

**Risky** shortcut: bulk lock↔manifest sync without verifying code—documented in `llm-tools/README.md`.

---

## Cursor / in-session compilation

Operational rules for agents: [`.cursor/skills/isl-code-generation/SKILL.md`](../.cursor/skills/isl-code-generation/SKILL.md).

---

## Normative references

- [`specs/Code Generation Protocol.md`](../specs/Code%20Generation%20Protocol.md) (if present in your clone)
- [`specs/Intent Specification Language (ISL).md`](../specs/Intent%20Specification%20Language%20(ISL).md)

---

## See also

- [Getting Started](./getting-started.md)
- [Tools overview](./tools-overview.md)
- [Documentation index](./README.md)
