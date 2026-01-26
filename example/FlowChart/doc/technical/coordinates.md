# Technical Reference Manual: CoordinateUtils

## 1. Component Overview

The `CoordinateUtils` component serves as a centralized utility module designed to handle SVG coordinate transformations within the Flow Chart Coordinates project. It encapsulates the core business logic for converting screen-space coordinates to world-space coordinates, crucial for interactive SVG applications involving zooming and panning.

*   **Version**: 1.0.0
*   **ISL Version**: 1.6.1
*   **Implementation**: `./coordinates.js`

### 1.1. Role and Responsibilities

*   **Role**: Business Logic
*   **Responsibilities**:
    *   Provide utilities for converting screen coordinates (e.g., from mouse events) into the coordinate system of a transformed SVG group (world space).
    *   Ensure accurate coordinate transformations, especially under dynamic SVG transformations like zoom and pan.

## 2. Public Capabilities

This section details the public methods and functionalities exposed by the `CoordinateUtils` component, as defined by its ISL contract.

### 2.1. `toWorldCoordinates`

Converts screen coordinates (relative to the viewport, e.g., `clientX`, `clientY` from a mouse event) to World Space coordinates. World Space refers to the coordinate system inside a specific SVG group (`worldGroupElement`) that may be transformed (scaled, translated, rotated).

*   **Description**: Converts screen coordinates (clientX, clientY) to World Space coordinates (inside the zoomed/panned group).
*   **Input**:
    *   `svgElement`: `SVGSVGElement` - The root SVG element, used to create SVG points.
    *   `worldGroupElement`: `SVGGraphicsElement` - The `<g>` element (or any `SVGGraphicsElement`) that is transformed and defines the target world space.
    *   `clientX`: `number` - The X-coordinate in screen space.
    *   `clientY`: `number` - The Y-coordinate in screen space.
*   **Output**:
    *   `{ x: number, y: number }` - An object containing the transformed X and Y coordinates in world space.
*   **Flow**:
    1.  Create an SVG point `p` using `svgElement.createSVGPoint()`.
    2.  Set `p.x = clientX` and `p.y = clientY`.
    3.  Obtain the inverse of the Current Transformation Matrix (CTM) for the `worldGroupElement` using `worldGroupElement.getScreenCTM().inverse()`. Let this be `m`.
    4.  Transform point `p` using the inverse matrix: `p = p.matrixTransform(m)`.
    5.  Return the transformed coordinates `{ x: p.x, y: p.y }`.

## 3. Real Implementation Signature

The actual exported entities from the `./coordinates.js` module are as follows:

```typescript
export const useCoordinateUtils: {
  toWorldCoordinates: (
    svgElement: SVGSVGElement,
    worldGroupElement: SVGGraphicsElement,
    clientX: number,
    clientY: number
  ) => { x: number, y: number };
};
```

*   The `toWorldCoordinates` capability described in the ISL is exported as a method within an object named `useCoordinateUtils`. Developers should import `useCoordinateUtils` and then access `useCoordinateUtils.toWorldCoordinates`.

## 4. Critical Constraints

*   **Precision Requirement**: The component **must** use native `SVGMatrix` and `createSVGPoint` for all coordinate calculations. This constraint is critical to ensure high precision and accuracy, especially when dealing with complex SVG transformations such as zooming and panning, where floating-point inaccuracies can accumulate rapidly.

## 5. Dependencies

The `CoordinateUtils` component has the following dependencies:

*   **Internal API Dependencies**:
    *   `SVGSVGElement`: Required for creating SVG points (`createSVGPoint`).
    *   `SVGGraphicsElement`: Required for retrieving the current transformation matrix (`getScreenCTM`).
    *   `SVGMatrix`: Utilized internally for matrix transformations (`matrixTransform`).

*   **Component Dependencies**:
    *   There are no explicit component-to-component references defined in the ISL. This component is designed as a utility, implying other components will depend on it for coordinate transformation services.