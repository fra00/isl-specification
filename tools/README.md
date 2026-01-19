# ISL Tools

This directory contains the official tooling ecosystem for **Intent Specification Language (ISL)**.

## 🛠️ Available Tools

- **[VS Code Extension](./vscode-isl)**: The complete IDE experience with validation, snippets, and compilation.
- **[ISL Compiler](./isl_compiler.py)**: Standalone Python script to resolve ISL references and generate prompts.
- **[ISL Lint](#isl-lint)**: CLI validator for CI/CD pipelines (documented below).

---

# ISL Lint

**ISL Lint** is the official Command Line Interface (CLI) validator for **Intent Specification Language (ISL) v1.6.1**.

It parses `.isl.md` files to ensure they comply with the Canonical Rules, structural requirements, and best practices defined in the ISL specification.

## 🚀 Features

- **Structure Validation**: Ensures correct hierarchy (Project -> Component -> Capability).
- **Canonical Rules Enforcement**: Checks for normative sections (⚡, 🚨, ✅) and required fields.
- **Role Validation**: Verifies separation of concerns (Presentation vs Backend).
- **Domain Integrity**: Checks if referenced types exist in "Domain Concepts".
- **RFC 2119 Compliance**: Ensures constraints use keywords like MUST, SHOULD, MUST NOT.
- **Emoji Check**: Validates the usage of semantic emojis.

## 📦 Installation

Prerequisites: **Node.js** (v18+) and **npm**.

1. Navigate to the tool directory:

   ```bash
   cd tools/isl-lint
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Build the project:
   ```bash
   npm run build
   ```

## 🛠️ Usage

You can run the linter directly using `npm run lint`.

### Basic Validation

```bash
npm run lint -- <path-to-isl-file>
```

**Example:**

```bash
npm run lint -- ../../specs/api-endpoint.isl.md
```

### Options

| Flag       | Description                                                                     |
| :--------- | :------------------------------------------------------------------------------ |
| `--json`   | Outputs the result in JSON format (useful for CI/CD integration).               |
| `--strict` | Treats all **Warnings** as **Errors**, causing the process to exit with code 1. |
| `--help`   | Shows the help message.                                                         |

**Example JSON Output:**

```bash
npm run lint -- ../../specs/api-endpoint.isl.md --json
```

## 📊 Output & Rules

The linter reports three levels of feedback:

1. **❌ Errors**: Violations of **Normative** rules (Canonical Rules). These make the ISL invalid.
2. **⚠️ Warnings**: Violations of **Best Practices** or Recommended fields. The ISL is valid but suboptimal.
3. **ℹ️ Info**: Statistical data about the file.

### Validation Rules Reference

| Code        | Level   | Description                                           |
| :---------- | :------ | :---------------------------------------------------- |
| **ISL-001** | Error   | Missing Project header (`# Project: Name`).           |
| **ISL-002** | Warning | Project header format incorrect.                      |
| **ISL-003** | Warning | Project description too short.                        |
| **ISL-010** | Warning | Missing `## Domain Concepts` section.                 |
| **ISL-011** | Warning | Domain Entity missing `**Identity**`.                 |
| **ISL-012** | Warning | Domain Entity missing `**Properties**`.               |
| **ISL-020** | Error   | No Components defined.                                |
| **ISL-021** | Error   | Component missing `### Role` (Presentation/Backend).  |
| **ISL-022** | Error   | Invalid Role value.                                   |
| **ISL-023** | Warning | Component has no Capabilities defined.                |
| **ISL-024** | Warning | Invalid semantic emoji used.                          |
| **ISL-030** | Error   | Capability missing `**Contract**` (Required).         |
| **ISL-031** | Info    | Capability missing `**Signature**` (Recommended).     |
| **ISL-032** | Warning | Complex Capability (has Flow) missing Test Scenarios. |
| **ISL-033** | Warning | Constraints missing RFC 2119 keywords (MUST, SHOULD). |
| **ISL-034** | Warning | Reference to undefined Domain Entity.                 |
| **ISL-040** | Warning | Semantic emoji used outside of a Component context.   |

## 🤝 Contributing

To add new rules, modify `isl-lint.ts` and add a new check in the `ISLValidator` class.
Ensure you update the `ISL_CONFIG` if the ISL version changes.
