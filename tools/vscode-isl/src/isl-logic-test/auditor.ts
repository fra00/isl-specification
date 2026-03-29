import * as fs from "fs";
import * as path from "path";
import { LLMClient } from "../llm-client";
import { ISLCompiler } from "../compiler";
import { AUDITOR_SYSTEM_PROMPT } from "./auditor-prompt";

export class ISLLogicAuditor {
  constructor(private llmClient: LLMClient) {}

  public async runAudit(islFilePath: string): Promise<string | null> {
    const absolutePath = path.resolve(islFilePath);
    const fileName = path.basename(absolutePath);
    const projectRoot = this.findProjectRoot(absolutePath);

    const testFilePath = path.join(
      projectRoot,
      "logic-test",
      fileName.replace(".isl.md", ".test.isl.md"),
    );

    if (!fs.existsSync(testFilePath)) {
      console.error(
        `❌ Test file not found for ${fileName}. Run isl-logic-test first.`,
      );
      return null;
    }

    console.log(`🔍 Auditing logic for: ${fileName}...`);

    const resolvedContent = ISLCompiler.resolveReferences(absolutePath, 2);
    const testScenarios = fs.readFileSync(testFilePath, "utf-8");

    const prompt = `
### BUSINESS LOGIC & DOMAIN (UNDER TEST)
${resolvedContent}

### TEST SCENARIOS & ASSERTS
${testScenarios}

### TASK
Execute the tests mentally and generate the Audit Report. Report only failures.
`;

    try {
      const report = await this.llmClient.generateRaw([
        { role: "system", content: AUDITOR_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ]);

      if (report.includes("ALL TESTS PASSED")) {
        console.log("✅ Success: Logic is sound.");
      } else {
        console.warn(
          `⚠️ Issues found in ${fileName}. Check the report for REPAIR_PAYLOADs.`,
        );
      }
      return `## Audit Report for: ${fileName}\n\n${report}\n\n---\n`;
    } catch (error: any) {
      console.error(`❌ Audit failed: ${error.message}`);
      return `## Audit Error for: ${fileName}\n\n❌ **Audit failed**: ${error.message}\n\n---\n`;
    }
  }

  private findProjectRoot(filePath: string): string {
    let current = path.dirname(filePath);
    while (current !== path.parse(current).root) {
      if (
        fs.existsSync(path.join(current, "logic-test")) ||
        fs.existsSync(path.join(current, "build"))
      ) {
        return current;
      }
      current = path.dirname(current);
    }
    return path.dirname(filePath);
  }
}
