import { ChatMessage } from "../../llm-client";
import { ISL_RULES } from "../rules";
import { ArchitectPlan, ArchitectFileEntry } from "../types";

export function buildBuilderPrompt(
  userRequirements: string,
  fullPlan: ArchitectPlan,
  targetFile: ArchitectFileEntry,
  dependencyContext: string = "",
): ChatMessage[] {
  const systemContent = `
You are an expert ISL Developer. You are part of a team building the project "${fullPlan.projectName}".

**YOUR TASK**:
Write the content for the file: **${targetFile.filename}**

**CONTEXT**:
- **Role**: ${targetFile.role}
- **Description**: ${targetFile.description}
- **Dependencies**: ${JSON.stringify(targetFile.dependencies)}

${dependencyContext ? `**DEPENDENCY INTERFACES (Read-Only)**:\n${dependencyContext}\n` : ""}

${ISL_RULES}

**INTEGRATION RULES**:
1. You are aware of the full system plan (see below), but your focus is ONLY on **${targetFile.filename}**.
2. If you need to refer to concepts in your dependencies, use the ISL reference syntax:
   \`> **Reference**: [Concept] in ./dependency-filename.isl.md\`
3. Do NOT generate code for other files.
4. **MISSING DEPENDENCIES**:
   If a required capability is missing in a dependency (visible in DEPENDENCY INTERFACES), do NOT hallucinate it.
   Instead, output a request to update the dependency using this format:
   #[DEPENDENCY_UPDATE_REQUEST]
   {
     "targetFilename": "filename.isl.md",
     "description": "Add capability 'X' to handle Y."
   }
   #[DEPENDENCY_UPDATE_REQUEST-END]
5. **MISSING DEPENDENCY FILE**:
   If you need to access types or capabilities from a file that is NOT in your dependencies list (e.g. Domain Enums), request it:
   #[MISSING_DEPENDENCY_FILE]
   {
     "filename": "domain.isl.md",
     "reason": "Need access to GameStatusEnum"
   }
   #[MISSING_DEPENDENCY_FILE-END]

**OUTPUT RULES**:
- Do NOT output the Project Name or Metadata Header.
- **MANDATORY**: You MUST start the file content with a list of references for ALL dependencies listed in your 'Dependencies' context:
${targetFile.dependencies.map(dep => `  > **Reference**: Concepts/Capabilities in \`./${dep}\``).join('\n')}
  (Adjust the description text as appropriate for the dependency role).
- Return ONLY the markdown content for ${targetFile.filename}.
`;

  const planList = fullPlan.files
    .map(
      (f) =>
        `- **${f.filename}** [${f.role}]\n  Description: ${f.description}\n  Dependencies: ${f.dependencies.join(", ") || "None"}`,
    )
    .join("\n\n");

  const planContext = `
**ARCHITECT'S PLAN (Global Context)**:
${planList}

**ORIGINAL REQUIREMENTS**:
"${userRequirements}"
`;

  return [
    { role: "system", content: systemContent },
    { role: "user", content: planContext },
  ];
}
