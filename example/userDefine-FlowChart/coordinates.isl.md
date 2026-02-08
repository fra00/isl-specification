# Project: Flow Chart Coordinates

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./coordinates.js

---

## Component: CoordinateUtils

Centralized utility module for handling SVG coordinate transformations.
**Constraint**: Must use native `SVGMatrix` and `createSVGPoint` for all calculations to ensure precision under Zoom/Pan.

### Role: Business Logic

### ⚡ Capabilities

#### toWorldCoordinates

**Contract**: Converts screen coordinates (clientX, clientY) to World Space coordinates (inside the zoomed/panned group).
**Signature**:
  - **Input**:
    - svgElement: SVGSVGElement (The root svg, used to create points)
    - worldGroupElement: SVGGraphicsElement (The `<g>` that is transformed)
    - clientX: number
    - clientY: number
  - **Output**:
    - x: number
    - y: number
**Flow**:
1. Create point `p` from `svgElement.createSVGPoint()`.
2. Set `p.x = clientX`, `p.y = clientY`.
3. Get matrix `m = worldGroupElement.getScreenCTM().inverse()`.
4. Transform `p = p.matrixTransform(m)`.
5. Return `{ x: p.x, y: p.y }`.