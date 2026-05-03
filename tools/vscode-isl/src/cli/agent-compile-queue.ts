/**
 * CLI for Cursor agent / skill: lists compile queue using isl-generator compile-plan (no LLM).
 *
 * Usage:
 *   npx ts-node tools/vscode-isl/src/cli/agent-compile-queue.ts --root example/dungeon
 *   npx ts-node tools/vscode-isl/src/cli/agent-compile-queue.ts --manifest path --bin path --lock path --stack react-js
 */

import * as fs from "fs";
import * as path from "path";
import type { ManifestEntry, GenLock } from "../isl-generator/types";
import { getStackConfig } from "../isl-generator/stacks.config";
import {
  buildAgentCompileQueue,
  getTargetPathForEntry,
  shouldSkipGeneration,
} from "../isl-generator/compile-plan";

function parseArgs(argv: string[]) {
  const out: {
    root: string | null;
    manifest: string | null;
    bin: string | null;
    lock: string | null;
    stack: string;
    json: boolean;
    force: boolean;
    all: boolean;
  } = {
    root: null,
    manifest: null,
    bin: null,
    lock: null,
    stack: "react-js",
    json: false,
    force: false,
    all: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") out.json = true;
    else if (a === "--force") out.force = true;
    else if (a === "--all") out.all = true;
    else if (a === "--root" && argv[i + 1]) out.root = path.resolve(argv[++i]);
    else if (a === "--manifest" && argv[i + 1])
      out.manifest = path.resolve(argv[++i]);
    else if (a === "--bin" && argv[i + 1]) out.bin = path.resolve(argv[++i]);
    else if (a === "--lock" && argv[i + 1]) out.lock = path.resolve(argv[++i]);
    else if (a === "--stack" && argv[i + 1]) out.stack = argv[++i];
  }
  return out;
}

function defaultsFromRoot(stackRoot: string) {
  return {
    manifest: path.join(stackRoot, "build", "build-manifest.json"),
    bin: path.join(stackRoot, "bin"),
    lock: path.join(stackRoot, "build", "gen-lock.json"),
  };
}

function countSkippedUnchanged(
  manifest: ManifestEntry[],
  lock: GenLock,
  binDir: string,
  stackConfig: ReturnType<typeof getStackConfig>,
  force: boolean,
): number {
  let n = 0;
  for (const entry of manifest) {
    if (!entry.implementationPath) {
      continue;
    }
    const buildContext = fs.readFileSync(entry.buildFile, "utf-8");
    const paths = getTargetPathForEntry(
      entry,
      buildContext,
      binDir,
      stackConfig,
    );
    if (!paths) {
      continue;
    }
    if (shouldSkipGeneration(entry, lock, paths.targetPath, force)) {
      n++;
    }
  }
  return n;
}

function main() {
  const args = parseArgs(process.argv);
  let manifestPath = args.manifest;
  let binDir = args.bin;
  let lockPath = args.lock;

  if (args.root) {
    const d = defaultsFromRoot(args.root);
    manifestPath = manifestPath || d.manifest;
    binDir = binDir || d.bin;
    lockPath = lockPath || d.lock;
  }

  if (!manifestPath || !fs.existsSync(manifestPath)) {
    console.error(
      "Missing or invalid --manifest (or --root with build/build-manifest.json).",
    );
    process.exit(1);
  }
  if (!binDir) {
    console.error("Missing --bin (or --root).");
    process.exit(1);
  }

  const manifest: ManifestEntry[] = JSON.parse(
    fs.readFileSync(manifestPath, "utf-8"),
  );
  let lock: GenLock = {};
  if (lockPath && fs.existsSync(lockPath)) {
    lock = JSON.parse(fs.readFileSync(lockPath, "utf-8"));
  }

  const stackConfig = getStackConfig(args.stack);
  const queue = buildAgentCompileQueue(manifest, lock, binDir, stackConfig, {
    force: args.force,
  });

  const skippedUnchanged = countSkippedUnchanged(
    manifest,
    lock,
    binDir,
    stackConfig,
    args.force,
  );

  if (args.all && args.json) {
    const rows = manifest.map((entry) => {
      if (!entry.implementationPath) {
        return {
          sourceFile: entry.sourceFile,
          buildFile: entry.buildFile,
          implementationPath: entry.implementationPath,
          manifestHash: entry.hash,
          compile: false,
          reason: "no-implementation-path",
        };
      }
      const buildContext = fs.readFileSync(entry.buildFile, "utf-8");
      const paths = getTargetPathForEntry(
        entry,
        buildContext,
        binDir,
        stackConfig,
      );
      if (!paths) {
        return {
          sourceFile: entry.sourceFile,
          buildFile: entry.buildFile,
          manifestHash: entry.hash,
          compile: false,
          reason: "no-paths",
        };
      }
      const compile = !shouldSkipGeneration(
        entry,
        lock,
        paths.targetPath,
        args.force,
      );
      return {
        sourceFile: entry.sourceFile,
        buildFile: entry.buildFile,
        implementationPath: entry.implementationPath,
        manifestHash: entry.hash,
        targetPath: paths.targetPath,
        compile,
        reason: compile ? "needs-compile" : "unchanged",
      };
    });
    console.log(
      JSON.stringify(
        {
          manifest: manifestPath,
          bin: binDir,
          lock: lockPath,
          stack: args.stack,
          entries: rows,
        },
        null,
        2,
      ),
    );
    return;
  }

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          manifest: manifestPath,
          bin: binDir,
          lock: lockPath,
          stack: args.stack,
          compileQueue: queue,
          skippedUnchanged,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`Manifest: ${manifestPath}`);
  console.log(`Bin: ${binDir}`);
  console.log(`Lock: ${lockPath || "(none)"}`);
  console.log(`Stack: ${args.stack}`);
  console.log(`Compile queue (${queue.length}):`);
  for (const item of queue) {
    console.log(
      `  - ${path.basename(item.sourceFile)}  [${item.reason}]  →  ${item.targetPath}`,
    );
  }
  console.log(`Skipped unchanged: ${skippedUnchanged}`);
}

main();
