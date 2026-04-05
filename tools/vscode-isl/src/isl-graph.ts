import * as fs from "fs";
import * as path from "path";

/**
 * ISL Graph Generator
 * Scansiona i file .isl.md e genera un diagramma Mermaid delle dipendenze.
 */

const ISL_EXT = ".isl.md";

// Regex per estrarre il file referenziato e il Role del componente
const REF_REGEX = /> \*\*Reference\*\*: .+ in `(.+?\.isl\.md)`/g;
const ROLE_REGEX = /### Role:\s*([\w\s]+)/i;

interface NodeMetadata {
  id: string;
  role: string;
}

function generateGraph(targetDir: string) {
  const absoluteTargetDir = path.resolve(targetDir);
  if (!fs.existsSync(absoluteTargetDir)) {
    console.error(`Errore: La cartella "${targetDir}" non esiste.`);
    process.exit(1);
  }

  // Prendi solo i file nella root del percorso specificato (non ricorsivo)
  const files = fs
    .readdirSync(absoluteTargetDir)
    .filter(
      (file) =>
        fs.statSync(path.join(absoluteTargetDir, file)).isFile() &&
        file.endsWith(ISL_EXT),
    )
    .map((file) => path.join(absoluteTargetDir, file));

  const edges: Set<string> = new Set();
  const nodes: Map<string, NodeMetadata> = new Map();

  files.forEach((filePath) => {
    const content = fs.readFileSync(filePath, "utf-8");
    const fileName = path.basename(filePath, ISL_EXT);

    // Reset regex per ogni file
    REF_REGEX.lastIndex = 0;
    ROLE_REGEX.lastIndex = 0;

    // Estrazione Role per stilizzazione
    const roleMatch = content.match(ROLE_REGEX);
    const role = roleMatch ? roleMatch[1].trim() : "Unknown";
    nodes.set(fileName, { id: fileName, role });

    // Estrazione Referenze
    let match;
    while ((match = REF_REGEX.exec(content)) !== null) {
      const targetPath = match[1];
      const targetName = path.basename(targetPath, ISL_EXT);

      if (fileName !== targetName) {
        edges.add(`    ${fileName} --> ${targetName}`);
      }
    }
  });

  // Costruzione output Mermaid con Classi
  let mermaid = "graph TD\n\n";

  // Definizione esplicita dei nodi
  nodes.forEach((_, id) => {
    mermaid += `    ${id}["${id}"]\n`;
  });
  mermaid += "\n";

  // Aggiunta archi
  Array.from(edges)
    .sort()
    .forEach((edge) => {
      mermaid += `${edge}\n`;
    });
  mermaid += "\n";

  // Definizione Classi
  mermaid += `    classDef domain fill:#b3e5fc,stroke:#01579b,stroke-width:2px;\n`;
  mermaid += `    classDef logic fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px;\n`;
  mermaid += `    classDef presentation fill:#ffe0b2,stroke:#ef6c00,stroke-width:2px;\n\n`;

  // Assegnazione classi
  const groups: Record<string, string[]> = {
    domain: [],
    logic: [],
    presentation: [],
  };

  nodes.forEach((meta, id) => {
    const role = meta.role.toLowerCase();
    if (role.includes("domain")) groups.domain.push(id);
    else if (role.includes("logic")) groups.logic.push(id);
    else if (role.includes("presentation")) groups.presentation.push(id);
  });

  if (groups.domain.length)
    mermaid += `    class ${groups.domain.join(",")} domain\n`;
  if (groups.logic.length)
    mermaid += `    class ${groups.logic.join(",")} logic\n`;
  if (groups.presentation.length)
    mermaid += `    class ${groups.presentation.join(",")} presentation\n`;

  // Cartella di destinazione: percorso di partenza + \graph
  const graphDir = path.join(absoluteTargetDir, "graph");
  if (!fs.existsSync(graphDir)) {
    fs.mkdirSync(graphDir, { recursive: true });
  }

  const outputPath = path.join(graphDir, "isl-dependencies.md");
  const finalOutput = `\n# ISL Dependency Graph\n\n\`\`\`mermaid\n${mermaid}\`\`\`\n`;

  fs.writeFileSync(outputPath, finalOutput);
  console.log(`\nGrafo generato con successo!`);
  console.log(`File creato: ${outputPath}`);
  console.log(`Totale file analizzati: ${files.length}`);
  console.log(`Totale dipendenze trovate: ${edges.size}\n`);
}

// Entry point
const targetFolder = process.argv[2];

if (!targetFolder) {
  console.log("Utilizzo: ts-node isl-graph.ts <cartella-sorgente>");
  process.exit(1);
}

generateGraph(targetFolder);
