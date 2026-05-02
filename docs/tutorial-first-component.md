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

- `message`: text string displayed to the user.

---

## Component: GreetingPanel

A panel that displays a welcome message.

### Role: Presentation

### 🔍 Appearance

- Renders the message text prominently in the center of the panel.

### ⚡ Capabilities

#### displayMessage

**Contract**: Displays the welcome message received as input.

**Trigger**: Component mount or message prop change.

**Side Effects**:

- Renders `message` as visible text in the UI.

### 🚨 Constraints

- MUST NOT fetch data from APIs or databases.

### ✅ Acceptance Criteria

- [ ] Displayed text matches the `message` input.

### 🧪 Test Scenarios

1. **Non-empty message**:
   - Input: `message = "Hello"`
   - Expected: UI shows `"Hello"`.
```

---

## Step 3 — Next: build and generate

Once the file is written, follow [Getting Started](./getting-started.md) steps 2–3 to run the Builder and Generator.

---

## Step 4 — VS Code extension (optional)

Open the file in VS Code with the ISL extension installed: syntax highlighting and real-time validation are active on `.isl.md` files.

---

## Next steps

- Add **modular references** (`> **Reference**: …`) and split across files per the spec.
- For codegen to real code, see [Compilation and codegen](./compilation-workflow.md) and a stack under [`example/`](../example/).

---

## See also

- [Getting Started](./getting-started.md)
- [Documentation index](./README.md)
