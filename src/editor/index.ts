import { fabric } from 'fabric';

class Editor {
	private canvas: fabric.Canvas | null;

	constructor(canvasElement: HTMLCanvasElement) {
		this.canvas = new fabric.Canvas(canvasElement);
	}

	public getCanvas(): fabric.Canvas | null {
		return this.canvas;
	}

	public addRectangle(options: fabric.IRectOptions) {
		if (this.canvas) {
			const rect = new fabric.Rect(options);
			this.canvas.add(rect);
			this.canvas.renderAll();
		}
	}

	public addText(text: string, options: fabric.ITextOptions) {
		if (this.canvas) {
			const textbox = new fabric.Textbox(text, options);
			this.canvas.add(textbox);
			this.canvas.renderAll();
		}
	}

	public addImage(url: string, options: fabric.IImageOptions) {
		if (this.canvas) {
			fabric.Image.fromURL(url, (img) => {
				img.set(options);
				this.canvas!.add(img);
				this.canvas!.renderAll();
			});
		}
	}

	public dispose() {
		if (this.canvas) {
			this.canvas.dispose();
			this.canvas = null;
		}
	}
}

export default Editor;
