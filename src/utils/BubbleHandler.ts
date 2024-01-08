//  // @ts-nocheck
import { fabric } from 'fabric'
import { getExistingObject } from '.';

fabric.Object.prototype.noScaleCache = false;

export const createBubbleElement = (canvas: fabric.Canvas, imgUrl: string, options?: fabric.ICircleOptions) => {

  var strokeCircle = new fabric.Circle({
    radius: 100,
    left: 350,
    top: 330,
    originX: 'center',
    originY: 'center',
    fill: 'transparent',
    strokeWidth: 10,
    stroke: "#ffffff",
    strokeUniform: false,
    selectable: true,
    ...options
  });

  var clipPath = new fabric.Circle({
    radius: 99,
    left: strokeCircle.left,
    top: strokeCircle.top,
    originX: 'center',
    originY: 'center',
    fill: 'transparent',
    opacity: 1,
    visible: true,
    selectable: true,
    strokeUniform: true,
    perPixelTargetFind: true,
    absolutePositioned: true,
  });

  (clipPath as any).customType = 'bubbleClipPath'
  var imageElement = document.createElement('img');
  imageElement.src = imgUrl;
  imageElement.crossOrigin = 'anonymous'

  // Add the image to the canvas when needed
  imageElement.onload = function () {
    var fabricImage = new fabric.Image(imageElement);
    (fabricImage as any).customType = 'bubble'

    fabricImage.clipPath = clipPath;

    var circleCenter = strokeCircle.getCenterPoint();

    fabricImage.set({
      absolutePositioned: false,
      perPixelTargetFind: true,
      scaleX: 0.3,
      scaleY: 0.3,
      left: circleCenter.x - fabricImage.width! * 0.3 / 2,
      top: circleCenter.y - fabricImage.height! * 0.3 / 2,
    }).setCoords();

    (strokeCircle as any).customType = 'bubbleStroke'
    canvas.insertAt(strokeCircle, 4, false)
    canvas.insertAt(fabricImage, 5, false)
    // canvas.add(strokeCircle)
    // canvas.add(fabricImage)

    strokeCircle.on('moving', function () {

      var circleCenter = strokeCircle.getCenterPoint();
      var imageCenter = fabricImage.getCenterPoint();

      var offsetX = circleCenter.x - imageCenter.x;
      var offsetY = circleCenter.y - imageCenter.y;

      fabricImage.set({
        left: fabricImage.left! + offsetX,
        top: fabricImage.top! + offsetY,
      }).setCoords();


      clipPath.set({
        left: strokeCircle.left,
        top: strokeCircle.top,
      }).setCoords();
    });

    strokeCircle.on('scaling', function () {
      // const newRadius = strokeCircle.getScaledWidth() / 2;

      clipPath.scaleToWidth(strokeCircle.getScaledWidth())
      clipPath.scaleToHeight(strokeCircle.getScaledHeight())
      clipPath.set({
        left: strokeCircle.left,
        top: strokeCircle.top,
        scaleX: strokeCircle.scaleX,
        scaleY: strokeCircle.scaleY,
        radius: strokeCircle.radius!,
      }).setCoords();
    });

    canvas.renderAll()
  };
}

export const updateBubbleElement = (canvas: fabric.Canvas,
  strokeCircle: fabric.Circle,
  options?: fabric.ICircleOptions
) => {

  const imageClipPath = getExistingObject(canvas, 'bubble')?.clipPath as fabric.Circle
  // Update strokeCircle properties
  if (options) {
    if (options.strokeWidth !== undefined) {
      const strokeWidth = options.strokeWidth;
      // const clipPath = strokeCircle.clipPath as fabric.Circle;

      // Update the clipPath radius to maintain the desired stroke outside the circle
      imageClipPath.radius = strokeCircle.radius! - strokeWidth / 2;
      imageClipPath.setCoords();
    }

    strokeCircle.set({
      ...options,
      strokeUniform: true,
      // radius: strokeCircleRadius - (options.strokeWidth / 2)
    });
  }

  strokeCircle.dirty = true
  // Render all changes
  canvas?.renderAll();
  strokeCircle.dirty = false
};


export const createBubble = (canvas: fabric.Canvas, imgUrl: string) => {
  fabric.Image.fromURL(imgUrl, function (img: fabric.Image) {
    // Set the maximum radius for the circular clip mask
    var maxRadius = 80;
    let scale = +Math.min(270 / img.width!, 270 / img.height!).toFixed(2)

    img.scale(scale).set({
      angle: 0,
      originX: 'center',
      originY: 'center'
    });
    img.center()

    // Create a circular clip mask
    var clipMask = new fabric.Circle({
      radius: maxRadius,
      originX: 'center',
      // left:300,
      // top:300,
      originY: 'center',
      fill: 'transparent',
      absolutePositioned: true,
      strokeWidth: 10, // Set border width
      stroke: "#fff", // Set border color
    });
    // Group the image and the clip mask
    var group = new fabric.Group([img, clipMask], {
      clipPath: clipMask,
      // absolutePositioned: true,
    });

    (group as any).customType = 'bubble';
    // Add the group to the canvas
    canvas.add(group);

    // Render the canvas
    canvas.renderAll();
  }, {
    crossOrigin: 'anonymous'
  });
}