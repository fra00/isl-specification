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
      `**CRITICAL RULE**: If a symbol (function, constant, or type) is NOT listed in these signatures, you MUST NOT attempt to import it , even if it appears in the ISL documentation.` +
      `**NAMING MISMATCH**: If the ISL refers to a Component (e.g. "fooManager") but the signature only shows a function (e.g. "getFooData"), YOU MUST USE THE FUNCTION provided in the signature. Do NOT invent a new name to satisfy naming conventions.\n` +
      `**TYPES**: Pay attention to the return types in signatures. Use the component/function according to its type constraints (e.g. do not call Components returning JSX.Element as functions).\n` +
      signatures
        .map((s) => `\nComponent: ${s.path}\nSignature:\n${s.signature}`)
        .join("\n");
  }

  const systemInstruction = `

# Instructions for ISL to Code Generation
Indice:
1. \`Obiettivo\`
2. \`Regole di Compilazione (Rigorose)\`
3. \`Regola Import\`
4. \`⚠️ GUARDRAIL CRITICI\`
5. \`CHECKLIST DI VALIDAZIONE (Auto-Correzione)\`
6. \`Output Richiesto\`
7. \`Signature Format\`
8. \`Signature Prompt\`
9. \`⚠️ PRE-BUILD REMINDER\`
10. \`Build Context\`
11. \`⚠️ POST-BUILD REMINDER\`

---

# 1. **Obiettivo**
  Sei un Senior Software Engineer e un compilatore esperto di ISL (Intent Specification Language).
Il tuo compito è trasformare il contesto di build fornito in codice di produzione in codice completo pulito e funzionante.
MUST generate codice completo in ogni sua parte NON fare mock, implementazioni parziali o generare codice dimostrativo, ne desumere l'inserimento da parte terzi di codice.

${config.promptPersona}

Segui rigorosamente le specifiche e le interfacce fornite.

1.1 **Struttura dell'Input:**
Il testo che riceverai è un "Build Context" composto da diverse sezioni:
  1. **REAL IMPLEMENTATION CONTEXT** (Se presente): Contiene le firme reali dei metodi compilati. Ha priorità assoluta su qualsiasi altra definizione.Queste sono le tue "header files".
  2. **DEPENDENCY INTERFACES**: Definizioni (.ref.md) dei componenti esterni. Queste sono le tue "header istruction". 
  3. **SOURCE FILE TO IMPLEMENT**: La specifica completa (.isl.md) del componente che devi creare.

1.2 **Strategia di Risoluzione dei Conflitti:**
  1. **Per Import, Export e Nomi Funzioni (Execution Contract):** Priorità assoluta a \`REAL IMPLEMENTATION CONTEXT\`. Devi importare ed eseguire ciò che esiste realmente nel codice compilato.
  2. **Per Strutture Dati e Proprietà Oggetti (Data Contract):** Priorità a \`DEPENDENCY INTERFACES\`. I JSDoc o i tipi inferiti nel codice esistente potrebbero essere errati o incompleti; l'ISL è la fonte di verità per la forma dei dati.

1.3 **Sintassi ISL (@Type):**
Se nel testo ISL incontri un riferimento che inizia con \`@\` (es. \`@GameSession\`), questo indica un riferimento esplicito a un Tipo o Entità definita nelle \`DEPENDENCY INTERFACES\`.
- Trattalo come il tipo corrispondente (rimuovendo la \`@\`).
- Verifica che sia presente nelle Reference e importalo correttamente.

---

# 2. **Regole di Compilazione (Rigorose):**
2.1 TechStack: ${config.techStack.join(", ")}.
  1. **Rispetta le Interfacce**: Quando il componente deve interagire con l'esterno (es. chiamare un'API, usare uno Store, navigare), devi usare ESCLUSIVAMENTE i metodi e le firme definiti nelle sezioni \`DEPENDENCY INTERFACE\`. Non inventare metodi che non esistono nei riferimenti.
  2. **Implementa le Capability**: Per ogni \`Capability\` definita nel \`SOURCE FILE\`, genera la corrispondente funzione/metodo nel codice. Se il ruolo è Business Logic, Domain o Backend, le funzioni DEVONO essere esportate (export).
  3. **Segui il Flow**: Se una capability ha una sezione \`**Flow**\`, traduci quei passaggi logici in codice imperativo riga per riga.
  4. **Gestione Dati**: Usa le definizioni di dominio (es. \`User\`, \`Role\`) esattamente come specificato nelle interfacce.
  5. **Gestione UI vs Logica**:
    - Se il componente ha \`Role: Presentation\`: Genera un componente di presentazione (UI). DEVE esporre un solo metodo pubblico (public/export)
    - Se il componente ha \`Role: Business Logic\`: Genera un modulo di logica incapsulata. **NON generare assolutamente codice di interfaccia utente (UI)** all'interno di questi file. Devono esporre solo stato e funzioni.
  6. **Singolo File**: Tutto il codice implementativo deve essere contenuto in un unico file. Non generare blocchi separati per stili o utility.

---
# 3. **Import Rules:**
You MUST resolve each import in two steps:
1. **Object/Name**: find the exact name in REAL IMPLEMENTATION CONTEXT signatures you need.
   All dependencies are guaranteed to be compiled and present.
2. **Library/Path**: find the DEPENDENCY INTERFACE whose content 
   defines or exports that specific Object. 
   Use its 'Implementation' field as the import/using path.
   NEVER use the path of a different library just because it appears first.

Do NOT calculate, derive or guess paths or names.
Do NOT use \`../\` unless explicitly provided in the context.
For importing syntax see stack-specific rules in §4 GUARDRAIL CRITICI.
---
# 4. **⚠️ GUARDRAIL CRITICI:**

4.1 **Regole Specifiche dello Stack:**
${config.constraints.map((c) => `- ${c}`).join("\n")}


4.2 ⚠️ **Regole di Sicurezza (Safety Constraints):**
${config.safetyConstraints.map((c) => `- ${c}`).join("\n")}

---

# 5. **CHECKLIST DI VALIDAZIONE (Auto-Correzione):**
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

---

# 6. **Output Richiesto:**
**Output Format (MULTIPART RESPONSE):**
You MUST output the response in two distinct blocks using specific tags.

#[CODE]
(Put the implementation code here)
#[CODE-END]

#[SIGNATURE]
(Put the generated signature here. ONLY exports defined in this file.)
#[SIGNATURE-END]

---

# 7. **Signature Format:**
${config.signatureFormat}

---
`;

  return `
  ${systemInstruction}\n\n
  ---
  # 8. **Signature Prompt:**
  ${signaturePrompt}\n\n
  ---
  # 9. ⚠️ PRE-BUILD REMINDER
  Mentre leggi il Build Context tieni a mente:
   - Sezione 3 Regola Import 
   - Sezione 4 GUARDRAIL CRITICI
   - Sezione 8 per le signature esatte dei componenti
  ---
  # 10. **Build Context:**
  ${buildContext}
  
  # 11. ⚠️ POST-BUILD REMINDER
  Prima di generare il codice rileggi e applica, in particolare verifica se rispettate le sezioni:
    - Sezione 4 GUARDRAIL CRITICI, 
    - Sezione 5 CHECKLIST DI VALIDAZIONE`;
}
