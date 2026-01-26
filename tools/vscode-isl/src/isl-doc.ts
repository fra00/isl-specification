import * as fs from "fs";
import * as path from "path";
import { LLMClient, LLMProvider } from "./llm-client";

interface ManifestEntry {
  sourceFile: string;
  buildFile: string;
  implementationPath: string | null;
  hash: string;
}

export class ISLDocGenerator {
  private manifestPath: string;
  private outputDir: string;
  private llmClient: LLMClient;

  constructor(
    manifestPath: string,
    outputDir: string,
    llmProvider: LLMProvider = "openai",
  ) {
    this.manifestPath = path.resolve(manifestPath);
    this.outputDir = path.resolve(outputDir);
    this.llmClient = new LLMClient(llmProvider);
  }

  public async run() {
    if (!fs.existsSync(this.manifestPath)) {
      console.error(`❌ Manifest not found: ${this.manifestPath}`);
      return;
    }

    const manifest: ManifestEntry[] = JSON.parse(
      fs.readFileSync(this.manifestPath, "utf-8"),
    );

    console.log(`🚀 Starting Documentation Generation`);
    console.log(`📂 Manifest: ${this.manifestPath}`);
    console.log(`🎯 Output Dir: ${this.outputDir}`);

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // 1. Generate User Guide (Presentation & Orchestration components)
    await this.generateUserGuide(manifest);

    // 2. Generate Technical Reference (All components)
    await this.generateTechnicalReference(manifest);

    console.log(`✅ Documentation Generation Completed.`);
  }

  private async generateUserGuide(manifest: ManifestEntry[]) {
    console.log(`📘 Generating User Guide...`);
    const userGuideContext = [];

    for (const entry of manifest) {
      const islContent = fs.readFileSync(entry.sourceFile, "utf-8");
      // Filter for Presentation or Orchestration roles
      if (
        islContent.includes("Role: Presentation") ||
        islContent.includes("Role: Application Orchestration")
      ) {
        userGuideContext.push(
          `--- COMPONENT: ${path.basename(entry.sourceFile)} ---\n${islContent}`,
        );
      }
    }

    if (userGuideContext.length === 0) {
      console.log("   (No presentation components found for User Guide)");
      return;
    }

    const prompt = `
      You are a Technical Writer creating a User Guide for an application.
      Based on the following ISL specifications (Intent Specification Language), write a clear, user-friendly guide.
      
      **Instructions:**
      - Focus on the "Description", "Capabilities", and "Flow" sections.
      - Explain WHAT the user can do and HOW to interact with the application.
      - Ignore technical implementation details (like props, state, specific code constraints).
      - Group related functionalities logically.
      - Use clear headings and bullet points.
      
      **Input Context:**
      ${userGuideContext.join("\n\n")}
    `;

    const userGuideContent = await this.llmClient.generateRaw(prompt);
    const outputPath = path.join(this.outputDir, "UserGuide.md");
    fs.writeFileSync(outputPath, userGuideContent);
    console.log(`   -> Created: ${outputPath}`);
  }

  private async generateTechnicalReference(manifest: ManifestEntry[]) {
    console.log(`🛠️ Generating Technical Reference...`);

    const techDir = path.join(this.outputDir, "technical");
    if (!fs.existsSync(techDir)) {
      fs.mkdirSync(techDir, { recursive: true });
    }

    const generatedDocs: { name: string; link: string }[] = [];

    for (const entry of manifest) {
      const componentName = path.basename(entry.sourceFile).replace(".isl.md", "");
      console.log(`   > Documenting: ${componentName}`);

      const islContent = fs.readFileSync(entry.sourceFile, "utf-8");
      let signatureContent = "";

      if (entry.implementationPath) {
        // Try to find the .sign.json file
        // Assuming outputBaseDir logic from generator: projectRoot/bin
        // We need to reconstruct where the generator put the file.
        // For simplicity, we look relative to the manifest location if possible,
        // or we might need the outputBaseDir passed in constructor to be accurate.
        // Here we assume the .sign.json is next to the implementation file in the 'bin' folder relative to project root.

        // Heuristic: Assume standard structure project/bin/file.jsx.sign.json
        const projectRoot = path.dirname(path.dirname(this.manifestPath)); // build/../ -> project root
        const signPath = path.join(
          projectRoot,
          "bin",
          entry.implementationPath + ".sign.json",
        );

        if (fs.existsSync(signPath)) {
          try {
            const signData = JSON.parse(fs.readFileSync(signPath, "utf-8"));
            signatureContent = `\n**Real Implementation Signature**:\n\`\`\`json\n${JSON.stringify(signData, null, 2)}\n\`\`\``;
          } catch (e) {
            // ignore error
          }
        }
      }

      const context = `--- COMPONENT: ${path.basename(entry.sourceFile)} ---\n${islContent}${signatureContent}`;

      const prompt = `
      You are a Senior Software Architect creating a Technical Reference Manual for a specific component.
      Based on the following ISL specifications and Real Implementation Signatures, document the component.
      
      **Instructions:**
      - Provide a summary of its Role and Responsibilities.
      - List the public Capabilities/Methods.
      - If a "Real Implementation Signature" is provided, document the actual exported functions and props.
      - Highlight any critical "Constraints" defined in the ISL.
      - Describe the dependencies between components (based on References in ISL).
      - Format as a structured Markdown document suitable for developers.
      
      **Input Context:**
      ${context}
    `;

      try {
        const techRefContent = await this.llmClient.generateRaw(prompt);
        const fileName = `${componentName}.md`;
        const outputPath = path.join(techDir, fileName);
        fs.writeFileSync(outputPath, techRefContent);
        generatedDocs.push({ name: componentName, link: `./technical/${fileName}` });
      } catch (error) {
        console.error(`   ❌ Failed to generate doc for ${componentName}`);
      }
    }

    // Generate Index
    let indexContent = `# Technical Reference Index\n\n`;
    indexContent += `## Components\n\n`;
    for (const doc of generatedDocs) {
      indexContent += `- ${doc.name}\n`;
    }

    const indexOutputPath = path.join(this.outputDir, "TechnicalReference.md");
    fs.writeFileSync(indexOutputPath, indexContent);
    console.log(`   -> Created Index: ${indexOutputPath}`);
  }
}

// CLI Entry Point
if (require.main === module) {
  const args = process.argv.slice(2);
  const useGemini = args.includes("--gemini");

  // Filter flags
  const positionalArgs = args.filter((arg) => !arg.startsWith("--"));

  const projectRoot = positionalArgs[0] || ".";
  const manifestPath = path.join(projectRoot, "build", "build-manifest.json");
  const outputDir = path.join(projectRoot, "doc");

  const provider = useGemini ? "gemini" : "openai";

  const docGenerator = new ISLDocGenerator(manifestPath, outputDir, provider);
  docGenerator.run();
}
