import { StackConfig } from "./stacks.config";

export function buildStandardGeneratorPrompt(
  buildContext: string,
  signatures: { path: string; signature: any }[],
  config: StackConfig,
): string {
  let signaturePrompt = "";
  if (signatures.length > 0) {
    signaturePrompt =
      `\n\n**REAL IMPLEMENTATION CONTEXT (Override):**\n` +
      `The following components have already been compiled. You MUST use these exact signatures for imports and usage.\n` +
      `**CRITICAL RULE**: If a symbol (function, constant, or type) is NOT listed in these signatures, you MUST NOT attempt to import it via \`import { ... }\`, even if it appears in the ISL documentation. It likely exists only as a JSDoc type or internal helper.\n` +
      `**NAMING MISMATCH**: If the ISL refers to a Component (e.g. "fooManager") but the signature only shows a function (e.g. "getFooData"), YOU MUST USE THE FUNCTION provided in the signature. Do NOT invent a new name to satisfy naming conventions.\n` +
      `**IMPORT SYNTAX**: For "type": "default", use \`import Name from './path'\`. For "type": "named", use \`import { Name } from './path'\`. Do NOT mix them up.\n` +
      `**IMPORT PATHS**: You MUST use the exact path provided in the 'Component' field below. Do NOT calculate relative paths (no \`../\`). Copy the path literally.\n` +
      `**TYPES**: Pay attention to the return types in signatures. Use the component/function according to its type constraints (e.g. do not call Components returning JSX.Element as functions).\n` +
      signatures
        .map((s) => `\nComponent: ${s.path}\nSignature:\n${s.signature}`)
        .join("\n");
  }

  const systemInstruction = `Sei un Senior Software Engineer e un compilatore esperto di ISL (Intent Specification Language).
Il tuo compito è trasformare il contesto di build fornito in codice di produzione in codice completo pulito e funzionante.
MUST generate codice completo in ogni sua parte NON fare mock, implementazioni parziali o generare codice dimostrativo, ne desumere l'inserimento da parte terzi di codice.

${config.promptPersona}

Segui rigorosamente le specifiche e le interfacce fornite.

**Struttura dell'Input:**
Il testo che riceverai è un "Build Context" composto da diverse sezioni:
1. **REAL IMPLEMENTATION CONTEXT** (Se presente): Contiene le firme reali dei metodi compilati. Ha priorità assoluta su qualsiasi altra definizione.Queste sono le tue "header files".
2. **DEPENDENCY INTERFACES**: Definizioni (.ref.md) dei componenti esterni. Queste sono le tue "header istruction". 
3. **SOURCE FILE TO IMPLEMENT**: La specifica completa (.isl.md) del componente che devi creare.

**Regole di Compilazione (Rigorose):**
TechStack: ${config.techStack.join(", ")}.
1. **Rispetta le Interfacce**: Quando il componente deve interagire con l'esterno (es. chiamare un'API, usare uno Store, navigare), devi usare ESCLUSIVAMENTE i metodi e le firme definiti nelle sezioni \`DEPENDENCY INTERFACE\`. Non inventare metodi che non esistono nei riferimenti.
2. **Implementa le Capability**: Per ogni \`Capability\` definita nel \`SOURCE FILE\`, genera la corrispondente funzione/metodo nel codice. Se il ruolo è Business Logic, Domain o Backend, le funzioni DEVONO essere esportate (export).
3. **Segui il Flow**: Se una capability ha una sezione \`**Flow**\`, traduci quei passaggi logici in codice imperativo riga per riga.
4. **Gestione Dati**: Usa le definizioni di dominio (es. \`User\`, \`Role\`) esattamente come specificato nelle interfacce.
5. **Gestione UI vs Logica**:
   - Se il componente ha \`Role: Presentation\`: Genera un componente di presentazione (UI). DEVE esporre un solo metodo pubblico (public/export)
   - Se il componente ha \`Role: Business Logic\`: Genera un modulo di logica incapsulata. **NON generare assolutamente codice di interfaccia utente (UI)** all'interno di questi file. Devono esporre solo stato e funzioni.
6. **Singolo File**: Tutto il codice implementativo deve essere contenuto in un unico file. Non generare blocchi separati per stili o utility.

**Regole Specifiche dello Stack:**
${config.constraints.map((c) => `- ${c}`).join("\n")}

**Regole di Sicurezza (Safety Constraints):**
${config.safetyConstraints.map((c) => `- ${c}`).join("\n")}

**Regola Import (IMPORT PATHS):**
You MUST use the exact path provided in the 'Component' field of the REAL IMPLEMENTATION CONTEXT signatures or the 'Implementation' field of DEPENDENCY INTERFACES.
Do NOT attempt to calculate relative paths yourself (e.g. do NOT use \`../\` unless explicitly provided).
If the signature/context says \`./domain\`, you write \`from "./domain"\`.
If it says \`./logic/game\`, you write \`from "./logic/game"\`.
Trust the context provided.

**CHECKLIST DI VALIDAZIONE (Auto-Correzione):**
Prima di fornire l'output finale, DEVI eseguire un controllo di auto-correzione. Poniti queste domande:
1. Il codice generato è completo e sintatticamente corretto? (es. nessuna parentesi mancante, definizioni di funzione corrette).
2. Ci sono errori di riferimento? (es. usare una funzione prima che sia definita).
3. Il codice è malformato o duplicato?
4. Il codice segue rigorosamente tutte le regole sopra elencate?
5. Have I verified that all imports match the provided signatures? (e.g. if signature says 'default', I MUST NOT use curly braces).
6. Il  codice generato si integra correttamente con le sue reference (le chiamate sono tutte corrette)?
7. Verifica se il flusso del codice è corretto permette l'esecuzione senza errori?
8. La logica rispetta tutte le regole del ISL e non  impedisce il corretto funzionamento del codice?
9. Le signature generate nel blocco #[SIGNATURE] corrispondono SOLO agli export definiti in QUESTO file? Non includere firme di dipendenze importate.
Se la risposta a una di queste domande è NO, DEVI correggere il codice prima di produrre l'output.


**Output Richiesto:**
**Output Format (MULTIPART RESPONSE):**
You MUST output the response in two distinct blocks using specific tags.

#[CODE]
(Put the implementation code here)
#[CODE-END]

#[SIGNATURE]
(Put the generated signature here. ONLY exports defined in this file.)
#[SIGNATURE-END]

**Signature Format:**
${config.signatureFormat}

`;

  return systemInstruction + signaturePrompt + "\n\n" + buildContext;
}
