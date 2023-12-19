
import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import yourJsonFile from "../Templates/first.json"; // Update the path
import { Link, Outlet } from "react-router-dom";
import { useTitle } from "../../context/fabricContext";
import { useCircleData } from "../../context/circle-context/circleContext";
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
    specialTag,
    elementBorder,
    swipeLeft,
  } = useTitle();
  const { circleData } = useCircleData()
  // Ref for HTML canvas
  const htmlCanvasRef = useRef<HTMLCanvasElement>(null);

  // Ref for Fabric.js canvas
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

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
  const [currentPosition, setCurrentPosition] = useState();
const updatedObjects= useRef<fabric.Object[]>([])

  useEffect(() => {
    const hideLoading = () => setLoading(false);


    if (!htmlCanvasRef.current) return;

    const canvas: fabric.Canvas = new fabric.Canvas(htmlCanvasRef.current, {
      width: 500,
      height: 500,
    });


    const loadJsonFile = async (json: any) => {
      try {
        canvas.loadFromJSON(yourJsonFile, () => {
          console.log("🚀 ~ file: fabricImageEditor.tsx:95 ~ canvas.loadFromJSON ~ objects:", canvas.getObjects())
         if(canvas.getObjects()) updatedObjects.current=canvas.getObjects()
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
                  object.type === "image" && object["custom-type"] === "background"
              );

            if (backgroundImage) canvas.remove(backgroundImage);


            // Convert image to data URL
            const imageUrl = background.background;
            const img = new Image();

            img.crossOrigin = "Anonymous";
            img.onload = function () {
              const dataUrl = getDataUrl(img);

              fabric.Image.fromURL(dataUrl, (fabricImg) => {
                fabricImg.set({
                  type: "image",
                  "custom-type": "background",
                  scaleX:
                    canvas.width && fabricImg.width && canvas.width / fabricImg.width,
                  scaleY:
                    canvas.height && fabricImg.height && canvas.height / fabricImg.height,
                  originX: "left",
                  originY: "top",
                  top: 0,
                  left: 0,
                });

                fabricImg.filters.push(
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
                      fabricImg,
                      background.tools.filter,
                      background.tools.filterToggle
                    );
                    break;
                  default:
                    break;
                }

                fabricImg.applyFilters();
                canvas.add(fabricImg);
                canvas.sendToBack(fabricImg);
                canvas.renderAll();
              });
            };

            // Set source and trigger the onload event
            img.src = imageUrl;
          } else {
            canvas.setBackgroundColor("red", canvas.renderAll.bind(canvas));
          }

          // Function to convert image to data URL
          function getDataUrl(img) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            return canvas.toDataURL();
          }

          //swipe-left
          if (swipeLeft.color.trim() !== "") {
            const leftSwipe = canvas
              .getObjects()
              .find(
                (object) =>
                  object.type === "image" &&
                  object["custom-type"] === "swipe-left"
              );

            if (leftSwipe) {
              canvas.remove(leftSwipe);
            }

            fabric.Image.fromURL(leftSwipe.src, (img) => {
              img.set({
                type: "image",
                "custom-type": "swipe-left",
                originX: "left",
                originY: "top",
                top: 450,
                left: 200,
                selectable: false,
                lockMovementX: true,
                lockMovementY: true,
              });

              img.filters.push(
                new fabric.Image.filters.BlendColor({
                  color: `#${swipeLeft?.color}`,
                  mode: "multiply",
                })
              );
              img.applyFilters();
              canvas.add(img);

              canvas.renderAll();
            });
          } else {
            canvas.setBackgroundColor("red", canvas.renderAll.bind(canvas));
          }

          //special tag
          if (specialTag.color.trim() !== "") {
            const specialTaag = canvas
              .getObjects()
              .find(
                (object) =>
                  object.type === "image" &&
                  object["custom-type"] === "special-tag"
              );

            if (specialTaag) {
              canvas.remove(specialTaag);
            }

            fabric.Image.fromURL(specialTaag.src, (img) => {
              img.set({
                type: "image",
                "custom-type": "special-tag",
                originX: "left",
                originY: "top",
                top: 10,
                left: 20,
                selectable: false,
                lockMovementX: true,
                lockMovementY: true,
              });

              img.filters.push(
                new fabric.Image.filters.BlendColor({
                  color: `#${specialTag?.color}`,
                  mode: "multiply",
                })
              );
              img.applyFilters();
              canvas.add(img);

              canvas.renderAll();
            });
          } else {
            canvas.setBackgroundColor("red", canvas.renderAll.bind(canvas));
          }

          //border tag
          if (elementBorder.color.trim() !== "") {
            const borderElement = canvas
              .getObjects()
              .find(
                (object) =>
                  object.type === "image" && object["custom-type"] === "borders"
              );

            if (borderElement) {
              canvas.remove(borderElement);
            }

            fabric.Image.fromURL(borderElement.src, (img) => {
              img.set({
                type: "image",
                "custom-type": "borders",
                originX: "left",
                originY: "top",
                top: 350,
                left: 200,
                selectable: false,
                lockMovementX: true,
                lockMovementY: true,
              });

              img.filters.push(
                new fabric.Image.filters.BlendColor({
                  color: `#${elementBorder?.color}`,
                  mode: "multiply",
                })
              );
              img.applyFilters();
              canvas.add(img);

              canvas.renderAll();
            });
          } else {
            canvas.setBackgroundColor("red", canvas.renderAll.bind(canvas));
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
                  antiAlias: false,
                });
                // Use the coordinates dynamically
                if (currentPosition) {
                  const { tl, tr, bl, br } = currentPosition;
                  const top = (tl?.y + bl?.y) / 2 ?? 120; // Vertical center or default to 120
                  const left = (tl?.x + tr?.x) / 2 ?? 10; // Horizontal center or default to 10

                  img
                    .scale(0.2)
                    .set({
                      top,
                      left,
                      angle: 0,
                      evented: true, // Set evented to true to enable events
                    })
                    .center()
                    .setCoords();
                } else {
                  console.log(circleData);

                  // Default values if currentPosition is null
                  img.scale(0.2).set({
                    top: circleData.top,
                    left: circleData.right,
                    angle: 0,
                    evented: true,
                  });
                }
                const clipPath = new fabric.Circle({
                  radius: 350,
                  originX: "center",
                  originY: "center",
                });

                img.clipPath = clipPath;
                fabric.Object.prototype.objectCaching = false;

                canvas.add(img);
                canvas.renderAll();
              }
            );
          }

          //export canvas
          // if (exportCanvas) {

          //   // Array of image URLs to preload
          //   const imageUrls = [
          //     "/images/sample/special-tag.png",
          //     circleImage
          //       ? circleImage
          //       : "/images/sample/scott-circle-image.png",
          //     "/images/sample/swipe-left.png",
          //     "/images/sample/borders.png",
          //     // Add other image URLs here...
          //   ];

          //   // Preload images
          //   const images = imageUrls.map((url) => {
          //     const img = new Image();
          //     img.src = url;
          //     return img;
          //   });

          //   Promise.all(
          //     images.map(
          //       (img) =>
          //         new Promise((resolve) => {
          //           img.onload = resolve;
          //         })
          //     )
          //   ).then(() => {
          //     // Images are loaded, now proceed with exporting the canvas
          //     fabric.Image.fromURL(background.background, (backgroundImage) => {
          //       backgroundImage.set({
          //         type: "image",
          //         "custom-type": "background",
          //         scaleX:
          //           canvas.width &&
          //           backgroundImage.width &&
          //           canvas.width / backgroundImage.width,
          //         scaleY:
          //           canvas.height &&
          //           backgroundImage.height &&
          //           canvas.height / backgroundImage.height,
          //         originX: "left",
          //         originY: "top",
          //         top: 0,
          //         left: 0,
          //       });

          //       canvas.add(backgroundImage);
          //       canvas.sendToBack(backgroundImage);
          //       canvas.renderAll();

          //       const dataUrl = canvas.toDataURL({
          //         format: "png",
          //         quality: 1.0,
          //       });

          //       const link = document.createElement("a");
          //       link.href = dataUrl;
          //       link.download = "canvas-export.png";
          //       link.click();

          //       setExportCanvas(false);
          //     });
          //   });
          // }


          // Render canvas after setting up listeners
          canvas.renderAll();
        });
      } catch (error) {
        console.error("Error loading JSON file:", error);
        hideLoading();
      }
    };

    loadJsonFile(yourJsonFile);
    let savedObjects = [];

    fabricCanvasRef.current = canvas
    // Event listener for "object:moving"
    canvas.on("object:moving", function (event) { 

      // updatedObjects.current.forEach((obj)=>{
      //   canvas.add(obj)
      // })
      console.log({ objects: canvasRef.current?.getObjects(),updatedObjects })
      // savedObjects = [];
      // canvas.forEachObject(function (obj) {
      //   savedObjects.push(obj);
      // });
      // importAndRenderObjects();

      // if (!isObjectMoving) {
      //   isObjectMoving = true;
      //   setTimeout(function () {
      //     isObjectMoving = false;
      //     if (
      //       event.target &&
      //       event.target.type === "image" &&
      //       currentPosition !== event.target.aCoords
      //     ) {
      //       setCurrentPosition(event.target.aCoords);
      //     }
      //   }, 200); // Adjust the debounce time as needed
      // }
      // importAndRenderObjects();
    });

    // canvas.on("object:moving", function (event) {
    //   savedObjects = [];
    //   canvas.forEachObject(function (obj) {
    //     savedObjects.push(obj);
    //   });
    //   importAndRenderObjects();

    //   if (!isObjectMoving) {
    //     isObjectMoving = true;
    //     setTimeout(function () {
    //       isObjectMoving = false;
    //       if (
    //         event.target &&
    //         event.target.type === "image" &&
    //         currentPosition !== event.target.aCoords
    //       ) {
    //         setCurrentPosition(event.target.aCoords);
    //       }
    //     }, 200); // Adjust the debounce time as needed
    //   }
    //   importAndRenderObjects();
    // });

    // canvas.on("selection:created", function (event) {
    //   console.log("event.selected[0]", event.selected[0]);


    //   if (event && event.selected[0].id === "555") {
    //     setCurrentPosition(event.selected[0].lineCoords);
    //     return;
    //   }
    //   // Cancel the selection if the object is not with id "555"
    //   canvas.discardActiveObject();
    // });

    // canvas.on("before:selection:cleared", function () {
    //   if (event && event.selected[0].id === "555") {
    //     setCurrentPosition(event.selected[0].lineCoords);
    //     return;
    //   }
    //   // Cancel the selection if the object is not with id "555"
    //   canvas.discardActiveObject();
    // });

  }, [
    specialTag,
    title,
    background,
    circleImage,
    exportCanvas,
    elementBorder,
    swipeLeft,
    circleData
  ]);


  useEffect(() => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    // Handle mouse down event for initiating drag and drop
    const handleMouseDown = (event) => {
      console.log({ object: canvasRef.current?.getActiveObjects() })
      const target = event.target;
      if (target && target.selectable) {
        target.setCoords();
        canvas.discardActiveObject();
        // canvas.setActiveObject(target);

        const savedObjects = [];
        canvas.forEachObject((obj) => {
          savedObjects.push(obj);
        });

        canvas.requestRenderAll();

        return savedObjects;
      }
    };

    // Handle mouse up event for ending drag and drop
    const handleMouseUp = (savedObjects) => {
      canvas.renderAll();

      if (savedObjects) {
        savedObjects.forEach((obj) => {
          obj.setCoords();
        });

        // canvas.discardActiveObject();
        canvas.renderAll();
      }
    };

    canvas.on("mouse:down", (event) => {
      const savedObjects = handleMouseDown(event);
      canvas.on("mouse:up", () => handleMouseUp(savedObjects));
    });

    return () => {
      canvas.off("mouse:down");
      canvas.off("mouse:up");
    };
  }, [fabricCanvasRef.current]);



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
              ref={htmlCanvasRef}
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