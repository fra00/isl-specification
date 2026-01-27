import * as fs from "fs";
import * as path from "path";
import { LLMClient, LLMProvider } from "./llm-client";

export class ISLCreator {
  private llmClient: LLMClient;

  constructor(provider: LLMProvider = "openai") {
    this.llmClient = new LLMClient(provider);
  }

  public async run(outputFile: string, description: string) {
    console.log(`🚀 Generating ISL Specification`);
    console.log(`📄 Output File: ${outputFile}`);
    console.log(`📝 Description: "${description}"`);

    const prompt = `
      Act as an expert Software Architect and ISL (Intent Specification Language) writer.
      
      Your task is to generate a valid ISL specification file based on the user's description.
      
      **User Description:**
      "${description}"
      
      **ISL Format Rules:**
      1. Start with "# Project: [Project Name]"
      2. Include metadata: **Version**, **ISL Version**: 1.6.1
      3. Define "## Domain Concepts" if the description implies data structures.
      4. Define one or more "## Component: [Name]" sections.
      5. Each component MUST have a "### Role: [Presentation/Backend/Business Logic]".
      6. For Presentation components, include "### 🔍 Appearance" and "### 📦 Content".
      7. Define "### ⚡ Capabilities" with "Contract", "Trigger", "Side Effects" or "Flow".
      8. Use emojis (🔍, 📦, ⚡, 🚨, ✅, 🧪) correctly as section headers.
      
      **Output:**
      Return ONLY the content of the .isl.md file. Do not include conversational text.
    `;

    try {
      const content = await this.llmClient.generateRaw(prompt);

      const resolvedPath = path.resolve(outputFile);
      const dir = path.dirname(resolvedPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(resolvedPath, content);
      console.log(`✅ ISL Generated successfully: ${resolvedPath}`);
    } catch (e: any) {
      console.error(`❌ Generation failed: ${e.message}`);
    }
  }
}

// CLI Entry Point
if (require.main === module) {
  const args = process.argv.slice(2);
  const useGemini = args.includes("--gemini");
  const positionalArgs = args.filter((arg) => !arg.startsWith("--"));

  if (positionalArgs.length < 1) {
    console.error(
      "Usage: node isl-create.js <output_file_path> [description] [--gemini]",
    );
    process.exit(1);
  }

  const outputFile = positionalArgs[0];
  // Se la descrizione non è fornita, usiamo il nome del file come base
  const description =
    positionalArgs[1] ||
    `A component named ${path.basename(outputFile, ".isl.md").replace(/-/g, " ")}`;

  const provider = useGemini ? "gemini" : "openai";

  const creator = new ISLCreator(provider);
  creator.run(outputFile, description);
}
