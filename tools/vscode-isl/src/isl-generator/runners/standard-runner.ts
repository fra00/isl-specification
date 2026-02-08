import * as fs from "fs";
import * as path from "path";
import { LLMClient } from "../../llm-client";
import { ManifestEntry, GenLock } from "../types";
import { buildStandardGeneratorPrompt } from "../prompts";
import { StackConfig } from "../stacks.config";
import { collectSignatures } from "../utils/signature-utils";

export class StandardRunner {
  constructor(
    private llmClient: LLMClient,
    private manifestPath: string,
    private outputBaseDir: string,
    private lockFilePath: string,
    private stackConfig: StackConfig,
  ) {}

  public async run(options: { force?: boolean; debug?: boolean } = {}) {
    const startTime = Date.now();
    const { force = false, debug = false } = options;

    if (!fs.existsSync(this.manifestPath)) {
      console.error(`❌ Manifest not found: ${this.manifestPath}`);
      return;
    }

    if (force) {
      console.log("⚡ Force mode enabled: All files will be regenerated.");
    }

    const manifest: ManifestEntry[] = JSON.parse(
      fs.readFileSync(this.manifestPath, "utf-8"),
    );
    let lock: GenLock = {};

    if (fs.existsSync(this.lockFilePath)) {
      lock = JSON.parse(fs.readFileSync(this.lockFilePath, "utf-8"));
    }

    console.log(`🚀 Starting Generation Pipeline`);
    console.log(`📂 Manifest: ${this.manifestPath}`);
    console.log(`🎯 Output Base: ${this.outputBaseDir}`);

    let generatedCount = 0;
    let skippedCount = 0;

    const totalFiles = manifest.length;
    let processedIndex = 0;

    for (const entry of manifest) {
      processedIndex++;
      const remaining = totalFiles - processedIndex;
      const progressInfo = `[${processedIndex}/${totalFiles}]`;

      // 1. Skip se non c'è un path di implementazione (es. file puramente astratti)
      if (!entry.implementationPath) {
        console.log(
          `${progressInfo} ⏩ Skipping ${path.basename(entry.sourceFile)} (Missing '**Implementation**: <path>' in ISL)`,
        );
        skippedCount++;
        continue;
      }

      // 3. Leggi il contesto di build (Anticipato per estrarre il ruolo)
      const buildContext = fs.readFileSync(entry.buildFile, "utf-8");

      // Extract Role from build context
      // FIX: Only look in the source file part to avoid matching roles from dependencies (which appear first in build context)
      const sourceContent =
        buildContext.split("<!-- SOURCE FILE TO IMPLEMENT -->")[1] ||
        buildContext;

      const roleMatch = sourceContent.match(
        /(?:###|\*\*)\s*Role(?:\*\*)?\s*:\s*(.+)/i,
      );
      const role = roleMatch ? roleMatch[1].trim() : "default";
      // console.log(`   🔍 Detected Role for ${path.basename(entry.sourceFile)}: "${role}"`);

      // Calculate Target Path with dynamic extension based on Stack Config
      let relativeImplPath = entry.implementationPath;
      const extMap = this.stackConfig.extensions;
      const desiredExt = extMap[role] || extMap.default || ".js";

      const currentExt = path.extname(relativeImplPath);
      if (currentExt) {
        relativeImplPath =
          relativeImplPath.slice(0, -currentExt.length) + desiredExt;
      } else {
        relativeImplPath = relativeImplPath + desiredExt;
      }

      const targetPath = path.join(this.outputBaseDir, relativeImplPath);

      // 2. Hash Check: Se l'hash non è cambiato E il file esiste, salta
      const lastHash = lock[entry.buildFile];
      const targetExists = fs.existsSync(targetPath);
      const hashMatch = lastHash === entry.hash;

      if (!force && hashMatch && targetExists) {
        console.log(
          `${progressInfo} ⏭️  Skipping ${path.basename(entry.sourceFile)} (Unchanged)`,
        );
        skippedCount++;
        continue;
      }

      if (force) {
        console.log(
          `${progressInfo} ⚡ Force Rebuild: ${path.basename(entry.sourceFile)}`,
        );
      } else if (!targetExists) {
        console.log(
          `${progressInfo} 🆕 Creating: ${path.basename(entry.sourceFile)}`,
        );
      } else {
        console.log(
          `${progressInfo} 📝 Updating: ${path.basename(entry.sourceFile)} (Changed)`,
        );
      }

      console.log(
        `${progressInfo} 🤖 Generating ${path.basename(entry.sourceFile)} -> ${relativeImplPath} (${remaining} remaining)`,
      );

      // NEW: Dependency Injection (Dynamic Linking)
      const signatures = collectSignatures(buildContext, this.outputBaseDir, this.stackConfig);

      const prompt = buildStandardGeneratorPrompt(
        buildContext,
        signatures,
        this.stackConfig,
      );

      if (debug) {
        const debugDir = path.join(this.outputBaseDir, "promptDebug");
        if (!fs.existsSync(debugDir)) {
          fs.mkdirSync(debugDir, { recursive: true });
        }
        const debugFilePath = path.join(debugDir, path.basename(entry.sourceFile));
        fs.writeFileSync(debugFilePath, prompt);
        console.log(`   🐛 Debug prompt saved: ${path.join("promptDebug", path.basename(entry.sourceFile))}`);
      }

      // 4. Chiama l'LLM tramite il client dedicato
      const rawOutput = await this.llmClient.generateRaw(prompt);
      const { code, signature } = this.parseMultipartOutput(rawOutput);

      // 5. Scrivi il file
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const header = `/**\n * 🛑 DO NOT EDIT THIS FILE DIRECTLY\n * ----------------------------------\n * This file was generated by ISL Compiler.\n * Source: ${path.basename(entry.sourceFile)}\n * Edit the ISL file instead.\n */\n\n`;
      fs.writeFileSync(targetPath, header + code);

      // NEW: Write signature
      if (signature) {
        const sigPath = targetPath + ".sign.ts";
        fs.writeFileSync(sigPath, signature);
        console.log(`   📝 Signature saved: ${path.basename(sigPath)}`);
      }

      // 6. Aggiorna il lock
      lock[entry.buildFile] = entry.hash;
      generatedCount++;
    }

    // Salva lo stato aggiornato
    fs.writeFileSync(this.lockFilePath, JSON.stringify(lock, null, 2));
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(
      `✅ Generation Completed in ${duration}s. (Generated: ${generatedCount}, Skipped: ${skippedCount})`,
    );

    if (generatedCount === 0 && skippedCount > 0) {
      console.log(
        `💡 Hint: Ensure your ISL files have a '**Implementation**: ./file.[extension of language]' header.`,
      );
    }
  }

  private parseMultipartOutput(output: string): {
    code: string;
    signature: any;
  } {
    const codeMatch = output.match(/#\[CODE\]([\s\S]*?)#\[CODE-END\]/);
    const sigMatch = output.match(/#\[SIGNATURE\]([\s\S]*?)#\[SIGNATURE-END\]/);

    let code = codeMatch && codeMatch[1] ? codeMatch[1].trim() : output.trim();
    let signature = null;

    // Clean markdown code blocks if present
    const mdMatch = code.match(/^```(?:\w+)?\n([\s\S]*?)```$/);
    if (mdMatch) code = mdMatch[1].trim();

    if (sigMatch && sigMatch[1]) {
      try {
        let sigStr = sigMatch[1].trim();
        const mdSigMatch = sigStr.match(/^```(?:\w+)?\n([\s\S]*?)```$/);
        if (mdSigMatch) sigStr = mdSigMatch[1].trim();
        signature = sigStr;
      } catch (e) {
        console.warn("   ⚠️ Error parsing #[SIGNATURE] block");
      }
    }

    return { code, signature };
  }
}
