import * as fs from "fs";
import * as path from "path";
import { LLMClient, LLMProvider } from "./llm-client";
import { CodeReviewRunner } from "./isl-codeReview/runner";
import { getStackConfig } from "./isl-generator/stacks.config";
import { collectSignatures } from "./isl-generator/utils/signature-utils";

// Define locally to ensure availability, matching isl-generator/types.ts
interface ManifestEntry {
  sourceFile: string;
  buildFile: string;
  implementationPath?: string;
  hash: string;
}

async function main() {
  const args = process.argv.slice(2);
  const useGemini = args.includes("--gemini");
  const useLmStudio = args.includes("--lmstudio");
  const modelArg = args
    .find((arg) => arg.startsWith("--model="))
    ?.split("=")[1];
  const urlArg = args.find((arg) => arg.startsWith("--url="))?.split("=")[1];
  const stackArg =
    args.find((arg) => arg.startsWith("--stack="))?.split("=")[1] || "react-js";

  const positionalArgs = args.filter((arg) => !arg.startsWith("--"));
  const islFilePath = positionalArgs[0];

  if (!islFilePath) {
    console.error("Usage: isl-codeReview <path/to/file.isl.md> [options]");
    process.exit(1);
  }

  const absoluteIslPath = path.resolve(islFilePath);
  if (!fs.existsSync(absoluteIslPath)) {
    console.error(`❌ ISL file not found: ${absoluteIslPath}`);
    process.exit(1);
  }

  // 1. Find Project Root (looking for build-manifest.json)
  let projectRoot = path.dirname(absoluteIslPath);
  let manifestPath = "";
  let foundRoot = false;

  // Search up for build-manifest.json
  let currentDir = projectRoot;
  while (true) {
    const directManifest = path.join(currentDir, "build-manifest.json");
    const buildManifest = path.join(currentDir, "build", "build-manifest.json");

    if (fs.existsSync(directManifest)) {
      projectRoot = currentDir;
      manifestPath = directManifest;
      foundRoot = true;
      break;
    }
    if (fs.existsSync(buildManifest)) {
      projectRoot = currentDir;
      manifestPath = buildManifest;
      foundRoot = true;
      break;
    }
    const parent = path.dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }

  if (!foundRoot) {
    console.error("❌ Could not find build-manifest.json in hierarchy.");
    process.exit(1);
  }

  // 2. Load Manifest
  const manifest: ManifestEntry[] = JSON.parse(
    fs.readFileSync(manifestPath, "utf-8"),
  );
  const islFileName = path.basename(absoluteIslPath);
  const entry = manifest.find(
    (e) => path.basename(e.sourceFile) === islFileName,
  );

  if (!entry) {
    console.error(`❌ Entry for ${islFileName} not found in manifest.`);
    process.exit(1);
  }

  if (!entry.implementationPath) {
    console.error(`❌ No implementation path defined for ${islFileName}.`);
    process.exit(1);
  }

  // 3. Determine Output Directory (bin)
  // Assumption: bin is in projectRoot/bin
  const outputBaseDir = path.join(projectRoot, "bin");

  // 4. Determine Generated File Path
  const stackConfig = getStackConfig(stackArg);
  const islContent = fs.readFileSync(absoluteIslPath, "utf-8");

  // Extract Role
  const roleMatch = islContent.match(
    /(?:###|\*\*)\s*Role(?:\*\*)?\s*:\s*(.+)/i,
  );
  const role = roleMatch ? roleMatch[1].trim() : "default";

  // Calculate extension
  let relativeImplPath = entry.implementationPath;
  const extMap = stackConfig.extensions;
  const desiredExt = extMap[role] || extMap.default || ".js";

  const currentExt = path.extname(relativeImplPath);
  if (currentExt) {
    relativeImplPath =
      relativeImplPath.slice(0, -currentExt.length) + desiredExt;
  } else {
    relativeImplPath = relativeImplPath + desiredExt;
  }

  const targetPath = path.join(outputBaseDir, relativeImplPath);

  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Generated file not found: ${targetPath}`);
    process.exit(1);
  }

  // 5. Collect Signatures
  // We need the build context (from .build.md) because it contains the resolved dependency blocks
  // required by collectSignatures. The raw ISL content does not have them.
  let buildContext = islContent;
  if (entry.buildFile && fs.existsSync(entry.buildFile)) {
    buildContext = fs.readFileSync(entry.buildFile, "utf-8");
  }
  const signatures = collectSignatures(buildContext, outputBaseDir, stackConfig);

  // 6. Run Review
  let provider: LLMProvider = "openai";
  if (useGemini) provider = "gemini";
  else if (useLmStudio) provider = "lm-studio";

  const client = new LLMClient(provider, modelArg, urlArg);
  const runner = new CodeReviewRunner(client, stackConfig);

  console.log(`🚀 Starting Code Review for ${path.basename(targetPath)}`);
  const result = await runner.review(targetPath, signatures);

  console.log(JSON.stringify(result, null, 2));

  if (!result.approved) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
