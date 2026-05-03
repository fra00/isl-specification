# Fog of War & Visibility Logic Rules

Questo documento definisce le regole autoritative per la gestione della nebbia di guerra e della visibilità nel progetto Dungeon React.

## 1. Rimozione della Nebbia (Trigger Area)

- La rimozione della nebbia avviene **esclusivamente** tramite i parametri `vis1` e `vis2` della cella occupata dall'eroe.
- Quando un personaggio si sposta su una coordinata `(x, y)`, il sistema deve leggere i valori `vis1` e `vis2` di quella specifica cella nel `VisibilityMap`.
- **Azione**: Tutte le celle del tabellone il cui attributo `valo` corrisponde a `vis1` oppure a `vis2` della cella corrente devono essere impostate a `fog: false`.

## 2. Il Ruolo delle Porte

- Le porte sono una **conseguenza topologica**: una porta chiusa impedisce al personaggio di occupare la cella sottostante o adiacente che contiene i puntatori `valo`/`vis1`/`vis2` necessari per rivelare la stanza successiva.
- Una volta aperta la porta, il personaggio può accedere alla cella di transizione, scatenando l'aggiornamento della visibilità basato sui nuovi `valo`/`vis1`/`vis2`.

## 3. Logica Ray Tracing

- Il Ray Tracing (propropagazione lineare della vista) non è onnipresente.
- Deve essere eseguito **solo ed esclusivamente** nei punti identificati come corridoi, tipicamente `valo: "1"`.
- Se il personaggio si trova in una stanza dove `valo` è diverso da "1" , `valo` definisce l'intera stanza, il Ray Tracing non deve essere calcolato. Tutte le celle on quel `valo` devono avere `fog: false`.

## 4. Persistenza

- Una volta che una cella è stata rivelata (`fog: false`), non deve mai tornare sotto la nebbia, indipendentemente dai movimenti successivi dei personaggi.

## 5. Coordinate e Mapping

- La logica deve gestire correttamente la discrepanza tra la UI (Base 0) e i dati della Mappa/Mobili/Porte (Base 1).
- Il controllo `vis1`/`vis2` deve essere atomico e avvenire ad ogni cambio di coordinata del personaggio in turno.

## 6. Vincoli di Inizializzazione

- **Guardia di Posizionamento**: La nebbia di guerra **non deve essere rimossa** finché gli eroi occupano la posizione di default di sistema (es. cella 1,1 o coordinate non inizializzate).
- **Sequenza di Attivazione**: Il calcolo dinamico della visibilità deve attivarsi solo dopo che:
  1. Gli eroi sono stati correttamente posizionati nelle coordinate `eroi_start` (tramite la capability `initializeMission`).
  2. L'utente ha confermato l'ordine dei turni (`isHeroOrderConfirmed` impostato a true).
- **Reveal Collettivo**: Il primo svelamento della mappa avviene esclusivamente tramite il trigger `revealInitialVisibility` subito dopo la conferma dell'ordine.

## 7. Attori della Funzionalità

### 🏛️ MainContent (Data Provider)

- **Ruolo**: Carica i dati statici del tabellone (`default.json`) durante la fase di bootstrap.
- **Responsabilità**: Garantire che la `staticVisibilityMap` sia integra e disponibile globalmente prima dell'inizio della missione.

### 🧠 useFogOfWar (State Manager)

- **Ruolo**: Custode della persistenza.
- **Responsabilità**: Mantiene lo stato dinamico `fogVisibilityMap`. Riceve le celle da svelare dall'algoritmo di calcolo e applica la modifica permanente (`fog: false`).

### ⚙️ useVisibilityCalc (Algorithm Engine)

- **Ruolo**: Il "motore" logico.
- **Responsabilità**: Implementa fisicamente la regola `vis1`/`vis2`. Analizza la coordinata corrente e restituisce l'elenco delle celle che appartengono alle aree visibili. Gestisce anche il Ray Tracing condizionale per i corridoi (`valo: "1"`).

### 🎨 DungeonBoard (Visual Renderer)

- **Ruolo**: L'occhio del giocatore.
- **Responsabilità**: Traduce i dati di `fogVisibilityMap` in pixel. Applica l'overlay nero e gestisce la conversione delle coordinate da 0-indexed (UI) a 1-indexed (Logica).

### 🏗️ Dungeon (Orchestrator)

- **Ruolo**: Il regista della sessione.
- **Responsabilità**: Connette gli attori. Quando riceve un evento di movimento da `useTurnLogic`, invoca `useFogOfWar` per aggiornare la mappa. Inietta la `staticVisibilityMap` negli hook che ne hanno bisogno.

### 🚪 useMapInteraction (Catalyst)

- **Ruolo**: Facilitatore di accesso.
- **Responsabilità**: Aprendo le porte, permette agli eroi di accedere alle celle di transizione, fungendo da "trigger" indiretto per la rivelazione di nuove aree.

---

**Nota per l'Auditor**: Qualsiasi implementazione che tenti di calcolare la visibilità basandosi su collisioni fisiche con muri o porte senza consultare la mappatura `vis1`/`vis2` è da considerarsi errata.
