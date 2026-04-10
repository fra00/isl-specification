# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./domain-spells-data

---

> **Reference**: Spell in `./domain-ruleset.isl.md`

## Component: GameSpellsData

### Role: Domain

### 📦 Content/Structure

#### `staticSpells`

La lista autoritativa dei 12 incantesimi disponibili nel gioco.

- **Fuoco** (Set 1):
  - **1**: { nome: "Palla di Fuoco", elemento: "Fuoco", targetType: "Monster", effetto: "Palla di Fuoco", valore: 2, immagine: "Fuoco01.jpg", dorso: "Fuoco00_Dorso.jpg", descrizione: "Infligge 2 danni diretti a un mostro." }
  - **2**: { nome: "Frecce di Fuoco", elemento: "Fuoco", targetType: "Monster", effetto: "Frecce di Fuoco", valore: 1, immagine: "Fuoco02.jpg", dorso: "Fuoco00_Dorso.jpg", descrizione: "Infligge 1 danno diretto a un mostro." }
  - **3**: { nome: "Coraggio", elemento: "Fuoco", targetType: "Hero", effetto: "Coraggio", valore: 2, immagine: "Fuoco03.jpg", dorso: "Fuoco00_Dorso.jpg", descrizione: "Aumenta l'attacco di un eroe di 2 dadi finché sono presenti mostri." }

- **Acqua** (Set 2):
  - **4**: { nome: "Acqua Guaritrice", elemento: "Acqua", targetType: "Hero", effetto: "Acqua Guaritrice", valore: 4, immagine: "Acqua01.jpg", dorso: "Acqua00_Dorso.jpg", descrizione: "Recupera fino a 4 Punti Corpo dell'eroe bersaglio." }
  - **5**: { nome: "Nebbia Caliginosa", elemento: "Acqua", targetType: "Hero", effetto: "Nebbia Caliginosa", valore: 0, immagine: "Acqua02.jpg", dorso: "Acqua00_Dorso.jpg", descrizione: "Permette all'eroe di attraversare i mostri durante il movimento." }
  - **6**: { nome: "Sonno", elemento: "Acqua", targetType: "Monster", effetto: "Sonno", valore: 0, immagine: "Acqua03.jpg", dorso: "Acqua00_Dorso.jpg", descrizione: "Fa addormentare un mostro (salta il turno) finché non viene attaccato." }

- **Terra** (Set 3):
  - **7**: { nome: "Pelle di Pietra", elemento: "Terra", targetType: "Hero", effetto: "Pelle di Pietra", valore: 1, immagine: "Terra01.jpg", dorso: "Terra00_Dorso.jpg", descrizione: "Aumenta la difesa di 1 dado finché l'eroe non subisce danni." }
  - **8**: { nome: "Passapareti", elemento: "Terra", targetType: "Hero", effetto: "Passapareti", valore: 0, immagine: "Terra02.jpg", dorso: "Terra00_Dorso.jpg", descrizione: "Permette all'eroe bersaglio di attraversare un solo muro durante il movimento. Non assegna cariche o usi extra basati su dadi." }
  - **9**: { nome: "Genio", elemento: "Terra", targetType: "Monster", effetto: "Genio", valore: 5, immagine: "Terra03.jpg", dorso: "Terra00_Dorso.jpg", descrizione: "Evoca un Genio per attaccare (5 dadi) o aprire una porta a distanza." }

- **Aria** (Set 4):
  - **10**: { nome: "Tempesta", elemento: "Aria", targetType: "Monster", effetto: "Tempesta", valore: 0, immagine: "Aria01.jpg", dorso: "Aria00_Dorso.jpg", descrizione: "Il mostro viene avvolto dai venti e salta il suo prossimo turno." }
  - **11**: { nome: "Passaggio Invisibile", elemento: "Aria", targetType: "Hero", effetto: "Passaggio Invisibile", valore: 0, immagine: "Aria02.jpg", dorso: "Aria00_Dorso.jpg", descrizione: "Rende l'eroe in grado di passare attraverso i muri o fuggire via." }
  - **12**: { nome: "Intralcio", elemento: "Aria", targetType: "Monster", effetto: "Intralcio", valore: 1, immagine: "Aria03.jpg", dorso: "Aria00_Dorso.jpg", descrizione: "Riduce il movimento del mostro a 1 sola casella." }

### ⚡ Capabilities

#### getAllSpells

- **Contract**: Restituisce la lista completa dei 12 incantesimi.
- **Signature**: `() -> List<@Spell>`

#### getSpellsByElement

- **Contract**: Filtra gli incantesimi per elemento.
- **Signature**: `(elemento: String) -> List<@Spell>`
