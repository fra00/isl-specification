# ISL Code Generation Protocol

This document defines the mandatory protocol for translating ISL specifications into executable code artifacts. It ensures that file organization and artifact classification remain deterministic without hardcoding filesystem paths in the specification.

## 1. Compilation Unit & Context Preparation

- Each `.isl.md` file is treated as an independent compilation unit.
- **Reference Resolution (Static Semantic Linking)**:
  - Before any generation phase, all ISL References MUST be resolved by **full inclusion** (transclusion).
  - This produces a single, **closed ISL compilation unit**.
  - Referencing a file means importing its full intent into the current scope.
- **Isolation**: The Generator operates exclusively on the resolved unit and MUST NOT assume the existence of external ISL files.
- **Result**: A self-contained prompt where all dependencies are visible and local.
- **Convergence**: If multiple compilation units generate the same artifact (e.g., a Shared Entity), they MUST resolve to the same filesystem path. Overwriting with semantically equivalent content is acceptable.

## 2. Semantic Artifact Classification (MANDATORY)

Every generated artifact MUST be classified by semantic role, inferred from its behavior and usage.

**Allowed semantic categories (non-exhaustive but canonical):**

- **Component**: UI or Backend main unit.
- **Pure Function**: Deterministic, no side effects, no I/O.
- **Helper**: Supporting logic, reusable, non-core, may have side effects.
- **Service**: Business logic, orchestration, state management.
- **Adapter**: Integration boundary (external APIs, DBs).
- **Model / Type**: Data structures, domain models, schemas.

This classification MUST be deterministic and based on intent, not size.
Classification MUST precede ownership resolution.

## 3. Ownership Resolution (CRITICAL RULE)

Every generated artifact MUST be assigned an **Owner** before placement.

**Definition of Owner:**
The semantic authority responsible for the artifact.

**Resolution Rules (in order of precedence):**

1. If the artifact is defined inside a Component → **Owner = that Component**
2. If the artifact exists to support a single Component → **Owner = that Component**
3. If the artifact is tied to a Domain Concept → **Owner = that Domain Concept**
4. If none apply → **Artifact is Shared**

Ownership is **semantic**, not filesystem-based.
Ownership MUST be resolved before filesystem placement.

## 4. File Structure Derivation

Generators MUST NOT hardcode filesystem paths inside ISL logic. Structure MUST be derived as follows:

**Primary Axis: Semantic Category**
Artifacts are grouped first by semantic role (logical grouping):

- `components/`
- `artifacts/`
  - `pure/`
  - `helpers/`
  - `services/`
  - `adapters/`
  - `models/`

**Secondary Axis: Owner (OPTIONAL)**
If an artifact has a resolved Owner, it MUST be placed in a subfolder named after the Owner.

**Example:**

```text
artifacts/pure/
  UserProfileCard/       ← Owner
    computeDisplayName.ts

artifacts/pure/
  (root)                 ← No Owner (Shared)
    computeSlug.ts
```

## 5. Naming Conventions (STRICT)

Generators MUST follow strict naming conventions to enable deterministic tooling.

**Required Naming Signals:**

- `computeX`, `calculateX`, `formatX` → **Pure Functions**
- `useX`, `buildX`, `resolveX` → **Helpers**
- `XService` → **Services**
- `XAdapter` → **Adapters**
- `XModel`, `XType` → **Models**

Naming MUST reflect semantic intent, not implementation detail. If a name is ambiguous, prefer clarity over brevity.
If naming contradicts classification, classification prevails.

## 6. Helper vs Pure Function Rule

**Pure Functions:**

- No side effects
- Deterministic output
- No I/O

**Helpers:**

- Support logic
- MAY orchestrate calls
- MAY depend on context or I/O

This distinction MUST be preserved in generation.

## 7. Generation Boundaries

**You MUST generate:**

- Only what is required by the ISL specification.
- No speculative helpers unless strictly necessary.
- If a helper is required to fulfill a Contract: Generate it, Classify it, Assign an Owner, Name it according to conventions.
- **Implicit Artifacts**: You MAY generate files not explicitly defined in ISL (e.g., internal helpers) ONLY IF they are strictly necessary to satisfy a Contract. These MUST follow all classification and ownership rules.

**You MUST NOT generate:**

- Framework boilerplate (unless explicitly requested).
- Infrastructure code unless explicitly required.
- Visual or business logic outside the component role.

## 8. Visibility & Encapsulation

- Artifacts owned by a Component MUST NOT be publicly exported unless explicitly required by ISL.
- Shared artifacts MAY be public.

## 9. Output Expectations

The generation output MUST clearly indicate:

1. Generated files
2. Semantic category of each artifact
3. Owner (if any)

**Meta-Example:**

```yaml
Generated:
  - path: artifacts/pure/UserProfileCard/computeDisplayName.ts
    type: Pure Function
    owner: UserProfileCard
```

## 10. End-to-End Process Flow (Reference)

To ensure determinism, the generation process MUST follow this two-phase pipeline:

### Phase 1: The Architect (Structure Strategy)

**Goal**: Define _where_ code goes before writing it.

1. **Input**: **Metadata extraction** of all `.isl.md` files (Headers, Roles, Capability names, References ONLY). Content bodies MUST be stripped to reduce context noise.
2. **Analysis**: Identify Components, Capabilities, and required helpers.
3. **Classification**: Assign semantic roles (Component, Pure, Helper...) (Rule 2).
4. **Ownership**: Resolve semantic owner for each artifact (Rule 3).
5. **Mapping**: Generate a virtual filesystem map based on derivation rules (Rule 4).
6. **Output**: A `project-structure.json` manifest.

### Phase 2: The Constructor (Implementation)

**Goal**: Write the code following the map.

1. **Input**: The same **Resolved ISL Unit** from Phase 1 + `project-structure.json` entry.
2. **Context**: Inject resolved paths for imports (no guessing).
3. **Generation**: Write code satisfying the Contract.
4. **Validation**: Verify Naming (Rule 5) and Boundaries (Rule 7).
5. **Output**: Final source code files.

```

```
