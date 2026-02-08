import * as fs from "fs";
import * as path from "path";
import { LLMClient, LLMProvider } from "./llm-client";
import { StandardRunner } from "./isl-create/runners/standard-runner";
import { ArchitectRunner } from "./isl-create/runners/architect-runner";

export class ISLCreator {
  private llmClient: LLMClient;
  private standardRunner: StandardRunner;
  private architectRunner: ArchitectRunner;

  constructor(
    provider: LLMProvider = "openai",
    modelName?: string,
    baseUrl?: string,
  ) {
    this.llmClient = new LLMClient(provider, modelName, baseUrl);
    this.standardRunner = new StandardRunner(this.llmClient);
    this.architectRunner = new ArchitectRunner(this.llmClient);
  }

  public async run(
    outputDir: string,
    inputContent: string,
    sourceFileName?: string,
  ) {
    return this.standardRunner.run(outputDir, inputContent, sourceFileName);
  }

  public async runArchitectMode(outputDir: string, inputContent: string) {
    return this.architectRunner.run(outputDir, inputContent);
  }
}

// CLI Entry Point
if (require.main === module) {
  // Usage Examples:
  // 1. Design Mode (Standard):
  //    node isl-create.js <output_dir> "<description_or_path>" [--gemini]
  //    Example: node isl-create.js ./specs "A login form"
  //
  // 2. Reverse Engineering Mode:
  //    node isl-create.js <output_dir> <source_file> --reverse [--gemini]
  //    Example: node isl-create.js ./specs ./bin/connection.jsx --reverse
  //
  // 3. Architect Mode:
  //    node isl-create.js <output_dir> "<requirements_or_path>" --architect [--gemini]
  //    Example: node isl-create.js ./specs "A complete e-commerce system" --architect

  const args = process.argv.slice(2);
  const useGemini = args.includes("--gemini");
  const useLmStudio = args.includes("--lmstudio");
  const isReverse = args.includes("--reverse");
  const isArchitect = args.includes("--architect");
  const modelArg = args
    .find((arg) => arg.startsWith("--model="))
    ?.split("=")[1];
  const urlArg = args.find((arg) => arg.startsWith("--url="))?.split("=")[1];
  const positionalArgs = args.filter((arg) => !arg.startsWith("--"));

  if (positionalArgs.length < 1) {
    console.error(
      "Usage: node isl-create.js <output_dir> [description_or_source_file] [--reverse] [--architect] [--gemini]",
    );
    process.exit(1);
  }

  if (isReverse && isArchitect) {
    console.error("❌ Error: Cannot use --reverse and --architect together.");
    process.exit(1);
  }

  const outputDir = positionalArgs[0];
  let inputArg = positionalArgs[1];
  let inputContent = "";
  let sourceFileName: string | undefined = undefined;

  if (isReverse) {
    // Reverse Engineering Mode: inputArg MUST be a file
    if (!inputArg) {
      console.error(
        "❌ Error: --reverse flag requires a source file path as the second argument.",
      );
      process.exit(1);
    }
    if (!fs.existsSync(inputArg) || !fs.statSync(inputArg).isFile()) {
      console.error(`❌ Error: Source file not found: ${inputArg}`);
      process.exit(1);
    }
    console.log(`📖 Reading source code from: ${inputArg}`);

    // Calcola il path relativo dal file ISL di output al file sorgente di input
    // Questo assicura che l'header **Implementation** sia corretto
    const outputDirAbs = path.resolve(outputDir);
    const inputAbsPath = path.resolve(inputArg);
    let relPath = path.relative(outputDirAbs, inputAbsPath);
    // Normalizza il path per usare forward slashes (anche su Windows) e assicurare ./ se necessario
    relPath = relPath.split(path.sep).join("/");
    if (!relPath.startsWith(".")) {
      relPath = "./" + relPath;
    }

    sourceFileName = relPath;
    inputContent = fs.readFileSync(inputArg, "utf-8");
  } else {
    // Design Mode: inputArg is description (or file containing description)
    if (inputArg && fs.existsSync(inputArg) && fs.statSync(inputArg).isFile()) {
      console.log(`📖 Reading description from file: ${inputArg}`);
      inputContent = fs.readFileSync(inputArg, "utf-8");
    } else if (inputArg) {
      inputContent = inputArg;
    } else {
      // Default description if none provided
      inputContent = `A component for the project in ${path.basename(outputDir)}`;
    }
  }

  let provider: LLMProvider = "openai";
  if (useGemini) {
    provider = "gemini";
  } else if (useLmStudio) {
    provider = "lm-studio";
  }

  const creator = new ISLCreator(provider, modelArg, urlArg);
  if (isArchitect) {
    creator.runArchitectMode(outputDir, inputContent);
  } else {
    creator.run(outputDir, inputContent, sourceFileName);
  }
}
