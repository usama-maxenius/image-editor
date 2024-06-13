import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import Editor from '.'; // Assuming Editor.ts contains your Editor class

const MultiCanvasEditor: React.FC = () => {
	const [canvasCount, setCanvasCount] = useState(1);

	const addCanvas = () => {
		setCanvasCount((prevCount) => prevCount + 1);
	};

	const removeCanvas = () => {
		if (canvasCount > 1) {
			setCanvasCount((prevCount) => prevCount - 1);
		}
	};

	return (
		<div>
			<div>
				{Array.from({ length: canvasCount }).map((_, index) => (
					<CanvasEditor key={index} index={index} />
				))}
			</div>
			<div>
				<button onClick={addCanvas}>Add Canvas</button>
				<button onClick={removeCanvas}>Remove Canvas</button>
			</div>
		</div>
	);
};

interface CanvasEditorProps {
	index: number;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ index }) => {
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
	const setCanvas = useEditorStore((state) => state.setCanvas);
	const setEditor = useEditorStore((state) => state.setEditor);

	useEffect(() => {
		const canvasElement = canvasRef.current;
		if (canvasElement) {
			const editor = new Editor(canvasElement);
			setEditor(editor);
			setCanvas(index, editor.getCanvas());
			return () => {
				editor.dispose(); // Clean up fabric.js resources
				setCanvas(index, null);
			};
		}
	}, [index, setCanvas]);

	const handleAddRectangle = () => {
		const { editor } = useEditorStore.getState();

		if (editor) {
			editor.addRectangle({
				left: 100,
				top: 100,
				fill: 'red',
				width: 50,
				height: 50,
			});
		}
	};

	const handleAddText = () => {
		const { editor } = useEditorStore.getState();
		if (editor) {
			editor.addText('Hello World', {
				left: 100,
				top: 200,
				fontSize: 30,
			});
		}
	};

	const handleAddImage = () => {
		const { editor } = useEditorStore.getState();
		if (editor) {
			editor.addImage('https://via.placeholder.com/150', {
				left: 200,
				top: 200,
			});
		}
	};

	return (
		<div style={{ border: '1px solid black', marginBottom: '10px' }}>
			<canvas ref={canvasRef} width={800} height={600}></canvas>
			<div>
				<button onClick={handleAddRectangle}>Add Rectangle</button>
				<button onClick={handleAddText}>Add Text</button>
				<button onClick={handleAddImage}>Add Image</button>
			</div>
		</div>
	);
};

export default MultiCanvasEditor;
