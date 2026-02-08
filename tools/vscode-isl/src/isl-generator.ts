import * as fs from "fs";
import * as path from "path";
import { LLMClient, LLMProvider } from "./llm-client";
import { StandardRunner } from "./isl-generator/runners/standard-runner";
import { getStackConfig, StackConfig } from "./isl-generator/stacks.config";

export class ISLGenerator {
  private manifestPath: string;
  private outputBaseDir: string;
  private lockFilePath: string;
  private llmClient: LLMClient;
  private standardRunner: StandardRunner;
  private stackConfig: StackConfig;

  constructor(
    manifestPath: string,
    outputBaseDir?: string,
    llmProvider: LLMProvider = "openai",
    stackId: string = "react-js",
    modelName?: string,
    baseUrl?: string,
  ) {
    let resolvedPath = path.resolve(manifestPath);
    let projectRoot: string;

    if (
      fs.existsSync(resolvedPath) &&
      fs.statSync(resolvedPath).isDirectory()
    ) {
      projectRoot = resolvedPath;
      const directPath = path.join(resolvedPath, "build-manifest.json");
      const buildPath = path.join(resolvedPath, "build", "build-manifest.json");

      if (fs.existsSync(directPath)) {
        resolvedPath = directPath;
      } else if (fs.existsSync(buildPath)) {
        resolvedPath = buildPath;
      } else {
        resolvedPath = directPath;
      }
    } else {
      // Se è un file, deduciamo la root del progetto
      const dir = path.dirname(resolvedPath);
      if (path.basename(dir) === "build") {
        projectRoot = path.dirname(dir);
      } else {
        projectRoot = dir;
      }
    }

    this.manifestPath = resolvedPath;
    if (outputBaseDir) {
      this.outputBaseDir = path.resolve(outputBaseDir);
    } else {
      this.outputBaseDir = path.join(projectRoot, "bin");
    }
    // Il lock file risiede accanto al manifest per tenere traccia dello stato
    this.lockFilePath = path.join(
      path.dirname(this.manifestPath),
      "gen-lock.json",
    );

    // Inizializza il client LLM
    this.llmClient = new LLMClient(llmProvider, modelName, baseUrl);
    this.stackConfig = getStackConfig(stackId);

    this.standardRunner = new StandardRunner(
      this.llmClient,
      this.manifestPath,
      this.outputBaseDir,
      this.lockFilePath,
      this.stackConfig,
    );
  }

  public async run(options: { force?: boolean; debug?: boolean } = {}) {
    return this.standardRunner.run(options);
  }
}

// CLI Entry Point
if (require.main === module) {
  const args = process.argv.slice(2);
  const forceFlag = args.includes("--force");
  const debugFlag = args.includes("--debug");
  const useGemini = args.includes("--gemini");
  const useLmStudio = args.includes("--lmstudio");
  const stackArg = args
    .find((arg) => arg.startsWith("--stack="))
    ?.split("=")[1];
  const modelArg = args
    .find((arg) => arg.startsWith("--model="))
    ?.split("=")[1];
  const urlArg = args.find((arg) => arg.startsWith("--url="))?.split("=")[1];

  // Filtra gli argomenti flag per ottenere solo quelli posizionali
  const positionalArgs = args.filter((arg) => !arg.startsWith("--"));

  const manifestArg = positionalArgs[0];
  const outputDirArg = positionalArgs[1];

  let provider: LLMProvider = "openai";
  if (useGemini) {
    provider = "gemini";
  } else if (useLmStudio) {
    provider = "lm-studio";
  }

  const generator = new ISLGenerator(
    manifestArg,
    outputDirArg,
    provider,
    stackArg,
    modelArg,
    urlArg,
  );
  generator.run({ force: forceFlag, debug: debugFlag });
}
