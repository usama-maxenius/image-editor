// export const createCollage = (images: string[]) => {
//   const canvas = canvasRef.current;

//   if (!canvas) return

//   // const img1 = '/images/sample/scott-bg-imag.jpg';
//   const img1 = images[0] || '/images/sample/toa-heftiba-FV3GConVSss-unsplash.jpg';
//   const img2 = images[1] || '/images/sample/scott-circle-image.png';

//   if (template.diptych === "vertical") {
//     loadImage(img1, 1, { top: 0, customType: 'bg-1' })
//     loadImage(img2, 2, { top: canvas.getHeight() / 2, customType: 'bg-2' });
//     updateRectangle({ width: canvas.getWidth(), top: (canvas.getHeight() / 2 - 5) })
//   } else {
//     loadImage(img1, 1, { left: 0, customType: 'bg-1' })
//     loadImage(img2, 2, { left: canvas.getWidth() / 2, customType: 'bg-2' });
//     updateRectangle({ left: (canvas.getHeight() / 2) - 5 })
//   }
// }

// const createCollage = (images: string[], diptych: Diptych) => {
//   const canvas = canvasRef.current;

//   if (!canvas) return

//   // const img1 = '/images/sample/scott-bg-imag.jpg';
//   const img1 = images[0] || '/images/sample/toa-heftiba-FV3GConVSss-unsplash.jpg';
//   const img2 = images[1] || '/images/sample/scott-circle-image.png';

//   loadImage(img1, 1, { top: 0, customType: 'bg-1' }, 'bg-1')
//   var rect = new fabric.Rect({
//     left: -1,
//     top: (canvas.height / 2),
//     selectable: false,
//     width: canvas.width,
//     stroke: 'red',
//     strokeWidth: 3
//   });
//   loadImage(img2, 2, { top: canvas.height / 2, customType: 'bg-2' }, 'bg-2');
//   canvas.insertAt(rect, 3, false)
// }