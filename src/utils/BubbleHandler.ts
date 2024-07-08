// @ts-nocheck
import { fabric } from 'fabric';
import { scaleToFit } from './ImageHandler';

fabric.Object.prototype.noScaleCache = false;
interface BubbleObject {
	left: number;
	top: number;
}

export const createBubble = (canvas: fabric.Canvas, imgUrl: string) => {
	const left = canvas.getWidth() / 2; //centerX
	const top = canvas.getHeight() / 2; //centerY

	var strokeCircle = new fabric.Circle({
		radius: 100,
		left,
		top,
		originX: 'center',
		originY: 'center',
		fill: 'transparent',
		strokeWidth: 10,
		stroke: '#ffffff',
		strokeUniform: false,
		selectable: true,
	});
	(strokeCircle as any).customType = 'strokeCircle';
	(strokeCircle as any).customId = new Date().getTime();

	var clipPath = new fabric.Circle({
		radius: strokeCircle.radius!,
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

	(clipPath as any).customType = 'bubbleClipPath';

	var imageElement = document.createElement('img');
	imageElement.src = imgUrl;
	imageElement.crossOrigin = 'anonymous';

	imageElement.onload = function () {
		var fabricImage = new fabric.Image(imageElement);
		(fabricImage as any).customType = 'bubble';
		(fabricImage as any).customId = new Date().getTime();

		fabricImage.clipPath = clipPath;

		var circleCenter = strokeCircle.getCenterPoint();
		const circleRadius = strokeCircle.radius!;
		const scaleFactor = Math.max(
			(circleRadius * 2) / fabricImage.width!,
			(circleRadius * 2) / fabricImage.height!
		);

		const imgFitWidth = strokeCircle.width! + 50;
		const imgFitHeight = strokeCircle.height! + 50;

		scaleToFit(fabricImage, { width: imgFitWidth, height: imgFitHeight });

		fabricImage
			.set({
				absolutePositioned: false,
				perPixelTargetFind: true,
				left: circleCenter.x - (fabricImage.width! * scaleFactor) / 2 - 30,
				top: circleCenter.y - (fabricImage.height! * scaleFactor) / 2 - 30,
			})
			.setCoords();

		canvas.add(strokeCircle);
		canvas.add(fabricImage);

		bindBubbleEvents(strokeCircle, fabricImage, canvas);

		canvas.renderAll();
	};
};

export const updateBubbleImageSrc = (canvas: fabric.Canvas, imgUrl: string) => {
	const activeObject: fabric.Object | null = canvas.getActiveObject();

	if (!activeObject) {
		return;
	}
	activeObject.setSrc(
		imgUrl,
		function () {
			canvas.requestRenderAll();
		},
		{ crossOrigin: 'annonymous' }
	);
};

export const updateBubbleCircle = (
	canvas: fabric.Canvas,
	options: fabric.ICircleOptions
) => {
	const activeObject = canvas.getActiveObject();
	if (!activeObject) {
		return;
	}
	activeObject.set(options);
	canvas.requestRenderAll();
};

export const updateBubbleImageFilters = (
	canvas: fabric.Canvas,
	filters: {
		brightness?: number;
		contrast?: number;
		[key: string]: any;
	}
) => {
	const activeObject: fabric.Image | null = canvas.getActiveObject();
	if (!activeObject) {
		return;
	}

	activeObject.filters = activeObject.filters || []; // Clear existing filters

	Object.entries(filters).forEach(([key, value]) => {
		if (key === 'brightness') {
			activeObject.filters = []; // Clear existing filters
			activeObject.filters.push(
				new fabric.Image.filters.Brightness({ brightness: value })
			);
		} else if (key === 'contrast') {
			activeObject.filters = []; // Clear existing filters
			activeObject.filters.push(
				new fabric.Image.filters.Contrast({ contrast: value })
			);
		}

		activeObject.applyFilters();
	});

	canvas?.renderAll();
	canvas.requestRenderAll();
};

export const updateBubbleShadow = (
	canvas: fabric.Canvas,
	strokeCircle: fabric.Circle,
	options?: fabric.ICircleOptions
) => {
	if (options) {
		if (options.strokeWidth !== undefined) {
			// Update the clipPath radius to maintain the desired stroke outside the circle
			imageClipPath.radius = strokeCircle.radius!;
			imageClipPath.setCoords();
		}

		strokeCircle.set({
			...options,
			radius: strokeCircle.radius,
			strokeUniform: false,
		});
		canvas?.requestRenderAll();
	}
};

// Function to bind moving and scaling events to the circle
export const bindBubbleEvents = (
	strokeCircle: fabric.Circle,
	fabricImage: fabric.Image,
	canvas: fabric.Canvas
) => {
	let prevLeft = strokeCircle.left!;
	let prevTop = strokeCircle.top!;
	const clipPath = fabricImage.clipPath;

	strokeCircle.on('moving', function () {
		// Get the current position of the strokeCircle
		const currentLeft = strokeCircle.left!;
		const currentTop = strokeCircle.top!;

		// Calculate the delta (difference) in position
		const deltaX = currentLeft - prevLeft;
		const deltaY = currentTop - prevTop;

		// Update the previous position to the current position for the next move
		prevLeft = currentLeft;
		prevTop = currentTop;

		// Update the image position by the same delta
		fabricImage
			.set({
				left: fabricImage.left! + deltaX,
				top: fabricImage.top! + deltaY,
			})
			.setCoords();

		// Update the clipPath position to match the strokeCircle
		clipPath
			.set({
				left: strokeCircle.left,
				top: strokeCircle.top,
			})
			.setCoords();

		canvas.renderAll();
	});

	strokeCircle.on('scaling', function (e) {
		const scaleX = strokeCircle.scaleX!;
		const scaleY = strokeCircle.scaleY!;
		const newRadius = strokeCircle.radius!;

		prevLeft = strokeCircle.left!;
		prevTop = strokeCircle.top!;

		clipPath
			.set({
				left: strokeCircle.left,
				top: strokeCircle.top,
				scaleX: scaleX,
				scaleY: scaleY,
				radius: newRadius,
			})
			.setCoords();

		// fabricImage
		// 	.set({
		// 		// scaleX: scaleX,
		// 		// scaleY: scaleY,
		// 		left: fabricImage.left,
		// 		top: fabricImage.top,
		// 		scaleX: scaleX,
		// 		scaleY: scaleY,
		// 		radius: newRadius,
		// 	})
		// 	.setCoords();

		canvas.renderAll();
	});

	canvas.renderAll();
};
