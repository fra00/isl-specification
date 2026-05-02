# ISL for VS Code

Official VS Code support for **Intent Specification Language (ISL) v1.6.2**.

This extension provides language support, snippets, validation, and tooling to write deterministic, intent-first specifications for LLM code generation.

> **ISL is a language, not a template.**
> Writing ISL-compliant documents requires understanding its canonical rules and grammar.

## Installation

All features below require the extension to be built and installed first.

### Build & Install (.vsix)

```bash
# 1. Install the packaging tool (once)
npm install -g @vscode/vsce

# 2. Build (from this folder)
npm install
npx vsce package        # produces isl-support-x.x.x.vsix

# 3. Install in VS Code
#    Extensions panel → ⋯ → Install from VSIX… → select the .vsix file
```

### From Source (Development mode)

1. Open this folder in VS Code.
2. Run `npm install`.
3. Press `F5` to launch the **Extension Development Host**.

---

## Features

> All features require the extension to be installed (see above).

### 🎨 Syntax Highlighting

Full syntax highlighting for `.isl.md` files, including:

- Semantic Emojis (⚡, 🚨, ✅, 🧪, etc.)
- RFC 2119 Keywords (MUST, SHOULD, MAY)
- ISL Structure (Project, Component, Domain Concepts)

### 🧩 Snippets

Type the prefix in any `.isl.md` file and press `Tab` or `Enter` to expand.

| Prefix           | Description                                                          |
| :--------------- | :------------------------------------------------------------------- |
| `isl-base`       | **Full Template**: Generates a complete ISL file structure (v1.6.2). |
| `isl-project`    | **Project Header**: Standard header with versioning.                 |
| `isl-component`  | **Component**: New Component block with Role.                        |
| `isl-cap`        | **Capability**: Capability block with Contract.                      |
| `isl-constraint` | **Constraint**: Normative block for rules.                           |
| `isl-test`       | **Test Scenarios**: Template for test cases.                         |
| `isl-ref`        | **Reference**: Syntax for importing shared domains.                  |
| `isl-rules`      | **Canonical Rules**: Inserts ISL rules summary.                      |
| `isl-appearance` | **Appearance**: UI visual properties section.                        |
| `isl-interface`  | **Interface**: API/Interface definition section.                     |
| `isl-security`   | **Security**: Security considerations section.                       |

### ✅ Real-time Validation (Linting)

The extension validates your specification as you type:

- **Structure**: Checks for Project Header, Domain Concepts, and Components.
- **Completeness**: Ensures Components have a `Role` and Capabilities have a `Contract`.
- **Semantics**: Validates correct usage of Section Emojis.
- **Normative Language**: Warns if Constraints lack RFC 2119 keywords.
- **Integrity**: Checks for references to undefined Domain Entities.

### 💡 Quick Fixes (Code Actions)

Automatically fix common errors:

- Add missing `Role` to Component.
- Add missing `Contract` to Capability.

### 📦 Modular Compilation

Merge multiple ISL files into a single prompt for LLMs.

1. Use `> **Reference**: ... in ./file.isl.md` to link files.
2. Run **ISL: Compile to Prompt** from the Command Palette (`Ctrl+Shift+P`).
3. A new document is opened with all references resolved inline.

### 🧙 Interactive Wizards

- **ISL: Create New Component** (`Ctrl+Shift+P`): Prompts for name and role, inserts a scaffold.
- **ISL: Create New Capability** (`Ctrl+Shift+P`): Prompts for name, inserts a capability block.

## Extension Settings

- `isl.validation.enabled`: Enable/disable real-time validation (default: `true`).
- `isl.validation.onSave`: Validate on file save (default: `true`).
- `isl.validation.strictMode`: Treat warnings as errors (default: `false`).

## Usage

1. Create a file with the extension `.isl.md` (e.g., `my-component.isl.md`).
2. Type `isl-base` and press `Tab` to generate the full file structure.
3. Use the Command Palette (`Ctrl+Shift+P`) to access ISL commands.

📘 **Full Specification**: [`Intent Specification Language (ISL)`](../../specs/)
