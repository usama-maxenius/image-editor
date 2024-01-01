// @ts-nocheck

import { fabric } from 'fabric';
import { ITextboxOptions } from 'fabric/fabric-impl';


interface FabricTextBox extends ITextboxOptions {
  customType: string
}

/**
 * Creates a new text object on the canvas with the specified options.
 * @param {fabric.Canvas} canvas - The canvas object on which to create the text.
 * @param {ITextboxOptions} options - The options to configure the text object.
 * @return {fabric.Textbox} - The newly created text object.
 */
export function createTextBox(canvas: fabric.Canvas | null, options: FabricTextBox): fabric.Textbox | undefined {
  if (!canvas) return

  const defaultOptions: ITextboxOptions = {
    left: 50,
    top: 50,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Pacifico",
    textAlign: 'center',
    fontStyle: 'normal',
    fill: '#000000',
    lineHeight: 1.16,
    strokeWidth: 1,
    text: 'Your text here',
  };

  const textOptions = { ...defaultOptions, ...options };

  const newText = new fabric.Textbox(options.text || 'Your text here', { ...textOptions });
  if (options.customType) newText.customType = options.customType
  canvas.add(newText);
  canvas.setActiveObject(newText);
  canvas.requestRenderAll();

  return newText;
}

/**
 * Updates the text of a canvas textbox element with the specified options.
 * @param {fabric.Canvas} canvas - The canvas object.
 * @param {fabric.Textbox} textbox - The textbox object to update.
 * @param {ITextboxOptions} options - The options to apply to the textbox.
 * @return {void} This function does not return anything.
 */
export function updateTextBox(canvas: fabric.Canvas | null, textbox: fabric.Textbox, options: ITextboxOptions): void {
  if (!canvas) return
  textbox.set({
    ...options
  });

  canvas.requestRenderAll();
}