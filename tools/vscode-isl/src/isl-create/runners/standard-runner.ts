import * as fs from "fs";
import * as path from "path";
import { LLMClient } from "../../llm-client";
import { buildISLCreatePrompt } from "../prompts";

export class StandardRunner {
  constructor(private llmClient: LLMClient) {}

  public async run(
    outputDir: string,
    inputContent: string,
    sourceFileName?: string,
  ) {
    console.log(`🚀 Generating ISL Specification`);
    console.log(`📂 Output Directory: ${outputDir}`);

    const isReverseEngineering = !!sourceFileName;
    if (isReverseEngineering) {
      console.log(`📂 Source File: ${sourceFileName} (Reverse Engineering)`);
    } else {
      console.log(
        `📝 Description: "${inputContent.substring(0, 100).replace(/\n/g, " ")}..."`,
      );
    }

    const mode = isReverseEngineering ? "REVERSE" : "DESIGN";
    const messages = buildISLCreatePrompt(mode, inputContent, sourceFileName);

    try {
      console.log(`🤖 Generating ISL in ${mode}...`);
      const content = await this.llmClient.generateRaw(messages);

      const resolvedOutputDir = path.resolve(outputDir);

      if (!fs.existsSync(resolvedOutputDir)) {
        fs.mkdirSync(resolvedOutputDir, { recursive: true });
      }

      // Parsing Multipart Output
      const files = this.parseMultipartOutput(content);

      // Fallback: Se l'LLM non ha usato i tag, trattiamo tutto come un singolo file
      if (files.length === 0) {
        let defaultFilename = "component.isl.md";
        if (isReverseEngineering && sourceFileName) {
          // Usa il nome del file sorgente ma con estensione .isl.md
          const baseName = path.basename(
            sourceFileName,
            path.extname(sourceFileName),
          );
          defaultFilename = `${baseName}.isl.md`;
        }

        files.push({
          filename: defaultFilename,
          content: content,
        });
      }

      for (const file of files) {
        const targetPath = path.join(resolvedOutputDir, file.filename);

        const targetDir = path.dirname(targetPath);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        const projectName = path
          .basename(file.filename, ".isl.md")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        const baseName = path.basename(file.filename, ".isl.md");
        const implPath = isReverseEngineering
          ? `${sourceFileName}` // In reverse, tutti i file derivano dalla stessa sorgente
          : `./${baseName}`;

        const header = `# Project: ${projectName}\n\n**Version**: 1.0.0\n**ISL Version**: 1.6.1\n**Implementation**: ${implPath}\n\n`;

        fs.writeFileSync(targetPath, header + file.content);
        console.log(`✅ ISL Generated successfully: ${targetPath}`);
      }
    } catch (e: any) {
      console.error(`❌ Generation failed: ${e.message}`);
    }
  }

  private parseMultipartOutput(
    raw: string,
  ): Array<{ filename: string; content: string }> {
    const fileRegex = /#\[FILE:\s*(.*?)\]([\s\S]*?)#\[FILE-END\]/g;
    const files: Array<{ filename: string; content: string }> = [];
    let match;
    while ((match = fileRegex.exec(raw)) !== null) {
      files.push({
        filename: match[1].trim(),
        content: match[2].trim(),
      });
    }
    return files;
  }
}
