/**
 * Agent/skill entrypoint: forwards to vscode-isl gen-lock merge (same semantics as generator publish).
 */
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.join(__dirname, "..");
const cli = path.join(
  repoRoot,
  "tools",
  "vscode-isl",
  "src",
  "cli",
  "agent-update-gen-lock.ts",
);

const extra = process.argv.slice(2);
const result = spawnSync(
  "npx",
  ["ts-node", cli, ...extra],
  {
    cwd: repoRoot,
    stdio: "inherit",
    shell: true,
    env: process.env,
  },
);

process.exit(result.status === null ? 1 : result.status);
