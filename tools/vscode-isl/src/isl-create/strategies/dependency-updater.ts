import { ChatMessage } from "../../llm-client";
import { ISL_RULES } from "../rules";

export function buildDependencyUpdaterPrompt(
  originalFileContent: string,
  updateRequest: string,
): ChatMessage[] {
  const systemContent = `
You are an expert ISL Maintenance Engineer.

**YOUR GOAL**:
Update an existing ISL file to satisfy a specific change request from a dependent component.

${ISL_RULES}

**UPDATE RULES**:
1. **Preserve Existing Logic**: Do not remove or break existing capabilities unless explicitly asked.
2. **Consistency**: Ensure the new capability matches the style and role of the file.
3. **Structure**: Maintain strict markdown hierarchy. Capabilities MUST be Level 4 headers (####).
4. **Minimal Changes**: Only make necessary changes.
5. **Formatting**: Do NOT use backticks in headers (e.g., use \`#### AddProduct\`, NOT \`#### \`AddProduct\`\`).

**OUTPUT RULES**:
- Return the FULL updated content of the ISL file.
- Do NOT output the Project Name or Metadata Header (Version, Implementation).
`;

  const userTask = `
**UPDATE TASK**:
1. **File to Update**:
${originalFileContent}

2. **Change Request**:
"${updateRequest}"

**ACTION**:
Regenerate the file content including the requested changes.
`;

  return [
    { role: "system", content: systemContent },
    { role: "user", content: userTask },
  ];
}
