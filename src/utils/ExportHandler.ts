/**
* Saves the image from a canvas element as a PNG file.
*
* @return {void} This function does not return a value.
*/
export function saveImage(canvas: fabric.Canvas | null): void {

  if (!canvas) return
  const dataUrl = canvas.toDataURL({
    format: "png",
    multiplier: 2,
    quality: 1.0,
  });
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "canvas-export.png";
  link.click();
}

/**
* Saves the JSON representation of the canvas.
*
* @return {void} - Does not return anything.
*/
export const saveJSON = (canvas: fabric.Canvas | null): void => {

  if (!canvas) {
    console.error('Canvas is undefined.');
    return;
  }

  const additionalFieldsToExport = ['customType', 'selectable', 'evented', 'perPixelTargetFind','absolutePositioned']

  var json = JSON.stringify(canvas.toJSON(additionalFieldsToExport));
  // Create a Blob containing the JSON data
  var blob = new Blob([json], { type: 'application/json' });

  // Create a link element
  var link = document.createElement('a');

  // Set the link's attributes
  link.download = 'canvas.json';
  link.href = URL.createObjectURL(blob);

  // Append the link to the document body
  document.body.appendChild(link);

  // // Click the link to trigger the download
  // link.click();

  // // Remove the link from the document
  // document.body.removeChild(link);

  console.log(json);
}