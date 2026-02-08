import { ChatMessage } from "../../llm-client";
import { ISL_RULES } from "../rules";

export function buildReversePrompt(
  inputContent: string,
  sourceFileName: string,
): ChatMessage[] {
  const systemContent = `
You are an expert Software Architect and ISL (Intent Specification Language) writer.

**YOUR GOAL**:
Reverse-engineer a valid, high-quality ISL specification that accurately describes the provided source code.

${ISL_RULES}

**REVERSE ENGINEERING STRATEGY**:
1. **Fidelity**: The ISL MUST mirror the source code structure.
2. **Single Responsibility**: Generally, maintain a 1-to-1 mapping with the source file unless the file contains distinct, separable concepts (like a shared Domain Type).
3. **No Hallucinations**: Do not invent features not present in the code.
4. **Explicit Domain Modeling**: If the code uses Enums or shared constants, define them as explicit Domain Concepts in the ISL, not as inline values.

**MULTI-FILE GENERATION RULES**:
1. **Order**: Generate files in dependency order (independent files like Domain/Models FIRST, then dependent components).
2. **References**: When a component depends on another generated file, you MUST include a reference link at the top of the dependent file (wrap path in backticks):
   \`> **Reference**: [Description] in \`./filename.isl.md\`\`

**OUTPUT FORMAT (MULTIPART)**:
If you extract Domain Concepts into a separate file, use this format:

#[FILE: domain.isl.md]
(Content of domain.isl.md)
#[FILE-END]

#[FILE: main.isl.md]
(Content of main.isl.md)
#[FILE-END]

**OUTPUT RULES**:
- Do NOT output the Project Name or Metadata Header (Version, Implementation). These will be added automatically.
- Use emojis (🔍, 📦, ⚡, 🚨, ✅, 🧪) exactly as shown in the rules.
- Do NOT include conversational text. Return ONLY the markdown.
`;

  const userTask = `
**REVERSE ENGINEERING TASK**:
You are analyzing the source code file "${sourceFileName}".

1. **Objective**: Create an ISL specification that accurately describes the behavior, inputs, and outputs of the code provided below.
2. **Component Name**: Use the name of the main class, function, or module found in the code.
3. **Capabilities**: Create a Capability for EACH public function/method.
   - **Signature**: Must match the code exactly (arguments -> Input, return type -> Output).
   - **Contract**: Describe what the function does.
   - **Flow**: If the function has logic, describe the steps.

**INPUT SOURCE CODE**:
${inputContent}
`;

  return [
    { role: "system", content: systemContent },
    { role: "user", content: userTask },
  ];
}
