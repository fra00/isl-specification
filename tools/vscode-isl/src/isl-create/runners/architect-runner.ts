import * as fs from "fs";
import * as path from "path";
import { LLMClient } from "../../llm-client";
import { buildArchitectPrompt } from "../strategies/architect";
import { buildBuilderPrompt } from "../strategies/builder";
import { buildDependencyUpdaterPrompt } from "../strategies/dependency-updater";
import { ArchitectPlan, ArchitectFileEntry } from "../types";
import { extractInterface } from "../../isl-generator/utils/isl-utils";

export class ArchitectRunner {
  constructor(private llmClient: LLMClient) {}

  public async run(outputDir: string, inputContent: string) {
    console.log(`🚀 Starting Architect Mode`);
    console.log(
      `📝 Requirements: "${inputContent.substring(0, 100).replace(/\n/g, " ")}..."`,
    );

    const debugDir = path.join(outputDir, "createPrompt");
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir, { recursive: true });
    }

    // 1. The Architect (Planning)
    console.log(`🧠 Architect is planning the system...`);
    const architectMessages = buildArchitectPrompt(inputContent);
    this.saveDebugPrompt(debugDir, "00_architect_plan.txt", architectMessages);

    const rawPlan = await this.llmClient.generateRaw(architectMessages);

    let plan: ArchitectPlan;
    try {
      plan = this.parseJsonOutput(rawPlan);
      console.log(
        `📋 Plan created: ${plan.projectName} (${plan.files.length} files)`,
      );
    } catch (e: any) {
      console.error(`❌ Failed to parse Architect Plan: ${e.message}`);
      console.error(`Raw Output: ${rawPlan}`);
      return;
    }

    const resolvedOutputDir = path.resolve(outputDir);
    if (!fs.existsSync(resolvedOutputDir)) {
      fs.mkdirSync(resolvedOutputDir, { recursive: true });
    }

    // 2. Topological Sort
    let sortedFiles: ArchitectFileEntry[] = [];
    try {
      sortedFiles = this.topologicalSort(plan.files);
      console.log(
        `🔄 Build Order: ${sortedFiles.map((f) => f.filename).join(" -> ")}`,
      );
    } catch (e: any) {
      console.error(`❌ Dependency Error: ${e.message}`);
      return;
    }

    // Memory map for generated content (filename -> content)
    const generatedContent = new Map<string, string>();

    // 3. The Builders (Sequential Execution with Self-Healing)
    for (const fileEntry of sortedFiles) {
      console.log(`👷 Building: ${fileEntry.filename} [${fileEntry.role}]`);

      let attempts = 0;
      const maxAttempts = 5;
      let success = false;

      while (attempts < maxAttempts && !success) {
        attempts++;
        if (attempts > 1) {
          console.log(`   🔄 Retry attempt ${attempts}/${maxAttempts}...`);
        }

        // Prepare Dependency Context
        let dependencyContext = "";
        for (const depFilename of fileEntry.dependencies) {
          const depContent = generatedContent.get(depFilename);
          if (depContent) {
            const iface = extractInterface(depContent);
            dependencyContext += `\n--- INTERFACE: ${depFilename} ---\n${iface}\n`;
          } else {
            console.warn(`   ⚠️ Warning: Dependency ${depFilename} not found in memory.`);
          }
        }

        if (dependencyContext) {
          console.log(`   🔗 Injected context from ${fileEntry.dependencies.length} dependencies.`);
        }

        const builderMessages = buildBuilderPrompt(
          inputContent,
          plan,
          fileEntry,
          dependencyContext,
        );
        
        this.saveDebugPrompt(
          debugDir, 
          `${fileEntry.filename}_attempt_${attempts}.txt`, 
          builderMessages
        );

        const rawContent = await this.llmClient.generateRaw(builderMessages);

        // Check for Dependency Update Request
        const updateRequestMatch = rawContent.match(
          /#\[DEPENDENCY_UPDATE_REQUEST\]([\s\S]*?)#\[DEPENDENCY_UPDATE_REQUEST-END\]/,
        );

        if (updateRequestMatch) {
          console.log(
            `   ⚠️  Missing Dependency Detected! Initiating Self-Healing...`,
          );
          try {
            const requestJson = JSON.parse(updateRequestMatch[1].trim());
            const targetFile = requestJson.targetFilename;
            const changeDescription = requestJson.description;

            if (generatedContent.has(targetFile)) {
              console.log(`   🚑 Updating dependency: ${targetFile}`);
              console.log(`   📝 Request: "${changeDescription}"`);
              const originalContent = generatedContent.get(targetFile)!;
              const updateMessages = buildDependencyUpdaterPrompt(
                originalContent,
                changeDescription,
              );
              
              this.saveDebugPrompt(
                debugDir,
                `${targetFile}_update_request.txt`,
                updateMessages
              );

              const updatedContentRaw =
                await this.llmClient.generateRaw(updateMessages);

              // Clean up output if needed
              let updatedContent = updatedContentRaw;
              const mdMatch = updatedContent.match(
                /^```(?:\w+)?\n([\s\S]*?)```$/,
              );
              if (mdMatch) updatedContent = mdMatch[1].trim();

              // Save updated dependency
              generatedContent.set(targetFile, updatedContent);
              this.saveFile(
                resolvedOutputDir,
                targetFile,
                plan.projectName,
                updatedContent,
              );
              console.log(`   ✅ Dependency updated: ${targetFile}`);

              // Continue loop to retry current file with new context
              continue;
            } else {
              console.error(
                `   ❌ Cannot update dependency ${targetFile}: File not found in generated set.`,
              );
              // If we can't update, we treat the current content as the result (stripping tags)
            }
          } catch (e: any) {
            console.error(`   ❌ Failed to parse update request: ${e.message}`);
          }
        }

        // Check for Missing Dependency File Request
        const missingFileMatch = rawContent.match(
          /#\[MISSING_DEPENDENCY_FILE\]([\s\S]*?)#\[MISSING_DEPENDENCY_FILE-END\]/,
        );

        if (missingFileMatch) {
          try {
            const requestJson = JSON.parse(missingFileMatch[1].trim());
            const requestedFile = requestJson.filename;

            console.log(
              `   ⚠️  Missing Dependency File Detected: ${requestedFile}`,
            );

            if (generatedContent.has(requestedFile)) {
              console.log(`   🔗 Injecting dependency: ${requestedFile}`);
              // Add to dependencies list for this file entry
              if (!fileEntry.dependencies.includes(requestedFile)) {
                fileEntry.dependencies.push(requestedFile);
              }
              // Retry immediately with new context
              continue;
            } else {
              console.warn(
                `   ❌ Cannot inject ${requestedFile}: File not found or not yet generated.`,
              );
            }
          } catch (e: any) {
            console.error(`   ❌ Failed to parse missing file request: ${e.message}`);
          }
        }

        // If we are here, either success or failed update.
        // Strip request tags if present
        const cleanContent = rawContent
          .replace(
            /#\[DEPENDENCY_UPDATE_REQUEST\][\s\S]*?#\[DEPENDENCY_UPDATE_REQUEST-END\]/,
            "",
          )
          .replace(
            /#\[MISSING_DEPENDENCY_FILE\][\s\S]*?#\[MISSING_DEPENDENCY_FILE-END\]/,
            "",
          )
          .trim();

        // Clean markdown code blocks if present in the final content
        let finalContent = cleanContent;
        const mdMatch = finalContent.match(/^```(?:\w+)?\n([\s\S]*?)```$/);
        if (mdMatch) finalContent = mdMatch[1].trim();

        generatedContent.set(fileEntry.filename, finalContent);
        this.saveFile(
          resolvedOutputDir,
          fileEntry.filename,
          plan.projectName,
          finalContent,
        );
        console.log(`   ✅ Generated: ${fileEntry.filename}`);
        success = true;
      }

      if (!success) {
        console.error(
          `   ❌ Failed to generate ${fileEntry.filename} after ${maxAttempts} attempts.`,
        );
        return;
      }
    }

    console.log(`🎉 Architect Mode Completed.`);
  }

  private saveFile(
    outputDir: string,
    filename: string,
    projectName: string,
    content: string,
  ) {
    const targetPath = path.join(outputDir, filename);
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Infer implementation path (convention)
    const baseName = path.basename(filename, ".isl.md");
    const implPath = `./${baseName}`;

    // Strip existing header if present to avoid duplication
    const headerRegex = /^# Project:[\s\S]*?\*\*Implementation\*\*:.*?\n\n/m;
    const contentWithoutHeader = content.replace(headerRegex, "");

    const header = `# Project: ${projectName}\n\n**Version**: 1.0.0\n**ISL Version**: 1.6.1\n**Implementation**: ${implPath}\n\n`;

    fs.writeFileSync(targetPath, header + contentWithoutHeader);
  }

  private topologicalSort(files: ArchitectFileEntry[]): ArchitectFileEntry[] {
    const visited = new Set<string>();
    const sorted: ArchitectFileEntry[] = [];
    const visiting = new Set<string>();

    const visit = (file: ArchitectFileEntry) => {
      if (visited.has(file.filename)) return;
      if (visiting.has(file.filename)) {
        throw new Error(
          `Circular dependency detected involving ${file.filename}`,
        );
      }
      visiting.add(file.filename);

      for (const depName of file.dependencies) {
        const depFile = files.find((f) => f.filename === depName);
        if (depFile) {
          visit(depFile);
        }
      }

      visiting.delete(file.filename);
      visited.add(file.filename);
      sorted.push(file);
    };

    for (const file of files) {
      visit(file);
    }

    return sorted;
  }

  private parseJsonOutput(raw: string): any {
    let jsonStr = raw.trim();
    // Try to find markdown code block
    const mdMatch = jsonStr.match(/```(?:json)?\s+([\s\S]*?)```/);
    if (mdMatch) {
      jsonStr = mdMatch[1].trim();
    }
    return JSON.parse(jsonStr);
  }

  private saveDebugPrompt(dir: string, filename: string, messages: any[]) {
    try {
      const content = messages
        .map((m) => `--- ROLE: ${m.role} ---\n${m.content}\n`)
        .join("\n");
      fs.writeFileSync(path.join(dir, filename), content);
    } catch (e) {
      console.warn(`   ⚠️ Failed to save debug prompt: ${filename}`);
    }
  }
}
