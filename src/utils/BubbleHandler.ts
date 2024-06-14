//  // @ts-nocheck
import { fabric } from 'fabric';
import { getExistingObject } from '.';
import { scaleToFit } from './ImageHandler';

fabric.Object.prototype.noScaleCache = false;

interface BubbleObject {
	left: number;
	top: number;
}
export const createBubbleElement = (
	canvas: fabric.Canvas,
	imgUrl: string,
	obj: BubbleObject
) => {
	const id: number = Math.floor(Math.random() * 100);

	const left = canvas.getWidth() / 2; //centerX
	const top = canvas.getHeight() / 2; //centerY

	var strokeCircle = new fabric.Circle({
		radius: 100,
		left: obj?.left ? obj.left : left,
		top: obj?.top ? obj.top : top,
		originX: 'center',
		originY: 'center',
		fill: 'transparent',
		strokeWidth: 10,
		stroke: '#ffffff',
		strokeUniform: false,
		selectable: true,
	});
	(strokeCircle as any).customId = id;

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
	(clipPath as any).customId = id;
	var imageElement = document.createElement('img');
	imageElement.src = imgUrl;
	imageElement.crossOrigin = 'anonymous';

	// Add the image to the canvas when needed
	imageElement.onload = function () {
		var fabricImage = new fabric.Image(imageElement);
		(fabricImage as any).customType = 'bubble';
		(fabricImage as any).customId = id;

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

		(strokeCircle as any).customType = 'bubbleStroke';
		(strokeCircle as any).customId = id;
		canvas.add(strokeCircle);
		canvas.add(fabricImage);

		let prevLeft = strokeCircle.left!;
		let prevTop = strokeCircle.top!;

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

		strokeCircle.on('scaling', function () {
			clipPath.scaleToWidth(strokeCircle.getScaledWidth());
			clipPath.scaleToHeight(strokeCircle.getScaledHeight());
			clipPath
				.set({
					left: strokeCircle.left,
					top: strokeCircle.top,
					scaleX: strokeCircle.scaleX,
					scaleY: strokeCircle.scaleY,
					radius: strokeCircle.radius!,
				})
				.setCoords();
		});

		canvas.renderAll();
	};
};

export const createBubbleElement1 = (
	canvas: fabric.Canvas,
	imgUrl: string,
	options?: fabric.ICircleOptions
) => {
	const existingBubbleStroke = getExistingObject(
		canvas,
		'bubbleStroke'
	) as fabric.Circle;

	const left = canvas.getWidth() / 2; //centerX
	const top = canvas.getHeight() / 2; //centerY

	var strokeCircle = new fabric.Circle({
		radius: 100,
		left: left,
		top: top,
		originX: 'center',
		originY: 'center',
		fill: 'transparent',
		strokeWidth: 10,
		stroke: '#ffffff',
		strokeUniform: false,
		selectable: true,
		...(existingBubbleStroke && { ...existingBubbleStroke }),
		...options,
	});

	const existingBubble = getExistingObject(canvas, 'bubble') as fabric.Circle;
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
		...(existingBubble && { ...existingBubble.clipPath }),
	});

	(clipPath as any).customType = 'bubbleClipPath';
	var imageElement = document.createElement('img');
	imageElement.src = imgUrl;
	imageElement.crossOrigin = 'anonymous';

	// Add the image to the canvas when needed
	imageElement.onload = function () {
		var fabricImage = new fabric.Image(imageElement);
		(fabricImage as any).customType = 'bubble';

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

		(strokeCircle as any).customType = 'bubbleStroke';
		canvas.insertAt(strokeCircle, 4, false);
		canvas.insertAt(fabricImage, 5, false);
		if (existingBubble) canvas?.remove(existingBubble);
		if (existingBubbleStroke) canvas?.remove(existingBubbleStroke);

		let prevLeft = strokeCircle.left!;
		let prevTop = strokeCircle.top!;

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

		strokeCircle.on('scaling', function () {
			clipPath.scaleToWidth(strokeCircle.getScaledWidth());
			clipPath.scaleToHeight(strokeCircle.getScaledHeight());
			clipPath
				.set({
					left: strokeCircle.left,
					top: strokeCircle.top,
					scaleX: strokeCircle.scaleX,
					scaleY: strokeCircle.scaleY,
					radius: strokeCircle.radius!,
				})
				.setCoords();
		});

		canvas.renderAll();
	};
};

export const updateBubbleElement = (
	canvas: fabric.Canvas,
	strokeCircle: fabric.Circle,
	options?: fabric.ICircleOptions
) => {
	const imageClipPath = getExistingObject(canvas, 'bubble')
		?.clipPath as fabric.Circle;

	// Update strokeCircle properties
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

export const updateBubbleImage = (canvas: fabric.Canvas, imgUrl: string) => {
	const left = canvas.getWidth() / 2; //centerX
	const top = canvas.getHeight() / 2; //centerY

	const activeBubble = getExistingObject(canvas, 'bubble');
	// const activeBubbleStroke = getExistingObject(canvas, 'bubbleStroke');
	// const activeBubbleCircle = getExistingObject(canvas, 'bubbleClipPath');

	// var strokeCircle = new fabric.Circle({
	// 	radius: 100,
	// 	left: activeBubbleStroke?.left ? activeBubbleStroke.left : left,
	// 	top: activeBubbleStroke?.top ? activeBubbleStroke.top : top,
	// 	originX: 'center',
	// 	originY: 'center',
	// 	fill: 'transparent',
	// 	strokeWidth: 10,
	// 	stroke: '#ffffff',
	// 	strokeUniform: false,
	// 	selectable: true,
	// 	...activeBubbleStroke,
	// });

	// var clipPath = new fabric.Circle({
	// 	radius: strokeCircle.radius!,
	// 	left: strokeCircle.left,
	// 	top: strokeCircle.top,
	// 	originX: 'center',
	// 	originY: 'center',
	// 	fill: 'transparent',
	// 	opacity: 1,
	// 	visible: true,
	// 	selectable: true,
	// 	strokeUniform: true,
	// 	perPixelTargetFind: true,
	// 	absolutePositioned: true,
	// 	...activeBubbleCircle,
	// });

	activeBubble?.setSourcePath(imgUrl);
	canvas.renderAll();
};

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

		let prevLeft = strokeCircle.left!;
		let prevTop = strokeCircle.top!;

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

		strokeCircle.on('scaling', function () {
			clipPath.scaleToWidth(strokeCircle.getScaledWidth());
			clipPath.scaleToHeight(strokeCircle.getScaledHeight());
			clipPath
				.set({
					left: strokeCircle.left,
					top: strokeCircle.top,
					scaleX: strokeCircle.scaleX,
					scaleY: strokeCircle.scaleY,
					radius: strokeCircle.radius!,
				})
				.setCoords();
		});

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
