# Compiling a Dungeon: A Real-World ISL Case Study

_Bonus chapter — Engineering Intent Series_

> **Live demo**: [dungeon-demo-isl.netlify.app](https://dungeon-demo-isl.netlify.app/)
> **Source**: `example/dungeon/` in the [ISL repository](https://github.com/fra00/isl-specification)

The first four articles of this series argued, from different angles, that LLM-driven development becomes predictable only when you replace prompts with a compilable specification. That is a strong claim, and a small toy app is not enough to defend it.

So we built something that is _not_ a toy: a Boardgame-style dungeon crawler — turn-based combat, fog of war, monster AI, spells with effect lifecycles, traps, secret passages, a campaign manager, a shop, an in-game editor. Single-page React app, fully generated from ISL.

This article is a frank look at what worked, what hurt, and what we learned by pushing ISL well past the size where prompt-driven workflows fall apart.

---

## The Scope, in Numbers

The `example/dungeon/` stack is intentionally larger than a demo. It is not a tutorial — it is the stress test:

| Artifact                                               | Count       |
| ------------------------------------------------------ | ----------- |
| Top-level ISL specs (`*.isl.md`)                       | **51**      |
| Behavioral specs (`logic-test/*.test.isl.md`)          | **49**      |
| Cross-cutting regression specs (`regression/`)         | **4**       |
| Generated source files in `bin/` (`.js` / `.jsx`)      | **56**      |
| Generated TypeScript interface signatures (`.sign.ts`) | **52**      |
| Approx. generated source size                          | **~330 KB** |

Roles are spread across the spec set: a `domain-*` core (ruleset, session, map, spells data), a thick `dungeon-use-*` business-logic layer implemented as React hooks, a `dungeon-*` presentation layer for the board and the modals, and a thin `main` shell that wires everything together.

Nothing in `bin/` is hand-written. Every change starts in an `.isl.md` file.

### Team and effort

One detail matters before reading any of the productivity numbers below.

- **Team size:** **1 developer**.
- **Commitment:** **part-time**, alongside other work.
- **Calendar duration:** **9 weeks** of elapsed time, not 9 weeks of full-time effort.

This is not a team project. It is a **single-developer, part-time stress test of ISL at scale**. The figures that follow — 73 commits, 51 specs, 56 generated files, a working live demo — were produced under those constraints, not by a dedicated squad on a sprint. Calibrate the rest of the article against that fact: every "we" in this piece is editorial; the actual workforce was one person, when time allowed.

We chose not to publish hour-by-hour effort estimates because we did not measure them rigorously, and a fabricated breakeven point would betray the empirical tone of this report. What we _can_ verify is the calendar-time and commit-count picture below.

---

## Why ISL Earned Its Keep at This Size

There is a size threshold above which an "AI assistant" stops helping and starts producing entropy. Around 30 components, three things break in classic prompt-driven workflows:

1. **Context fragments.** You can no longer paste "the relevant parts of the project" into a chat. Decisions made in one component drift away from the assumptions of another.
2. **Re-generation is destructive.** Any non-trivial fix re-touches code the previous generation got right, often introducing micro-regressions.
3. **The spec ages out.** Documentation, where it exists, is the first thing to fall out of sync with the code.

The dungeon project hits all three. Without ISL, it would have been a slow death by inconsistency. The ISL pipeline addresses each of those failure modes by construction:

- **Context surgery, not text dump.** The Builder produces a `.build.md` for each component that contains the spec _plus the public interfaces of just its dependencies_. A modal's generation prompt does not see the entire game; it sees the few hooks it actually consumes.
- **Real signatures, not aspirational ones.** Each generated component emits a `.sign.ts` describing what it _actually_ exports. Downstream components compile against that file. With 52 of those signatures in `bin/`, integration drift collapses to near zero.
- **The spec _is_ the truth.** Code is a build artifact, signed and read-only. There is no "the doc was right but the code does something else": either the spec is updated, or the rebuild fails.

These mechanisms were described in earlier articles. The interesting question is whether they actually scale — and the dungeon answers yes, but with caveats worth naming out loud.

---

## What 1.6.2 Made Possible (That 1.6.1 Did Not)

Article 4 walked through the v1.6.2 patterns abstractly. The dungeon is where they earned their place.

### Roles save us from "logic in the wrong file"

Before explicit `Role: Domain` / `Role: Business Logic` / `Role: Presentation`, hooks like `dungeon-use-combat` or `dungeon-use-monster-ai` would slowly absorb pieces of UI state — selected enemy, hover targets, "is this modal open" flags — because the generator had no formal reason to push them back to the presentation layer. With explicit roles, the same generation produces clean hooks and components that stop gluing themselves to each other.

### State qualifiers fix React hooks specifically

`dungeon-use-session-manager` is the canonical case. Before v1.6.2, "the session" was sometimes regenerated as local component state, sometimes as context, sometimes as a singleton. Once the spec marks `@GameSession` as **external** and `visibleEnemies` as **calculated**, regeneration becomes deterministic — and `useMemo` shows up exactly where it should.

### Effect Lifecycle is non-negotiable for spells and traps

`dungeon-use-magic`, `dungeon-use-traps` and `dungeon-use-treasure` define dozens of temporary effects: RockSkin, Genie, poison, fear, traps that fire once, treasures that wander a monster. Without an `Apply / Active While / Expires When / Cleanup` block, those effects would be re-derived inconsistently every time. With it, the lifecycle is a contract, and the generator can satisfy it in different idiomatic ways without changing _what_ is true at any tick of the game.

### Logic & Execution Rules vs. Flow

Combat order, modifier application, idempotency of movement — these are normative rules, not procedures. The dungeon makes the distinction explicit: "evaluate base attack → weapon → defense → modifiers; clamp to ≥ 0" lives in **Logic & Execution Rules**, while the **Flow** of `attackTarget` only describes the user-facing sequence. This decoupling is what lets us re-generate combat code dozens of times without the result drifting.

---

## What We Actually Did Differently to Make It Work

A spec language is necessary but not sufficient. A few practices, learned the hard way, mattered just as much.

### 1. Generate behavioral tests as ISL, not as code

The 49 specs under `logic-test/` and the 4 under `regression/` are not unit tests written in JavaScript. They are _ISL_ documents that describe _what should be true_ across components. The auditor consumes them; the test runner does too. The same source describes both expected behavior and verification.

This is the inversion that took the longest to internalize: **the test is also a spec**. When a regression appears, you do not patch the code first; you write or amend a `*.test.isl.md` that fails, and only then re-generate. The fix lives in the truthy artifact.

### 2. Bring the legacy data with its quirks intact

`dungeon-script-runtime.isl.md` is the most "anti-pure" file in the project. It openly says: _preserve the quirks of the original Dungeon script text instead of imposing a stricter modern syntax_. We import existing campaign JSON files (`DGBase01.json`, …) without rewriting them, and the runtime is specified to handle their idiosyncrasies — missing semicolons, line-based statement termination, etc.

The lesson: ISL is not allergic to messy reality. You can _specify_ the leniency. It is not a license to be sloppy; it is a way to be explicit about what compatibility you are buying and at what cost.

### 3. Keep the dependency graph shallow on purpose

We deliberately split `domain-*` files horizontally (`core`, `map`, `ruleset`, `session`, `spells-data`) rather than nesting one inside the other. The reason is operational: the Builder's topological order means a change in a deep root invalidates everything above it. Five flat domain files re-build cheaply; one mega-domain would invalidate the world on every tweak.

This is a build-system instinct, not an OOP one. Treat your spec graph the way you treat a Bazel or Cargo workspace.

### 4. Use `.sign.ts` as the contract, not the spec

Article 3 explained why generators receive real signatures, not idealized ones. In the dungeon this is what kept the React presentation layer honest: `dungeon-board.jsx` does not see what `useDungeonSessionManager` _should_ return — it sees what it _does_ return. When a hook's API drifts (and they did, several times), the presentation layer's regeneration fails immediately, on a missing field, instead of silently producing a runtime crash.

In effect, the `.sign.ts` files act like an internal package boundary inside a monorepo, with the bonus that they are auto-generated from real code.

---

## What Hurt, Honestly

ISL is not a magic wand and the dungeon project surfaced its real costs.

### The first 30% is slower than prompting

The investment is front-loaded. Writing `domain-core` and the first three `dungeon-use-*` hooks in ISL is slower than vibing them out in a chat — visibly slower. Pay-off begins around the 10th component, when re-generation of any one spec costs you minutes instead of an afternoon of re-aligning the rest of the system.

If you ship a prototype next week, ISL is not the right tool. If you intend to maintain it for six months, it pays for itself many times over.

### Effect Lifecycle is easy to under-specify

The first version of the spell system specified `Apply` and `Active While` but glossed over `Cleanup`. Result: subtle leaks where defeated monsters kept their poison status in the session object. The generator was correct against the spec; the spec was wrong. The lesson: **`Cleanup` is the part you are tempted to skip, and it is the part that bites.** The 1.6.2 four-field shape is opinionated for a reason.

### Logic-tests are work, and you must commit to writing them

49 `logic-test` specs is not free. It is a non-trivial slice of the total writing time. The temptation, especially under pressure, is to skip them. The dungeon makes the consequence visible: every regression we shipped traces back to a behavior we never wrote down as an acceptance criterion. The auditor cannot catch what was never specified.

### Generators have an opinion about file size

Past a certain spec size, generation quality drops. Some hooks (`dungeon-use-combat`, `dungeon-use-session-manager`) hit the ceiling and had to be split. There is no formal limit — it is empirical. The good news: splitting is cheap when the rest of the graph is properly typed.

### `bin/` is bigger than necessary

A 330 KB JavaScript footprint for a Dungeon clone is not minimal. The generator favors clarity and idiomatic patterns over byte-counting. We accept it; it is the price of generated code that is reviewable and re-buildable. If you need bundle-size discipline, it must be expressed _in the spec_ (constraints on dependencies, hints toward lighter libraries) — not after the fact.

---

## What This Project Is Not

A few honest disclaimers, because casual readers will look at the live demo and read more into it than they should:

- **It is not "AI built a game from one prompt."** It is a 51-module specification compiled by a deterministic pipeline whose quality is mainly a function of how well the spec is written.
- **It is not bug-free.** Some edge cases (specific monster AI behaviors, certain trap interactions) still misbehave. The point is that fixing them is a spec change followed by a targeted re-generation, not a code archaeology session.
- **It is not the smallest example to start from.** For a first contact with ISL, look at `example/design-pomodoro` or `example/architect-*` — three to seven specs, the same patterns, less overwhelming.
- **It is the _heaviest_ end-to-end reference**, and that is what it is for.

---

## What the Git History Actually Says

Opinions are cheap. The repository is not. The dungeon project carries **73 commits** spread over roughly **nine weeks** (late February to early May 2026), and reading the log is more sobering than any narrative we could write.

### Activity profile

| Month             | Commits |
| ----------------- | ------- |
| 2026-02           | 1       |
| 2026-03           | 8       |
| 2026-04           | 52      |
| 2026-05 (partial) | 12      |

The shape is typical of a project that needed an exploratory phase before it took off: one initial commit in February, a slow month in March (8 commits, mostly experimental), then the productivity inflection in April (52 commits) once the spec graph and the tooling stabilized.

There is a story behind the inflection. The ISL **logic-test generation tooling itself** was committed on 2026-03-29 — _inside the project window_, not before. The first 30 days were spent without an auditor. Once it landed, throughput roughly tripled. The takeaway is uncomfortable but useful: the cost of building the verification loop pays for itself almost immediately, but only if you actually build it.

### The commit type mix

| Type        | Count | Share |
| ----------- | ----- | ----- |
| `feat:`     | 35    | 48%   |
| `refactor:` | 23    | 32%   |
| `fix:`      | 5     | 7%    |
| `chore:`    | 5     | 7%    |
| other       | 5     | 7%    |

Two numbers stand out.

**Only 5 fixes in 73 commits (~7%).** That is _far_ below the typical bug-to-feature ratio of an organically-grown codebase of comparable size. We do not interpret this as "ISL prevents bugs" — it does not. We interpret it as "ISL pushes corrections back into the spec, where they show up as a `feat:` or a `refactor:`, not as a `fix:` of broken code." The fix work is real; it is just classified differently because the unit of change is the specification, not a patch in a `.js` file.

**32% refactor commits.** This is the honest counter-balance. Even with a deterministic pipeline, _restructuring the spec_ remains a constant activity: splitting components that grew too big, lifting state across roles, renaming domain concepts, normalizing flow descriptions. Spec-driven development does not eliminate refactoring — it relocates it. Refactor a `.isl.md` and the next regeneration moves the code with it; that is the shape of the work, not a flaw of the method.

### Where the churn really lives

The five most-modified specs in the project are not the obscure ones — they are the spine:

| Spec                                 | Revisions |
| ------------------------------------ | --------- |
| `dungeon.isl.md`                     | 28        |
| `dungeon-board.isl.md`               | 19        |
| `dungeon-turn-controls.isl.md`       | 18        |
| `dungeon-use-turn-logic.isl.md`      | 17        |
| `dungeon-use-session-manager.isl.md` | 12        |

The pattern: a small group of orchestration specs absorbs most of the iteration, while leaf modules (data, individual modals, isolated rules) are rewritten three or four times at most and then left alone. This is exactly the topology you want — change cost concentrated where you can _see_ it, not scattered across the periphery — but it implies a planning consequence: **invest in the orchestration specs first, and accept they will keep moving.**

The matching test specs follow the same ranking almost line for line:

| Test spec                            | Revisions |
| ------------------------------------ | --------- |
| `dungeon-board.test.isl.md`          | 11        |
| `dungeon.test.isl.md`                | 10        |
| `dungeon-turn-controls.test.isl.md`  | 8         |
| `dungeon-use-treasure.test.isl.md`   | 7         |
| `dungeon-use-turn-logic.test.isl.md` | 7         |

When a spine spec moves, its test moves with it. This co-evolution is one of the strongest signals in the repository that ISL is working as intended — the test is never further than one commit away from the behavior it describes.

### The regression specs tell the truth about us

The four files in `regression/` (`turn-combat`, `loot-inventory`, `map-visibility`, `campaign-state`) all appeared on a **single day**: 2026-05-01. That is not coincidence. It is the day we admitted we had been finding the same families of bugs more than once.

In other words: **regression specs were written reactively, after we shipped the bugs**, not proactively while writing the features. ISL did not prevent the bugs. It made the second occurrence cheap to catch — but it could not invent acceptance criteria we never bothered to write. This is the most useful lesson the history offers: the auditor is exactly as strong as the specs you give it, no more.

### The 1.6.2 migration was a non-event

The project began on ISL **1.6.1** and migrated to **1.6.2** in a single commit on 2026-05-01 (`chore: Update ISL version to 1.6.2 across all documentation and examples`). The diff touches every spec, but the regenerated code remains compatible: 1.6.2 is a vocabulary and discipline upgrade, not a breaking change. Nine weeks of work survived a language version bump unscathed.

For a spec language, that is not a small claim. It is the kind of thing you can only verify _after_ a non-trivial project has lived through it.

---

## Considerations We Took Away

Compressed, opinionated, after living in the dungeon for several iterations:

- **One part-time developer was enough to ship this.** Anything you read below is filtered through that constraint. Scale the conclusions accordingly when projecting them onto a larger team.
- **Specs are the asset, code is the artifact.** Treat the `.isl.md` files as your codebase. The `bin/` is build output, full stop.
- **Behavioral tests want to live in ISL.** A test rewritten as a `.test.isl.md` outlives any specific framework, runtime, or model.
- **Roles are not a comment.** They are a constraint on _what the generator is allowed to produce_. Honor them.
- **Effect Lifecycle has four fields, not three.** `Cleanup` is the one that matters most.
- **Flat graphs beat deep graphs** for incremental rebuilds. Optimize your spec topology like you would optimize a build target.
- **`.sign.ts` is your real contract.** When in doubt, read the signature, not the spec.
- **Front-load the writing.** The work you save later is roughly proportional to the precision you put in the first five specs.
- **Build the auditor early.** The repository's productivity tripled the moment the logic-test tooling landed. There is no reason to delay it — the cost of writing it is recovered in weeks.
- **Refactor is not a smell here, it is the shape of the work.** A third of the commits are spec refactors. That is the price of moving change to the right place.
- **Regression specs are reactive by nature.** Plan for it. They will appear after the second time a bug bites — make sure you actually write them then.

---

## Closing

The dungeon project is, for us, the answer to the only question that matters about ISL: _does it scale?_ We can now point to a live, playable, non-trivial app whose 56 source files were generated, signed, and audited from 51 specs — **built by a single developer working part-time** in 73 commits over nine weeks of calendar time, with a 7% bug rate and a clean migration to ISL 1.6.2 along the way.

If a spec-driven pipeline can deliver an end-to-end React game of this size with one person on a part-time schedule, the interesting question for any larger team is not "can we afford ISL?" — it is "what could we build if we stopped negotiating with the model and started compiling our intent?"

Try the demo: [dungeon-demo-isl.netlify.app](https://dungeon-demo-isl.netlify.app/).
Read the specs: `example/dungeon/` in the [ISL repository](https://github.com/fra00/isl-specification).
Then write your own.

The interesting argument is no longer whether AI can write code. It is whether your team is ready to write the spec it deserves.

---

**Tags:** #ISL #CaseStudy #LLM #AI #DevTools #SpecEngineering #React #OpenSource
