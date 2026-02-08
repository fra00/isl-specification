export interface ISLSection {
  type: string;
  title: string;
  content: string;
  line: number;
  level: number;
  emoji?: string;
}

class ISLParser {
  private lines: string[];
  private sections: ISLSection[] = [];

  constructor(content: string) {
    this.lines = content.split(/\r?\n/);
  }

  parse(): ISLSection[] {
    this.sections = [];

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);

      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2].trim();

        // Estrai emoji se presente
        const emojiMatch = title.match(/^([🔍📦⚡💡🚨✅🧪])\s+(.+)$/);
        const emoji = emojiMatch ? emojiMatch[1] : undefined;
        const cleanTitle = (emojiMatch ? emojiMatch[2] : title).replace(/`/g, "");

        // Estrai contenuto fino alla prossima heading
        const content = this.extractContent(i + 1);

        this.sections.push({
          type: this.inferType(level, cleanTitle, emoji),
          title: cleanTitle,
          content,
          line: i + 1,
          level,
          emoji,
        });
      }
    }

    return this.sections;
  }

  private extractContent(startLine: number): string {
    const contentLines: string[] = [];
    for (let i = startLine; i < this.lines.length; i++) {
      if (this.lines[i].match(/^#{1,4}\s+/)) {
        break;
      }
      contentLines.push(this.lines[i]);
    }
    return contentLines.join("\n").trim();
  }

  private inferType(level: number, title: string, emoji?: string): string {
    if (level === 1) return "project";
    if (level === 2) {
      if (title.includes("Domain Concepts")) return "domain";
      if (title.includes("Component:")) return "component";
      return "section";
    }
    if (level === 3) {
      if (emoji) {
        const emojiTypes: Record<string, string> = {
          "🔍": "appearance",
          "📐": "appearance",
          "📦": "content",
          "⚡": "capabilities",
          "💡": "hints",
          "🚨": "constraints",
          "✅": "acceptance",
          "🧪": "tests",
        };
        return emojiTypes[emoji] || "subsection";
      }
      if (title.includes("Role")) return "role";
      if (title.includes("Capabilities")) return "capabilities";
      if (title.includes("Constraints")) return "constraints";
      return "subsection";
    }
    if (level === 4) return "capability";
    return "unknown";
  }
}

/**
 * Extracts the public interface from an ISL file content.
 * This includes:
 * - Domain Concepts
 * - Component Definitions (Role, Signature)
 * - Capabilities (Contract, Signature, Input/Output)
 * - Constraints
 *
 * It explicitly excludes:
 * - Flow (Implementation details)
 * - Implementation Hints
 * - Test Scenarios
 * - Appearance/Content (UI details irrelevant for logic consumers)
 */
export function extractInterface(islContent: string): string {
  const parser = new ISLParser(islContent);
  const sections = parser.parse();

  let interfaceContent = "";

  // 1. Extract Domain Concepts (Always public)
  const domainSection = sections.find((s) => s.type === "domain");
  if (domainSection) {
    interfaceContent += `## ${domainSection.title}\n${domainSection.content}\n\n`;
    // Include all subsections of Domain Concepts (Entities)
    const domainSubsections = getSubsections(sections, domainSection);
    domainSubsections.forEach((sub) => {
      interfaceContent += `### ${sub.title}\n${sub.content}\n\n`;
    });
  }

  // 2. Extract Components
  const components = sections.filter((s) => s.type === "component");
  for (const component of components) {
    interfaceContent += `## ${component.title}\n`;

    // Include Component Description/Contract (content of the component section)
    if (component.content.trim()) {
      interfaceContent += `${component.content.trim()}\n`;
    }

    // Include Role & Signature from Component content/subsections
    const role = findSubsection(sections, component, "role");
    if (role) {
      interfaceContent += `### ${role.title}\n`;
      // Only print role content if it doesn't contain the signature (to avoid duplication if we extract it later)
      if (!role.content.includes("**Signature**:")) {
        interfaceContent += `${role.content}\n`;
      }
    }

    // Check for Signature in role content (if not already present in component content)
    if (!component.content.includes("**Signature**:") && role && role.content.includes("**Signature**:")) {
      const sig = extractField(role.content, "**Signature**:");
      if (sig) interfaceContent += `**Signature**: ${sig}\n`;
    }

    // 3. Extract Capabilities (Public API)
    const capabilitiesHeader = findSubsection(sections, component, "capabilities");
    if (capabilitiesHeader) {
      interfaceContent += `### ${capabilitiesHeader.title}\n`;
      const capabilities = getSubsections(sections, capabilitiesHeader);

      for (const cap of capabilities) {
        interfaceContent += `#### ${cap.title}\n`;
        
        // Extract Contract (Required)
        const contract = extractField(cap.content, "**Contract**:");
        if (contract) interfaceContent += `**Contract**: ${contract}\n`;

        // Extract Signature (Required/Recommended)
        const signature = extractField(cap.content, "**Signature**:");
        if (signature) interfaceContent += `**Signature**: ${signature}\n`;
        
        // Extract Input/Output (Alternative to Signature)
        const input = extractField(cap.content, "**Input**:");
        if (input) interfaceContent += `**Input**: ${input}\n`;
        const output = extractField(cap.content, "**Output**:");
        if (output) interfaceContent += `**Output**: ${output}\n`;

        interfaceContent += "\n";
      }
    }

    // 4. Extract Constraints (Normative rules often affect consumers)
    const constraintsHeader = findSubsection(sections, component, "constraints");
    if (constraintsHeader) {
       interfaceContent += `### ${constraintsHeader.title}\n${constraintsHeader.content}\n\n`;
    }

    interfaceContent += "\n";
  }

  return interfaceContent.trim();
}

// --- Helpers ---

function getSubsections(allSections: ISLSection[], parent: ISLSection): ISLSection[] {
  const subsections: ISLSection[] = [];
  const parentIndex = allSections.indexOf(parent);
  
  for (let i = parentIndex + 1; i < allSections.length; i++) {
    const s = allSections[i];
    if (s.level <= parent.level) break; // End of parent scope
    if (s.level === parent.level + 1) {
      subsections.push(s);
    }
  }
  return subsections;
}

function findSubsection(allSections: ISLSection[], parent: ISLSection, type: string): ISLSection | undefined {
  const subs = getSubsections(allSections, parent);
  return subs.find(s => s.type === type);
}

function extractField(content: string, fieldLabel: string): string | null {
  const regex = new RegExp(`${escapeRegExp(fieldLabel)}\\s*([\\s\\S]*?)(?:\\n\\*\\*|$)`);
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
