import create from 'zustand';
import { fabric } from 'fabric';
import Editor from '../editor';

interface EditorState {
	canvases: (fabric.Canvas | null)[];
	editor: Editor | null;
	setEditor: (editor: Editor | null) => void;
	setCanvas: (index: number, canvas: fabric.Canvas | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
	canvases: [],
	editor: null,
	setCanvas: (index, canvas) =>
		set((state) => ({
			canvases: [
				...state.canvases.slice(0, index),
				canvas,
				...state.canvases.slice(index + 1),
			],
		})),
	setEditor: (editor) => set({ editor }),
}));
