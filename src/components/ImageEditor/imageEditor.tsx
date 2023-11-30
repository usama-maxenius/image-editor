import React, { useRef, useEffect } from "react";
import Konva from "konva";
import { Stage, Layer, Rect } from "react-konva";

const ImageEditor: React.FC = () => {
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (stage) {
      // Add your drawing logic here
    }
  }, []);

  return (
    <Stage width={1080} height={1350} ref={stageRef}>
      <Layer>
        {/* Add your graphics here */}
        <Rect width={100} height={100} fill="red" draggable />
      </Layer>
    </Stage>
  );
};

export default ImageEditor;
