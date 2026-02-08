# Project: Flow Chart Domain

Definizioni del dominio per l'applicazione Flow Chart.

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-01-23
**Implementation**: ./domain.js

---

## Domain Concepts

### TOOL

E' l'elenco dei componenti del flow chart che si possono utilizzare (es. Azione, Condizione).

### Nodo

Un TOOL trascinato nel main content diventa un nodo.
**Identity**: nodeId
**Properties**:

- type: enum (action, condition)
- x: number
- y: number
- label: string

### Connessione

E' la relazione tra un nodo ed un altro.
**Identity**: connectionId
**Properties**:

- sourceNodeId: string
- targetNodeId: string
- label: string

---

## Component: DomainTypes

Implementazione dei tipi di dominio.
**Constraint**: Deve esportare costanti o definizioni JSDoc per TOOL, Nodo, Connessione.

### Role: Backend
