# Regole di Gestione delle Porte e Passaggi

Questo documento descrive il funzionamento tecnico e le regole di business relative alle porte e ai passaggi segreti nel progetto Heroquest React.

## 1. Natura delle Porte

- Stato: Una porta può essere "Chiusa" (default) o "Aperta" (se presente in `gameSession.openedDoors`).

## 2. Visibilità della Porta (Rendering)

Una porta viene visualizzata sul tabellone se soddisfa almeno una di queste condizioni:

1. **Persistenza**: La porta è già stata aperta (`openedDoors`).
2. **Adiacenza Rivelata**: La cella della porta stessa o una delle sue celle adiacenti (sopra/sotto per porte orizzontali, destra/sinistra per verticali) ha `fog: false`.

## 3. Apertura delle Porte

L'apertura di una porta avviene in due modalità:

### A. Apertura Automatica (Movimento)

- Durante l'esecuzione del movimento (`movementEffect`), se l'eroe passa sopra una cella identificata come porta, la capability `openPassage` viene triggerata automaticamente.

### B. Apertura Manuale (Azione)

- La capability `useMapInteraction.isFrontOfDoor` verifica la presenza di passaggi (porta o passaggio segreto) validi **esclusivamente nelle 4 celle cardinali adiacenti (N, S, E, O)** rispetto alla posizione corrente dell'eroe. L'interazione diagonale è tassativamente vietata.
- Se `isFrontOfDoor` è su di una porta chiusa, il pulsante "Open Door" nella UI si abilita.

## 4. Impatto sulla Nebbia di Guerra

L'apertura di una porta (automatica o manuale) è un'operazione atomica che esegue:

1. - Chiama il metodo `isFrontOfDoor` dell'hooks `useMapInteraction` che ritorna le coordinate della cella di destinazione `destinationCell`.
2. **Reveal**: Chiama `fogOfWarLogic.revealFromPoint` sulla cella di `destinationCell` (la destinazione è implicitamente una `valo` diversa dalla cella corrente).
   - **Nota**: L'algoritmo deve calcolare la visibilità come se l'eroe si trovasse fisicamente nella cella di destinazione, svelando l'area oltre la porta senza spostare il token (utilizzando le regole stabilite di visualizzazione della cella di destinazioen).
3. **State Update**: Aggiunge la coordinata della porta a `openedDoors`.
4. **State Reset**: Il flag di interazione `canOpenDoor` deve essere resettato a `null` immediatamente dopo l'apertura (sia per l'apertura automatica che manuale).
5. **Notification**: Invia un feedback all'utente ("Porta aperta.").

## 5. Passaggi Segreti

- I passaggi segreti seguono le stesse regole delle porte una volta scoperti tramite l'azione "Cerca Passaggi Segreti".
- Finché non vengono scoperti, sono trattati come muri invalicabili e non possono essere aperti.

## 8. Attori della Funzionalità

### 🧠 useMapInteraction (Motore Logico)

- **Compito**: Gestisce la validazione spaziale e l'esecuzione dell'apertura.
- **Responsabilità**: Implementa `isFrontOfDoor` (calcolo simmetrico della destinazione) e `openPassage` (aggiornamento atomico di `openedDoors` e rimozione nebbia).

### 🕹️ useTurnLogic (Controllore Interazioni)

- **Compito**: Gestisce il ciclo di vita dell'interazione durante il turno.
- **Responsabilità**: Triggera l'apertura automatica durante il movimento (`movementEffect`) e gestisce lo stato `canOpenDoor` per abilitare il pulsante nella UI.

### ⚙️ useDungeonDoors (Gestore Visibilità Rendering)

- **Compito**: Filtra le porte da visualizzare sul tabellone.
- **Responsabilità**: Decide se una porta deve essere renderizzata in base allo stato `openedDoors` o alla rivelazione delle celle adiacenti nella `boardVisibilityMap`.

### 🔍 useDungeonMapQuery (Fornitore Dati)

- **Compito**: Astrazione dell'accesso ai dati della mappa.
- **Responsabilità**: Fornisce la capability `isDoor` per verificare se determinate coordinate appartengono a una definizione di porta nel JSON.

### 🏗️ Dungeon (Orchestratore)

- **Compito**: Composition Root del modulo.
- **Responsabilità**: Instanzia gli hook e garantisce il passaggio dei dati (come `staticVisibilityMap` e `gameSession`) tra i vari componenti.

---

**Nota tecnica**: Tutte le coordinate delle porte sono gestite in **Base 1** (1-26, 1-19) per coerenza con i dati JSON del tabellone.
