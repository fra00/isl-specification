/**
 * @typedef {string} PixelColor
 * @description Represents a color value for a single pixel (e.g., hexadecimal color code like "#RRGGBB").
 */
type PixelColor = string;

/**
 * @typedef {ReturnType<typeof import('./domain').GridCell>[][]} IconGrid
 * @description Represents the entire icon as a 2D array of GridCell objects.
 */
type IconGrid = ReturnType<typeof import('./domain').GridCell>[][];

/**
 * @typedef {typeof import('./domain').IconSize.SIZE_16 | typeof import('./domain').IconSize.SIZE_32 | typeof import('./domain').IconSize.SIZE_64} IconSizeValue
 * @description Represents one of the predefined icon dimensions.
 */
type IconSizeValue = typeof import('./domain').IconSize.SIZE_16 | typeof import('./domain').IconSize.SIZE_32 | typeof import('./domain').IconSize.SIZE_64;

export const IconEditorEngine: (
  initialSize: IconSizeValue,
  initialColor: PixelColor
) => {
  initializeGrid: (size: IconSizeValue) => void;
  setPixel: (x: number, y: number, color: PixelColor) => void;
  getGrid: () => IconGrid;
  getIconSize: () => IconSizeValue;
  resetGrid: () => void;
  getCurrentDrawingColor: () => PixelColor;
  setDrawingColor: (color: PixelColor) => void;
};