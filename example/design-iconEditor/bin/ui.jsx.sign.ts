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

export default function DrawingCanvas(props: {
  grid?: IconGrid;
  cellSize?: number;
  onPixelClick?: (x: number, y: number) => void;
}): React.Element;

export function IconPreview(props: {
  grid?: IconGrid;
  previewSize?: number;
}): React.Element;

export function SizeSelector(props: {
  currentSize?: IconSizeValue;
  onSizeChange?: (newSize: IconSizeValue) => void;
}): React.Element;

export function ColorPicker(props: {
  currentColor?: PixelColor;
  onColorChange?: (newColor: PixelColor) => void;
}): React.Element;

export function Toolbar(props: {
  onClear?: () => void;
}): React.Element;