# Regole di Gestione delle Porte e Passaggi

Questo documento descrive il funzionamento tecnico e le regole di business relative alle porte e ai passaggi segreti nel progetto Heroquest React.

## 1. Natura delle Porte

- Stato: Una porta può essere "Chiusa" (default) o "Aperta" (se presente in `gameSession.openedDoors`).

## 2. Visibilità della Porta (Rendering)

Una porta viene visualizzata sul tabellone se soddisfa almeno una di queste condizioni:

1. **Persistenza**: La porta è già stata aperta (`openedDoors`).
2. **Adiacenza Rivelata**: La cella della porta stessa o una delle sue celle adiacenti (sopra/sotto per porte orizzontali, destra/sinistra per verticali) ha `fog: false`.

## 3. Verifica Adiacenza Porta

La verifica dell'adiacenza della porta viene fatta tramite il metodo `isFrontOfDoor` dell'hook `useMapInteraction`.
Ritorna un valore booleano se l'eroe è sopra una porta (x,y dell'eroe è uguale a x,y della porta), o se è `adiacente` (x, y+-1 per porte orizzontali, x+-1 per porte verticali) ad una porta.
Le porte sono posizionate su di una cella , ma queste in realtà interagiscono con due celle, una di ingresso e una di destinazione. il metodo ritorna oltre al booleano le coordinate della cella di destinazione.
La cella di destinazione è la cella `adiacente` che ha un valore di `valo` diverso da quello della cella su cui è posizionata la porta. Es: eroe è in x,y ed è la porta e ha `valo` 1, x+1 ha `valo` 1, mentre x-1 ha `valo` 2. Allora la cella di destinazione è x-1.

## 3. Apertura delle Porte

L'apertura di una porta avviene in due modalità:

### A. Apertura Automatica (Movimento)

- Durante l'esecuzione del movimento (`movementEffect`), se l'eroe passa sopra una cella identificata come porta, la capability `openPassage` viene triggerata automaticamente.

### B. Apertura Manuale (Azione)

- La capability `useMapInteraction.isFrontOfDoor` verifica la presenza di passaggi (porta o passaggio segreto) validi **esclusivamente nelle 4 celle cardinali adiacenti (N, S, E, O)** rispetto alla posizione corrente (x, y) dell'eroe o se l'eroe è sopra la porta (x,y).
- **Validazione Orientamento**:
  - Una porta **Orizzontale** è considerata valida solo se l'eroe si trova nella cella sopra (y-1) o sotto (y+1) o sopra (x,y) rispetto alle coordinate (x, y) della porta.
  - Una porta **Verticale** è considerata valida solo se l'eroe si trova nella cella a sinistra (x-1) o a destra (x+1) o sopra (x,y) rispetto alle coordinate (x, y) della porta.
- L'interazione diagonale è tassativamente vietata.
- **Consumo Azione**: L'apertura di una porta (sia manuale che automatica) **non consuma l'azione del turno** (attacco o ricerca). L'eroe può aprire una porta e successivamente attaccare o cercare tesori nella stessa attivazione.
- **Abilitazione UI**: Il pulsante "Open Door" si abilita solo se l'eroe è adiacente cardinalmente a una porta chiusa.

## 4. Impatto sulla Nebbia di Guerra

L'apertura di una porta (automatica o manuale) è un'operazione atomica che esegue:

1. **Trigger di Apertura**:
   - **Apertura Automatica**: Avviene solo se l'eroe attraversa fisicamente una porta chiusa. quindi se ha cambiato `valo` rispetto alla precedente cella. L'unico modo per cambiare `valo` è tramite una porta o passaggio segreto.
   - **Apertura Manuale**: Avviene solo tramite pressione del pulsante dedicato quando l'eroe è adiacente.
2. **Identificazione Destinazione**: Chiama il metodo `isFrontOfDoor` per ottenere la `destinationCell`.
   - **Logica del Valo (Symmetry Rule)**: Per calcolare la destinazione, il sistema confronta il `valo` (Area ID) della cella occupata dall'eroe con il `valo` della cella target (la porta o la cella immediatamente successiva). La `destinationCell` è definita come la cella che ha un `valo` diverso da quello della cella di partenza dell'eroe.
3. **Reveal**: Chiama `fogOfWarLogic.revealFromPoint` sulla cella di `destinationCell`.
   - **Nota**: L'algoritmo deve calcolare la visibilità come se l'eroe si trovasse fisicamente nella cella di destinazione, svelando l'area oltre la porta senza spostare il token.
4. **State Update**: Aggiunge la coordinata della porta a `openedDoors`.
5. **State Reset**: Il flag di interazione `canOpenDoor` deve essere resettato a `null` immediatamente dopo l'apertura.
6. **Notification**: Invia un feedback all'utente ("Porta aperta.").

## 5. Passaggi Segreti

- I passaggi segreti seguono le stesse regole delle porte una volta scoperti tramite l'azione "Cerca Passaggi Segreti".
- Finché non vengono scoperti, sono trattati come muri invalicabili e non possono essere aperti.

## 6. Attori della Funzionalità

### 🧠 useMapInteraction (Motore Logico)

- **Compito**: Gestisce la validazione spaziale e l'esecuzione dell'apertura.
- **Responsabilità**: Implementa `isFrontOfDoor` (validazione orientamento e calcolo della destinazione tramite confronto `valo`) e `openPassage` (aggiornamento atomico di `openedDoors` e rimozione nebbia).

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
