import * as fs from "fs";
import * as path from "path";
import { LLMClient } from "../llm-client";
import { ISLCompiler } from "../compiler";
import { GENERATOR_SYSTEM_PROMPT } from "./generator-prompt";

export class ISLLogicTestGenerator {
  constructor(private llmClient: LLMClient) {}

  public async generate(islFilePath: string) {
    const absolutePath = path.resolve(islFilePath);
    const fileName = path.basename(absolutePath);

    const projectRoot = this.findProjectRoot(absolutePath);
    const testDir = path.join(projectRoot, "logic-test");
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

    const testFilePath = path.join(
      testDir,
      fileName.replace(".isl.md", ".test.isl.md"),
    );

    console.log(`🧪 Generating logic tests for: ${fileName}...`);

    // Reuse ISLCompiler to inject Domain context
    const resolvedContent = ISLCompiler.resolveReferences(absolutePath, 2);

    const prompt = `
### COMPONENT AND DOMAIN CONTEXT
${resolvedContent}

### TASK
Generate a comprehensive set of logic test scenarios following the Given/When/Assert pattern.
`;

    try {
      const testScenarios = await this.llmClient.generateRaw([
        { role: "system", content: GENERATOR_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ]);

      const header = `<!-- LOGIC TEST SCENARIOS FOR: ${fileName} -->\n\n`;
      fs.writeFileSync(testFilePath, header + testScenarios);
      console.log(`✅ Test scenarios created: ${testFilePath}`);
    } catch (error: any) {
      console.error(`❌ Generation failed: ${error.message}`);
    }
  }

  private findProjectRoot(filePath: string): string {
    let current = path.dirname(filePath);
    while (current !== path.parse(current).root) {
      if (
        fs.existsSync(path.join(current, "domain-session.isl.md")) ||
        fs.existsSync(path.join(current, "build"))
      ) {
        return current;
      }
      current = path.dirname(current);
    }
    return path.dirname(filePath);
  }
}
