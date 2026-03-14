# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-treasure-card-modal

---

> **Reference**: @TreasureCard in `./domain-ruleset.isl.md`

## Component: TreasureCardModal

### Role: Presentation

**Signature**:

- `isOpen`: Boolean (Controls visibility).
- `card`: @TreasureCard (The card to display).
- `onClose`: () -> void (Callback to close the modal).


### 🔍 Appearance

- **Overlay**: Fixed full-screen container with semi-transparent backdrop (bg-black/80), z-index 60.
- **Dialog**: Centered container.
- **Image**: The card image.

### 📦 Content

- **Card Image**:
  - Source: `/img/cartetesoro/` + `card.immagine`.
  - Alt: `card.effetto`.
  - Click on image or overlay triggers `onClose`.

### ⚡ Capabilities

#### handleClose

- **Contract**: Closes the modal.
- **Trigger**: Click on overlay or image.
- **Flow**:
  - Trigger `onClose`.