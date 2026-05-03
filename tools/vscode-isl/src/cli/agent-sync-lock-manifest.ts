/**
 * Sets gen-lock entries for every manifest row that has implementationPath
 * to the current manifest hash.
 *
 * WARNING: Only run after every artifact in bin/ has been reconciled with ISL.
 * Syncing the lock without updating implementation source code is not compilation.
 *
 * Usage:
 *   npx ts-node tools/vscode-isl/src/cli/agent-sync-lock-manifest.ts --root example/dungeon
 */

import * as fs from "fs";
import * as path from "path";
import type { ManifestEntry, GenLock } from "../isl-generator/types";

function parseArgs(argv: string[]) {
  const out: {
    root: string | null;
    manifest: string | null;
    lock: string | null;
  } = { root: null, manifest: null, lock: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root" && argv[i + 1]) out.root = path.resolve(argv[++i]);
    else if (a === "--manifest" && argv[i + 1])
      out.manifest = path.resolve(argv[++i]);
    else if (a === "--lock" && argv[i + 1]) out.lock = path.resolve(argv[++i]);
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv);
  let manifestPath = args.manifest;
  let lockPath = args.lock;

  if (args.root) {
    manifestPath =
      manifestPath ||
      path.join(args.root, "build", "build-manifest.json");
    lockPath =
      lockPath || path.join(args.root, "build", "gen-lock.json");
  }

  if (!manifestPath || !fs.existsSync(manifestPath)) {
    console.error("Need --manifest or --root");
    process.exit(1);
  }
  if (!lockPath) {
    console.error("Need --lock or --root");
    process.exit(1);
  }

  const manifest: ManifestEntry[] = JSON.parse(
    fs.readFileSync(manifestPath, "utf8"),
  );
  let existing: GenLock = {};
  if (fs.existsSync(lockPath)) {
    existing = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  }

  const lock: GenLock = { ...existing };
  let n = 0;
  for (const e of manifest) {
    if (!e.implementationPath) continue;
    lock[e.buildFile] = e.hash;
    n++;
  }

  const dir = path.dirname(lockPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2), "utf8");
  console.log(`Synced ${n} manifest hashes into ${lockPath}`);
}

main();
