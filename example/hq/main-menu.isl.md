# Project: Heroquest React

Short description

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./main-menu

---

> **Reference**: Core entities are defined in `./domain-core.isl.md`.

## Component: MainMenu

Main Menu Screen

### Role: Presentation

**Signature**:

- `onChangePageView`: (page: @PageNavigationEnum) -> void

### 🔍 Appearance

- full width
- height : 100vh
- background: image url(/img/menusfondo.jpg) , adatta immagine allo sfondo
- contenuto allineato al centro
- applica al background un animazione css con effetto zoom-parallax continuo (durata 50s, zoom max 110%, loop alternato infinito, ease-in-out)

voci di menu :

- Button text
- no background
- bold font
- blur effect on text with animation
- mouse over remove blur effect with animation

### 📦 Content

Eenco di voci di menu (no titolo):

- "Gioca" `destination` => PageNavigationEnum.PLAY_GAME
- "Editor" `destination` => PageNavigationEnum.EDITOR_GAME

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
