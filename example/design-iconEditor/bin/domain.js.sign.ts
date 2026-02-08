/**
 * @typedef {string} PixelColor
 * @description Represents a color value for a single pixel (e.g., hexadecimal color code like "#RRGGBB").
 */
type PixelColor = string;

/**
 * @typedef {ReturnType<typeof GridCell>[][]} IconGrid
 * @description Represents the entire icon as a 2D array of GridCell objects.
 */
type IconGrid = ReturnType<typeof GridCell>[][];

/**
 * @constant {object} IconSize
 * @description Defines the possible dimensions for an icon grid.
 */
export const IconSize: {
  SIZE_16: 16;
  SIZE_32: 32;
  SIZE_64: 64;
};

/**
 * @function GridCell
 * @description Factory function for a single cell (pixel) within the icon grid.
 */
export const GridCell: (data?: {
  x?: number;
  y?: number;
  color?: PixelColor;
}) => {
  x: number;
  y: number;
  color: PixelColor;
};