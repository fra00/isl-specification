# Project: Heroquest React

Short description

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./main-menu

---

> **Reference**: Core entities are defined in `./domain-core.isl.md`.

## Domain Concepts

### 📦 Content/Structure

- This component is the presentation entry point of the application and defines the visual language of the home screen, including menu emphasis and preview behavior on hover.

## Component: MainMenu

Main Menu Screen

### Role: Presentation

**Signature**:

- `onChangePageView`: (page: @PageNavigationEnum) -> void

### 🔍 Appearance

- full width
- height : 100vh
- contenuto: centrato orizzontalmente ma spostato più in basso rispetto al centro verticale (z-index superiore agli effetti di background)
- `BackgroundLayer`: livello di base con immagine `/img/menusfondo.jpg` (z-index 0, overflow: hidden)
  - size: cover, position: center, width: 100%, height: 100%
  - animation: "Respiro" (zoom continuo: scale da 1.0 a 1.08, durata 30s, loop alternato, ease-in-out)
- `MouseOverImageLayer`: riquadro per visualizzazione immagine MouseOver (z-index 2)
  - posizione: absolute, top 0, right 0
  - width: auto (mantiene aspect ratio)
  - height: 30% del parent
  - opacity: 0.8 (leggermente trasparente per fondersi con lo sfondo)
  - no border
- `MistOverlay`: livello di nebbia dinamica (z-index 5)
  - position: absolute, inset 0, pointer-events: none
  - background: url(/img/mist.jpeg) repeat-x
  - background-size: 200% 100%
  - filter: blur(5px)
  - animation: "Deriva Nebbia" (animazione continua della background-position-x da 0% a 100%, durata 60s, loop infinito, linear)
  - opacity: 0.3
  - mix-blend-mode: screen
- `DustOverlay`: effetto pulviscolare (z-index 8)
  - position: absolute, inset 0, pointer-events: none, overflow: hidden
  - Struttura: Genera un set fisso di 80 particelle persistenti all'inizializzazione.
  - Particella: div circolare, dimensione random 1-3px, colore ambra/oro (#FFD700).
  - Posizionamento: coordinate X random (0-100%), coordinata Y iniziale random (0-100%).
  - Animazione "Fluttuazione Pulviscolo":
    - Movimento: da Y=110% a Y=-10% (fuori schermo alto).
    - Variazione: oscillazione orizzontale (drift) di +/- 20px tramite trasformazione sinusoidale.
    - Opacità: fadeIn iniziale e fadeOut finale per evitare scatti visivi.
    - Durata: randomizzata tra 15s e 25s per ogni particella.
    - Delay: randomizzato (negativo) per far sì che il pulviscolo sia già presente al caricamento.
  - mix-blend-mode: screen
- `CandleLightOverlay`: riflesso della luce (z-index 10)
  - position: absolute, inset 0, pointer-events: none
  - background: radial-gradient(circle at 50% 60%, rgba(255, 160, 20, 0.4) 0%, transparent 70%)
  - animation: "Bagliore Vivo" (pulsazione morbida dell'opacità tra 0.4 e 0.8 e lievissima variazione di scala 1.02, durata 4s, ease-in-out, loop infinito)
  - mix-blend-mode: screen
- `UIContent`: livello superiore (z-index 20)
  - posizionamento: offset verticale verso il basso per dare più respiro all'immagine di sfondo e al riquadro preview in alto

voci di menu :

- clicakble text con stile (no button, solo testo decorato):
  Font: 'fantasy' (Bold).

  Typography:
  Color: linear-gradient(to bottom, #D6B36A 0%, #8C6239 100%).
  -webkit-background-clip: text.
  -webkit-text-fill-color: transparent.
  💡 Effetto: Questo crea un riflesso metallico bronzo caldo, più desaturato e coerente con l'atmosfera del menu.

  Shadow & Stroke (Rilevante per la tua immagine):
  Stroke: -webkit-text-stroke: 2px #2a2a2a (Grigio pietra molto scuro per staccare dal giallo).
  Drop-Shadow: filter: drop-shadow(4px 4px 2px rgba(0,0,0,1)).
  💡 Nota: Usare filter: drop-shadow invece di text-shadow garantisce che l'ombra segua la sagoma del testo incluso lo stroke grigio.

- stato base del testo: nessun blur, ma ombra scura netta e contrasto forte
- mouse over: evidenziazione con leggero aumento scala, glow bronzo caldo, stroke più chiaro e lieve traslazione orizzontale; evitare blur sul testo

### 📦 Content

Eenco di voci di menu (no titolo):

- `MistOverlay` (nebbia che striscia sullo sfondo)
- `DustOverlay` (particelle di polvere in sospensione)
- `CandleLightOverlay` (livello decorativo per effetto tremolio)
- "GIOCA" `destination` => PageNavigationEnum.PLAY_GAME
- "EDITOR" `destination` => PageNavigationEnum.EDITOR_GAME

- `MouseOverImage` riquadro per visualizzazione immagine MouseOver
  - posizione assoluta top 0
  - posizione assoluta right 0
  - weight mantiene aspect ratio
  - height 30% del parent
  - no border

### ⚡ Capabilities

#### clickMenuItems

**contract**:
Azione da eseguire al click su voce di menu
**Trigger**:
Click su voce di menu
**Side Effects**:
IF NOT isProcessing:

- set isProcessing = TRUE
- vai alla pagina `destination` (onChangePageView(`PageNavigationEnum`))
- set isProcessing = FALSE

#### mouseOverMenuItems

**Contract**:
Azione da eseguire al mouseover su voce di menu
**Trigger**:
Mouse over voce di menu
**Side Effects**:
Visualizza e carica immagine su riquadro `MouseOverImage`
se "Gioca" allora url(/img/main-menu/nuova.jpg)
se "Editor" allora url(/img/main-menu/editor.jpg)
