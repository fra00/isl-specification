# Regole di Gestione delle Porte e Passaggi

Questo documento descrive il funzionamento tecnico e le regole di business relative alle porte e ai passaggi segreti nel progetto Heroquest React.

## 1. Natura delle Porte

- Stato: Una porta può essere "Chiusa" (default) o "Aperta" (se presente in `gameSession.openedDoors`).

## 2. Visibilità della Porta (Rendering)

Una porta viene visualizzata sul tabellone se soddisfa almeno una di queste condizioni:

1. **Persistenza**: La porta è già stata aperta (`openedDoors`).
2. **Adiacenza Rivelata**: La cella della porta stessa o una delle sue celle adiacenti (sopra/sotto per porte orizzontali, destra/sinistra per verticali) ha `fog: false`.

## 3. Verifica Adiacenza Porta

La verifica viene fatta tramite `isFrontOfDoor`. Le porte sono posizionate su una cella $(x, y)$ e agiscono come confine tra due celle specifiche:

- **Porta Orizzontale**: Collega la cella sopra $(x, y-1)$ e la cella della porta stessa $(x, y)$.
- **Porta Verticale**: Collega la cella a sinistra $(x-1, y)$ e la cella della porta stessa $(x, y)$.

Il metodo identifica queste due celle come `sideA` e `sideB`. La **cella di destinazione** è quella delle due che ha un ID area (`valo`) differente da quello della cella in cui si trova attualmente l'eroe.

## 3. Apertura delle Porte

L'apertura di una porta avviene in due modalità:

### A. Apertura Automatica (Movimento)

- Durante l'esecuzione del movimento (`movementEffect`), se l'eroe attraversa una porta e transita su di una cella con `valo` diverso da quello precedente significa che ho attraversato una porta (è possibile cambiare `valo` solo attraversando porte o passaggi segreti), la capability `openPassage` viene triggerata automaticamente.

### B. Apertura Manuale (Azione)

- La capability `useMapInteraction.isFrontOfDoor` verifica la presenza di passaggi (porta o passaggio segreto) validi .
- **Requisito per Apertura**:
  il requisito è che `useMapInteraction.isFrontOfDoor` sia true,vedi la sezione `Verifica Adiacenza Porta` per maggiori dettagli.
- L'interazione diagonale è tassativamente vietata.
- **Consumo Azione**: L'apertura di una porta (sia manuale che automatica) **non consuma l'azione del turno** (attacco o ricerca). L'eroe può aprire una porta e successivamente attaccare o cercare tesori nella stessa attivazione.
- **Abilitazione UI**: Il pulsante "Open Door" si abilita solo se l'eroe è adiacente cardinalmente (cioè se `useMapInteraction.isFrontOfDoor` ritorna `true`) a una porta chiusa .

## 4. Impatto sulla Nebbia di Guerra

L'apertura di una porta (automatica o manuale) è un'operazione atomica che esegue:

1. **Trigger di Apertura**:
   - **Apertura Automatica**: Avviene solo se l'eroe attraversa fisicamente una porta chiusa. quindi se ha cambiato `valo` rispetto alla precedente cella. L'unico modo per cambiare `valo` è tramite una porta o passaggio segreto.
   - **Apertura Manuale**: Avviene solo tramite pressione del pulsante dedicato quando l'eroe è adiacente.
2. **Identificazione Destinazione**: Il sistema identifica le due celle collegate (`sideA` e `sideB`). La `destinationCell` è la cella tra le due che possiede un `valo` diverso da quello della cella di partenza dell'eroe. Questo garantisce che la nebbia venga rimossa sempre nel lato "nuovo" rispetto alla posizione del giocatore.
3. **Reveal**: Chiama `fogOfWarLogic.revealFromPoint` sulla cella di `destinationCell`.
   - **Nota**: L'algoritmo deve calcolare la visibilità come se l'eroe si trovasse fisicamente nella cella di destinazione, svelando l'area oltre la porta senza spostare il token.
4. **State Update**: Aggiunge la coordinata della porta a `openedDoors`.
5. **State Reset**: Il flag di interazione `canOpenDoor` deve essere resettato a `null` immediatamente dopo l'apertura.
6. **Notification**: Invia un feedback all'utente ("Porta aperta.").

## 5. Ricerca e Scoperta di Passaggi Segreti

I passaggi segreti sono inizialmente invisibili e agiscono come muri invalicabili. Possono essere rivelati solo tramite l'azione di ricerca.

### A. Azione "Cerca Passaggi"

- **Trigger**: Pressione del pulsante "Search Passages" nel pannello di controllo.
- **Logica di Rilevamento**:
  - Il sistema calcola le celle attualmente visibili all'eroe:
    - se dentro una stanza (`valo` != "1") l'area visibile sarà la stanza stessa.
    - se in un corridoio (`valo` == "1") utilizza la Logica Ray Tracing
  - Un passaggio segreto viene scoperto se almeno una delle sue celle di confine (sopra/sotto per orizzontali, sinistra/destra per verticali useMapInteraction.isFrontOfDoor return true) fa parte dell'area rivelata (non coperta da nebbia).
- **Consumo**: Questa operazione **consuma l'azione** del turno (`HasPerformedAction: true`).
- **Stato**: Una volta scoperto, il passaggio viene aggiunto alla lista `foundPassages` e viene renderizzato sul tabellone (`pso.jpg` o `psv.jpg`).

### B. Interazione Post-Scoperta

- Una volta scoperto, un passaggio segreto eredita **tutte le regole di interazione delle porte** descritte nei punti 3 e 4.
- Può essere aperto manualmente (se adiacente) o automaticamente (se attraversato), innescando la rimozione della nebbia nell'area di destinazione.

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

### 🔍 useSecretPassages (Rilevatore)

- **Compito**: Gestisce la scansione dell'area per elementi nascosti.
- **Responsabilità**: Implementa `searchPassages` confrontando la griglia dei passaggi della mappa con le `visibleCells` fornite dal calcolo della visibilità.

### 🔍 useDungeonMapQuery (Fornitore Dati)

- **Compito**: Astrazione dell'accesso ai dati della mappa.
- **Responsabilità**: Fornisce la capability `isDoor` per verificare se determinate coordinate appartengono a una definizione di porta nel JSON.

### 🏗️ Dungeon (Orchestratore)

- **Compito**: Composition Root del modulo.
- **Responsabilità**: Instanzia gli hook e garantisce il passaggio dei dati (come `staticVisibilityMap` e `gameSession`) tra i vari componenti.

---

**Nota tecnica**: Tutte le coordinate delle porte sono gestite in **Base 1** (1-26, 1-19) per coerenza con i dati JSON del tabellone.
