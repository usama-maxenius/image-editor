 // @ts-nocheck

import { fabric } from 'fabric';
import { ITextboxOptions } from 'fabric/fabric-impl';
import { getExistingObject } from '.';


interface FabricTextBox extends ITextboxOptions {
  customType: string
}

export function createTextBox(canvas: fabric.Canvas | null, options: FabricTextBox): fabric.Textbox | undefined {
  if (!canvas) return
  const defaultOptions: ITextboxOptions = {
    left: 50,
    top: 50,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Fira Sans",
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
  canvas.renderAll();
  return newText;
}

/**
 * Creates a new text object on the canvas with the specified options.
 * @param {fabric.Canvas} canvas - The canvas object on which to create the text.
 * @param {ITextboxOptions} options - The options to configure the text object.
 * @return {fabric.Textbox} - The newly created text object.
 */
export function createSwipeGroup(canvas: fabric.Canvas, options: FabricTextBox, iconSrc?: string): fabric.Textbox | undefined {
  const swipeGroup = canvas.getObjects().find(obj => obj.customType === 'swipeGroup');

  const defaultOptions: ITextboxOptions = {
    text: 'Swipe Left',
    width: 190,
    top: 6,
    // fontSize: 16,
    fill: '#ffffff',
    fontFamily: 'Fira Sans',
    ...options
  };

  const textOptions = { ...defaultOptions, ...options };

  const newText = new fabric.Textbox(options.text || 'Your text here', { ...textOptions });

  newText.customType = 'swipeText'

  if (!iconSrc) {
    canvas.add(newText);
    canvas.renderAll();
  } else {
    fabric.Image.fromURL(iconSrc, function (img) {
      if (!img) {
        console.error("Image failed to load:", iconSrc);
        return;
      }

      img.scale(0.8).set({
        left: 0
      })
      img.customType = 'icon'
      var group = new fabric.Group([newText, img], {
        // selectable: true,
        top: canvas.getHeight() - 60,
        left: 300,
        visible: true,
        originX: 'center'
      });
      group.customType = 'swipeGroup'
      if (swipeGroup) canvas.remove(swipeGroup)
      canvas.add(group);
      canvas.renderAll()

    }, {
      crossOrigin: 'anonymous'
    });
  }
  return newText;
}

export const updateSwipeColor = (canvas: fabric.Canvas, color: string) => {
  const swipeGroup = canvas.getObjects().find(obj => obj.customType === 'swipeGroup');
  if (swipeGroup) {
    swipeGroup.visible = true
    swipeGroup?._objects?.forEach(obj => {
      if (obj.customType === 'swipeText') {
        obj.fill = color
      } else {
        var filter = new fabric.Image.filters.BlendColor({
          color,
          mode: 'tint',
          alpha: 1,
        });
        obj.filters.push(filter);
        obj.applyFilters();
      }
      canvas.renderAll()
    })
  } else console.log('Swipe Group not found')
}

/**
 * Updates the text of a canvas textbox element with the specified options.
 * @param {fabric.Canvas} canvas - The canvas object.
 * @param {fabric.Textbox} textbox - The textbox object to update.
 * @param {ITextboxOptions} options - The options to apply to the textbox.
 * @return {void} This function does not return anything.
 */
export function updateTextBox(canvas: fabric.Canvas | null, options: ITextboxOptions, defaultType?: 'title' | 'hashtag' | 'borders'): void {
  if (!canvas) return

  let textbox: Object | undefined = getExistingObject(canvas, defaultType || 'title')

  const activeObject = canvas?.getActiveObject()
  if (activeObject && activeObject.isType('textbox')) textbox = activeObject

  if (!textbox) {
    console.log('Textbox not founded')
    return
  }
  (textbox as fabric.Textbox).set({
    ...options,
    visible: true
  });
  canvas.requestRenderAll();
}
