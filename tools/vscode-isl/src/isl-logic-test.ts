import * as fs from "fs";
import * as path from "path";
import { LLMClient, LLMProvider } from "./llm-client";
import { ISLLogicTestGenerator } from "./isl-logic-test/generator";

function getFilesRecursively(dir: string, fileList: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== "node_modules" &&
        entry.name !== "build" &&
        entry.name !== "bin" &&
        entry.name !== "logic-test" &&
        !entry.name.startsWith(".")
      ) {
        getFilesRecursively(fullPath, fileList);
      }
    } else if (entry.isFile()) {
      if (
        entry.name.endsWith(".isl.md") &&
        !entry.name.endsWith(".test.isl.md") &&
        !entry.name.endsWith(".report.md")
      ) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

async function main() {
  const args = process.argv.slice(2);
  const useGemini = args.includes("--gemini");
  const positionalArgs = args.filter((a) => !a.startsWith("--"));
  const pathArg = positionalArgs[0];

  const provider: LLMProvider = useGemini ? "gemini" : "openai";
  const client = new LLMClient(provider);
  const generator = new ISLLogicTestGenerator(client);

  if (pathArg && pathArg.endsWith(".isl.md")) {
    await generator.generate(pathArg);
  } else {
    const startDir = pathArg || process.cwd();
    console.log(`🔍 Searching for ISL files in: ${startDir}...`);
    const files = getFilesRecursively(startDir);
    for (const file of files) {
      await generator.generate(file);
    }
  }
}

if (require.main === module) {
  main();
}
