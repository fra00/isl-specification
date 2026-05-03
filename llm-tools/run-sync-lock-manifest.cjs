const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.join(__dirname, "..");
const cli = path.join(
  repoRoot,
  "tools",
  "vscode-isl",
  "src",
  "cli",
  "agent-sync-lock-manifest.ts",
);

const result = spawnSync(
  "npx",
  ["ts-node", cli, "--root", "example/dungeon", ...process.argv.slice(2)],
  { cwd: repoRoot, stdio: "inherit", shell: true },
);
process.exit(result.status === null ? 1 : result.status);
