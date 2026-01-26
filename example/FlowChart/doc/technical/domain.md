This document provides a technical reference for the `DomainTypes` component, based on its ISL specifications and observed real implementation.

---

# Component: DomainTypes

## 1. Role and Responsibilities

The `DomainTypes` component serves as the foundational layer for defining the core domain concepts within the Flow Chart application. Its primary role is to centralize and export the type definitions and constants related to the application's key entities.

**Role**: Backend (as per ISL)

**Responsibilities**:
*   To define and make available the structural types and enumerations for `TOOL`, `Nodo` (Node), and `Connessione` (Connection).
*   To ensure consistency in how these domain concepts are referenced and utilized across other components.
*   To act as a single source of truth for domain-specific constants, facilitating easier maintenance and evolution of the application's data model.

## 2. Public Capabilities

This component primarily exports constants and type definitions that describe the Flow Chart domain. It does not expose executable methods but rather data structures and enumerations.

### 2.1. Real Implementation Details

Based on the provided `Real Implementation Signature`, the component exports the following:

*   **`NODE_TYPES`**: An object constant representing the available types for `Nodo` (Node) entities. This likely corresponds to the `type` property of a `Nodo` as defined in the ISL (e.g., `action`, `condition`).

    ```javascript
    // Example (conceptual, based on signature)
    export const NODE_TYPES = {
      ACTION: 'action',
      CONDITION: 'condition',
      // ... other node types
    };
    ```

## 3. Critical Constraints

The following critical constraint is defined in the ISL for `DomainTypes`:

*   **Export Requirement**: The component **must** export constants or JSDoc definitions for `TOOL`, `Nodo`, and `Connessione`. This ensures that other components can reliably import and utilize these core domain concepts.

## 4. Dependencies

While the ISL does not explicitly list `References` to other components for `DomainTypes`, this component establishes implicit dependencies.

*   **Dependent Components**: Any component that interacts with or manipulates Flow Chart elements (such as `TOOL`s, `Nodo`s, or `Connessione`s) will implicitly depend on `DomainTypes` for its fundamental definitions and constants. This includes UI components for rendering, backend services for data persistence, and business logic modules for processing flow chart operations.