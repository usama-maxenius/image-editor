import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import yourCanvasJson from "../Templates/first.json";

interface CanvasProps {
  text: string;
  image: string;
}

const images = [
  { name: 'Nature', url: 'https://res.cloudinary.com/dkh87tzrg/image/upload/v1665486789/hlfbvilioi8rlkrumq2g.jpg' },
  { name: 'City', url: 'https://res.cloudinary.com/dkh87tzrg/image/upload/v1671791251/f86duowvpgzgrsz7rfou.jpg' },
  // { name: 'Mountains', url: 'https://example.com/mountains.jpg' },
  // Add more images as needed
];


const Canvas: React.FC<CanvasProps> = ({ text, image }) => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<fabric.IBaseFilter[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const availableFilters: { name: string; filter: fabric.IBaseFilter }[] = [
    { name: 'Grayscale', filter: new fabric.Image.filters.Grayscale() },
    { name: 'Sepia', filter: new fabric.Image.filters.Sepia() },
    { name: 'Invert', filter: new fabric.Image.filters.Invert() },
    // Add more filters as needed
  ];

  useEffect(() => {
    const loadCanvas = async () => {
      if (!canvasRef.current) {
        canvasRef.current = new fabric.Canvas('canvas', {
          width: 500,
          height: 500,
        });
      }

      // Clear the canvas
      canvasRef.current.clear();

      // Load canvas JSON template
      await new Promise((resolve) => {
        canvasRef.current?.loadFromJSON(yourCanvasJson, () => {
          resolve(null);
        });
      });

      // Add text
      const textObject = new fabric.Textbox(text, { left: 50, top: 50, selectable: false });
      canvasRef.current.add(textObject);

      fabric.Image.fromURL(
        image,
        (img) => {
          img.set({
            borderColor: "red", // Example additional style
            selectable: true,
            lockMovementX: false,
            lockMovementY: false,
          });
          // Use the coordinates dynamically

          img
            .scale(0.2)
            .set({
              angle: 0,
              evented: true, // Set evented to true to enable events
            })
            .center()
            .setCoords();

          const clipPath = new fabric.Circle({
            radius: 350,
            originX: "center",
            originY: "center",
          });

          img.clipPath = clipPath;
          fabric.Object.prototype.objectCaching = false;

          canvasRef.current?.add(img);
          canvasRef.current?.renderAll();
        }
      );


      // Other canvas configurations and event handlers can be added here
    };

    loadCanvas();

    return () => {
      // Cleanup code if needed
    };
  }, [text, image]);

  const applyImageFilters = () => {
    const activeObject = canvasRef.current?.getActiveObject();

    const imageObject = canvasRef.current?.getObjects().find(
      (object) => object.type === "image" && object["custom-type"] === "background"
    ); // Adjust this based on your JSON structure

    if (imageObject && activeObject === imageObject && canvasRef.current) {
      // Apply filters to the image object
      imageObject.filters = appliedFilters;
      imageObject.applyFilters();
      canvasRef.current.renderAll();
    }

  };

  const handleFilterChange = (filterName: string) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    // Assuming selectedImage is defined somewhere in your code
    // Load the selected background image with filters
    const img = new Image();
    img.src = selectedImage;
    img.width = 500
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      // Assuming you have an image object in your canvas JSON
      const imageObject = canvasRef.current?.getObjects().find(
        (object) => object.type === "image" && object["custom-type"] === "background"
      ); // Adjust this based on your JSON structure

      // Check if there is an image object
      if (imageObject) {

        const filterObj = availableFilters.find((f) => f.name === filterName);
        if (filterObj) {
          imageObject.filters = [filterObj.filter];
          imageObject.applyFilters();
        }

        // Center the image in the canvas
        const canvasWidth = canvas.width || 0;
        const canvasHeight = canvas.height || 0;
        const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;

        imageObject.set({
          width: newWidth,
          height: newHeight,
        });
        imageObject.setElement(img);
        imageObject.setCoords();
        imageObject.width = canvas.width
        imageObject.height = canvas.height
        canvasRef.current?.renderAll();
      }
      
    };
    setSelectedFilter(filterName);
  };

  useEffect(() => {
    // Listen for object:selected event to trigger re-rendering after selecting an object
    canvasRef.current?.on('object:selected', applyImageFilters);
    return () => {
      canvasRef.current?.off('object:selected', applyImageFilters);
    };
  }, []);


  const handleImageChange = (imageUrl: string) => {

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    // Load the selected background image with filters
    const img = new Image();
    img.src = imageUrl;
    img.width = 500
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      // Assuming you have an image object in your canvas JSON
      const imageObject = canvasRef.current?.getObjects().find(
        (object) => object.type === "image" && object["custom-type"] === "background"
      ); // Adjust this based on your JSON structure

      // Check if there is an image object
      if (imageObject) {
        // Center the image in the canvas
        const canvasWidth = canvas.width || 0;
        const canvasHeight = canvas.height || 0;
        const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;

        imageObject.set({
          width: newWidth,
          height: newHeight,
        });
        imageObject.setElement(img);
        imageObject.setCoords();
        imageObject.width = canvas.width
        imageObject.height = canvas.height
        canvasRef.current?.renderAll();
      }

      // Update the selected image after setting it as the canvas background
      setSelectedImage(imageUrl);
    };
  };


  function saveImage() {
    const canvas = canvasRef.current

    if (!canvas) return

    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1.0,
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "canvas-export.png";
    link.click();
  }


  return (
    <div>
      <div>
        <label>Select Filter:</label>
        <select value={selectedFilter} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="">None</option>
          {availableFilters.map((filter) => (
            <option key={filter.name} value={filter.name}>
              {filter.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Select Background Image:</label>
        <select value={selectedImage} onChange={(e) => handleImageChange(e.target.value)}>
          <option value="">None</option>
          {images.map((image) => (
            <option key={image.url} value={image.url}>
              {image.name}
            </option>
          ))}
        </select>
      </div>
      <canvas id="canvas" width={800} height={600}></canvas>
      <button onClick={saveImage}>
        Export
      </button>

    </div>
  );
};

export default Canvas;
