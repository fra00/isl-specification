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

    // Read source file to extract ISL Version
    const sourceContent = fs.readFileSync(absolutePath, "utf-8");
    const islVersion = this.extractISLVersion(sourceContent);

    // Reuse ISLCompiler to inject Domain context
    const resolvedContent = ISLCompiler.resolveReferences(absolutePath, 2);

    const prompt = `
### COMPONENT AND DOMAIN CONTEXT
${resolvedContent}

### TASK
Generate a comprehensive set of logic test scenarios following the Target/Given/When/Assert pattern.
Ensure mandatory coverage: at least 1 happy path, 1 edge case, and 1 adversarial scenario per capability.
Ensure at least 1 violation scenario per declared constraint.
`;

    try {
      const testScenarios = await this.llmClient.generateRaw([
        { role: "system", content: GENERATOR_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ]);

      const header = this.buildHeader(fileName, islVersion);
      fs.writeFileSync(testFilePath, header + testScenarios);
      console.log(`✅ Test scenarios created: ${testFilePath}`);
    } catch (error: any) {
      console.error(`❌ Generation failed: ${error.message}`);
    }
  }

  private extractISLVersion(content: string): string {
    const match = content.match(/\*\*ISL Version\*\*:\s*(\d+\.\d+\.\d+)/);
    return match ? match[1] : "unknown";
  }

  private buildHeader(fileName: string, islVersion: string): string {
    const timestamp = new Date().toISOString().split("T")[0];
    return `# Logic Test Scenarios

**Source**: \`${fileName}\`
**ISL Version**: ${islVersion}
**Generated**: ${timestamp}

---

> Reference: \`./${fileName}\`

`;
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
