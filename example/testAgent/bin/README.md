# Test Agent Validator

Questo tool automatizza la validazione delle risposte di un agente AI confrontandole con una "Ground Truth" (risposte attese), utilizzando un approccio ibrido per ottimizzare precisione e costi.

## 1. Come si usa

### Prerequisiti

Assicurarsi di avere Python installato e le dipendenze necessarie:

```bash
pip install sentence-transformers google-generativeai tqdm numpy
```

### Configurazione

È obbligatorio impostare la chiave API di Google Gemini come variabile d'ambiente prima dell'esecuzione:

- **Windows (PowerShell):** `$env:GEMINI_API_KEY="la_tua_chiave_api"`
- **Linux/Mac:** `export GEMINI_API_KEY="la_tua_chiave_api"`

### File di Input

Nella cartella dell'eseguibile devono essere presenti due file CSV:

1.  `input.csv`: Deve contenere le colonne `domanda` e `risposta_attesa`.
2.  `agent_answers.csv`: Deve contenere le risposte dell'agente (una per riga, corrispondenti all'ordine di `input.csv`).

### Dati di Test (Cartella `dati-test`)

Nella cartella `dati-test` sono inclusi file di esempio pronti all'uso:

*   `agent_answers.csv`: Risposte simulate dell'agente.
*   `input.csv`: Domande e risposte corrette simulate (Ground Truth).
*   `agent-model-response.md`: Risposte simulate dell'agente con spiegazione del perché sono considerate giuste o sbagliate.

### Esecuzione

Lanciare lo script principale:

```bash
python main.py
```

## 2. Flusso di Controllo

Il sistema valuta ogni coppia (Risposta Attesa vs Risposta Agente) seguendo una logica a cascata:

1.  **Exact Match (Corrispondenza Esatta):**
    - Confronta le stringhe (case-insensitive).
    - Se identiche: Assegna **Score 5** e passa alla riga successiva.

2.  **Semantic Similarity (Similarità Semantica):**
    - Se non c'è match esatto, calcola la similarità vettoriale usando il modello locale `all-MiniLM-L6-v2`.
    - Se similarità **> 0.85**: Assegna **Score 5** (Concetto identico).
    - Se similarità **< 0.40**: Assegna **Score 1** (Concetto diverso).

3.  **LLM Judge (Giudice AI - Gemini):**
    - Se la similarità è nella "zona grigia" (tra 0.40 e 0.85), invia i dati a Gemini.
    - L'LLM analizza il significato e assegna un punteggio (1-5) con spiegazione.
    - _Nota:_ Include un Rate Limiter (max 15 chiamate/minuto) per il free-tier.

## 3. Output

I risultati vengono salvati nel file `output.csv` con le seguenti colonne:

- **domanda**: Il prompt originale.
- **risposta_attesa**: La risposta corretta di riferimento.
- **risposta_agente**: La risposta generata dall'agente.
- **metodo_valutazione**: Il metodo che ha determinato il voto (`EXACT_MATCH`, `SEMANTIC_SIMILARITY`, `LLM_JUDGE`).
- **score**: Il punteggio assegnato (1 = Errato, 5 = Corretto).
- **spiegazione**: Motivazione del punteggio (automatica o generata dall'LLM).
