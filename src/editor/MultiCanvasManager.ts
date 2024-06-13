import Editor from '.';

class MultiCanvasManager {
	private editors: Editor[] = [];
	private activeIndex: number = 0;

	constructor(canvasIds: string[]) {
		this.editors = canvasIds.map((id) => new Editor(id));
	}

	public switchTo(index: number) {
		if (index >= 0 && index < this.editors.length) {
			this.activeIndex = index;
			this.editors.forEach((editor, i) => {
				const canvasElement = document.getElementById(editor.canvasId);
				if (canvasElement) {
					canvasElement.style.display =
						i === this.activeIndex ? 'block' : 'none';
				}
			});
		}
	}

	public getActiveEditor() {
		return this.editors[this.activeIndex];
	}

	public addEditor(canvasId: string) {
		this.editors.push(new Editor(canvasId));
	}

	public removeEditor(index: number) {
		if (index >= 0 && index < this.editors.length) {
			this.editors.splice(index, 1);
			if (this.activeIndex >= this.editors.length) {
				this.activeIndex = this.editors.length - 1;
			}
			this.switchTo(this.activeIndex);
		}
	}
}

export default MultiCanvasManager;
