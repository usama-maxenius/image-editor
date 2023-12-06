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

const ImageEditor = () => {
  const { title, background, circleImage } = useTitle();

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

  useEffect(() => {
    const hideLoading = () => {
      setLoading(false);
    };

    if (!canvasRef.current) return;

    const canvas: fabric.Canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 500,
      selectable: true,
      lockMovementX: false,
      lockMovementY: false,
    });

    const loadJsonFile = async (json: any) => {
      try {
        canvas.loadFromJSON(yourJsonFile, () => {
          hideLoading();

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

              const overlayRect = new fabric.Rect({
                width: img.width,
                height: img.height,
                fill: `rgba(255, 0, 0, ${parseInt(background.tools.overlay)})`,
                originX: "left",
                originY: "top",
              });

              img.filters.push(
                new fabric.Image.filters.Contrast({
                  contrast: parseInt(background.tools.contrast),
                }),
                new fabric.Image.filters.Brightness({
                  brightness: parseInt(background.tools.brightness),
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
              canvas.add(img, overlayRect);
              canvas.sendToBack(img);
              canvas.renderAll();
            });
          } else {
            canvas.setBackgroundColor("red", canvas.renderAll.bind(canvas));
          }

          //bubble image
          canvas.getObjects().forEach((object) => {
            fabric.Image.fromURL(
              circleImage
                ? circleImage
                : "/images/sample/scott-circle-image.png",

              (img) => {
                img.scale(0.2).set({
                  top: 120,
                  left: 10,
                  angle: 0,
                });
                const clipPath = new fabric.Circle({
                  radius: 300,
                  originX: "center",
                  originY: "center",
                });
                img.clipPath = clipPath;
                canvas.add(img);
                canvas.renderAll();
              }
            );
          });
      

          canvas.renderAll();
        });
      } catch (error) {
        console.error("Error loading JSON file:", error);
        hideLoading();
      }
    };

    loadJsonFile(yourJsonFile);
  }, [yourJsonFile, title, background, circleImage]);

  const handleButtonClick = (message: string) => {
    console.log(message);
  };
  const tools = false;
  const toolsBelow = "false";

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#151433",
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
              cursor: "not-allowed",
              pointerEvents: "none",
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
    </>
  );
};

export default ImageEditor;
