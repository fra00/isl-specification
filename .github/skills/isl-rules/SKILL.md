---
name: isl-rules
description: "ISL v1.6.2 specification rules and conventions. Use when: writing or reviewing ISL documents (.isl.md files), creating Domain/Business Logic/Test roles, using symbol notation with @ and backticks, or applying canonical interpretation rules for generators."
applyTo:
  - "**/*.isl.md"
  - "**/domain*.isl.md"
  - "**/logic*.isl.md"
  - "**/test*.isl.md"
---

# ISL v1.6.2 Rules & Conventions

## Standard Roles

All ISL documents MUST declare a role. Standard roles are:

| Role               | Purpose                                                                           |
| ------------------ | --------------------------------------------------------------------------------- |
| **Presentation**   | UI rendering, interaction surfaces, visual behavior                               |
| **Backend**        | API contracts, persistence, service orchestration, integration boundaries         |
| **Domain**         | entities, value structures, enumerations, static rules, shared concepts           |
| **Business Logic** | deterministic use cases, state transitions, orchestration rules, runtime behavior |
| **Test**           | scenario specifications, fixtures, assertions, behavior validation inputs         |

## Symbol Reference Notation

Use consistent notation to distinguish stable domain types from transient local values:

- **`@TypeName`**: Domain type, state structure, or reusable entity (use for contracts)
- **`` `variableName` ``**: Local variable, parameter, field, or temporary value (use for transient scope)

**Why it matters**: Generators must understand the difference between contracts (reference, do not duplicate) and values (local scope, transient).

### Example

```markdown
### Role: Business Logic

- `gameSession`: @GameSession
- `spell`: @Spell

### Flow

1. Find `targetMonster` in `gameSession.monsters`.
2. Apply damage from `spell` to `targetMonster`.
```

Here: `@GameSession` and `@Spell` are domain types (reference existing contracts); `targetMonster`, `spell` are local variables.

## Mandatory Sections

Every ISL document MUST include:

- **Role**: Declaration of document purpose
- **Contract**: What the capability promises to do
- **Flow**: Behavioral sequencing (when applicable to role)

## Standard Section Symbols (Emoji Notation)

ISL uses emoji to categorize standard sections for visual clarity and consistency:

| Symbol     | Section                       | Usage                                                                         |
| ---------- | ----------------------------- | ----------------------------------------------------------------------------- |
| **🔍**     | Appearance                    | Visual styling, layout, responsive behavior (Presentation role)               |
| **📦**     | Content                       | Layout structure, conditional rendering, slot composition (Presentation role) |
| **⚡**     | Capabilities                  | Public methods/actions/events the component exposes                           |
| **🗂**     | Internal State                | State ownership qualifiers (external/internal/calculated)                     |
| **⚙**      | Logic & Execution Rules       | Normative semantics, evaluation order, deterministic constraints              |
| **🔄**     | Effect Lifecycle              | Apply → Active While → Expires When → Cleanup                                 |
| **🔒**     | Mutation Boundary             | State ownership and write authorization rules                                 |
| **🧭**     | Decision Rules                | Explicit selection policies and priorities                                    |
| **🧩**     | Embedded DSL                  | Grammar, opcodes, execution rules for runtime interpreters                    |
| **🧪**     | Fixtures/Scenarios/Assertions | Test role specifics                                                           |
| **💡**     | Implementation Hint           | Non-normative guidance (optional, informational)                              |
| **@State** | Component State               | Props and state fields with types and defaults                                |

## Optional Standard Sections

Documents MAY include these sections when relevant:

- **🗂 Internal State**: Clarify state ownership (external/internal/calculated)
- **⚙ Logic & Execution Rules**: Normative semantics required for deterministic generation
- **🔄 Effect Lifecycle**: Apply → Active While → Expires When → Cleanup
- **🔒 Mutation Boundary**: Declare state ownership and write authorization
- **🧭 Decision Rules**: Explicit selection policies (AI targeting, walkability, priority)
- **🧩 Embedded DSL**: Grammar, opcodes, execution rules for runtime interpreters
- **🧪 Fixtures/Scenarios/Assertions**: Test role specifics

## Cross-File References & Dependencies

When a document references types or behaviors from other ISL files:

### Reference Format

At the top of the document, declare references using blockquote notation:

```markdown
> **Reference**: @Monster, @Equipment, @Item in `./domain-ruleset.isl.md`.
> **Reference**: @Campaign in `./domain-map.isl.md`.
> **Reference**: PagePresentation in `./page-presentation.isl.md`.
```

### Symbol Notation for Cross-File Types

- Use `@FileName.TypeName` when type identity must be explicit
- Or simply `@TypeName` when context is clear (same project, same domain)
- Always declare which file defines each referenced type

### Example: Complete Reference Header

```markdown
> **Reference**: PagePresentation are defined in `./page-presentation.isl.md`.
> **Reference**: @Monster, @Equipment, @Item, @Spell, @TreasureCard in `./domain-ruleset.isl.md`.
> **Reference**: @Campaign in `./domain-map.isl.md`.
> **Reference**: @VisibilityMap in `./domain-map.isl.md`.
```

## Project Metadata Header

Every ISL file declaring `# Project: Name` SHOULD include metadata before the first section:

```markdown
# Project: ProjectName

**Version**: 1.0.0
**ISL Version**: 1.6.2
**Created**: 2026-02-09
**Implementation**: ./build-output

---

> **Reference**: @Type definitions in `./domain-file.isl.md`.
```

**Fields:**

- **Version**: Semantic version of the specification
- **ISL Version**: Target ISL language version (e.g., 1.6.2)
- **Created**: ISO date (YYYY-MM-DD) when first authored
- **Implementation**: Path to generated code or build output (optional)

## Presentation Components Structure

Presentation role documents (UI components) typically use:

```markdown
## Component: ComponentName

**Signature**: (props) => JSX

### Role: Presentation

### @State

- `fieldName`: Type (Default: value)
- `anotherField`: Type (Default: value)

### 🔍 Appearance

- width: description
- height: description
- colors: description
- responsive behavior

### 📦 Content

- IF condition:
  - render: element
- ELSE:
  - render: element

### ⚡ Capabilities

#### capabilityName

- **Contract**: Description of what it does
- **Trigger**: When it happens (onClick, onMount, etc.)
- **Flow**:
  1. Step 1
  2. Step 2
```

## Domain Concepts (Role: Domain)

Domain files declare shared vocabulary and data structures across the project.

```markdown
## Domain Concepts

- `@Hero`: A playable character with HP, attack, defense, inventory, spells.
- `@Monster`: A non-playable enemy with HP, attack, AI behavior.
- `@Spell`: A castable magic ability with cooldown, damage, area-of-effect rules.
- `@Item`: Pickupable object (armor, weapon, consumable).
- `@GameSession`: The persistent game state containing heroes, monsters, map, turn order.
```

**Rule**: Types defined in Domain role with `@` prefix are **reusable contracts**. Do NOT regenerate them elsewhere—reference them.

## Complete Capability Structure

A full capability declaration includes:

```markdown
### ⚡ Capabilities

#### capabilityName

- **Signature**: (param1: Type1, param2: Type2) => ReturnType
- **Contract**: What this capability promises to do. Must be satisfied by any implementation.
- **Trigger**: When this capability is invoked (e.g., onClick, onMount, event name).
- **Flow**:
  1. Step 1 describing observable behavior
  2. Step 2 with state transitions
  3. Reference Logic & Execution Rules when determinism matters
- **Side Effect**: What state mutations occur (changes to `@GameSession`, component state, etc.)
- **Cleanup**: Any teardown or finalization (e.g., event listeners, timers)
- **🚨 Constraint**: Limits or preconditions (e.g., "requires `isReady === true`")
- **✅ Acceptance**: How to verify success (e.g., "HP reduced by damage amount")
- **💡 Implementation Hint**: Suggested approach (non-normative; can be adapted)
```

**Example:**

```markdown
#### attackMonster

- **Signature**: (targetMonster: @Monster, attackerHero: @Hero) => void
- **Contract**: Apply calculated damage to `targetMonster` and record in session.
- **Trigger**: When player clicks "Attack" button with a valid target.
- **Flow**:
  1. Calculate `damageAmount` from `attackerHero.attack` and `targetMonster.defense`.
  2. Set `inputDisabled = true`.
  3. Play attack animation.
  4. Apply `damageAmount` to `targetMonster.hp`.
  5. Persist changes to @GameSession.
  6. Show damage result (floating text, HP bar update).
  7. Re-enable input when animation completes.

- **Side Effect**: `targetMonster.hp` decreases; `@GameSession` updated via `commitSessionUpdate`.
- **Cleanup**: Animation state cleared; input re-enabled.
- **🚨 Constraint**: `targetMonster` must be in visible enemies; `attackerHero.hp > 0`.
- **✅ Acceptance**: Target HP = previous HP - calculated damage (clamped to 0).
- **💡 Implementation Hint**: Use requestAnimationFrame for smooth animation.
```

## Constraints & Acceptance Criteria

### 🚨 Constraints (Normative)

Constraints define hard limits and preconditions:

```markdown
### 🚨 Constraints

- Input can only be enabled when `animationComplete === true`.
- Monster AI cannot target invisible heroes.
- Damage value must be >= 0.
- Turn order must respect hero speed (sorted descending).
```

Constraints are **mandatory** — violations are errors.

### ✅ Acceptance Criteria (Normative)

Acceptance criteria define success conditions:

```markdown
### ✅ Acceptance Criteria

- When a hero casts "Fireball", all enemies in the 3x3 area take damage.
- When an enemy dies (HP ≤ 0), it is removed from the board.
- Turn counter increments only after all heroes have acted.
- Treasure cards are revealed only when a hero occupies the cell.
```

Acceptance criteria are **testable** — automated tests should verify them.

### 💡 Implementation Hints (Informative)

Implementation hints are suggestions, not mandates:

```markdown
### 💡 Implementation Hints

- Consider using a priority queue for turn order.
- Debounce input events to prevent double-clicks.
- Cache visibility calculations for performance.
- Use React Context for shared state instead of prop drilling.
```

## Internal State Qualifiers (Detail)

Clarify which state is managed where:

```markdown
### 🗂 Internal State

- `@GameSession` **external**: Provided by the engine; this component reads and mutates it.
- `isAnimationPlaying` **internal**: Local component state during playback.
- `visibleMonsters` **calculated** from `@GameSession.monsters` and `@GameSession.fogOfWar`.
- `heroTurnOrder` **calculated** from hero speed stats and active effects.
```

**Interpretation:**

- **external**: do not create; receive from parent/context/props
- **internal**: create and manage locally; not shared
- **calculated**: derive from other values; do NOT store unless explicitly required for performance

## Effect Lifecycle (Detail)

For temporary effects, buffs, debuffs, spell states:

```markdown
### 🔄 Effect Lifecycle

#### Fireball Spell

- **Apply**: When spell is cast on the target monster.
  - Add fire damage over 3 turns.
  - Set `isOnFire = true`.
- **Active While**: `turnsRemaining > 0` AND `monsterAlive === true`.
  - Each turn, apply 5 fire damage.
  - Show visual flame animation.
- **Expires When**: `turnsRemaining === 0` OR `monster.hp <= 0`.
  - Remove from active effects.
  - Stop animation.
- **Cleanup**: Delete effect from `@GameSession.activeEffects`.

#### Invisibility Buff

- **Apply**: When hero drinks invisibility potion.
  - Set `hero.isInvisible = true`.
  - Duration = 5 turns.
- **Active While**: `turnsRemaining > 0` AND `hero.distance_moved === 0` (invisible until hero moves).
  - Hero not visible to enemy AI.
  - Hero can move freely without breaking invisibility.
- **Expires When**: `turnsRemaining === 0` OR hero moves more than 1 cell.
- **Cleanup**: Remove from active buffs; update visibility map.
```

## Logic & Execution Rules (Detail)

For deterministic behavior and operational semantics:

```markdown
### ⚙ Logic & Execution Rules (operational semantics — normative execution constraints)

#### DamageCalculation

- Order: base attack → weapon bonus → multiplicative modifiers → resistances.
- Rounding: `floor` after each step.
- Clamp: `max(0, result)`.
- Idempotency: Operations marked with `stableScriptKey` execute at most once per effect.

#### TurnEvaluation

- Sort heroes by speed (descending).
- Evaluate each hero's action in order.
- After all heroes act, evaluate monsters (by initiative).
- Apply any turn-end effects (poison damage, regeneration, expiration checks).
- Commit all mutations atomically to `@GameSession`.

#### InputGating

- On action start: Set `inputDisabled = true` immediately.
- On animation end: Check `commitSuccess`.
- If commit failed: Set `inputDisabled = false` and show error.
- If commit succeeded: Keep disabled until animation fully completes.

**Implementation Note**: This ensures UI reflects server state accurately.
```

## Mutation Boundary (Detail)

Define which component owns persistent state writes:

```markdown
### 🔒 Mutation Boundary

This component owns all persistent writes to `@GameSession` and `@Hero`.

- Only this component calls `commitSessionUpdate()`.
- Downstream components (HeroStats, MonstersPanel, etc.) MUST NOT directly mutate game state.
- Downstream components MAY hold transient local state (e.g., UI animation flags), but MUST delegate durable changes through this boundary.
- Callers access shared state read-only; mutations go through this component's API.

**Pattern**: This component implements the "state owner" pattern where other components request actions, this component evaluates and persists.
```

## Test Role Structure (Role: Test)

Test documents use specialized sections:

````markdown
# Role: Test

## 🧪 Fixtures

Define reusable test setup:

```markdown
### 🧪 Fixtures

- `emptyBoard`: A 10x10 dungeon with no monsters or items
- `defaultSession`: Two heroes (Warrior, Mage), one goblin, visible room
- `poisonedHero`: Warrior with "Poison" effect (2 turns remaining)
```
````

## 🧪 Scenario Groups

Group related test scenarios:

```markdown
### 🧪 Scenario Groups

#### Hero Movement

1. **Hero Cannot Move Off Board**
   - Given: `defaultSession`
   - When: hero attempts to move outside the 10x10 grid
   - Then: movement is rejected; hero position unchanged

2. **Hero Cannot End On Occupied Cell**
   - Given: `defaultSession`
   - When: destination is occupied by another hero or monster
   - Then: movement is rejected

3. **Hero Can Move To Empty Cell**
   - Given: `defaultSession`
   - When: hero moves 1 cell in any direction to an empty, walkable cell
   - Then: hero position updated; animation plays
```

## 🧪 Assertions

Define acceptance checks:

```markdown
### 🧪 Assertions

- `targetMonster.hp === previousHp - damageAmount`
- `@GameSession.isCommitted === true`
- `heroOrder[0].speed === max(heroes.speed)`
- `activeEffects.length === 2` after spell cast
```

## 🧪 Parameter Sets

Run same test with multiple inputs (optional):

```markdown
### 🧪 Parameter Sets

#### Damage Calculation Variants

| attacker    | defender  | weaponBonus | expectedDamage |
| ----------- | --------- | ----------- | -------------- |
| Warrior(10) | Goblin(2) | 2           | 10             |
| Mage(6)     | Dragon(5) | 0           | 1              |
| Warrior(10) | Dragon(5) | 3           | 8              |
```

## Embedded DSL Structure (🧩 Embedded DSL)

For systems that interpret a secondary language:

```markdown
### 🧩 Embedded DSL

This component interprets mission script commands stored in map data.

### 🧩 Grammar

- `msg "text"` → emit notification with text
- `aggoro <amount>` → add gold to active hero
- `fineturno` → force end of turn
- Blocks nest with `end` keyword
- Comments start with `//`

### 🧩 Opcodes

| Opcode      | Operands | Semantics                   |
| ----------- | -------- | --------------------------- |
| `msg`       | text     | Emit notification message   |
| `aggoro`    | amount   | Add gold; update UI         |
| `fineturno` | —        | End turn immediately        |
| `setflag`   | flagName | Set boolean flag in session |

### 🧩 Execution Rules

- Unknown statements are treated as implicit `msg` messages.
- Nested blocks close with `end`.
- Flags persist across turns; queries check `@GameSession.scriptFlags`.
- All opcodes are atomic with respect to `@GameSession` mutations.
```

## Canonical Rules for Generators

Generators MUST apply these interpretation rules in order:

### Rule 1: Contract Is Normative

- The `Contract` field defines what code MUST satisfy
- Implementation Hints are optional guidance, not requirements
- If code satisfies the contract, alternative implementations are valid

### Rule 2: Signature Enforces Types

- If a capability declares `Signature`, code MUST match those types
- If no signature exists, infer from Contract and Flow

### Rule 3: Flow Is Semantic, Not Pseudocode

- Flow describes observable sequencing and state transitions
- Flow is NOT JavaScript/pseudocode; avoid syntax idioms
- Procedural language is allowed if it remains semantic

### Rule 4: Domain Is Authoritative

- Types defined in Domain role are reusable, stable contracts
- Do NOT regenerate types marked with `@TypeName` unless the source Domain changes
- References to `@Domain.Type` MUST resolve the same type across all files

### Rule 5: Internal State Qualifiers Are Normative

- When a component declares `**external**`, inputs MUST come from props/context
- When a component declares `**internal**`, state MUST be locally owned
- When a component declares `**calculated**`, values MUST be derived, not stored independently

### Rule 6: Test Role Scenarios Are Acceptance Criteria

- Scenarios in Test documents define required behavior
- Generated code MUST satisfy all scenarios
- Assertions are normative constraints

## Flow Semantics

When writing Flow:

### ✅ DO

- Describe business-visible sequencing
- State transitions and evaluation order
- Branching policy and conditional logic
- Deterministic constraints affecting observable behavior
- Reference Logic & Execution Rules when order matters for determinism

### ❌ DON'T

- Write language-specific syntax (JavaScript, Python, etc.)
- Describe variable-by-variable implementation mechanics
- Include framework lifecycle details with no behavioral impact
- Use pseudocode reserved words (let, function, class, etc.)
- Over-specify what should remain an implementation detail

## Determinism Guidelines

For consistent code generation:

1. **Use `@Type` for contracts**: Mark domain types with `@`, ensure generators recognize them as references
2. **Use `` `var` `` for locals**: Mark transient values with backticks, signal they are local scope
3. **Declare state ownership**: Use Internal State if ownership is non-obvious
4. **Normalize numeric operations**: Specify rounding (floor, ceil, round) and clamp rules explicitly
5. **Name execution constraints**: Tag complex operations with operation names (DamageCalc, InputGating) in Logic & Execution Rules
6. **Declare effect lifetimes**: Use Effect Lifecycle for temporary effects, buffs, debuffs, permissions

## Document Structure Template

```markdown
# <Component or Domain Name>

## Role: <Presentation|Backend|Domain|Business Logic|Test>

## Contract

Text describing the public promise of this component/entity.

## Signature

- Input/output types (if applicable)
- Parameters (if applicable)

## 🗂 Internal State (optional)

- `fieldName` **external|internal|calculated**: description

## 🔄 Effect Lifecycle (optional)

- EffectName:
  - Apply: when...
  - Active While: condition...
  - Expires When: condition...
  - Cleanup: action...

## ⚙ Logic & Execution Rules (optional)

#### RuleName

- Normative semantic constraint

## Flow

1. Step 1
2. Step 2
3. etc.

## Capabilities (if applicable)

- Capability 1: Contract promise
- Capability 2: Contract promise

## 🧪 Test Scenarios (Role: Test only)

### Scenario Name

- Given: fixture setup
- When: trigger event
- Then: expected outcome
```

## Backward Compatibility

- Documents using only `Presentation` and `Backend` roles remain valid
- Documents without `@Type` notation remain valid
- Generators SHOULD interpret plain type names as implicit `@Type` references when context is clear

## References

- [ISL Official Specification](<../../../specs/Intent%20Specification%20Language%20(ISL).md>)
- [ISL v1.6.2 Proposals](<../../../specs/Intent%20Specification%20Language%20(ISL)%20v1.6.2%20Proposals.md>)
- [ISL FAQ](<../../../specs/Intent%20Specification%20Language%20(ISL).FAQ.md>)
