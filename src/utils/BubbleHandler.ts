 // @ts-nocheck
import { fabric } from 'fabric'

export const createBubbleElement = (canvas: fabric.Canvas, imgUrl: string, options?: fabric.ICircleOptions) => {

  var clipPath = new fabric.Circle({
    radius: 95,
    left: 350,
    top: 330,
    originX: 'center',
    originY: 'center',
    fill: 'transparent',
    opacity: 1,
    visible: true,
    selectable: true,
    perPixelTargetFind: true,
    absolutePositioned: true,
  });
  clipPath.customType = 'bubbleClipPath'
  var imageElement = document.createElement('img');
  imageElement.src = imgUrl;
  imageElement.crossOrigin = 'anonymous'

  // Add the image to the canvas when needed
  imageElement.onload = function () {
    var fabricImage = new fabric.Image(imageElement);
    fabricImage.customType = 'bubble'
    fabricImage.center()

    fabricImage.clipPath = clipPath;
    fabricImage.set({
      absolutePositioned: false,
      perPixelTargetFind: true,
      originX: 'center',
      originY: 'center',
    })

    var strokeCircle = new fabric.Circle({
      radius: 100,
      left: 350,
      top: 330,
      originX: 'center',
      originY: 'center',
      fill: 'transparent',
      strokeWidth: 10,
      stroke: "red",
      absolutePositioned: true,
      selectable: true,
      ...options
    });
    strokeCircle.customType = 'bubbleStroke'
    console.log(strokeCircle.width)
    // fabricImage.scaleToWidth(strokeCircle.width)
    canvas.add(strokeCircle)
    canvas.add(fabricImage)

    strokeCircle.on('moving', function () {

      fabricImage.set({
        left: strokeCircle.left! - (strokeCircle.width! / 2),
        top: strokeCircle.top! - (strokeCircle.height! / 2),
      }).setCoords();

      clipPath.set({
        left: strokeCircle.left,
        top: strokeCircle.top,
      }).setCoords();
    });

    strokeCircle.on('scaling', function () {
      clipPath.scaleToWidth(strokeCircle.getScaledWidth())
      clipPath.scaleToHeight(strokeCircle.getScaledHeight())
      clipPath.set({
        left: strokeCircle.left,
        top: strokeCircle.top,
        scaleX: strokeCircle.scaleX,
        scaleY: strokeCircle.scaleY,
        radius: strokeCircle.radius! - 5,
      }).setCoords();
    });

    canvas.renderAll()
  };
}

export const createBubble = (canvas: fabric.Canvas, imgUrl: string, options: fabric.Circle) => {
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

    group.customType = 'bubble';
    // Add the group to the canvas
    canvas.add(group);

    // Render the canvas
    canvas.renderAll();
  }, {
    crossOrigin: 'anonymous'
  });
}