import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useCoordinateUtils } from '../coordinates';

describe('useCoordinateUtils', () => {
  let toWorldCoordinates;

  /**
   * Helper to create a mock SVGPoint object.
   * Its `matrixTransform` method is a vi.fn() that can be configured.
   * @param {number} initialX - Initial x-coordinate.
   * @param {number} initialY - Initial y-coordinate.
   * @returns {SVGPoint} A mock SVGPoint object.
   */
  const createMockSVGPoint = (initialX = 0, initialY = 0) => {
    const point = {
      x: initialX,
      y: initialY,
      matrixTransform: vi.fn(),
    };
    // Default implementation for matrixTransform, can be overridden per test.
    // By default, it returns a new point with the same coordinates, simulating an identity transform.
    point.matrixTransform.mockImplementation(function() {
      return createMockSVGPoint(this.x, this.y);
    });
    return point;
  };

  /**
   * Helper to create a mock SVGMatrix object.
   * Its `inverse` method is a vi.fn() that can be configured.
   * @param {number} a - Matrix component a.
   * @param {number} b - Matrix component b.
   * @param {number} c - Matrix component c.
   * @param {number} d - Matrix component d.
   * @param {number} e - Matrix component e (translation x).
   * @param {number} f - Matrix component f (translation y).
   * @returns {SVGMatrix} A mock SVGMatrix object.
   */
  const createMockSVGMatrix = (a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) => {
    const matrix = {
      a, b, c, d, e, f,
      inverse: vi.fn(),
    };
    // Default implementation for inverse, can be overridden per test.
    // By default, it returns an identity matrix.
    matrix.inverse.mockImplementation(() => {
      return createMockSVGMatrix(1, 0, 0, 1, 0, 0);
    });
    return matrix;
  };

  /**
   * Helper to create mock SVGSVGElement and SVGGraphicsElement objects
   * along with their internal mock SVGPoint and SVGMatrix instances.
   * @returns {object} An object containing mock SVG elements and their internal mocks.
   */
  const createMockSvgElements = () => {
    const mockSvgPointInstance = createMockSVGPoint();
    const mockSvgElement = {
      createSVGPoint: vi.fn(() => mockSvgPointInstance),
    };

    const mockSvgMatrixInstance = createMockSVGMatrix();
    const mockWorldGroupElement = {
      getScreenCTM: vi.fn(() => mockSvgMatrixInstance),
    };

    return {
      mockSvgElement,
      mockWorldGroupElement,
      mockSvgPointInstance,
      mockSvgMatrixInstance,
    };
  };

  beforeEach(() => {
    // Instantiate the hook to get the `toWorldCoordinates` function.
    // Since `useCallback` has no external dependencies, we can call it directly.
    const { toWorldCoordinates: func } = useCoordinateUtils();
    toWorldCoordinates = func;
  });

  it('should ensure `toWorldCoordinates` function is defined', () => {
    expect(toWorldCoordinates).toBeInstanceOf(Function);
  });

  it('should correctly convert screen coordinates to world coordinates with an identity matrix (no zoom/pan)', () => {
    const { mockSvgElement, mockWorldGroupElement, mockSvgPointInstance } = createMockSvgElements();

    const clientX = 100;
    const clientY = 50;

    // Configure mocks for identity transformation
    mockSvgElement.createSVGPoint.mockReturnValue(mockSvgPointInstance);
    // The component sets p.x and p.y directly on the created point
    mockSvgPointInstance.x = clientX;
    mockSvgPointInstance.y = clientY;

    const identityMatrix = createMockSVGMatrix(1, 0, 0, 1, 0, 0);
    mockWorldGroupElement.getScreenCTM.mockReturnValue(identityMatrix);
    identityMatrix.inverse.mockReturnValue(identityMatrix); // Inverse of identity is identity

    // For an identity transformation, the point should remain unchanged
    mockSvgPointInstance.matrixTransform.mockReturnValue(createMockSVGPoint(clientX, clientY));

    const result = toWorldCoordinates(mockSvgElement, mockWorldGroupElement, clientX, clientY);

    expect(mockSvgElement.createSVGPoint).toHaveBeenCalledTimes(1);
    expect(mockWorldGroupElement.getScreenCTM).toHaveBeenCalledTimes(1);
    expect(identityMatrix.inverse).toHaveBeenCalledTimes(1);
    expect(mockSvgPointInstance.matrixTransform).toHaveBeenCalledWith(identityMatrix); // Should be called with the inverse matrix
    expect(result).toEqual({ x: clientX, y: clientY });
  });

  it('should correctly convert screen coordinates with a translation matrix', () => {
    const { mockSvgElement, mockWorldGroupElement, mockSvgPointInstance } = createMockSvgElements();

    const clientX = 150;
    const clientY = 75;
    const translateX = 50;
    const translateY = 25;

    // If the worldGroupElement is translated by (50, 25), then a point (x,y) in world
    // appears at (x+50, y+25) on screen.
    // So, the screenCTM (world to screen) is a translate(50, 25) matrix.
    const screenCTM = createMockSVGMatrix(1, 0, 0, 1, translateX, translateY);
    // Its inverse (screen to world) is a translate(-50, -25) matrix.
    const inverseCTM = createMockSVGMatrix(1, 0, 0, 1, -translateX, -translateY);

    mockSvgElement.createSVGPoint.mockReturnValue(mockSvgPointInstance);
    mockSvgPointInstance.x = clientX;
    mockSvgPointInstance.y = clientY;

    mockWorldGroupElement.getScreenCTM.mockReturnValue(screenCTM);
    screenCTM.inverse.mockReturnValue(inverseCTM);

    // Expected transformation: (clientX, clientY) * inverseCTM
    // (150, 75) * translate(-50, -25) => (150 - 50, 75 - 25) => (100, 50)
    mockSvgPointInstance.matrixTransform.mockReturnValue(createMockSVGPoint(clientX - translateX, clientY - translateY));

    const result = toWorldCoordinates(mockSvgElement, mockWorldGroupElement, clientX, clientY);

    expect(mockSvgElement.createSVGPoint).toHaveBeenCalledTimes(1);
    expect(mockWorldGroupElement.getScreenCTM).toHaveBeenCalledTimes(1);
    expect(screenCTM.inverse).toHaveBeenCalledTimes(1);
    expect(mockSvgPointInstance.matrixTransform).toHaveBeenCalledWith(inverseCTM);
    expect(result).toEqual({ x: 100, y: 50 });
  });

  it('should correctly convert screen coordinates with a scaling matrix', () => {
    const { mockSvgElement, mockWorldGroupElement, mockSvgPointInstance } = createMockSvgElements();

    const clientX = 200;
    const clientY = 100;
    const scaleFactor = 2;

    // Screen CTM (world to screen) is a scale(2) matrix.
    const screenCTM = createMockSVGMatrix(scaleFactor, 0, 0, scaleFactor, 0, 0);
    // Its inverse (screen to world) is a scale(0.5) matrix.
    const inverseCTM = createMockSVGMatrix(1 / scaleFactor, 0, 0, 1 / scaleFactor, 0, 0);

    mockSvgElement.createSVGPoint.mockReturnValue(mockSvgPointInstance);
    mockSvgPointInstance.x = clientX;
    mockSvgPointInstance.y = clientY;

    mockWorldGroupElement.getScreenCTM.mockReturnValue(screenCTM);
    screenCTM.inverse.mockReturnValue(inverseCTM);

    // Expected transformation: (clientX, clientY) * inverseCTM
    // (200, 100) * scale(0.5) => (200 * 0.5, 100 * 0.5) => (100, 50)
    mockSvgPointInstance.matrixTransform.mockReturnValue(createMockSVGPoint(clientX / scaleFactor, clientY / scaleFactor));

    const result = toWorldCoordinates(mockSvgElement, mockWorldGroupElement, clientX, clientY);

    expect(mockSvgElement.createSVGPoint).toHaveBeenCalledTimes(1);
    expect(mockWorldGroupElement.getScreenCTM).toHaveBeenCalledTimes(1);
    expect(screenCTM.inverse).toHaveBeenCalledTimes(1);
    expect(mockSvgPointInstance.matrixTransform).toHaveBeenCalledWith(inverseCTM);
    expect(result).toEqual({ x: 100, y: 50 });
  });

  it('should correctly convert screen coordinates with combined translation and scaling', () => {
    const { mockSvgElement, mockWorldGroupElement, mockSvgPointInstance } = createMockSvgElements();

    const clientX = 250;
    const clientY = 150;
    const scaleFactor = 2;
    const translateX = 50;
    const translateY = 25;

    // Screen CTM (world to screen) is a scale(2) then translate(50, 25) matrix.
    // In SVGMatrix terms (a,b,c,d,e,f): a=scaleX, d=scaleY, e=translateX, f=translateY
    const screenCTM = createMockSVGMatrix(scaleFactor, 0, 0, scaleFactor, translateX, translateY);

    // Inverse of [S 0 Tx] is [1/S 0 -Tx/S]
    //            [0 S Ty]    [0 1/S -Ty/S]
    //            [0 0 1 ]    [0 0 1    ]
    const inverseCTM = createMockSVGMatrix(
      1 / scaleFactor,
      0,
      0,
      1 / scaleFactor,
      -translateX / scaleFactor,
      -translateY / scaleFactor
    );

    mockSvgElement.createSVGPoint.mockReturnValue(mockSvgPointInstance);
    mockSvgPointInstance.x = clientX;
    mockSvgPointInstance.y = clientY;

    mockWorldGroupElement.getScreenCTM.mockReturnValue(screenCTM);
    screenCTM.inverse.mockReturnValue(inverseCTM);

    // Expected transformation: (clientX, clientY) * inverseCTM
    // x_world = (clientX - Tx) / S = (250 - 50) / 2 = 200 / 2 = 100
    // y_world = (clientY - Ty) / S = (150 - 25) / 2 = 125 / 2 = 62.5
    mockSvgPointInstance.matrixTransform.mockReturnValue(createMockSVGPoint(
      (clientX - translateX) / scaleFactor,
      (clientY - translateY) / scaleFactor
    ));

    const result = toWorldCoordinates(mockSvgElement, mockWorldGroupElement, clientX, clientY);

    expect(mockSvgElement.createSVGPoint).toHaveBeenCalledTimes(1);
    expect(mockWorldGroupElement.getScreenCTM).toHaveBeenCalledTimes(1);
    expect(screenCTM.inverse).toHaveBeenCalledTimes(1);
    expect(mockSvgPointInstance.matrixTransform).toHaveBeenCalledWith(inverseCTM);
    expect(result).toEqual({ x: 100, y: 62.5 });
  });

  it('should handle zero client coordinates correctly with transformations', () => {
    const { mockSvgElement, mockWorldGroupElement, mockSvgPointInstance } = createMockSvgElements();

    const clientX = 0;
    const clientY = 0;
    const translateX = 100;
    const translateY = 50;
    const scaleFactor = 0.5;

    const screenCTM = createMockSVGMatrix(scaleFactor, 0, 0, scaleFactor, translateX, translateY);
    const inverseCTM = createMockSVGMatrix(
      1 / scaleFactor,
      0,
      0,
      1 / scaleFactor,
      -translateX / scaleFactor,
      -translateY / scaleFactor
    );

    mockSvgElement.createSVGPoint.mockReturnValue(mockSvgPointInstance);
    mockSvgPointInstance.x = clientX;
    mockSvgPointInstance.y = clientY;

    mockWorldGroupElement.getScreenCTM.mockReturnValue(screenCTM);
    screenCTM.inverse.mockReturnValue(inverseCTM);

    // Expected transformation: (clientX, clientY) * inverseCTM
    // x_world = (0 - 100) / 0.5 = -100 / 0.5 = -200
    // y_world = (0 - 50) / 0.5 = -50 / 0.5 = -100
    mockSvgPointInstance.matrixTransform.mockReturnValue(createMockSVGPoint(-200, -100));

    const result = toWorldCoordinates(mockSvgElement, mockWorldGroupElement, clientX, clientY);

    expect(result).toEqual({ x: -200, y: -100 });
  });

  it('should handle negative client coordinates (if applicable for relative calculations) with transformations', () => {
    const { mockSvgElement, mockWorldGroupElement, mockSvgPointInstance } = createMockSvgElements();

    const clientX = -10;
    const clientY = -20;
    const translateX = 50;
    const translateY = 30;
    const scaleFactor = 2;

    const screenCTM = createMockSVGMatrix(scaleFactor, 0, 0, scaleFactor, translateX, translateY);
    const inverseCTM = createMockSVGMatrix(
      1 / scaleFactor,
      0,
      0,
      1 / scaleFactor,
      -translateX / scaleFactor,
      -translateY / scaleFactor
    );

    mockSvgElement.createSVGPoint.mockReturnValue(mockSvgPointInstance);
    mockSvgPointInstance.x = clientX;
    mockSvgPointInstance.y = clientY;

    mockWorldGroupElement.getScreenCTM.mockReturnValue(screenCTM);
    screenCTM.inverse.mockReturnValue(inverseCTM);

    // Expected transformation: (clientX, clientY) * inverseCTM
    // x_world = (-10 - 50) / 2 = -60 / 2 = -30
    // y_world = (-20 - 30) / 2 = -50 / 2 = -25
    mockSvgPointInstance.matrixTransform.mockReturnValue(createMockSVGPoint(-30, -25));

    const result = toWorldCoordinates(mockSvgElement, mockWorldGroupElement, clientX, clientY);

    expect(result).toEqual({ x: -30, y: -25 });
  });

  it('should ensure `createSVGPoint` and `getScreenCTM` are called on the correct elements', () => {
    const { mockSvgElement, mockWorldGroupElement, mockSvgPointInstance, mockSvgMatrixInstance } = createMockSvgElements();

    const clientX = 10;
    const clientY = 20;

    // Minimal setup to allow the function to run without errors
    mockSvgElement.createSVGPoint.mockReturnValue(mockSvgPointInstance);
    mockWorldGroupElement.getScreenCTM.mockReturnValue(mockSvgMatrixInstance);
    mockSvgMatrixInstance.inverse.mockReturnValue(mockSvgMatrixInstance); // Inverse can be itself for this check
    mockSvgPointInstance.matrixTransform.mockReturnValue(createMockSVGPoint(0, 0)); // Return any point

    toWorldCoordinates(mockSvgElement, mockWorldGroupElement, clientX, clientY);

    expect(mockSvgElement.createSVGPoint).toHaveBeenCalledTimes(1);
    expect(mockWorldGroupElement.getScreenCTM).toHaveBeenCalledTimes(1);
    // Verify that the point's x and y were set correctly before transformation
    expect(mockSvgPointInstance.x).toBe(clientX);
    expect(mockSvgPointInstance.y).toBe(clientY);
  });

  it('should return precise coordinates for floating-point transformations', () => {
    const { mockSvgElement, mockWorldGroupElement, mockSvgPointInstance } = createMockSvgElements();

    const clientX = 123.45;
    const clientY = 67.89;
    const scaleFactor = 3;
    const translateX = 10.5;
    const translateY = 20.2;

    const screenCTM = createMockSVGMatrix(scaleFactor, 0, 0, scaleFactor, translateX, translateY);
    const inverseCTM = createMockSVGMatrix(
      1 / scaleFactor,
      0,
      0,
      1 / scaleFactor,
      -translateX / scaleFactor,
      -translateY / scaleFactor
    );

    mockSvgElement.createSVGPoint.mockReturnValue(mockSvgPointInstance);
    mockSvgPointInstance.x = clientX;
    mockSvgPointInstance.y = clientY;

    mockWorldGroupElement.getScreenCTM.mockReturnValue(screenCTM);
    screenCTM.inverse.mockReturnValue(inverseCTM);

    const expectedX = (clientX - translateX) / scaleFactor;
    const expectedY = (clientY - translateY) / scaleFactor;

    mockSvgPointInstance.matrixTransform.mockReturnValue(createMockSVGPoint(expectedX, expectedY));

    const result = toWorldCoordinates(mockSvgElement, mockWorldGroupElement, clientX, clientY);

    // Use toBeCloseTo for floating point comparisons to avoid precision issues
    expect(result.x).toBeCloseTo(expectedX);
    expect(result.y).toBeCloseTo(expectedY);
  });
});