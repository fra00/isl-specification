# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-item-logic

---

> **Reference**: @HeroState, @GameSession in `./domain-session.isl.md`
> **Reference**: @Item in `./domain-ruleset.isl.md`

## Component: useItemLogic

### Role: Business Logic

**Signature**:

- `staticItems`: List<@Item>
- `onUpdateSession`: (session: @GameSession) -> void
- `onNotify`: (message: String) -> void

### ⚡ Capabilities

#### useItem

- **Contract**: Applies the effects of a consumable item to a hero and removes it from inventory.
- **Signature**: `(heroId: Integer, itemId: Integer, gameSession: @GameSession, targetMonsterId: Integer | null)`
- **Flow**:
  - Find `hero` in `gameSession.heroes` matching `heroId`.
  - Find `itemDef` in `staticItems` matching `itemId`.
  - IF `hero` is found AND `itemDef` is found:
    - Check if `itemId` exists in `hero.inventory`.
    - IF NOT found: RETURN.
    - **Apply Effects**:
      - IF `itemDef.hp` is NOT 0:
        - Add `itemDef.hp` to `hero.currentBody`.
        - Clamp `hero.currentBody` to max `hero.hero.corpo`.
      - IF `itemDef.mp` is NOT 0:
        - Add `itemDef.mp` to `hero.currentMind`.
        - Clamp `hero.currentMind` to max `hero.hero.mente`.
    - **Handle Special Items**:
      - IF `itemDef.acqua` is true:
        - IF `targetMonsterId` is NOT null:
          - Find `targetMonster` in `gameSession.monsters` matching `targetMonsterId`.
          - IF `targetMonster` is found:
            - IF `targetMonster.monster.nonmorto` is true:
              - Subtract `itemDef.danni` (e.g., 3) from `targetMonster.currentBody`.
              - Trigger `onNotify("L'Acqua Santa purifica il non-morto infliggendo " + itemDef.danni + " danni!")`.
              - IF `targetMonster.currentBody` <= 0:
                - Remove `targetMonster` from `gameSession.monsters`.
            - ELSE:
              - Trigger `onNotify("L'Acqua Santa non ha effetto su questa creatura.")`.
        - ELSE:
          - Trigger `onNotify("Hai usato l'Acqua Santa, ma non hai colpito nulla!")`.
    - **Inventory Management**:
      - Find index of `itemId` in `hero.inventory`.
      - Remove item at that index (only one instance).
    - **Feedback**:
      - Trigger `onNotify("Hai usato " + itemDef.nome + "!")`.
    - **Update**:
      - Trigger `onUpdateSession` with updated `gameSession`.

### ✅ Acceptance Criteria

- Using a healing potion increases `currentBody`.
- Health cannot exceed the hero's starting `corpo` value.
- The item is removed from the `inventory` array after use.
- A notification is shown to the user confirming the action.
