import * as fs from "fs";
import * as path from "path";
import { LLMClient, LLMProvider } from "./llm-client";

interface ManifestEntry {
  sourceFile: string;
  buildFile: string;
  implementationPath: string | null;
  hash: string;
}

interface GenLock {
  [buildFile: string]: string; // Mappa buildFile -> hash dell'ultima generazione
}

export class ISLGenerator {
  private manifestPath: string;
  private outputBaseDir: string;
  private lockFilePath: string;
  private llmClient: LLMClient;

  constructor(
    manifestPath: string,
    outputBaseDir?: string,
    llmProvider: LLMProvider = "openai",
  ) {
    let resolvedPath = path.resolve(manifestPath);
    let projectRoot: string;

    if (
      fs.existsSync(resolvedPath) &&
      fs.statSync(resolvedPath).isDirectory()
    ) {
      projectRoot = resolvedPath;
      const directPath = path.join(resolvedPath, "build-manifest.json");
      const buildPath = path.join(resolvedPath, "build", "build-manifest.json");

      if (fs.existsSync(directPath)) {
        resolvedPath = directPath;
      } else if (fs.existsSync(buildPath)) {
        resolvedPath = buildPath;
      } else {
        resolvedPath = directPath;
      }
    } else {
      // Se è un file, deduciamo la root del progetto
      const dir = path.dirname(resolvedPath);
      if (path.basename(dir) === "build") {
        projectRoot = path.dirname(dir);
      } else {
        projectRoot = dir;
      }
    }

    this.manifestPath = resolvedPath;
    if (outputBaseDir) {
      this.outputBaseDir = path.resolve(outputBaseDir);
    } else {
      this.outputBaseDir = path.join(projectRoot, "bin");
    }
    // Il lock file risiede accanto al manifest per tenere traccia dello stato
    this.lockFilePath = path.join(
      path.dirname(this.manifestPath),
      "gen-lock.json",
    );

    // Inizializza il client LLM
    this.llmClient = new LLMClient(llmProvider);
  }

  public async run(options: { force?: boolean } = {}) {
    const { force = false } = options;

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

    for (const entry of manifest) {
      // 1. Skip se non c'è un path di implementazione (es. file puramente astratti)
      if (!entry.implementationPath) {
        console.log(
          `⏩ Skipping ${path.basename(entry.sourceFile)} (Missing '**Implementation**: <path>' in ISL)`,
        );
        skippedCount++;
        continue;
      }

      // Risolvi il path di destinazione (relativo alla cartella di output specificata)
      const targetPath = path.join(
        this.outputBaseDir,
        entry.implementationPath,
      );

      // 2. Hash Check: Se l'hash non è cambiato E il file esiste, salta
      const lastHash = lock[entry.buildFile];
      const targetExists = fs.existsSync(targetPath);
      const hashMatch = lastHash === entry.hash;

      if (!force && hashMatch && targetExists) {
        console.log(
          `⏭️  Skipping ${path.basename(entry.sourceFile)} (Unchanged)`,
        );
        skippedCount++;
        continue;
      }

      if (force) {
        console.log(`⚡ Force Rebuild: ${path.basename(entry.sourceFile)}`);
      } else if (!targetExists) {
        console.log(`🆕 Creating: ${path.basename(entry.sourceFile)}`);
      } else {
        console.log(
          `📝 Updating: ${path.basename(entry.sourceFile)} (Changed)`,
        );
      }

      console.log(
        `🤖 Generating ${path.basename(entry.sourceFile)} -> ${entry.implementationPath}`,
      );

      // 3. Leggi il contesto di build
      const buildContext = fs.readFileSync(entry.buildFile, "utf-8");

      // NEW: Dependency Injection (Dynamic Linking)
      const signatures = this.collectSignatures(buildContext);
      let signaturePrompt = "";
      if (signatures.length > 0) {
        signaturePrompt =
          `\n\n**REAL IMPLEMENTATION CONTEXT (Override):**\n` +
          `The following components have already been compiled. You MUST use these exact signatures for imports and usage:\n` +
          signatures
            .map(
              (s) =>
                `\nComponent: ${s.path}\nSignature: ${JSON.stringify(s.signature, null, 2)}`,
            )
            .join("\n");
      }

      const systemInstruction = `Sei un Senior Software Engineer e un compilatore esperto di ISL (Intent Specification Language).
Il tuo compito è trasformare il contesto di build fornito in codice di produzione pulito e funzionante nel linguaggio: REACT.

Segui rigorosamente le specifiche e le interfacce fornite.

**Struttura dell'Input:**
Il testo che riceverai è un "Build Context" composto da due parti:
1. **DEPENDENCY INTERFACES**: Definizioni (.ref.md) dei componenti esterni. Queste sono le tue "header files".
2. **SOURCE FILE TO IMPLEMENT**: La specifica completa (.isl.md) del componente che devi creare.

**Regole di Compilazione (Rigorose):**
TechStack: React 18+, Javascript, TailwindCSS, Fetch API per chiamate di rete.
1. **Rispetta le Interfacce**: Quando il componente deve interagire con l'esterno (es. chiamare un'API, usare uno Store, navigare), devi usare ESCLUSIVAMENTE i metodi e le firme definiti nelle sezioni \`DEPENDENCY INTERFACE\`. Non inventare metodi che non esistono nei riferimenti e non cambi.
2. **Implementa le Capability**: Per ogni \`Capability\` definita nel \`SOURCE FILE\`, genera la corrispondente funzione/metodo nel codice.
3. **Segui il Flow**: Se una capability ha una sezione \`**Flow**\`, traduci quei passaggi logici in codice imperativo riga per riga.
4. **Gestione Dati**: Usa le definizioni di dominio (es. \`User\`, \`Role\`) esattamente come specificato nelle interfacce.
5. **Gestione UI vs Logica**:
   - Se il componente ha \`Role: Presentation\`: Genera un componente React che ritorna JSX.
   - Se il componente ha \`Role: Business Logic\`: Genera un **Custom Hook** (che inizia con \`use...\`) o un Context Provider. **NON generare assolutamente codice JSX o UI** all'interno di questi file. Devono restituire solo stato e funzioni.
**Regola Import: **
Se una DEPENDENCY INTERFACE specifica un IMPLEMENTATION PATH, devi generare l'istruzione import corrispondente all'inizio del file, calcolando il percorso relativo rispetto al file che stai generando.
IMPORTANTE: I percorsi che iniziano con \`./\` indicano la root di output. Se sia il file corrente che la dipendenza iniziano con \`./\`, sono nella stessa cartella. Usa \`./\` per l'import (es. \`import ... from "./store"\`).

**Regola Export/Import (SOLO in React) (Cruciale):**
1. **Componenti UI (Role: Presentation)**: Usa SEMPRE \`export default function NomeComponente\`.
   - Quando importi questi componenti in altri file, usa l'import di default: \`import NomeComponente from "./path"\`.
2. **Logica/Domain/Utilities**: Usa \`export const Nome = ...\` (Named Export).
   - Quando importi questi elementi, usa l'import nominale: \`import { Nome } from "./path"\`.
3. **Solo** un export default per file, e solo per componenti UI.
4. DIVIETO ASSOLUTO DI TYPESCRIPT ,Se necessario, usa esclusivamente JSDoc per documentare i tipi.
5. Tutte le funzioni restituite da un hook DEVONO essere avvolte in useCallback.
6. Prediligi la destrutturazione per gli oggetti provenienti da hooks (es. const { func } = useHook()) invece di assegnare l'intero oggetto, per evitare problemi di dipendenze nei useEffect.


**CHECKLIST DI VALIDAZIONE (Auto-Correzione):**
Prima di fornire l'output finale, DEVI eseguire un controllo di auto-correzione. Poniti queste domande:
1. Il codice generato è completo e sintatticamente corretto? (es. nessuna parentesi mancante, definizioni di funzione corrette).
2. Ci sono errori di riferimento? (es. usare una funzione prima che sia definita).
3. Il codice è malformato o duplicato?
4. Il codice segue rigorosamente tutte le regole sopra elencate?
Se la risposta a una di queste domande è NO, DEVI correggere il codice prima di produrre l'output.


**Output Richiesto:**
**Output Format (MULTIPART RESPONSE):**
You MUST output the response in two distinct blocks using specific tags.

#[CODE]
(Put the implementation code here)
#[CODE-END]

#[SIGNATURE]
(Put the JSON signature here)
#[SIGNATURE-END]

**Signature JSON Structure:**
{
  "exports": [
    { "type": "default", "name": "ComponentName", "props": ["prop1", "prop2"] },
    { "type": "named", "name": "ConstantName", "typeDef": "Type" }
  ]
}

`;

      const prompt =
        systemInstruction + signaturePrompt + "\n\n" + buildContext;

      // 4. Chiama l'LLM tramite il client dedicato
      const rawOutput = await this.llmClient.generateRaw(prompt);
      const { code, signature } = this.parseMultipartOutput(rawOutput);

      // 5. Scrivi il file
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.writeFileSync(targetPath, code);

      // NEW: Write signature
      if (signature) {
        const sigPath = targetPath + ".sign.json";
        fs.writeFileSync(sigPath, JSON.stringify(signature, null, 2));
        console.log(`   📝 Signature saved: ${path.basename(sigPath)}`);
      }

      // 6. Aggiorna il lock
      lock[entry.buildFile] = entry.hash;
      generatedCount++;
    }

    // Salva lo stato aggiornato
    fs.writeFileSync(this.lockFilePath, JSON.stringify(lock, null, 2));
    console.log(
      `✅ Generation Completed. (Generated: ${generatedCount}, Skipped: ${skippedCount})`,
    );

    if (generatedCount === 0 && skippedCount > 0) {
      console.log(
        `💡 Hint: Ensure your ISL files have a '**Implementation**: path/to/file.ext' header.`,
      );
    }
  }

  private collectSignatures(
    buildContext: string,
  ): { path: string; signature: any }[] {
    const signatures: { path: string; signature: any }[] = [];
    const depRegex =
      /<!-- START DEPENDENCY INTERFACE: .*? -->([\s\S]*?)<!-- END DEPENDENCY INTERFACE -->/g;
    let match;

    while ((match = depRegex.exec(buildContext)) !== null) {
      const depContent = match[1];
      const implMatch = depContent.match(/<!-- IMPLEMENTATION PATH: (.+?) -->/);
      if (implMatch) {
        const implPath = implMatch[1].trim();
        const depAbsPath = path.join(this.outputBaseDir, implPath);
        const signPath = depAbsPath + ".sign.json";

        if (fs.existsSync(signPath)) {
          try {
            const sig = JSON.parse(fs.readFileSync(signPath, "utf-8"));
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
        let jsonStr = sigMatch[1].trim();
        const mdJsonMatch = jsonStr.match(/^```(?:json)?\n([\s\S]*?)```$/);
        if (mdJsonMatch) jsonStr = mdJsonMatch[1].trim();
        signature = JSON.parse(jsonStr);
      } catch (e) {
        console.warn("   ⚠️ Invalid JSON in #[SIGNATURE] block");
      }
    }

    return { code, signature };
  }
}

// CLI Entry Point
if (require.main === module) {
  const args = process.argv.slice(2);
  const forceFlag = args.includes("--force");
  const useGemini = args.includes("--gemini");

  // Filtra gli argomenti flag per ottenere solo quelli posizionali
  const positionalArgs = args.filter((arg) => !arg.startsWith("--"));

  const manifestArg = positionalArgs[0];
  const outputDirArg = positionalArgs[1];

  const provider = useGemini ? "gemini" : "openai";

  const generator = new ISLGenerator(manifestArg, outputDirArg, provider);
  generator.run({ force: forceFlag });
}
