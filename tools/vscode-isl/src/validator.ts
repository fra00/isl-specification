export interface ValidationIssue {
  severity: "error" | "warning" | "info";
  line: number;
  column: number;
  message: string;
  rule: string;
}

export class ISLValidator {
  validate(text: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const lines = text.split("\n");

    // Check for project header
    if (!text.includes("# Project:")) {
      issues.push({
        severity: "error",
        line: 0,
        column: 0,
        message: "Missing project header (# Project: Name)",
        rule: "ISL-001",
      });
    }

    // Check for Domain Concepts
    if (!text.includes("## Domain Concepts")) {
      issues.push({
        severity: "warning",
        line: 0,
        column: 0,
        message: "Missing Domain Concepts section",
        rule: "ISL-010",
      });
    }

    // Validate components
    const componentPattern = /^##\s+Component:\s+(.+)$/gm;
    let componentMatch;
    const components: Array<{ name: string; line: number }> = [];

    while ((componentMatch = componentPattern.exec(text)) !== null) {
      const lineNumber =
        text.substring(0, componentMatch.index).split("\n").length - 1;
      components.push({
        name: componentMatch[1],
        line: lineNumber,
      });
    }

    if (components.length === 0) {
      // Allow shared domain files (no component, but has domain concepts)
      if (!text.includes("## Domain Concepts")) {
        issues.push({
          severity: "error",
          line: 0,
          column: 0,
          message: "No components defined. At least one component is required.",
          rule: "ISL-020",
        });
      }
    }

    // Validate each component has Role
    components.forEach((comp) => {
      const componentText = this.extractComponentText(text, comp.line);
      if (!componentText.includes("### Role:")) {
        issues.push({
          severity: "error",
          line: comp.line,
          column: 0,
          message: `Component "${comp.name}" missing required Role section`,
          rule: "ISL-021",
        });
      }
    });

    // Validate capabilities
    const capabilityPattern = /^####\s+(.+)$/gm;
    let capMatch;

    while ((capMatch = capabilityPattern.exec(text)) !== null) {
      const lineNumber =
        text.substring(0, capMatch.index).split("\n").length - 1;
      const capabilityText = this.extractCapabilityText(text, capMatch.index);

      // Check for Contract
      const contractRegex = /\*\*Contract(:\*\*|\*\* *:)/i;
      if (!contractRegex.test(capabilityText)) {
        issues.push({
          severity: "error",
          line: lineNumber,
          column: 0,
          message: `Capability "${capMatch[1]}" missing required Contract field`,
          rule: "ISL-030",
        });
      }

      // Check for Signature (recommended)
      const signatureRegex = /\*\*Signature(:\*\*|\*\* *:)/i;
      if (!signatureRegex.test(capabilityText)) {
        issues.push({
          severity: "info",
          line: lineNumber,
          column: 0,
          message: `Capability "${capMatch[1]}" missing recommended Signature field`,
          rule: "ISL-031",
        });
      }

      // Check RFC 2119 keywords in constraints
      if (capabilityText.includes("**🚨 Constraint**:")) {
        const rfc2119 = [
          "MUST",
          "MUST NOT",
          "SHOULD",
          "SHOULD NOT",
          "MAY",
          "REQUIRED",
          "OPTIONAL",
        ];
        const hasKeyword = rfc2119.some((kw) => capabilityText.includes(kw));

        if (!hasKeyword) {
          issues.push({
            severity: "warning",
            line: lineNumber,
            column: 0,
            message:
              "Constraints should use RFC 2119 keywords (MUST, SHOULD, MAY, etc.)",
            rule: "ISL-033",
          });
        }
      }
    }

    // Validate emoji usage
    lines.forEach((line, idx) => {
      const emojiMatch = line.match(/^###\s+([🔍📦⚡💡🚨✅🧪])\s+/);
      if (emojiMatch) {
        const validEmojis = ["🔍", "📦", "⚡", "💡", "🚨", "✅", "🧪"];
        if (!validEmojis.includes(emojiMatch[1])) {
          issues.push({
            severity: "warning",
            line: idx,
            column: 0,
            message: `Invalid semantic emoji "${emojiMatch[1]}"`,
            rule: "ISL-024",
          });
        }
      }
    });

    return issues;
  }

  private extractComponentText(text: string, startLine: number): string {
    const lines = text.split("\n");
    let componentText = "";

    for (let i = startLine + 1; i < lines.length; i++) {
      if (lines[i].startsWith("## ")) break;
      componentText += lines[i] + "\n";
    }

    return componentText;
  }

  private extractCapabilityText(text: string, startIndex: number): string {
    // Find end of current line to skip the current heading
    const endOfLineIdx = text.indexOf("\n", startIndex);
    const searchStart = endOfLineIdx === -1 ? text.length : endOfLineIdx + 1;
    const remainingText = text.substring(searchStart);

    const nextHeadingMatch = remainingText.search(/^#{1,4}\s+/m);

    if (nextHeadingMatch === -1) {
      return text.substring(startIndex);
    }

    return text.substring(startIndex, searchStart + nextHeadingMatch);
  }
}
