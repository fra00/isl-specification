import { useCallback } from 'react';

/**
 * @typedef {object} WorldCoordinates
 * @property {number} x - The x-coordinate in world space.
 * @property {number} y - The y-coordinate in world space.
 */

/**
 * Centralized utility module for handling SVG coordinate transformations.
 * This hook provides functions to convert screen coordinates to world space coordinates
 * within an SVG context, respecting zoom and pan transformations.
 *
 * @returns {object} An object containing utility functions for SVG coordinate transformations.
 * @returns {function(SVGSVGElement, SVGGraphicsElement, number, number): WorldCoordinates} .toWorldCoordinates - Converts screen coordinates to world space coordinates.
 */
export const useCoordinateUtils = () => {

  /**
   * Converts screen coordinates (clientX, clientY) to World Space coordinates
   * (inside the zoomed/panned group).
   *
   * @param {SVGSVGElement} svgElement - The root SVG element, used to create points.
   * @param {SVGGraphicsElement} worldGroupElement - The `<g>` element that is transformed (e.g., for zoom/pan).
   * @param {number} clientX - The x-coordinate relative to the viewport.
   * @param {number} clientY - The y-coordinate relative to the viewport.
   * @returns {WorldCoordinates} An object containing the x and y coordinates in world space.
   */
  const toWorldCoordinates = useCallback(
    (svgElement, worldGroupElement, clientX, clientY) => {
      // 1. Create point `p` from `svgElement.createSVGPoint()`.
      const p = svgElement.createSVGPoint();

      // 2. Set `p.x = clientX`, `p.y = clientY`.
      p.x = clientX;
      p.y = clientY;

      // 3. Get matrix `m = worldGroupElement.getScreenCTM().inverse()`.
      // getScreenCTM() returns the transformation matrix from the user coordinate system
      // of the current element to the screen coordinate system.
      // We need its inverse to go from screen to the element's user coordinate system.
      const m = worldGroupElement.getScreenCTM().inverse();

      // 4. Transform `p = p.matrixTransform(m)`.
      const transformedP = p.matrixTransform(m);

      // 5. Return `{ x: p.x, y: p.y }`.
      return { x: transformedP.x, y: transformedP.y };
    },
    [] // Dependencies for useCallback. This function only depends on its arguments, not external state.
  );

  return {
    toWorldCoordinates,
  };
};