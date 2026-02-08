import * as fs from "fs";
import { LLMClient } from "../llm-client";
import { StackConfig } from "../isl-generator/stacks.config";
import { SignatureEntry } from "../isl-generator/utils/signature-utils";
import { buildCodeReviewPrompt } from "./prompts";

export interface ReviewResult {
  approved: boolean;
  suggestions: string[];
}

export class CodeReviewRunner {
  constructor(
    private llmClient: LLMClient,
    private stackConfig: StackConfig,
  ) {}

  public async review(
    filePath: string,
    signatures: SignatureEntry[] = [],
  ): Promise<ReviewResult> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const code = fs.readFileSync(filePath, "utf-8");
    const fileName = filePath.split(/[\/]/).pop() || "unknown";

    const prompt = buildCodeReviewPrompt(
      code,
      fileName,
      signatures,
      this.stackConfig,
    );

    console.log(`   🕵️  Reviewing ...`);
    console.log(`${prompt}`);

    try {
      const rawOutput = await this.llmClient.generateRaw(prompt);

      // Clean up potential markdown formatting from LLM (```json ... ```)
      let jsonStr = rawOutput.trim();
      const mdMatch = jsonStr.match(/^```(?:json)?\n([\s\S]*?)```$/);
      if (mdMatch) {
        jsonStr = mdMatch[1].trim();
      }

      const result: ReviewResult = JSON.parse(jsonStr);
      return result;
    } catch (error) {
      console.error("   ❌ Review failed (LLM or Parse Error):", error);
      // Fail safe: if review crashes, don't block but warn
      return {
        approved: false,
        suggestions: ["Review process failed internally."],
      };
    }
  }
}
