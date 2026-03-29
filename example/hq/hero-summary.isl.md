# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./hero-summary

---

> **Reference**: Hero in `./domain-ruleset.isl.md`
> **Reference**: HeroState in `./domain-session.isl.md`
> **Reference**: Equipment in `./domain-ruleset.isl.md`

## Component: HeroSummary

### Role: Presentation

**Signature**:

- `heroes`: List<HeroState> (Dynamic states from session).
- `staticHeroes`: List<Hero> (Static definitions loaded from JSON).
- `selectedIndex`: Integer (Index of the currently selected hero).
- `onSelect`: (index: Integer) -> void (Callback when a hero is selected).

### 🛡️ Guards

- IF heroes.length == 0 THEN RETURN 'No Heroes Available'
- IF selectedIndex >= heroes.length THEN SET selectedIndex = 0

### 🔍 Appearance

- **Layout**: Vertical column layout.
- **Hero Selector**: A list or dropdown to switch between heroes.
- **Portrait**: Large image container for the hero's portrait.
- **Stats**: Display for Gold amount.
- **Inventory**: List of owned items.

### 📦 Content

- **Selector**: Renders names of all heroes in the session.
- **Portrait**: Image sourced from `/img/eroi/` + `staticHero.portrait`.
- **Gold**: Text displaying "Gold: " + `heroState.gold`.
- **Equipment List**: List of names of equipment currently owned by the hero. Use id to find the Equipment "nome" from static Equipment list

### ⚡ Capabilities

#### handleSelect

- **Contract**: Propagates selection event.
- **Trigger**: User clicks on a hero in the selector.
- **Flow**:
  - Trigger `onSelect(index)`.
