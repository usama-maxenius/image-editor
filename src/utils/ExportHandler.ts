/**
 * Saves the image from a canvas element as a PNG file.
 *
 * @return {void} This function does not return a value.
 */
export function saveImage(canvas: fabric.Canvas | null): void {
	if (!canvas) {
		console.error('Canvas is null.');
		return;
	}
	// if (!canvas) return;
	const dataUrl = canvas.toDataURL({
		format: 'jpeg',
		multiplier: 2,
		quality: 1.0,
	});

	const link = document?.createElement('a');
	link.href = dataUrl;
	link.download = 'canvas-export.jpeg';
	link.click();
	// console.log('Canvas is .', canvas);
}

/**
 * Saves the JSON representation of the canvas.
 *
 * @return {void} - Does not return anything.
 */
export const saveJSON = (
	canvas: fabric.Canvas | null,
	newTemplate?: boolean
): string | void => {
	if (!canvas) {
		console.error('Canvas is undefined.');
		return;
	}

	const additionalFieldsToExport = [
		'customType',
		'selectable',
		'evented',
		'perPixelTargetFind',
		'absolutePositioned',
	];

	var json = JSON?.stringify(canvas?.toJSON(additionalFieldsToExport));
	// Create a Blob containing the JSON data
	var blob = new Blob([json], { type: 'application/json' });

	// Create a link element
	var link = document.createElement('a');

	// Set the link's attributes
	link.download = 'canvas.json';
	link.href = URL?.createObjectURL(blob);

	// Append the link to the document body
	document?.body?.appendChild(link);

	// // Click the link to trigger the download
	// link.click();

	// // Remove the link from the document
	// document.body.removeChild(link);

	if (newTemplate) {
		return json;
	}
	// if (newTemplate) {
	//   return json;
	// } else {
	//   // Click the link to trigger the download
	//   link.click();

	//   // Remove the link from the document
	//   document.body.removeChild(link);
	// }
};

export function hexToRgbA(hex: string) {
	var c;
	if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
		c = hex.substring(1).split('');
		if (c.length === 3) {
			c = [c[0] + c[1], c[0] + c[1], c[2] + c[2]];
		} else {
			c = [c[0] + c[1], c[2] + c[3], c[4] + c[5]];
		}
		c = '0x' + c.join('');
		return (
			'rgba(' +
			[(Number(c) >> 16) & 255, (Number(c) >> 8) & 255, Number(c) & 255].join(
				','
			) +
			', 1)'
		);
	}
	throw new Error('Bad Hex');
}
