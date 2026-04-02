# Inside the Machine: The ISL Build Pipeline

_Part 3 of 3 — Engineering Intent Series_

---

In Part 1 we identified the problem. In Part 2 we dissected the spec format. Now we go inside the engine that transforms intent into production code — automatically, verifiably, and repeatably.

This is the **ISL Tooling Engine**. It has two distinct phases: **Build** and **Generate**.

---

## Phase 1: The Builder

Real software is never a single file. A `LoginForm` depends on `UserAuthService`, which depends on `User` domain model, which depends on `AuthStatus` enum. Each of those has its own `.isl.md` spec file.

The **ISL Builder** scans your entire specification folder, identifies all `@Reference` tags, and builds a **Directed Acyclic Graph (DAG)** of your system:

```
AuthStatus (enum)
    └── User (domain model)
            └── UserAuthService (business logic)
                    └── LoginForm (presentation)
```

This graph is not documentation. It's the build order.

### Topological Sort

The Builder performs a **topological sort** on this graph — the same technique used by real compilers, package managers (npm, cargo, gradle), and build systems like Make. The rule is simple: before processing any node, all its dependencies must already be resolved.

To trigger the build phase and resolve the project graph:

```bash
npx ts-node tools/vscode-isl/src/isl-builder.ts example/design-pomodoro
```

For each component, the Builder produces two files:

**`xxx.build.md`** — the full generation context: the original ISL spec of the component, with all the `.ref.md` files of its dependencies inlined. This is the complete, self-contained instruction set for that component.

**`xxx.ref.md`** — the public interface of the component: what it exports, what its capabilities are, what types it exposes. This is what downstream components will receive as context.

Here's what a real `.ref.md` looks like — from an actual ISL project:

```markdown
<!-- INTERFACE (REF) FOR: logic.isl.md -->

# Project: Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1

<!-- IMPLEMENTATION PATH: ./logic -->

> **Reference**: TimerMode, TimerState, TimerConfigEntity in `./domain.isl.md`

## Component: PomodoroEngine

### Role: Business Logic

### ⚡ Capabilities

#### initialize

**Contract**: Sets up the initial state of the timer
**Signature**: Input: None / Output: None

#### startTimer

**Contract**: Initiates the countdown for the current timer mode
**Signature**: Input: None / Output: None

#### selectMode

**Contract**: Changes the active timer mode and resets the timer
**Signature**:

- Input: `mode`: `TimerMode`
- Output: None
```

The Builder also produces the **Build Manifest** — a JSON index of all components in topological order, with their source paths, build paths, and integrity hashes:

```json
[
  {
    "sourceFile": "./pomodoro/domain.isl.md",
    "buildFile": "./pomodoro/build/domain.build.md",
    "implementationPath": "./domain",
    "hash": "753ff32724b2a2501ab95b5241afbd48"
  },
  {
    "sourceFile": "./pomodoro/logic.isl.md",
    "buildFile": "./pomodoro/build/logic.build.md",
    "implementationPath": "./logic",
    "hash": "8b36f3559da223a04d77a5ccba40bfbd"
  },
  {
    "sourceFile": "./pomodoro/ui.isl.md",
    "buildFile": "./pomodoro/build/ui.build.md",
    "implementationPath": "./ui",
    "hash": "91d28e3dc2652d9d0f0590acf7f1583a"
  },
  {
    "sourceFile": "./pomodoro/main.isl.md",
    "buildFile": "./pomodoro/build/main.build.md",
    "implementationPath": "./main",
    "hash": "72145c5ee3d89dac2a7f86f0047cb673"
  }
]
```

Notice the order: `domain` first, then `logic` (which depends on domain), then `ui` (which depends on logic), then `main` last. The topological sort guarantees this. The Generate phase will process them in exactly this sequence.

---

## Phase 2: The Generator

With the Build Manifest ready, the Generator processes each component **in topological order** — because by the time it reaches any component, all its dependencies have already been compiled.

For each component, the Generator receives exactly two inputs:

**1. `xxx.build.md`** — the spec + inlined interfaces of all dependencies.

**2. `dep.sign.ts` for each dependency** — the **actual TypeScript signatures** generated in previous steps. Not the spec. Not the `.ref.md`. The real, generated code signatures.

Here's why this matters. The `.ref.md` describes what a component _should_ expose according to the ISL spec. But the LLM that compiled it may have made idiomatic choices — wrapping a return type, using a language-native pattern, adjusting a signature slightly. The `sign.ts` captures what was _actually generated_:

```typescript
import { TimerMode, TimerState, TimerConfigEntity } from "./domain";

export const PomodoroEngine: (initialConfig?: {
  workDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
}) => {
  initialize: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  selectMode: (mode: (typeof TimerMode)[keyof typeof TimerMode]) => void;
  getCurrentState: () => (typeof TimerState)[keyof typeof TimerState];
  getRemainingTime: () => number;
};
```

When `LoginForm` is compiled, it receives this exact signature — not what the spec said, but what the code _is_. This eliminates integration mismatches structurally. The generated code is guaranteed to compile against the code that actually exists.

To generate the implementation using a specific stack and LLM provider:

```bash
npx ts-node tools/vscode-isl/src/isl-generator.ts example/design-pomodoro --gemini --v=31p --stack=react-js
```

The Generator outputs:

- **`xxx.js`** — the generated implementation
- **`xxx.sign.ts`** — the actual signature of this component, ready for downstream consumers

---

## Phase 3: The Auditor (Verification)

The pipeline doesn't end when the code is written. To ensure the implementation strictly follows the logical state transitions defined in the ISL, we trigger the **Auditor**.

The Auditor is a specialized agent that acts as a **Deterministic Unit Test Runner**. It doesn't just look at the code; it simulates the "Flow" described in the spec against the generated logic. 

Its job is to catch **Logical Dead-ends**:
*   Is an `isLoading` flag set but never reset in a `CATCH` block?
*   Does a state transition skip a mandatory notification?
*   Is a method signature logically sound but practically unreachable?

The audit process happens in two steps: first generating the scenarios, then running the simulation.

```bash
# 1. Create the logical tests from the spec
npx ts-node tools/vscode-isl/src/isl-logic-test.ts example/design-pomodoro --gemini --v=31p

# 2. Run the robotic auditor to verify the implementation
npx ts-node tools/vscode-isl/src/isl-logic-test-run.ts example/design-pomodoro --gemini --v=31p
```

By running this verification automatically, we catch architectural bugs before a human developer even opens a Pull Request.

---

## The Full Pipeline

```
.isl.md files
      │
      ▼
┌─────────────┐
│   BUILDER   │  DAG + topological sort
└─────────────┘
      │
      ├──► xxx.build.md   (ISL + inlined .ref.md of dependencies)
      ├──► xxx.ref.md     (public interface, for downstream specs)
      └──► manifest.json  (ordered build index + hashes)
      │
      ▼
┌─────────────┐
│  GENERATOR  │  processes in topological order
└─────────────┘
      │
      Input per component:
      ├── xxx.build.md
      └── dep.sign.ts  (real signatures of all dependencies)
      │
      Output per component:
      ├──► xxx.js        (generated implementation)
      └──► xxx.sign.ts   (real signature, for downstream generators)
```

Every step is deterministic. Every component is compiled against real, already-generated interfaces. The output is not "what the AI felt like generating today." It's the inevitable result of compiling a precise specification against a verified dependency graph.

---

## Closing the Loop

Across these three articles, we've built the case for a fundamentally different way of working with AI in software development.

Not prompt engineering. **Spec engineering.**

The shift is conceptually simple but practically significant: you stop treating the LLM as a creative collaborator you negotiate with, and start treating it as a compiler you feed precise input. The quality of the output stops depending on how well you phrase your request and starts depending on how well you define your intent.

ISL is the language for that intent. The Tooling Engine is the compiler. The generated code is the artifact. And the spec — always in sync with the code, by construction — is the end of undocumented legacy software.

**The spec is open source — read it, use it, contribute to it:**
[github.com/fra00/isl-specification](https://github.com/fra00/isl-specification)

---

**Tags:** #Compilers #BuildSystems #LLM #AI #DevTools #OpenSource
