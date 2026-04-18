# ISL v1.6.2: Evolution for Complex Systems

_Part 4 of 4 — Engineering Intent Series_

## Introduction

This article is a standalone look at the 1.6.2 changes, but it also builds on the ideas introduced in earlier pieces of the series:

- Article 1: The Ambiguity Tax
- Article 2: The ISL Solution
- Article 3: The Tooling Engine

Version 1.6.2 is not about redesigning ISL. It is about formalizing patterns that already exist in real projects and removing the ambiguity that emerges when those patterns are left implicit.

The changes in this release address five specific areas where real systems already need extra clarity:

- what role each piece of the spec plays (Domain vs. Business Logic vs. Backend)
- which state belongs where (external, internal, or calculated)
- which behaviors are normative rules versus optional guidance
- how temporary effects are born, live, and die
- how Flow should express logic without becoming code

## The Main Changes in 1.6.2

### Expanded Role Taxonomy

ISL has always had Presentation and Backend. v1.6.2 adds three more roles that already appear in mature projects:

- **Domain**: entities, value structures, enumerations, static rules, shared concepts
- **Business Logic**: deterministic use cases, state transitions, orchestration rules, non-visual runtime behavior
- **Test**: scenario specifications, fixtures, assertions, behavior validation

The reason for this change is that real projects were already separating these concerns. Without explicit role names, a reader and a model have to guess whether a declaration is part of the domain model or a behavior specification.

Example—what is this?

```
Pricing Rule: Calculate final price based on promotion tier and membership.
```

Is this a data structure that belongs to Domain? Is this an operation that belongs to Business Logic? Without the role, it is ambiguous.

With explicit roles, the distinction becomes clear:

```
Role: Domain
- Hero: a character with attributes (HP, attack, defense).
- Stat Types: BaseStats, ModifiedStats (derived from effects).
- MembershipTier: standard, silver, gold.

Role: Business Logic
- When a purchase is placed, apply the current membership discount.
- When an effect is applied, update ModifiedStats from active effects.
```

Here, `Domain` is structure and naming. `Business Logic` is when and how that structure is used.

### Internal State Section (Optional)

Complex components need three kinds of values:

- values that come from outside (props, context, shared state)
- values that the component owns and maintains
- values that are derived and should not be stored

v1.6.2 clarifies this with three qualifiers: `**external**`, `**internal**`, `**calculated**`.

Example:

```
### 🗂 Internal State

- `gameSession` **external**: provided by the application runtime
- `visibleEnemies` **calculated** from `gameSession.enemies` and `currentHero.vision`
- `selectedTarget` **internal**: which enemy the player is hovering over
```

Without these qualifiers, a model might assume that `visibleEnemies` should be stored. Making it explicit prevents that mistake.

### Logic & Execution Rules Pattern

This section describes normative execution constraints. It is NOT a list of actions (that is Flow).

The common mistake is confusing this with Flow. Here is the difference:

❌ **Wrong** (this is Flow, not Execution Rules):

```
Logic & Execution Rules:
- Check if the player can move.
- If yes, update position.
- If no, show error.
```

✓ **Right** (these are normative rules):

```
### ⚙ Logic & Execution Rules

#### Movement Validation

- Walkable: a cell is not occupied and not blocked
- Occupied: another hero or enemy is on the cell
- Check walkability BEFORE position update
- Order: terrain check → occupancy check → apply movement

#### Position Commit

- Atomicity: position updates in `@GameSession` are atomic
- Idempotency: the same move action applied twice MUST NOT double-shift
- Animation sync: UI animation starts AFTER position commit
```

These are rules about order, atomicity, and normalization—not a procedure.

### Effect Lifecycle Pattern

Effects have four parts: when they start, what keeps them active, what ends them, what cleanup is needed.

v1.6.2 formalizes this with: `Apply`, `Active While`, `Expires When`, `Cleanup`.

Example:

```
### 🔄 Effect Lifecycle

#### RockSkin Spell

- **Apply**: when the spell is cast on a hero
- **Active While**: hero has shields remaining
- **Expires When**: shields are depleted to zero
- **Cleanup**: remove `rockSkinActive` from status; restore default armor

#### UI Notification Toast

- **Apply**: immediately after successful purchase
- **Active While**: toast rendered AND timer not expired
- **Expires When**: user dismisses OR 5 seconds elapsed
- **Cleanup**: remove from DOM; cancel pending animations
```

The structure makes boundaries explicit.

### Clarified Flow Semantics

Flow should be semantic, not code-like. v1.6.2 clarifies what is valid:

**Valid** (behavior sequencing):

```
### Flow

1. Player selects "Attack".
2. Validate target is in range and visible.
3. Calculate damage using Combat Rules.
4. Apply damage to target.
5. Update visual state and play animation.
6. Return to input state.
```

**Invalid** (implementation pseudo-code):

```
### Flow

1. Set selected = true.
2. If selected == true, then call updateModel().
3. var damage = baseAttack - defense.
4. ...
```

Flow describes what happens and the order that matters for behavior, not variable mechanics.

### Symbol Reference Notation

One final clarification: how to distinguish between a type reference and a variable reference in specs.

In real projects, authors and generators need to know: is this a reusable type definition, or a local variable?

v1.6.2 standardizes a simple convention:

- **`@TypeName`**: A reusable type, state structure, or domain concept (e.g., `@GameSession`, `@State`, `@Spell`)
- **`` `variableName` ``**: A local variable, parameter, or temporary value (e.g., `currentHero`, `damage`, `targetMonster`)

Example:

```
### Role: Business Logic

**Signature:**
- `gameSession`: @GameSession
- `currentSpell`: @Spell

### Flow

1. Find `targetMonster` in `gameSession.monsters`.
2. Calculate `damageAmount` = `currentSpell.baseDamage`.
3. Apply `damageAmount` to `targetMonster.health`.
4. Persist via `commitSessionUpdate(@GameSession)`.
```

Why does this matter? A generator that does not know `@GameSession` is a stable type might regenerate it locally instead of reusing the shared instance. That breaks determinism and correctness.

When a generator sees `@GameSession`, it knows: "reference the existing contract, do not instantiate a new one." When it sees `` `damageAmount` ``, it knows: "this is local scope and transient."

This notation is not new; it is already used consistently in mature ISL projects. v1.6.2 formalizes it so it becomes explicit and intentional.

## Examples

### Example 1: Domain Is Structure, Not Behavior

Where do you describe a Hero's stats? In Domain.

```
Role: Domain

- Hero: a character with attributes (HP, attack, defense, abilities).
- BaseStats: fixed numeric values.
- ModifiedStats: derived from BaseStats and active effects.
- ActiveEffect: a temporary modification to stats.
```

Domain defines the structure. It does not say "when a buff is applied, add 2 to attack." That belongs in Business Logic or Effect Lifecycle.

### Example 2: Damage Calculation Uses Domain + Business Logic + Execution Rules

```
Role: Domain

- Damage: a numeric value derived from attack and defense.
- AttackModifier: a numeric bonus from weapons or effects.

Role: Business Logic

- To calculate damage: (Attacker.Attack + weapon bonus) - Defender.Defense.
- Apply modifiers from active effects.
- Clamp result to [0, max damage].

### ⚙ Logic & Execution Rules

#### DamageOrder

- Evaluation order: base attack → weapon bonus → defender defense → modifiers.
- Modifier application: additive first, multiplicative second.
- Clamp: after all calculations, apply max(result, 0).
```

Notice: Domain says what a Damage is. Business Logic says what to do. Execution Rules says order and normalization.

### Example 3: Internal State Makes Ownership Clear

```
### 🗂 Internal State

- `@GameSession` **external**: persistent game state owned by the backend
- `selectedHero` **internal**: which hero is currently selected in the UI
- `canAttack` **calculated** from `@GameSession.activeHero`, active effects, and reachable targets
```

Without qualifiers, ownership is implicit. With them, it is explicit.

### Example 4: Effect Lifecycle Declares the Full Lifecycle

```
### 🔄 Effect Lifecycle

#### Poison Status

- **Apply**: when Poison spell hits a hero
- **Active While**: hero is alive AND poison timer has not expired
- **Expires When**: poison timer reaches zero OR hero is cured by antidote
- **Cleanup**: remove from active status list; restore HP display to normal
```

This makes the entire lifecycle visible.

## Why This Matters

The reason for these changes is determinism. When ISL is ambiguous about roles, state ownership, execution order, and effect lifecycles, different models (and different people) make different assumptions. That leads to inconsistent code generation and rework.

By formalizing these patterns, ISL becomes a clearer contract between authors and generators. The patterns do not force you to use them; they are optional. But when you need them, they give you a way to be precise.

## Conclusion

ISL v1.6.2 does not change the fundamental nature of ISL. It remains Markdown-first and human-readable. What v1.6.2 does is give you explicit language for distinctions that complex systems already need to make.

The five changes—role taxonomy, state qualifiers, execution rules, effect lifecycle, and clarified Flow—address the most common sources of ambiguity in real projects. They are optional, backward-compatible, and designed to reduce the friction between human intent and generated behavior.

For the full specification, see `specs/Intent Specification Language (ISL).md`.
