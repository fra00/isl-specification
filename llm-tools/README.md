# Agent hooks (ISL in-session compile)

These scripts **do not** replace the generator for day-to-day developers: they let **Cursor / skills** reuse the **same logic** as `StandardRunner` (path, role, hash, lock) **without LLM calls**.

**Important:** updating `gen-lock.json` without first **aligning `bin/` code to the ISL** is equivalent to claiming something compiled when it is not. The lock should be updated **after** the artifact reflects the signatures, capabilities, and constraints of the `*.isl.md`.

Shared implementation:

- `tools/vscode-isl/src/isl-generator/compile-plan.ts` — factored from the generator; also used by `runners/standard-runner.ts`.
- `tools/vscode-isl/src/cli/agent-compile-queue.ts` — incremental compile queue.
- `tools/vscode-isl/src/cli/agent-update-gen-lock.ts` — updates `gen-lock.json` for **one or more** `--build-file` entries after a verified compile.

## Usage (from repository root)

```bash
node llm-tools/run-compile-queue.cjs --root example/dungeon

node llm-tools/run-compile-queue.cjs --root example/dungeon --json

node llm-tools/run-update-gen-lock.cjs --root example/dungeon --build-file "C:\...\dungeon.build.md"
```

Direct equivalent (no wrapper):

```bash
npx ts-node tools/vscode-isl/src/cli/agent-compile-queue.ts --root example/dungeon

npx ts-node tools/vscode-isl/src/cli/agent-update-gen-lock.ts --root example/dungeon --build-file "<abs>"
```

Main queue options: `--manifest`, `--bin`, `--lock`, `--stack react-js`, `--force`, `--all --json`.

### Use with caution

| Script | Note |
|--------|------|
| `run-sync-lock-manifest.cjs` | Sets **all** manifest hashes in the lock. Use only if you are sure **every** artifact in `bin/` already matches the current ISL—**not** as a shortcut after only checking that files exist. |
| `agent-refresh-queue-headers.cjs` | Renames only the banner at the top of queued files; **not** compilation or semantic alignment. |

Skill documentation: `.cursor/skills/isl-code-generation/SKILL.md`.
