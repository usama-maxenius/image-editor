// @ts-nocheck

import { fabric } from 'fabric';
import { createRect } from './RectHandler';

export const createVerticalCollage = (canvas: fabric.Canvas, images: string[]) => {

  const width = canvas.getWidth()
  const height = canvas.getHeight()
  const top = (height / 2);

  var clipPath = new fabric.Rect({ width, height: height / 2, top: 0, left: 0, absolutePositioned: true, evented: false });
  var clipPath2 = new fabric.Rect({ width, height: height / 2, top, left: 0, absolutePositioned: true, evented: false });

  var imageElement = document.createElement('img');
  imageElement.src = images[0];
  imageElement.crossOrigin = 'anonymous'

  // Add the image to the canvas when needed
  imageElement.onload = function () {
    var img = new fabric.Image(imageElement);
    img.clipPath = clipPath;
    img.set({
      centeredScaling: true,
      perPixelTargetFind: true,
    })
    img.scaleToWidth(width)
    if (img.width && img.width > 1080) img.scaleToHeight(height / 2)
    img.customType = 'bg-1'
    canvas.insertAt(img, 0, false);
    canvas.renderAll()
  }


  var imageElement2 = document.createElement('img');
  imageElement2.src = images[1];
  imageElement2.crossOrigin = 'anonymous'

  // Add the image to the canvas when needed
  imageElement2.onload = function () {
    var img2 = new fabric.Image(imageElement2);
    img2.set({
      centeredScaling: true,
      perPixelTargetFind: true,
      top,
      clipPath: clipPath2
    })
    img2.scaleToWidth(width)
    if (img2.width && img2.width > 1080) img2.scaleToHeight(height / 2)
    img2.customType = 'bg-2'
    canvas.insertAt(img2, 1, false);
    canvas.renderAll()
  }

  const rect = createRect(canvas, { top, left: -10, width: width + 10, lockMovementX: true, selectable: true, visible: true, customType: 'photo-border' }, 3) as fabric.Rect

  rect.on('moving', (options) => {
    const rectHeight = rect.top;
    
    clipPath.set({ height: rectHeight, top: 0 }).setCoords();
    clipPath2.set({ height: height - rectHeight!, top: rectHeight }).setCoords();
    canvas.requestRenderAll();
  });

  canvas.renderAll()
};

export const createHorizontalCollage = (canvas: fabric.Canvas, images: string[]) => {

  const width = canvas.getWidth()
  const height = canvas.getHeight()
  const left = (width / 2);

  var clipPath = new fabric.Rect({ width: width / 2, height, left: 0, absolutePositioned: true, evented: false });
  var clipPath2 = new fabric.Rect({ width: width / 2, height, left, absolutePositioned: true, evented: false });

  var imageElement = document.createElement('img');
  imageElement.src = images[0];
  imageElement.crossOrigin = 'anonymous'

  // Add the image to the canvas when needed
  imageElement.onload = function () {
    var img = new fabric.Image(imageElement);
    img.clipPath = clipPath;
    img.set({
      centeredScaling: true,
      perPixelTargetFind: true,
      originX: 'center',
    })
    img.scaleToHeight(height)
    img.customType = 'bg-1'
    canvas.insertAt(img, 0, false);
    canvas.renderAll()
  }

  var imageElement2 = document.createElement('img');
  imageElement2.src = images[1];
  imageElement2.crossOrigin = 'anonymous'

  // Add the image to the canvas when needed
  imageElement2.onload = function () {
    var img2 = new fabric.Image(imageElement2);
    img2.clipPath = clipPath2;
    img2.set({
      centeredScaling: true,
      perPixelTargetFind: true,
      originX: 'center',
      left,
      clipPath: clipPath2
    })
    img2.scaleToHeight(height)
    img2.customType = 'bg-2'
    canvas.insertAt(img2, 1, false);
    canvas.renderAll()
  }

  // setTimeout(() => {
  const rect = createRect(canvas, { left, height: height + 10, top: -10, selectable: true, lockMovementY: true, width: 0, visible: true, customType: 'photo-border' }) as fabric.Rect;

  rect.on('moving', () => {
    const rectLeft = rect.left!;
    clipPath.set({ width: rectLeft, left: 0 }).setCoords();
    clipPath2.set({ width: width - rectLeft, left: rectLeft }).setCoords();
    canvas.requestRenderAll();
  });

  canvas.requestRenderAll();
};

export const updateVerticalCollageImage = (canvas: fabric.Canvas | null, newImage: string, activeObject: fabric.Object) => {
  if (!canvas) return
  const width = canvas.getWidth();
  const height = canvas.getHeight();

  if (activeObject && activeObject.isType('image')) {
    console.log({ activeObject })
    if (activeObject.customType === 'bg-1') {

      var imageElement = document.createElement('img');
      imageElement.src = newImage;
      imageElement.crossOrigin = 'anonymous'

      // Add the image to the canvas when needed
      imageElement.onload = function () {
        var img = new fabric.Image(imageElement);
        img.clipPath = activeObject.clipPath;
        img.set({
          centeredScaling: true,
          perPixelTargetFind: true,
        })

        img.filters = activeObject.filters || []
        img.applyFilters();
        img.scaleToWidth(width)
        if (img.width && img.width > 1080) img.scaleToHeight(height / 2)

        img.customType = activeObject.customType
        canvas.remove(activeObject)
        canvas.insertAt(img, 0, false);
        canvas.renderAll()
      };
    } else {

      var imageElement = document.createElement('img');
      imageElement.src = newImage;
      imageElement.crossOrigin = 'anonymous'

      // Add the image to the canvas when needed
      imageElement.onload = function () {
        var img = new fabric.Image(imageElement);
        img.clipPath = activeObject.clipPath;
        img.set({
          centeredScaling: true,
          top: activeObject.top,
          perPixelTargetFind: true,
        })

        img.filters = activeObject.filters || []
        img.applyFilters();
        img.scaleToWidth(width)
        if (img.width && img.width > 1080) img.scaleToHeight(height / 2)

        img.customType = activeObject.customType
        canvas.remove(activeObject)
        canvas.insertAt(img, 1, false);
        canvas.renderAll()
      }
    }
  };
}

export const updateHorizontalCollageImage = (canvas: fabric.Canvas | null, newImage: string, activeObject: fabric.Object) => {

  if (!canvas) return
  const height = canvas.getHeight();

  if (activeObject && activeObject.isType('image')) {
    if (activeObject.customType === 'bg-1') {
      var imageElement = document.createElement('img');
      imageElement.src = newImage;
      imageElement.crossOrigin = 'anonymous'

      // Add the image to the canvas when needed
      imageElement.onload = function () {
        var img = new fabric.Image(imageElement);
        img.clipPath = activeObject.clipPath;
        img.set({
          perPixelTargetFind: true,
          centeredScaling: true,
          originX: 'center',
        })

        img.scaleToHeight(height)
        img.customType = activeObject.customType
        img.filters = activeObject.filters || []
        img.applyFilters();
        if (img.width && img.width > 1080) img.scaleToHeight(height / 2)

        canvas.remove(activeObject)
        canvas.insertAt(img, 0, false);
        canvas.renderAll()
      }

    } else {

      var imageElement = document.createElement('img');
      imageElement.src = newImage;
      imageElement.crossOrigin = 'anonymous'

      // Add the image to the canvas when needed
      imageElement.onload = function () {
        var img = new fabric.Image(imageElement);
        img.clipPath = activeObject.clipPath;
        img.set({
          evented: true,
          centeredScaling: true,
          perPixelTargetFind: true,
          left: activeObject.left,
          clipPath: activeObject.clipPath,
          originX: 'center',
        })

        img.scaleToHeight(height)
        img.customType = activeObject.customType
        img.filters = activeObject.filters || []
        img.applyFilters();
        canvas.remove(activeObject)
        canvas.insertAt(img, 1, false);
        canvas.renderAll()
      }

    }
  }
  canvas.renderAll()
};