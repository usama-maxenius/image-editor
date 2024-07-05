import { bindBubbleEvents } from './BubbleHandler';

/**
 * Rebinds all events to objects on the canvas.
 *
 * @param {fabric.Canvas} canvas - The canvas to rebind events on.
 * @returns {void}
 */
export const rebindAllEvents = (canvas: fabric.Canvas): void => {
	if (!canvas) {
		return;
	}
	canvas.forEachObject(function (obj: any, index: number) {
		if (obj.customType === 'strokeCircle') {
			const fabricImage = canvas
				.getObjects()
				.find(
					(o: any) =>
						o.customId === obj.customId &&
						o.customType === 'bubble' &&
						index + 1 === canvas.getObjects().indexOf(o)
				);

			bindBubbleEvents(obj, fabricImage as fabric.Image, canvas);
		}
	});
};
