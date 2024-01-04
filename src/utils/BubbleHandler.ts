 // @ts-nocheck
import { fabric } from 'fabric'


export const createBubbleElement = (canvas: fabric.Canvas, imgUrl: string) => {

  var clipPath = new fabric.Rect({ width: 300, height: 300, top: 30, left: 30, rx: 100, ry: 100, absolutePositioned: false, evented: true, selectable: true,perPixelTargetFind: true });

  fabric.Image.fromURL(imgUrl, function (img) {
    img.clipPath = clipPath;
    img.set({
      centeredScaling: true,
      perPixelTargetFind: true,
    })
    img.customType = 'overlay'
    canvas.add(img);
  }, {
    crossOrigin: 'anonymous'
  });

}

export const createBubble = (canvas: fabric.Canvas, imgUrl: string, options: fabric.Circle) => {
  fabric.Image.fromURL(imgUrl, function (img: fabric.Image) {
    // Set the maximum radius for the circular clip mask
    var maxRadius = 80;
    let scale = +Math.min(270 / img.width, 270 / img.height).toFixed(2)

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
      originY: 'center',
      fill: 'transparent',
      strokeWidth: 10, // Set border width
      stroke: "#fff", // Set border color
    });

    // Group the image and the clip mask
    var group = new fabric.Group([img, clipMask], {
      clipPath: clipMask,
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