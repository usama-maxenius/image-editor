// // @ts-nocheck
import { fabric } from 'fabric';
import { useCanvasStore } from '../../store/useCanvasStore';

export const SnappyImage = fabric.util.createClass(fabric.Image, {
	type: 'snappyImage',

	initialize: function (element: any, options: {}) {
		options || (options = {});
		this.callSuper('initialize', element, options);
		this.guides = {};
	},

	_render: function (ctx: any) {
		this.callSuper('_render', ctx);
		if (this.canvas.getActiveObject() === this) {
			this._drawObjectGuides();
		}
	},

	_drawObjectGuides: function () {
		const w = this.getScaledWidth();
		const h = this.getScaledHeight();
		console.log(this.top);
		this._drawGuide('top', this.top);
		this._drawGuide('left', this.left);
		this._drawGuide('centerX', this.left + w / 2);
		this._drawGuide('centerY', this.top + h / 2);
		this._drawGuide('right', this.left + w);
		this._drawGuide('bottom', this.top + h);
		this.setCoords();
	},

	_drawGuide: function (side: string | number, pos: any) {
		let ln;
		const color = 'rgb(178, 207, 255)';
		const lineProps = {
			left: 0,
			top: 0,
			evented: true,
			stroke: color,
			selectable: false,
			opacity: 1,
		};

		switch (side) {
			case 'top':
				ln = new fabric.Line(
					[0, 0, this.canvas.width, 0],
					Object.assign(lineProps, {
						left: 0,
						top: pos,
					})
				);
				break;
			case 'bottom':
				ln = new fabric.Line(
					[0, 0, this.canvas.width, 0],
					Object.assign(lineProps, {
						left: 0,
						top: pos,
					})
				);
				break;

			case 'centerY':
				ln = new fabric.Line(
					[0, 0, this.canvas.width, 0],
					Object.assign(lineProps, {
						left: 0,
						top: pos,
					})
				);
				break;

			case 'left':
				ln = new fabric.Line(
					[0, this.canvas.height, 0, 0],
					Object.assign(lineProps, {
						left: pos,
						top: 0,
					})
				);
				break;

			case 'right':
				ln = new fabric.Line(
					[0, this.canvas.height, 0, 0],
					Object.assign(lineProps, {
						left: pos,
						top: 0,
					})
				);
				break;

			case 'centerX':
				ln = new fabric.Line(
					[0, this.canvas.height, 0, 0],
					Object.assign(lineProps, {
						left: pos,
						top: 0,
					})
				);
				break;

			default:
				break;
		}

		if (this.guides[side] instanceof fabric.Line) {
			// remove the line
			this.canvas.remove(this.guides[side]);
			delete this.guides[side];
		}
		this.guides[side] = ln;
		this.canvas.add(ln);
	},
	clearGuides: function () {
		for (let side in this.guides) {
			if (this.guides[side] instanceof fabric.Line) {
				console.log('runng');
				this.canvas.remove(this.guides[side]);
				delete this.guides[side];
			}
		}
	},
});

fabric.SnappyImage = SnappyImage;

export function clearAllGuides(canvas) {
	const objects = canvas.getObjects().filter((o) => o.type === 'snappyImage');

	objects?.forEach((obj) => obj?.clearGuides());
}

const SnappyText = fabric.util.createClass(fabric.Textbox, {
	type: 'snappyText',

	initialize: function (options) {
		options || (options = {});
		this.callSuper('initialize', options);
		this.guides = {};
	},
	_render: function (ctx) {
		this.callSuper('_render', ctx);
		this._drawObjectGuides();
	},

	_drawObjectGuides: function () {
		const w = this.getScaledWidth();
		const h = this.getScaledHeight();
		this._drawGuide('top', this.top);
		this._drawGuide('left', this.left);
		this._drawGuide('centerX', this.left + w / 2);
		this._drawGuide('centerY', this.top + h / 2);
		this._drawGuide('right', this.left + w);
		this._drawGuide('bottom', this.top + h);
		this.setCoords();
	},

	_drawGuide: function (side, pos) {
		let ln;
		const color = 'rgb(178, 207, 255)';
		const lineProps = {
			left: 0,
			top: 0,
			evented: true,
			stroke: color,
			selectable: false,
			opacity: 1,
		};

		switch (side) {
			case 'top':
				ln = new fabric.Line(
					[0, 0, this.canvas.width, 0],
					Object.assign(lineProps, {
						left: 0,
						top: pos,
					})
				);
				break;
			case 'bottom':
				ln = new fabric.Line(
					[0, 0, this.canvas.width, 0],
					Object.assign(lineProps, {
						left: 0,
						top: pos,
					})
				);
				break;

			case 'centerY':
				ln = new fabric.Line(
					[0, 0, this.canvas.width, 0],
					Object.assign(lineProps, {
						left: 0,
						top: pos,
					})
				);
				break;

			case 'left':
				ln = new fabric.Line(
					[0, this.canvas.height, 0, 0],
					Object.assign(lineProps, {
						left: pos,
						top: 0,
					})
				);
				break;

			case 'right':
				ln = new fabric.Line(
					[0, this.canvas.height, 0, 0],
					Object.assign(lineProps, {
						left: pos,
						top: 0,
					})
				);
				break;

			case 'centerX':
				ln = new fabric.Line(
					[0, this.canvas.height, 0, 0],
					Object.assign(lineProps, {
						left: pos,
						top: 0,
					})
				);
				break;

			default:
				break;
		}

		if (this.guides[side] instanceof fabric.Line) {
			// remove the line
			this.canvas.remove(this.guides[side]);
			delete this.guides[side];
		}
		this.guides[side] = ln;
		this.canvas.add(ln);
	},
	// clearGuides: function () {
	// 	for (let side in this.guides) {
	// 		if (this.guides[side] instanceof fabric.Line) {
	// 			this.canvas.remove(this.guides[side]);
	// 			delete this.guides[side];
	// 		}
	// 	}
	// },
});

fabric.SnappyText = SnappyText;

// ADD YOUR CODE HERE
var events = {
	object: ['added', 'moving', 'moved', 'scaled', 'selected', 'over'],
	mouse: ['down', 'up', 'moving', 'over', 'out'],
};

export function bindEvents() {
	const { canvas } = useCanvasStore.getState();
	if (!canvas) return false;
	events.object.forEach((event) => {
		if (event === 'added') {
			canvas.on(`object:${event}`, onObjectAdded);
		} else if (event === 'moving') {
			canvas.on(`object:${event}`, onObjectMoving);
		} else if (event === 'mouseover') {
			canvas.on(`object:${event}`, onObjectMouseOver);
		} else if (event === 'moved') {
			canvas.on(`object:${event}`, onObjectMoved);
		}
	});
}

function isSnappyElement(obj: any): boolean {
	return obj instanceof fabric.SnappyText || obj instanceof fabric.SnappyImage;
}

export async function init() {
	const { canvas } = useCanvasStore.getState();
	if (!canvas) return false;
	await bindEvents();

	var snappy = new fabric.SnappyText('Hello', {
		width: 150,
		height: 150,
		fill: 'yellow',
		top: 10,
		left: 10,
	});

	canvas.add(snappy).renderAll();

	var snappy2 = new fabric.SnappyText('Hello World', {
		width: 150,
		height: 150,
		fill: 'yellow',
		top: 10,
		left: 10,
	});

	canvas.add(snappy2).renderAll();
}
function onObjectAdded(e) {
	const obj = e.target;

	if (!isSnappyElement(obj)) return false;

	drawObjectGuides(obj);
}

function onObjectMoved(e) {
	const obj = e.target;
	if (!isSnappyElement(obj)) return false;
	drawObjectGuides(obj);
}

function onObjectMoving(e) {
	const obj = e.target;
	const { canvas } = useCanvasStore.getState();
	if (!canvas || !isSnappyElement(obj)) return false;
	// clearAllGuides(canvas);
	drawObjectGuides(obj);

	const objects = canvas
		.getObjects()
		.filter((o) => o.type !== 'line' && o !== obj);
	const matches = new Set();
	console.log({ objects });
	for (var i of objects) {
		for (var side in obj.guides) {
			var axis, newPos;

			switch (side) {
				case 'right':
					axis = 'left';
					newPos = i.guides[side][axis] - obj.getScaledWidth();
					break;
				case 'bottom':
					axis = 'top';
					newPos = i.guides[side][axis] - obj.getScaledHeight();
					break;
				case 'centerX':
					axis = 'left';
					newPos = i.guides[side][axis] - obj.getScaledWidth() / 2;
					break;
				case 'centerY':
					axis = 'top';
					newPos = i.guides[side][axis] - obj.getScaledHeight() / 2;
					break;
				default:
					axis = side;
					newPos = i.guides[side][axis];
					break;
			}

			if (inRange(obj.guides[side][axis], i.guides[side][axis])) {
				matches.add(side);
				snapObject(obj, axis, newPos);
			}

			if (side === 'left') {
				if (inRange(obj.guides['left'][axis], i.guides['right'][axis])) {
					matches.add(side);
					snapObject(obj, axis, i.guides['right'][axis]);
				}
			} else if (side === 'right') {
				if (inRange(obj.guides['right'][axis], i.guides['left'][axis])) {
					matches.add(side);
					snapObject(obj, axis, i.guides['left'][axis] - obj.getScaledWidth());
				}
			} else if (side === 'top') {
				if (inRange(obj.guides['top'][axis], i.guides['bottom'][axis])) {
					matches.add(side);
					snapObject(obj, axis, i.guides['bottom'][axis]);
				}
			} else if (side === 'bottom') {
				if (inRange(obj.guides['bottom'][axis], i.guides['top'][axis])) {
					matches.add(side);
					snapObject(obj, axis, i.guides['top'][axis] - obj.getScaledHeight());
				}
			} else if (side === 'centerX') {
				if (inRange(obj.guides['centerX'][axis], i.guides['left'][axis])) {
					matches.add(side);
					snapObject(
						obj,
						axis,
						i.guides['left'][axis] - obj.getScaledWidth() / 2
					);
				} else if (
					inRange(obj.guides['centerX'][axis], i.guides['right'][axis])
				) {
					matches.add(side);
					snapObject(
						obj,
						axis,
						i.guides['right'][axis] - obj.getScaledWidth() / 2
					);
				}
			} else if (side === 'centerY') {
				if (inRange(obj.guides['centerY'][axis], i.guides['top'][axis])) {
					matches.add(side);
					snapObject(
						obj,
						axis,
						i.guides['top'][axis] - obj.getScaledHeight() / 2
					);
				} else if (
					inRange(obj.guides['centerY'][axis], i.guides['bottom'][axis])
				) {
					matches.add(side);
					snapObject(
						obj,
						axis,
						i.guides['bottom'][axis] - obj.getScaledHeight() / 2
					);
				}
			}
		}
	}

	for (var k of matches) {
		obj.guides[k].set('opacity', 1);
	}

	obj.setCoords();
}

// If the 2 different coordinates are in range
function inRange(a, b) {
	return Math.abs(a - b) <= 10;
}

function snapObject(obj, side, pos) {
	obj.set(side, pos);
	obj.setCoords();
	drawObjectGuides(obj);
}

function onObjectMouseOver(e) {
	var obj = e.target;
	const { canvas } = useCanvasStore.getState();
	if (!canvas || !(obj instanceof fabric.Line)) return false;
	obj.set('opacity', 1);
	canvas.renderAll();
}

function drawObjectGuides(obj) {
	const w = obj.getScaledWidth();
	const h = obj.getScaledHeight();
	drawGuide('top', obj.top, obj);
	drawGuide('left', obj.left, obj);
	drawGuide('centerX', obj.left + w / 2, obj);
	drawGuide('centerY', obj.top + h / 2, obj);
	drawGuide('right', obj.left + w, obj);
	drawGuide('bottom', obj.top + h, obj);
	obj.setCoords();
}

function drawGuide(side, pos, obj) {
	const { canvas } = useCanvasStore.getState();
	if (!canvas) return false;
	var ln;
	var color = 'rgb(178, 207, 255)';
	var lineProps = {
		left: 0,
		top: 0,
		evented: true,
		stroke: color,
		selectable: false,
		opacity: 0,
	};
	switch (side) {
		case 'top':
			ln = new fabric.Line(
				[0, 0, canvas.width, 0],
				Object.assign(lineProps, {
					left: 0,
					top: pos,
				})
			);
			break;
		case 'bottom':
			ln = new fabric.Line(
				[0, 0, canvas.width, 0],
				Object.assign(lineProps, {
					left: 0,
					top: pos,
				})
			);
			break;

		case 'centerY':
			ln = new fabric.Line(
				[0, 0, canvas.width, 0],
				Object.assign(lineProps, {
					left: 0,
					top: pos,
				})
			);
			break;

		case 'left':
			ln = new fabric.Line(
				[0, canvas.height, 0, 0],
				Object.assign(lineProps, {
					left: pos,
					top: 0,
				})
			);
			break;
		case 'right':
			ln = new fabric.Line(
				[0, canvas.height, 0, 0],
				Object.assign(lineProps, {
					left: pos,
					top: 0,
				})
			);
			break;
		case 'centerX':
			ln = new fabric.Line(
				[0, canvas.height, 0, 0],
				Object.assign(lineProps, {
					left: pos,
					top: 0,
				})
			);
			break;
	}

	if (obj.guides[side] instanceof fabric.Line) {
		// remove the line
		canvas.remove(obj.guides[side]);
		delete obj.guides[side];
	}
	obj.guides[side] = ln;
	canvas.add(ln).renderAll();
}
