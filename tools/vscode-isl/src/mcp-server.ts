import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as path from "path";

// Importiamo le classi esistenti dei nostri tool
import { ISLBuilder } from "./isl-builder";
import { ISLGenerator } from "./isl-generator";
import { ISLLogicTestGenerator } from "./isl-logic-test/generator";
import { ISLLogicAuditor } from "./isl-logic-test/auditor";
import { ISLDocGenerator } from "./isl-doc";
import { LLMClient } from "./llm-client";

/**
 * ISL MCP Server
 * Espone i tool di generazione, build e audit come strumenti per l'IA.
 */
class ISLMCPServer {
  private server: Server;
  private llmClient: LLMClient;

  constructor() {
    this.server = new Server(
      {
        name: "isl-tools",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    // Inizializziamo il client LLM (legge le API Key dall'ambiente)
    this.llmClient = new LLMClient("openai"); // o gemini in base ai default

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // 1. Elenco dei tool disponibili
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "compile_isl",
          description:
            "Analizza le dipendenze e genera i contesti di build (.build.md) per i file ISL.",
          inputSchema: {
            type: "object",
            properties: {
              projectRoot: {
                type: "string",
                description: "Percorso della root del progetto",
              },
            },
            required: ["projectRoot"],
          },
        },
        {
          name: "generate_logic_tests",
          description:
            "Genera scenari di test logici (.test.isl.md) partendo da un file di Business Logic.",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Percorso del file .isl.md",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "run_logic_audit",
          description:
            "Esegue un audit logico su un file ISL confrontandolo con i suoi test logici.",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Percorso del file .isl.md",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "generate_implementation",
          description:
            "Genera il codice sorgente (JSX/JS) partendo dal contesto di build di un ISL.",
          inputSchema: {
            type: "object",
            properties: {
              manifestPath: {
                type: "string",
                description: "Percorso del build-manifest.json",
              },
              stack: {
                type: "string",
                description: "Stack tecnologico (es. react-js)",
                default: "react-js",
              },
            },
            required: ["manifestPath"],
          },
        },
      ],
    }));

    // 2. Esecuzione dei tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "compile_isl": {
            const builder = new ISLBuilder(args?.projectRoot as string);
            await builder.build();
            return {
              content: [
                {
                  type: "text",
                  text: "Build completata con successo nella cartella /build",
                },
              ],
            };
          }

          case "generate_logic_tests": {
            const generator = new ISLLogicTestGenerator(this.llmClient);
            await generator.generate(args?.path as string);
            return {
              content: [
                {
                  type: "text",
                  text: `Test logici generati per ${path.basename(args?.path as string)}`,
                },
              ],
            };
          }

          case "run_logic_audit": {
            const auditor = new ISLLogicAuditor(this.llmClient);
            await auditor.runAudit(args?.path as string);
            // Nota: qui potremmo leggere il report e restituirlo direttamente all'LLM
            return {
              content: [
                {
                  type: "text",
                  text: `Audit completato. Controlla la cartella logic-test/report per i dettagli.`,
                },
              ],
            };
          }

          case "generate_implementation": {
            const generator = new ISLGenerator(
              args?.manifestPath as string,
              undefined,
              "openai",
              (args?.stack as string) || "react-js",
            );
            await generator.run();
            return {
              content: [
                { type: "text", text: "Generazione del codice completata." },
              ],
            };
          }

          default:
            throw new Error(`Tool non trovato: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Errore durante l'esecuzione di ${name}: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  public async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("ISL MCP Server in esecuzione su STDIO");
  }
}

// Avvio del server
const mcpServer = new ISLMCPServer();
mcpServer.run().catch((error) => {
  console.error("Errore fatale del server MCP:", error);
  process.exit(1);
});
