import { fabric } from 'fabric';

interface IRectOptions {
  left?: number;
  selectable?: boolean;
  stroke?: string;
  strokeWidth?: number;
  // Add any other properties as needed
}

/**
 * Creates a rectangle on the canvas with the specified options.
 * @param {fabric.Canvas} canvas - The canvas on which to create the rectangle.
 * @param {IRectOptions} options - The options for the rectangle.
 * @param {number | undefined} index - The index at which to insert the rectangle (optional).
 * @return {fabric.Rect | undefined} The created rectangle.
 */
export const createRect = (canvas: fabric.Canvas, options: IRectOptions, index?: number | undefined): fabric.Rect | false => {
  if (!canvas) return false;

  const defaultOptions: IRectOptions = {
    left: canvas.getWidth() / 2,
    selectable: false,
    stroke: 'red',
    strokeWidth: 3,
    ...options,
  };

  const rect = new fabric.Rect(defaultOptions);

  if (index) {
    canvas.insertAt(rect, index, false);
  } else {
    canvas.add(rect);
  }

  canvas.renderAll(); // Render the canvas after adding the new rectangle

  return rect;
};

/**
 * Updates a rectangle object with the provided options.
 * @param {fabric.Rect} rect - The rectangle object to be updated.
 * @param {IRectOptions} options - The options to update the rectangle with.
 */
export const updateRect = (rect: fabric.Rect, options: IRectOptions) => {
  if (rect) {
    rect.set(options);
    rect.canvas?.renderAll(); // Render the canvas after updating the rectangle
  }
};
