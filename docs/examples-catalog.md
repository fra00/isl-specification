# Examples catalog (`example/`)

The [`example/`](../example/) folder holds **sample ISL projects**, from micro-demos to full stacks. You do not need to explore everything; this page helps you navigate.

---

## Project types (indicative)

| Area / prefix | Description |
|---------------|-------------|
| **`example/dungeon/`** | HeroQuest-style stack: many ISL modules, `logic-test/`, React `bin/`, JSON data—advanced **reference POC**. |
| **`architect-*`** | Product-shaped samples (dashboard, roadmap, space invaders): modularity and Presentation / Logic roles. |
| **`design-*`** | Smaller UI domains (calculator, kanban, expense tracker, …). |
| **`userDefine-*`** | Forms, flowcharts, user-defined orchestrations—good medium-sized starting points. |
| **`keyboard/`** | Compact keyboard-domain example. |
| **`frontend-component.isl.md`** | Single-file sample at `example/` root. |

Exact folder names may change over time; the table is a **conceptual map**.

---

## How to use the examples

1. **Learn ISL**: start from small files (`frontend-component`, `design-calculator`, …) or a single component under `architect-*`.
2. **Study end-to-end codegen**: `example/dungeon/` is the richest and heaviest; follow [Compilation and codegen](./compilation-workflow.md).
3. **Do not blindly copy `bin/`**: check ISL version and stack conventions documented in that sample.

---

## Relation to other repositories

If you publish “ISL-only” or “`bin/`-only” examples in separate repositories, **this** repo remains the home of the **official specification** and **tooling documentation** (`docs/`).

---

## See also

- [Getting Started](./getting-started.md)
- [Documentation index](./README.md)
