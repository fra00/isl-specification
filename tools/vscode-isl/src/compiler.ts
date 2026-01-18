import * as fs from "fs";
import * as path from "path";

export class ISLCompiler {
  /**
   * Legge un file ISL e risolve ricorsivamente i riferimenti esterni definiti via:
   * > **Reference**: ... in [path](path)
   */
  public static resolveReferences(
    filePath: string,
    baseDir?: string,
    depth: number = 0,
  ): string {
    if (depth > 5) {
      return `\n[ERROR: Maximum recursion depth exceeded for ${filePath}]\n`;
    }

    if (!baseDir) {
      baseDir = path.dirname(filePath);
    }

    if (!fs.existsSync(filePath)) {
      return `\n[ERROR: File not found: ${filePath}]\n`;
    }

    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch (e) {
      return `\n[ERROR: Could not read file ${filePath}: ${e}]\n`;
    }

    // Strip BOM (Byte Order Mark) se presente
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }

    const lines = content.split(/\r?\n/);
    const resolvedContent: string[] = [];
    // Regex per catturare il path nel link markdown: text dentro un blocco Reference
    const refPattern = /^>\s*\*\*Reference\*\*.*\[.*?\]\((.*?)\)/;

    for (const line of lines) {
      const match = line.match(refPattern);
      if (match) {
        const relPath = match[1];
        // Risolve il path relativo al file corrente
        const absPath = path.resolve(baseDir, relPath);

        resolvedContent.push(line); // Mantiene la linea di riferimento per contesto
        resolvedContent.push(`\n<!-- START EXTERNAL CONTEXT: ${relPath} -->\n`);

        // Risoluzione ricorsiva
        const externalContent = this.resolveReferences(
          absPath,
          path.dirname(absPath),
          depth + 1,
        );
        resolvedContent.push(externalContent);

        resolvedContent.push(`\n<!-- END EXTERNAL CONTEXT -->\n`);
      } else {
        resolvedContent.push(line);
      }
    }

    return resolvedContent.join("\n");
  }
}
