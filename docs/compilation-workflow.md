# Compilation and codegen

How to go from `.isl.md` specifications to artifacts in `bin/`.

---

## Concepts

| Artifact | Role |
|----------|------|
| **`*.isl.md`** | Normative source (contracts, capabilities, constraints). |
| **`build/build-manifest.json`** | Ordered list of build units for the stack (e.g. one component → one output). |
| **`*.build.md`** | Merged compilation context (includes the "source to implement" block). |
| **`bin/`** | Generated or hand-maintained code aligned with the spec. |

---

## Two typical phases

### 1. ISL Builder

- **Script**: [`tools/vscode-isl/src/isl-builder.ts`](../tools/vscode-isl/src/isl-builder.ts)
- **Example** (from repo root):

```bash
npx ts-node tools/vscode-isl/src/isl-builder.ts example/hq
```

- **What it does**: resolves references, produces/updates the manifest and `.build.md` files under `<stack>/build/`.
- **What it does not do**: it does not write the full application implementation in `bin/` by itself.

Use it when ISL dependencies change or you need full context before running the generator or prompting an LLM manually.

### 2. Codegen to `bin/`

- **LLM pipeline**: [`tools/vscode-isl/src/isl-generator.ts`](../tools/vscode-isl/src/isl-generator.ts) (and related runners), often via extension commands.
- Uses the context prepared by the Builder to emit code in the stack's output folder (e.g. React → `.jsx`).
- Alternatively, the `.build.md` file for a component can be fed directly to any LLM to generate or update code manually.

---

## Normative references

- [`specs/Code Generation Protocol.md`](../specs/Code%20Generation%20Protocol.md) (if present in your clone)
- [`specs/Intent Specification Language (ISL).md`](../specs/Intent%20Specification%20Language%20(ISL).md)

---

## See also

- [Getting Started](./getting-started.md)
- [Tools overview](./tools-overview.md)
- [Documentation index](./README.md)
