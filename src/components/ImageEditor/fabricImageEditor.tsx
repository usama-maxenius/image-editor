import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import yourJsonFile from "../Templates/first.json"; // Update the path



const ImageEditor = () => {
  const canvasRef: React.MutableRefObject<fabric.Canvas | null> =
    useRef<fabric.Canvas | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hideLoading = () => {
      setLoading(false);
    };

    if (!canvasRef.current) return;

    //@ts-ignore
    const canvas: fabric.Canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 500,
    });

    // Set canvas background color to red
    canvas.setBackgroundColor("red", () => {
      canvas.renderAll();
    });

    const loadJsonFile = async (json: any) => {
      try {
        canvas.loadFromJSON(json, () => {
          hideLoading();
          const imageObject = canvas
            .getObjects()
            .find((object) => object.type === "image");
          if (imageObject) {
            //@ts-ignore
            imageObject.setSrc(imageObject.src);
          }
          canvas.renderAll();
        });
      } catch (error) {
        console.error("Error loading JSON file:", error);
        hideLoading();
      }
    };

    loadJsonFile(yourJsonFile);
  }, []);

  const handleButtonClick = (message: string) => {
    // Handle button click based on the message
    console.log(message);
  };

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
        }}
      >
        {loading && <div>Loading...</div>}
        <div
          style={{
            width: "500px",
            height: "500px",
            border: "3px solid yellow",
          }}
        >
          <canvas
            ref={canvasRef as React.LegacyRef<HTMLCanvasElement>}
          ></canvas>
        </div>
        <div style={{ display: "flex", marginTop: "16px" }}>
          <button onClick={() => handleButtonClick("It's Background")}>
            Background
          </button>
          <button onClick={() => handleButtonClick("It's Title")}>Title</button>
          <button onClick={() => handleButtonClick("Add Bubble")}>
            Add Bubble
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageEditor;
