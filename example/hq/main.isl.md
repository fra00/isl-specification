# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./main-content

---

> **Reference**: PagePresentation are defined in `./page-presentation.isl.md`.
> **Reference**: @Monster, @Equipment, @Item, @Spell, @TreasureCard in `./domain-ruleset.isl.md`.
> **Reference**: @Campaign in `./domain-map.isl.md`.
> **Reference**: @GameSpellsData in `./domain-spells-data.isl.md`.

## Component: MainContent

Componente fullscreen sarà l'entry point e il contenitore principale dell'applicativo
**signature**:()=>void

### Role: Presentation

### @State

- `isAppReady`: Boolean (Default: false)
- `globalMonsters`: List<@Monster> (Default: [])
- `globalHeroes`: List<@Hero> (Default: [])
- `globalBoardData`: @VisibilityMap (Default: null)
- `globalEquipment`: List<@Equipment> (Default: [])
- `globalItems`: List<@Item> (Default: [])
- `globalSpells`: List<@Spell> (Default: [])
- `globalTreasureDeck`: List<@TreasureCard> (Default: [])
- `globalCampaign`: @Campaign (Default: null)

### 🔍 Appearance

width: full width
height : 100vh
allinea il contenuto al centro si orizzontale che verticale

### 📦 Content

IF `isAppReady` is false:

- visualizza Schermata di caricamento con scritta "Inizializzazione Sistema..."
  ELSE:
- `PagePresentation` passing all `globalAssets` as props.

### ⚡ Capabilities

#### bootstrap

- **Contract**: Loads all required JSON assets before starting the app.
- **Trigger**: On Mount.
- **Flow**:
  - TRY:
    - Fetch in parallel: `/jsonData/monsters.json`, `/jsonData/heroes.json`, `/jsonData/tabellone/default.json`, `/jsonData/equipment.json`, `/jsonData/items.json`, `/jsonData/treasure-card.json`, `/jsonData/campagne.json`.
    - Parse and update `globalMonsters`, `globalHeroes`, `globalBoardData`, `globalEquipment`, `globalItems`, `globalTreasureDeck`, `globalCampaign`.
    - Initialize `globalSpells` using the static data from `@GameSpellsData.getAllSpells()`.
    - SET `isAppReady` to true.
  - CATCH Error:
    - Display critical error: "Errore durante il caricamento degli asset: " + error.message.
