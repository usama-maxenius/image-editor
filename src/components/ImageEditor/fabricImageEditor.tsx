/* eslint-disable  */
//@ts-nocheck

import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import yourJsonFile from "../Templates/first.json"; // Update the path
import { Link, Outlet } from "react-router-dom";
import { useTitle } from "../../context/fabricContext";
import LandscapeIcon from "@mui/icons-material/Landscape";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PersonIcon from "@mui/icons-material/Person";
import WavesIcon from "@mui/icons-material/Waves";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const ImageEditor = () => {
  const {
    title,
    background,
    circleImage,
    exportCanvas,
    setExportCanvas,
    addElement,
  } = useTitle();

  const canvasRef: React.MutableRefObject<fabric.Canvas | null> =
    useRef<fabric.Canvas | null>(null);

  const [loading, setLoading] = useState(true);
  const handleFilter = (img, filter, toggle) => {
    const filterExists = img.filters.some(
      (existingFilter) => existingFilter.type === filter
    );

    if (toggle && !filterExists) {
      switch (filter) {
        case "invert":
          img.filters.push(new fabric.Image.filters.Invert());
          break;
        case "sepia":
          img.filters.push(new fabric.Image.filters.Sepia());
          break;
        case "brownie":
          img.filters.push(new fabric.Image.filters.Brownie());
          break;
        case "greyscale":
          img.filters.push(new fabric.Image.filters.Grayscale());
          break;
        case "vintage":
          img.filters.push(new fabric.Image.filters.Vintage());
          break;
        case "kodachrome":
          img.filters.push(new fabric.Image.filters.Kodachrome());
          break;
        case "technicolor":
          img.filters.push(new fabric.Image.filters.Technicolor());
          break;
        case "polaroid":
          img.filters.push(new fabric.Image.filters.Polaroid());
          break;
        default:
          break;
      }
    } else if (!toggle && filterExists) {
      // Remove the filter if it exists
      img.filters = img.filters.filter(
        (existingFilter) => existingFilter.type !== filter
      );
    }
  };
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    const hideLoading = () => {
      setLoading(false);
    };

    if (!canvasRef.current) return;

    const canvas: fabric.Canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 500,
    });

    const loadJsonFile = async (json: any) => {
      try {
        canvas.loadFromJSON(yourJsonFile, () => {
          hideLoading();

          //overlay

          canvas.getObjects().forEach((object) => {
            if (object["custom-type"] === "rect") {
              const updatedFill = {
                type: "linear",
                coords: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 200,
                },
                colorStops: [
                  {
                    offset: 0,
                    color: `rgba(0, 0, 0, ${background.tools.overlay})`,
                  },
                  {
                    offset: 0.2,
                    color: `rgba(0, 0, 0, ${background.tools.overlay + 0.2} )`,
                  },
                  {
                    offset: 0.5,
                    color: `rgba(0, 0, 0, ${background.tools.overlay + 0.4})`,
                  },
                  {
                    offset: 1,
                    color: `rgba(0, 0, 0, ${background.tools.overlay + 0.6})`,
                  },
                ],
                shadow: {
                  color: `rgba(0, 0, 0, ${background.tools.overlay})`,
                  blur: 10,
                  offsetX: 0,
                  offsetY: -30,
                },
              };

              canvas.remove(object);

              const updatedRect = new fabric.Rect({
                width: object.width,
                height: object.height,
                left: object.left,
                top: object.top,
                originX: object.originX,
                originY: object.originY,
                selectable: object.selectable,
                lockMovementX: object.lockMovementX,
                lockMovementY: object.lockMovementY,
                fill: updatedFill,
                "custom-type": "rect",
              });
              canvas.add(updatedRect);
              canvas.sendBackwards(updatedRect);
            }
          });

          canvas.renderAll();

          //for Title
          if (title.title.trim() !== "") {
            canvas.getObjects().forEach((object) => {
              if (object["custom-type"] === "title") {
                object.set({
                  text: title?.title as string,
                  fill: title?.tools?.color,
                  fontSize: parseInt(title?.tools?.fontSize),
                  fontFamily: title.tools.fontFamily,
                } as fabric.ITextOptions);
              }
            });
            canvas.renderAll();
          }

          //background
          if (background.background.trim() !== "") {
            const backgroundImage = canvas
              .getObjects()
              .find(
                (object) =>
                  object.type === "image" &&
                  object["custom-type"] === "background"
              );

            if (backgroundImage) {
              canvas.remove(backgroundImage);
            }

            fabric.Image.fromURL(background.background, (img) => {
              img.set({
                type: "image",
                "custom-type": "background",
                scaleX: canvas.width && img.width && canvas.width / img.width,
                scaleY:
                  canvas.height && img.height && canvas.height / img.height,
                originX: "left",
                originY: "top",
                top: 0,
                left: 0,
              });

              img.filters.push(
                new fabric.Image.filters.Contrast({
                  contrast: background.tools.contrast,
                }),
                new fabric.Image.filters.Brightness({
                  brightness: background.tools.brightness,
                })
              );

              switch (background.tools.filter) {
                case "invert":
                case "sepia":
                case "brownie":
                case "greyscale":
                case "vintage":
                case "kodachrome":
                case "technicolor":
                case "polaroid":
                  handleFilter(
                    img,
                    background.tools.filter,
                    background.tools.filterToggle
                  );
                  break;
                default:
                  break;
              }

              img.applyFilters();
              canvas.add(img);
              canvas.sendToBack(img);
              canvas.renderAll();
            });
          } else {
            canvas.setBackgroundColor("red", canvas.renderAll.bind(canvas));
          }

          // //special tag
          if (background.background.trim() === "") {
            fabric.Image.fromURL("/images/sample/special-tag.png", (img) => {
              img.set({
                type: "image",
                "custom-type": "special-tag",
                originX: "left",
                originY: "top",
                top: 10,
                left: 20,
              });
              canvas.add(img);
              canvas.renderAll();
            });
          }

          //bubble image
          const existingImage = canvas
            .getObjects()
            .find(
              (object) => object.type === "image" && object.src === circleImage
            );

          if (!existingImage) {
            fabric.Image.fromURL(
              circleImage
                ? circleImage
                : "/images/sample/scott-circle-image.png",
              (img) => {
                img.set({
                  id: "555",
                  borderColor: "red", // Example additional style
                  selectable: true,
                  lockMovementX: false,
                  lockMovementY: false,
                });
                // Use the coordinates dynamically
                if (currentPosition) {
                  const { tl, tr, bl, br } = currentPosition;
                  const top = (tl?.y + bl?.y) / 2 ?? 120; // Vertical center or default to 120
                  const left = (tl?.x + tr?.x) / 2 ?? 10; // Horizontal center or default to 10

                  img.scale(0.2).set({
                    top,
                    left,
                    angle: 0,
                    evented: true, // Set evented to true to enable events
                  });
                } else {
                  // Default values if currentPosition is null
                  img.scale(0.2).set({
                    top: 120,
                    left: 10,
                    angle: 0,
                    evented: true,
                  });
                }

                const clipPath = new fabric.Circle({
                  radius: 400,
                  originX: "center",
                  originY: "center",
                });

                img.clipPath = clipPath;
                canvas.add(img);
                canvas.renderAll();
              }
            );
          }

          //export canvas
          if (exportCanvas) {
            fabric.Image.fromURL(background.background, (backgroundImage) => {
              backgroundImage.set({
                type: "image",
                "custom-type": "background",
                scaleX:
                  canvas.width &&
                  backgroundImage.width &&
                  canvas.width / backgroundImage.width,
                scaleY:
                  canvas.height &&
                  backgroundImage.height &&
                  canvas.height / backgroundImage.height,
                originX: "left",
                originY: "top",
                top: 0,
                left: 0,
              });
              canvas.add(backgroundImage);
              canvas.sendToBack(backgroundImage);
              canvas.renderAll();

              const dataUrl = canvas.toDataURL({
                format: "png",
                quality: 1.0,
              });
              const link = document.createElement("a");
              link.href = dataUrl;
              link.download = "canvas-export.png";
              link.click();

              setExportCanvas(false);
            });
          }

          canvas.renderAll();
        });
      } catch (error) {
        console.error("Error loading JSON file:", error);
        hideLoading();
      }
    };

    loadJsonFile(yourJsonFile);
  
    var isObjectMoving = false;
    let savedObjects = [];

    canvas.on("object:moving", function (event) {
      console.log("yes");
      savedObjects = [];
      canvas.forEachObject(function (obj) {
        console.log("obj", obj);
        savedObjects.push(obj);
      });
      importAndRenderObjects();

      if (!isObjectMoving) {
        isObjectMoving = true;
        setTimeout(function () {
          isObjectMoving = false;
          if (
            event.target &&
            event.target.type === "image" &&
            currentPosition !== event.target.aCoords
          ) {
            setCurrentPosition(event.target.aCoords);
          }
        }, 200); // Adjust the debounce time as needed
      }
      importAndRenderObjects();
      // Rest of the code...
    });

    canvas.off("mouse:down");
    canvas.off("mouse:up");
    // canvas.on("mouse:down", function (event) {
    //   event.isClick = false
    //   savedObjects = [];
    //   canvas.forEachObject(function (obj) {
    //     console.log("obj", obj);
    //     savedObjects.push(obj);
    //   });
    //   importAndRenderObjects();
    // });

    // Function to import and render saved objects
    function importAndRenderObjects() {
      canvas.clear(); // Clear existing canvas

      // Import saved objects and add them back to the canvas
      console.log("savedObjects", savedObjects);
      for (const obj of savedObjects) {
        canvas.add(obj);
      }

      canvas.renderAll(); // Render all objects
    }

  
   
 
  }, [
    canvasRef,
    title,
    background,
    circleImage,
    exportCanvas,
    currentPosition,
  ]);
  const handleButtonClick = (message: string) => {
    console.log(message);
  };
  const tools = false;
  const toolsBelow = "false";

  return (
    <div
      style={{ width: "100vw", height: "100vh", backgroundColor: "#151433" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading && <div>Loading...</div>}
        <div>
          <div
            style={{
              width: "500px",
              height: "500px",
              border: "3px solid #9475bf",
              borderRadius: "3px",
              // cursor: "not-allowed",
              // pointerEvents: "none",
            }}
          >
            <canvas
              ref={canvasRef as React.LegacyRef<HTMLCanvasElement>}
            ></canvas>
          </div>

          <div
            style={{
              color: "white",
              width: "500px",
              height: "70px",
            }}
          >
            <Outlet context={[toolsBelow]} />
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "16px",
              justifyContent: "space-between",
            }}
          >
            <Link to="/image-editor/background">
              <button
                onClick={() => handleButtonClick("It's Background")}
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                <LandscapeIcon style={{ color: "white", fontSize: "30px" }} />
                <p style={{ color: "white", margin: "0px", fontWeight: "600" }}>
                  BACKGROUND{" "}
                </p>
              </button>
            </Link>
            <Link to="/image-editor/title">
              {" "}
              <button
                onClick={() => handleButtonClick("It's Title")}
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                <TextFieldsIcon style={{ color: "white", fontSize: "30px" }} />
                <p style={{ color: "white", margin: "0px", fontWeight: "600" }}>
                  {" "}
                  TITLE{" "}
                </p>
              </button>
            </Link>
            <Link to="/image-editor/bubble ">
              {" "}
              <button
                onClick={() => handleButtonClick("Add Bubble")}
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                <PersonIcon style={{ color: "white", fontSize: "30px" }} />
                <p style={{ color: "white", margin: "0px", fontWeight: "600" }}>
                  {" "}
                  ADD BUBBLE
                </p>
              </button>
            </Link>
            <Link to="/image-editor/element">
              <button
                onClick={() => handleButtonClick("Add Bubble")}
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                <WavesIcon style={{ color: "white", fontSize: "30px" }} />
                <p style={{ color: "white", margin: "0px", fontWeight: "600" }}>
                  Elements
                </p>
              </button>
            </Link>
            <Link to="/image-editor/write-post">
              <button
                onClick={() => handleButtonClick("Add Bubble")}
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                <EditNoteIcon style={{ color: "white", fontSize: "30px" }} />
                <p style={{ color: "white", margin: "0px", fontWeight: "600" }}>
                  write post
                </p>
              </button>
            </Link>
          </div>
        </div>

        <div
          style={{
            color: "white",
            width: "200px",
            display: "inline-block",
            position: "relative",
            left: "7%",
            bottom: "1%",
            padding: "0px 20px",
            height: "600px",
          }}
        >
          <Outlet context={[tools]} />
        </div>
      </div>
      <div
        onClick={() => setExportCanvas(true)}
        style={{
          color: "white",
          marginTop: "10px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "8px",
          cursor: "pointer",
        }}
      >
        <ArrowForwardIosIcon />
      </div>
    </div>
  );
};

export default ImageEditor;
