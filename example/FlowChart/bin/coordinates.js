import { useCallback } from 'react';

/**
 * @typedef {object} WorldCoordinates
 * @property {number} x - The x-coordinate in world space.
 * @property {number} y - The y-coordinate in world space.
 */

/**
 * Centralized utility hook for handling SVG coordinate transformations.
 * This hook provides a function to convert screen coordinates to world space coordinates
 * within a transformed SVG group, ensuring precision under zoom and pan operations.
 *
 * @returns {{toWorldCoordinates: (svgElement: SVGSVGElement, worldGroupElement: SVGGraphicsElement, clientX: number, clientY: number) => WorldCoordinates}}
 *   An object containing the `toWorldCoordinates` function.
 */
export const useCoordinateUtils = () => {
  /**
   * Converts screen coordinates (clientX, clientY) to World Space coordinates
   * (inside the zoomed/panned group).
   *
   * This function leverages native SVGMatrix and createSVGPoint for accurate
   * transformations, respecting any zoom or pan applied to the `worldGroupElement`.
   *
   * @param {SVGSVGElement} svgElement - The root SVG element, used to create SVGPoint objects.
   * @param {SVGGraphicsElement} worldGroupElement - The SVG `<g>` element (or any SVGGraphicsElement)
   *   that represents the transformed "world" space (e.g., the group that is zoomed/panned).
   * @param {number} clientX - The x-coordinate from the client event (e.g., `MouseEvent.clientX`).
   * @param {number} clientY - The y-coordinate from the client event (e.g., `MouseEvent.clientY`).
   * @returns {WorldCoordinates} An object containing the `x` and `y` coordinates in world space.
   */
  const toWorldCoordinates = useCallback(
    (svgElement, worldGroupElement, clientX, clientY) => {
      // 1. Create point p from svgElement.createSVGPoint().
      const p = svgElement.createSVGPoint();

      // 2. Set p.x = clientX, p.y = clientY.
      p.x = clientX;
      p.y = clientY;

      // 3. Get matrix m = worldGroupElement.getScreenCTM().inverse().
      // getScreenCTM() returns the transformation matrix from the user coordinate system
      // of the SVG element to the screen coordinate system.
      // To convert from screen to user coordinates, we need the inverse of this matrix.
      const m = worldGroupElement.getScreenCTM().inverse();

      // 4. Transform p = p.matrixTransform(m).
      // Apply the inverse transformation matrix to the screen point to get world coordinates.
      const transformedP = p.matrixTransform(m);

      // 5. Return { x: p.x, y: p.y }.
      return { x: transformedP.x, y: transformedP.y };
    },
    [] // Dependencies for useCallback. This function is pure and its logic does not depend
       // on any external state or props from the hook's scope that would change over time.
       // All necessary data (svgElement, worldGroupElement, clientX, clientY) are passed as arguments.
  );

  return {
    toWorldCoordinates,
  };
};