import * as fs from "fs";
import * as path from "path";
import { StackConfig } from "../stacks.config";

export interface SignatureEntry {
  path: string;
  signature: any;
}

export function collectSignatures(
  buildContext: string,
  outputBaseDir: string,
  stackConfig: StackConfig
): SignatureEntry[] {
  const signatures: SignatureEntry[] = [];
  const depRegex =
    /<!-- START DEPENDENCY INTERFACE: .*? -->([\s\S]*?)<!-- END DEPENDENCY INTERFACE -->/g;
  let match;

  while ((match = depRegex.exec(buildContext)) !== null) {
    const depContent = match[1];
    const implMatch = depContent.match(/<!-- IMPLEMENTATION PATH: (.+?) -->/);
    if (implMatch) {
      const implPath = implMatch[1].trim();
      const depAbsPath = path.join(outputBaseDir, implPath);

      // Attempt 1: Exact path + .sign.ts
      let signPath = depAbsPath + ".sign.ts";
      let found = fs.existsSync(signPath);

      // Attempt 2: Try appending extensions from stack config
      if (!found) {
        const extensions = new Set(Object.values(stackConfig.extensions));
        for (const ext of extensions) {
          const tryPath = depAbsPath + ext + ".sign.ts";
          if (fs.existsSync(tryPath)) {
            signPath = tryPath;
            found = true;
            break;
          }
        }
      }

      if (found) {
        try {
          const sig = fs.readFileSync(signPath, "utf-8");
          signatures.push({
            path: implPath,
            signature: sig,
          });
        } catch (e) {
          console.warn(`   ⚠️ Failed to read signature for ${implPath}`);
        }
      }
    }
  }
  return signatures;
}
