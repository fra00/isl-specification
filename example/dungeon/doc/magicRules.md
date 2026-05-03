# Magic Rules & Spellcasting Logic

Questo documento definisce le regole autoritative per la gestione della magia, la selezione degli incantesimi e l'esecuzione degli effetti nel progetto Dungeon React.

## 1. Selezione Iniziale degli Incantesimi

- **Eroi Magici**: Solo il Mago e l'Elfo possono possedere incantesimi.
- **Distribuzione Elementale**: Gli incantesimi sono divisi in 4 gruppi elementali (Fuoco, Acqua, Terra, Aria), ciascuno contenente 3 incantesimi.
- **Priorità di Scelta**:
  1. Il **Mago** sceglie per primo 3 gruppi elementali (9 incantesimi totali).
  2. L'**Elfo** riceve automaticamente l'ultimo gruppo elementale rimanente (3 incantesimi).
- **Automatismo**: Se il Mago seleziona i suoi 3 elementi, il sistema assegna automaticamente il quarto all'Elfo. Se il Mago non è presente, l'Elfo sceglie il suo gruppo.

## 2. Economia dell'Azione Magica

- **Costo**: Lanciare un incantesimo consuma l'**Azione** del turno del personaggio.
- **Consumo**: Una volta lanciato con successo, l'incantesimo viene rimosso dalla lista `availableSpells` dell'eroe (uso singolo per missione).
- **Fallimento**: Se un incantesimo non può essere lanciato (es. bersaglio non valido), l'azione viene considerata "eseguita" ma l'incantesimo non viene rimosso dal mazzo dell'eroe.

## 3. Targeting e Linea di Vista (LOS)

- **Tipi di Target**: Definiti nella proprietà `targetType` dello Spell: `Self`, `Hero`, `Monster`, `Point`, `Door`.
- **Regola Generale LOS**: Per lanciare un incantesimo su un target (Mostro o Eroe), deve esserci una linea di vista libera (calcolata tramite `useVisibilityCalc.hasLineOfSight`).
- **Eccezione "Genio"**: L'incantesimo _Genio_ ignora la linea di vista e gli ostacoli. Può essere lanciato su qualsiasi mostro o porta rivelata sulla mappa.
- **Visualizzazione**: Durante il targeting, il sistema mostra una "Targeting Tracer" (linea SVG). La linea è blu se il lancio è possibile, rossa se la LOS è ostruita.

## 4. Risoluzione ed Effetti

### A. Resistenza Mentale

- Alcuni incantesimi (es. _Sonno_) richiedono un test di resistenza basato sui Punti Mente (`currentMind`).
- Il difensore tira un dado per ogni punto mente. Se ottiene almeno un **6**, l'incantesimo fallisce.

### B. Immunità

- I mostri contrassegnati come `nonmorto: true` sono immuni all'incantesimo _Sonno_.
- L'_Acqua Santa_ (oggetto speciale) infligge 3 danni fissi solo ai non-morti.

### C. Stati Attivi (Buff/Debuff)

Gli incantesimi possono applicare tag alla lista `activeStatus`:

- **RockSkin (Pelle di Pietra)**: +1 dado in difesa (calcolato da `useHeroStats`). L'effetto svanisce non appena l'eroe subisce almeno 1 danno (gestito da `useMonsterAI`).
- **Courage (Coraggio)**: +2 dadi in attacco. L'effetto persiste finché l'eroe rimane nella stessa stanza/area dove sono presenti mostri.
- **Sleep (Sonno)**: Il mostro salta il turno. Lo stato viene rimosso immediatamente se il mostro subisce danni da incantesimi (es. Palla di Fuoco) o attacchi fisici.
- **Tempest (Tempesta)**: Il mostro salta il turno (rimozione stato in `useMonsterAI`). Se attaccato _prima_ di aver saltato il turno, la sua difesa è ridotta a 0 (gestito esplicitamente dal Genio in `useMagicLogic`).
- **Entangled (Intralcio)**: Il mostro riduce il suo movimento a 1 sola casella per il prossimo turno.
- **FoggyMist**: Applica lo stato temporaneo `FoggyMist` fino alla fine del turno, ma non consente di attraversare occupanti.
- **InvisiblePassage / WallPass**: Permettono rispettivamente di attraversare occupanti e muri durante il movimento.
- **Passapareti**: Non introduce un contatore di utilizzi basato su un dado. L'eroe bersaglio tira normalmente il movimento; l'effetto consente di attraversare un solo muro e si consuma al primo attraversamento valido. Deve essere chiaramente visibile in UI quando attivo.

## 5. Interazioni Speciali

- **Incantesimi di Movimento**: Modificano le regole di validazione delle celle in `useDungeonMovementRules`.
- **Il Genio e le Porte**: Il Genio può aprire porte a distanza (anche non in linea di vista). Questa operazione utilizza `openPassage` di `useMapInteraction`, che a sua volta triggera `revealFromPoint` per aggiornare la nebbia di guerra.

## 7. Abilitazione Pulsante Magic (UI)

Il pulsante per l'apertura del menu Magia deve seguire queste regole di attivazione:

1. **Requisito di Classe**: Deve essere visibile solo per le classi in grado di usare la magia (Mago ed Elfo). Tecnicamente, questo si traduce nel verificare che la lista `availableSpells` dell'eroe non sia vuota.
2. **Stato dell'Azione**: Il pulsante deve essere **disabilitato** se l'eroe ha già effettuato un'azione nel turno corrente (`turnPhase.HasPerformedAction` è true).
3. **Stato del Movimento**: Il pulsante deve essere **disabilitato** mentre l'eroe è in fase di animazione di movimento (`isMoving` è true) per evitare conflitti di stato.
4. **Targeting**: Se è già attiva una modalità di targeting (per un altro incantesimo), il pulsante deve permettere solo l'annullamento o essere disabilitato.

## 6. Attori della Funzionalità

### 🔮 useMagicLogic (Business Logic)

- **Ruolo**: Il motore di esecuzione.
- **Responsabilità**: Implementa lo switch degli effetti (`castSpell`), gestisce il consumo degli incantesimi e la rimozione degli stati scaduti.

### 🎨 DungeonBoard (Presentation)

- **Ruolo**: Gestore del targeting visivo.
- **Responsabilità**: Mostra il cursore a mirino, evidenzia i target validi e renderizza la "Targeting Tracer".

### 📊 useHeroStats (Business Logic)

- **Ruolo**: Calcolatore di statistiche dinamiche.
- **Responsabilità**: Applica i bonus derivanti dagli `activeStatus` (es. RockSkin, Courage) al calcolo finale dei dadi di attacco e difesa.

### 🧠 useMonsterAI (Business Logic)

- **Ruolo**: Gestore degli stati sui mostri.
- **Responsabilità**: Controlla se un mostro deve saltare il turno a causa di _Sonno_ o _Tempesta_.

---

**Nota per l'Auditor**: Assicurarsi che ogni modifica alla sessione (`onUpdateSession`) rifletta correttamente la rimozione dell'incantesimo dal `HeroState` dopo l'esecuzione di `castSpell`.
