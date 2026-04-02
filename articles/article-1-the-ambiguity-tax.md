# Stop Prompting, Start Compiling: The Path to Predictable AI-Generated Code

_Part 1 of 3 — Engineering Intent Series_

---

If you use LLMs to generate code, you are likely dealing with a "Slot Machine" workflow. You pull the lever with a prompt, get a great result, and then — two days later, on a different model, or with a different colleague — the same request produces something completely different.

Different patterns, different variable names, different bugs. In software engineering, this inconsistency has a name: **The Ambiguity Tax**.

---

## The Root Cause: Conflating Intent with Implementation

The problem isn't that the AI is hallucinating. The problem is that natural language is inherently ambiguous.

Take this common request: _"Implement a user profile page with validation."_

To a human — or an AI — this leaves a dozen critical questions unanswered:

- Is validation client-side, server-side, or both?
- Does "profile" include avatar uploads or just text fields?
- What happens to the UI while the save is in progress?
- Is state managed locally or via a global store?
- What does a validation error look like — inline, toast, modal?

When we leave these decisions to the LLM, we aren't engineering. We're gambling.

---

## Prompting is Not Methodology

The industry is obsessed with "Prompt Engineering." But let's be honest: adding _"you are a world-class developer"_ to your request is a superstition, not a methodology.

If your build process depends on the mood of a probabilistic model, you haven't built a pipeline. **You've built a slot machine.**

The root cause is that we tell the AI _how_ to do things — through examples, tone, role-playing — instead of formally defining _what_ must happen. We're negotiating with a language model when we should be compiling a specification.

---

## The Solution: A Real Compiler for Intent

This is where **ISL (Intent Specification Language)** comes in — and it's important to say upfront: **ISL is not a better prompt. It's a build system.**

Here's what actually happens under the hood:

**1. You write a formal spec**, not a prompt. Each component gets its own `.isl.md` file that defines behavior, constraints, and acceptance criteria — not implementation details.

**2. The Builder resolves your entire project graph.** It scans all your spec files, identifies dependencies, and performs a **topological sort**. Instead of giving "the whole project" to the AI hoping it understands, the Builder provides exactly and only what is needed for that specific piece, in the correct order. It’s **context surgery**, not a generic text dump.

**3. The Compiler generates code — not guesses.** IIt passes each component's precisely scoped context to the LLM, which at this point is functioning as a compiler back-end: mapping a deterministic spec to idiomatic syntax in your target language. React, Vue, Python, Go — same spec, same behavior, different output.

**4. Code is a read-only artifact.** Every generated file is locked with a cryptographic signature. The code is no longer the developer's domain; it's a build artifact. If a dev modifies the code by hand, it breaks the build. This enforces a strict discipline: documentation (ISL) and code are always perfectly aligned. It’s the end of "undocumented legacy code."

**5. The Auditor verifies behavior, not just syntax.** It runs against the generated code and checks that state transitions match the spec — catching logical dead-ends like a loading flag that never resets before a human ever sees the code.

---

## What a Spec Looks Like

Here's the difference between what you give an LLM today and what you give ISL:

**Today:**

```
Implement user authentication with JWT.
```

**With ISL:**

```markdown
#### authenticateUser

**Contract**: Authenticate credentials and return a session token

🚨 Constraints:

- Passwords MUST NOT be stored or compared in plaintext
- Tokens MUST expire after 24 hours
- MUST NOT log passwords in any form
- Response time MUST be < 200ms (p95)

✅ Acceptance Criteria:

- Valid credentials → token returned
- Invalid credentials → authentication error
- Expired token → 401, not 403
```

The LLM doesn't decide what "secure" means. You do. The LLM compiles it.

---

## What's Next

The next two articles go deep on how this works in practice:

- **[Part 2: The IKEA Manual for Software](./article-2-the-isl-solution.md)** — The anatomy of an ISL spec: contracts, constraints, acceptance criteria, and why the distinction between a Constraint and an Implementation Hint changes everything.
- **[Part 3: The Tooling Engine](./article-3-the-tooling-engine.md)** — Builder, Compiler, signatures, and Auditor in detail — with a real end-to-end example.

The spec is open source: [github.com/fra00/isl-specification](https://github.com/fra00/isl-specification)

---

**Tags:** #SoftwareEngineering #LLM #AI #DevTools #OpenSource
