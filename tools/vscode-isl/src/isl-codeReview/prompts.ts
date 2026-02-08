import { StackConfig } from "../isl-generator/stacks.config";
import { SignatureEntry } from "../isl-generator/utils/signature-utils";

export function buildCodeReviewPrompt(
  code: string,
  fileName: string,
  signatures: SignatureEntry[],
  stackConfig: StackConfig,
): string {
  const signatureContext =
    signatures.length > 0
      ? `\n**DEPENDENCY SIGNATURES (Contracts you MUST respect):**\n` +
        signatures.map((s) => `Module: ${s.path}\n${s.signature}`).join("\n\n")
      : "";

  return `
You are a Senior Code Reviewer and QA Specialist for ${stackConfig.id}.
Your goal is to analyze the provided code for logical bugs, architectural violations, and stack-specific anti-patterns.

**CONTEXT:**
File Name: ${fileName}
Stack: ${stackConfig.techStack.join(", ")}

${signatureContext}

**CODE TO REVIEW:**
\`\`\`${path.extname(fileName).substring(1)}
${code}
\`\`\`

**REVIEW GUIDELINES:**
1. **Correctness**: Does the code compile/run? Are there syntax errors?
2. **Contract Compliance**: Does the code respect the imports/exports defined in the Dependency Signatures? (e.g. importing a named export as default).
3. **Stack Best Practices**:
   - React: Check for stale closures, missing deps. CRITICAL: Custom Hooks MUST return stable functions (useRef pattern) if exposed, to avoid infinite loops in consumers.
   - General: Check for null/undefined access without checks.
4. **Logic**: Are there obvious logical flaws (e.g. infinite loops, off-by-one errors)?

**OUTPUT FORMAT:**
You must output a JSON object strictly following this schema:
{
  "approved": boolean, // true if code is safe and correct, false if critical issues found
  "suggestions": string[] // List of specific, actionable fixes. Empty if approved.
}

Do NOT output markdown code blocks for the JSON. Output ONLY the raw JSON string.
`;
}

import * as path from "path";
