# Tutorial: first ISL component

Guided path (about 15–20 minutes) from zero to a **validatable** file with ISL 1.6.x structure. This does not replace reading the [full specification](../specs/Intent%20Specification%20Language%20(ISL).md).

---

## Step 1 — Create the file

Create `hello-feature.isl.md` (any name, extension `.isl.md`).

---

## Step 2 — Project header and body

```markdown
# Project: HelloFeature

**Version**: 1.0.0  
**ISL Version**: 1.6.2  
**Created**: 2026-01-01  

---

## Domain Concepts

### Message

**Identity**: string  
**Properties**:

- text: content shown to the user

---

## Component: GreetingPanel

### Role: Presentation

### ⚡ displayMessage

**Contract**: Display a welcome message received as input.

**Input**:

- message: Message

**Flow**:

1. Render the message text prominently.

🚨 **Constraints**:

- MUST NOT fetch data from APIs or databases.

✅ **Acceptance Criteria**:

- Displayed text matches `message.text`.

🧪 **Test Scenarios**:

1. **Non-empty message**  
   - Input: text = `"Hello"`  
   - Expected: UI shows `"Hello"`.
```

---

## Step 3 — Run the linter

Save the file wherever you prefer (e.g. repo root or under `example/`). From `tools/isl-lint-shell/` (after `npm install`):

```bash
npm run lint -- ../../path/to/your/hello-feature.isl.md
```

Fix errors and warnings until the run is clean (or acceptable without `--strict`).

---

## Step 4 — VS Code extension (optional)

Open the file in VS Code with the ISL extension installed: highlighting and diagnostics should align with the linter.

---

## Next steps

- Add **modular references** (`> **Reference**: …`) and split across files per the spec.
- For codegen to real code, see [Compilation and codegen](./compilation-workflow.md) and a stack under [`example/`](../example/).

---

## See also

- [Getting Started](./getting-started.md)
- [Documentation index](./README.md)
