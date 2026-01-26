import * as fs from "fs";
import * as path from "path";

export class ISLCompiler {
  /**
   * Legge un file ISL e risolve ricorsivamente i riferimenti esterni definiti via:
   * > **Reference**: ... in [path](path)
   */
  public static resolveReferences(
    filePath: string,
    maxDepth: number = 1,
    baseDir?: string,
    depth: number = 0,
    includedFiles: Set<string> = new Set(),
  ): string {
    if (depth > maxDepth) {
      return `\n<!-- Max recursion depth (${maxDepth}) reached for ${filePath} -->\n`;
    }

    // Ensure absolute path for deduplication
    const absolutePath = path.resolve(filePath);

    if (!baseDir) {
      baseDir = path.dirname(absolutePath);
    }

    if (!fs.existsSync(absolutePath)) {
      return `\n[ERROR: File not found: ${absolutePath}]\n`;
    }

    // Deduplication: If not root and already included
    if (depth > 0 && includedFiles.has(absolutePath)) {
      return "";
    }

    // Register file
    includedFiles.add(absolutePath);

    let content: string;
    try {
      content = fs.readFileSync(absolutePath, "utf-8");
    } catch (e) {
      return `\n[ERROR: Could not read file ${absolutePath}: ${e}]\n`;
    }

    // Strip BOM (Byte Order Mark) se presente
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }

    const lines = content.split(/\r?\n/);
    const resolvedContent: string[] = [];
    // Regex per catturare il path nel link markdown: text dentro un blocco Reference
    const refPattern =
      /^>\s*\*\*Reference\*\*.*(?:\[.*?\]\(([^"\s)]+)(?:\s+".*?")?\)|`([^`]+)`)/;

    for (const line of lines) {
      const match = line.match(refPattern);
      if (match) {
        const relPath = match[1] || match[2];
        // Risolve il path relativo al file corrente
        const absPath = path.resolve(baseDir, relPath);

        resolvedContent.push(line); // Mantiene la linea di riferimento per contesto

        // Risoluzione ricorsiva
        const externalContent = this.resolveReferences(
          absPath,
          maxDepth,
          path.dirname(absPath),
          depth + 1,
          includedFiles,
        );

        if (externalContent.trim() !== "") {
          resolvedContent.push(
            `\n<!-- START EXTERNAL CONTEXT: ${relPath} -->\n`,
          );
          resolvedContent.push(externalContent);
          resolvedContent.push(`\n<!-- END EXTERNAL CONTEXT: ${relPath} -->\n`);
        }
      } else {
        resolvedContent.push(line);
      }
    }

    // Normalizzazione: Unisce le linee e riduce i ritorni a capo multipli (3+) a max 2
    // Questo preserva la struttura dei paragrafi Markdown risparmiando token inutili.
    const body = resolvedContent.join("\n").replace(/\n{3,}/g, "\n\n");

    // Se siamo alla radice (depth 0), aggiungiamo la Context Map all'inizio
    if (depth === 0) {
      const fileList = Array.from(includedFiles)
        .map((f) => `- 📄 ${path.basename(f)}`)
        .join("\n");
      const contextMap = `<!-- CONTEXT MAP (Files included in this compilation) -->\n${fileList}\n<!-- END CONTEXT MAP -->\n\n`;
      return contextMap + body;
    }

    return body;
  }
}
