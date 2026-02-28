### TASK

Sviluppa uno script Python per la validazione test cases utilizzando un approccio IBRIDO a cascata per minimizzare i costi e massimizzare la velocità.

### LOGICA DI VALUTAZIONE (In ordine di esecuzione)

1. EXACT MATCH: Se la risposta dell'agente è identica alla Ground Truth (case-insensitive), assegna Score 5 e passa oltre.
2. SEMANTIC SIMILARITY: Per le risposte non identiche, usa la libreria 'sentence-transformers' (modello locale gratuito 'all-MiniLM-L6-v2').
   - Se la similarità è > 0.95: Assegna Score 5.
   - Se la similarità è < 0.40: Assegna Score 1.
3. LLM AS JUDGE (Filtro finale): Solo per i casi con similarità compresa tra 0.40 e 0.95, invia i dati a Gemini 1.5 Flash (utilizzando la libreria google-generativeai per sfruttare il tier gratuito).

### REQUISITI TECNICI

- Gestione di un file CSV in input (domanda, risposta_attesa).
- Calcolo locale degli embeddings (non usare API a pagamento per la similarità).
- Rate limiting per le chiamate a Gemini (max 15 chiamate al minuto per stare nel free tier).
- Output: Un file CSV finale con colonne: domanda, risposta_attesa, risposta_agente, metodo_valutazione (Exact/Semantic/LLM), score, spiegazione.
- Barra di progresso tqdm e salvataggio incrementale ogni 10 righe.

### OUTPUT

Fornisci il codice Python completo e commentato.
