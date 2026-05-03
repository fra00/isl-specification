# Compilation and codegen

How `.isl.md` specifications become **`build/`** artifacts and then **`bin/`** implementation files.

---

## End-to-end picture

```text
*.isl.md  --(ISL Builder)-->  build/build-manifest.json
                              build/*.build.md
                              |
                              +-- optional: isl-graph (visualize refs)
                              +-- optional: isl-doc (docs from manifest)
                              |
                              v
                     --(ISL Generator + LLM)-->  bin/*
```

1. **Authoring** — You edit normative `.isl.md` files (optionally split with `Reference` links).
2. **Builder** — Deterministic step: no LLM. Produces an ordered manifest and one merged context file per component (`*.build.md`).
3. **Generator** — Calls an LLM with each `.build.md` and writes or updates files under `bin/` according to the stack (for example React JSX).

If you change only wording inside an existing capability, re-run **Builder** then **Generator** so hashes and contexts stay aligned. The Generator usually regenerates only units whose inputs changed; use **`--force`** to rebuild everything.

---

## Artifact roles

| Artifact | Role |
|----------|------|
| **`*.isl.md`** | Normative source: contracts, capabilities, constraints, acceptance criteria, tests. |
| **`build/build-manifest.json`** | Ordered list of compile units: source path, build context path, optional implementation path, content hash. |
| **`*.build.md`** | Full compilation context for one component: resolved references, dependency snippets, and cues for the implementation file. Safe to paste into any LLM if you are not using the Generator. |
| **`bin/`** | Generated or hand-maintained code that must satisfy the ISL. Stack-specific layout (see generator stack config). |

---

## Phase 1: ISL Builder

- **Script**: [`tools/vscode-isl/src/isl-builder.ts`](../tools/vscode-isl/src/isl-builder.ts)

```bash
npx tsx     tools/vscode-isl/src/isl-builder.ts example/hq
npx ts-node tools/vscode-isl/src/isl-builder.ts example/hq
```

**Does**

- Walks the project’s `.isl.md` set (according to stack rules and any existing manifest).
- Resolves `Reference` transclusions so each `.build.md` carries enough context for codegen or review.
- Updates **`build-manifest.json`** and **`.build.md`** files under `<stack>/build/`.

**Does not**

- Call an LLM.
- Write application code into `bin/` by itself.

Run the Builder whenever ISL files or cross-file references change, **before** relying on the Generator or on tools that read the manifest (`isl-doc`, `isl-codeReview`, agent helpers under `llm-tools/`).

---

## Phase 2: Codegen to `bin/`

- **Script**: [`tools/vscode-isl/src/isl-generator.ts`](../tools/vscode-isl/src/isl-generator.ts)

```bash
npx tsx     tools/vscode-isl/src/isl-generator.ts example/hq
npx ts-node tools/vscode-isl/src/isl-generator.ts example/hq
```

**Does**

- Reads **`build/build-manifest.json`**.
- For each entry, sends the corresponding `.build.md` (plus stack prompts) to the configured LLM.
- Writes or patches files under **`bin/`** (extensions and roles depend on `--stack=`, default `react-js`).

**Requires**

- Network access and API credentials for the chosen provider (`OPENAI_API_KEY`, Gemini, LM Studio URL, etc.).

**Alternative**

- Skip the Generator and paste a `.build.md` into any LLM manually; you still own aligning output paths with your stack.

Common flags: **`--force`**, **`--gemini`**, **`--lmstudio`**, **`--stack=`**, **`--model=`**, **`--url=`**, **`--debug`**. Details: [Tools overview](./tools-overview.md).

---

## Locks and incremental builds

Many stacks keep a **`gen-lock.json`** (or similar) recording hashes of generated units so unchanged specs do not trigger redundant LLM calls. Updating lock metadata without reconciling **`bin/`** with the ISL is invalid: the lock must reflect code that actually matches the specification. Treat lock updates as a consequence of a successful generate/review cycle, not as a shortcut.

---

## Related tooling (after `build/` exists)

| Tool | Depends on Builder output? |
|------|---------------------------|
| **isl-doc** | Yes — reads `build/build-manifest.json`. |
| **isl-codeReview** | Yes — needs manifest + `bin/` file for the component. |
| **isl-graph** | No manifest required — scans `.isl.md` in one folder for `Reference` edges. |
| **isl-logic-test / isl-logic-test-run** | Works from `.isl.md` trees; reports often live under `logic-test/`. |

See [Tools overview](./tools-overview.md) for commands.

---

## Normative references

- [`specs/Code Generation Protocol.md`](../specs/Code%20Generation%20Protocol.md) (if present in your clone)
- [`specs/Intent Specification Language (ISL).md`](../specs/Intent%20Specification%20Language%20(ISL).md)

---

## See also

- [Getting Started](./getting-started.md)
- [Tools overview](./tools-overview.md)
- [Documentation index](./README.md)
