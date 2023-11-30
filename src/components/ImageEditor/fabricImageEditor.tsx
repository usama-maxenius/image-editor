import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import yourJsonFile from "./first.json"; // Update the path

interface ImageEditorProps {
  selectedCard: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ selectedCard }) => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hideLoading = () => {
      setLoading(false);
    };

    if (!canvasRef.current) return;

    //@ts-ingore
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 500,
      backgroundColor: "gray",
      selection: false, // Disable object selection
      isDrawingMode: false, // Disable drawing mode
    });

    const loadJsonFile = async (json: any) => {
      try {
        canvas.loadFromJSON(json, () => {
          hideLoading();
          canvas.renderAll();
        });

        canvas.getObjects().forEach((obj) => {
          obj.set({
            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
            hoverCursor: "default",
          });
        });

        canvas.renderAll();
      } catch (error) {
        console.error("Error loading JSON file:", error);
        hideLoading();
      }
    };

    loadJsonFile(yourJsonFile);
  }, []); // No dependencies as it's a static import

  return (
    <>
      {loading && <div>Loading...</div>}
      <canvas ref={canvasRef as React.LegacyRef<HTMLCanvasElement>}></canvas>
    </>
  );
};

export default ImageEditor;
