// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
  Typography,
  Box,
  IconButton,
  Stack,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { styles, useStyles } from "./index.style";
import ImageViewer from "../Image";
import { IEvent, IRectOptions } from "fabric/fabric-impl";
import { canvasDimension, templateData } from "../../constants";
import CustomColorPicker from "../colorPicker";
import { Template } from "../../types";
import { getSummary } from "../../api/write-post/index";
import DeselectIcon from "@mui/icons-material/Deselect";
import JSZip from "jszip";

import {
  createSwipeGroup,
  createTextBox,
  updateSwipeColor,
  updateTextBox,
} from "../../utils/TextHandler";
import { updateRect } from "../../utils/RectHandler";
import { saveImage, saveJSON, hexToRgbA } from "../../utils/ExportHandler";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createImage,
  createImageLogo,
  updateImageSource,
} from "../../utils/ImageHandler";
import { useCanvasContext } from "../../context/CanvasContext";
import { usePaginationContext } from "../../context/MultiCanvasPaginationContext";

import FontsTab from "../Tabs/EditText/FontsTab";
import {
  createHorizontalCollage,
  createVerticalCollage,
  updateHorizontalCollageImage,
  updateVerticalCollageImage,
} from "../../utils/CollageHandler";
import { activeTabs } from "../../types/context";
import FlipIcon from "@mui/icons-material/Flip";
import {
  createBubbleElement,
  createBubbleElement1,
  updateBubbleElement,
} from "../../utils/BubbleHandler";
import { debounce } from "lodash";

import GridOnIcon from "@mui/icons-material/GridOn";
import GridOffIcon from "@mui/icons-material/GridOff";
import { ChromePicker } from "react-color";
import socialTag1 from "../../assets/socialTags/Verification-Tick-1.svg";
import socialTag2 from "../../assets/socialTags/Verification-Tick-2.svg";
import socialTag3 from "../../assets/socialTags/Verification-Tick-3.svg";

import shape1 from "../../assets/shapes/1-Shapes-Circle.svg";
import shape2 from "../../assets/shapes/2-Shapes-Rectangle.svg";
import shape3 from "../../assets/shapes/3-Shapes-Star-A.svg";
import shape4 from "../../assets/shapes/4-Shapes-Star-B.svg";
import shape5 from "../../assets/shapes/5-Shapes-Triangle.svg";
import shape6 from "../../assets/shapes/6-Shapes-Square.svg";
import shape7 from "../../assets/shapes/7-Shapes-Diamond.svg";
import shape8 from "../../assets/shapes/8-Shapes-Plus.svg";
import shape9 from "../../assets/shapes/9-Shapes-Heart.svg";
import shape10 from "../../assets/shapes/10-Shapes-Trapezium.svg";

import swipe1 from "../../assets/swipe/Swipe-1.svg";
import swipe2 from "../../assets/swipe/Swipe-2.svg";
import swipe3 from "../../assets/swipe/Swipe-3.svg";

import socialPlatformsImg1 from "../../assets/socialPlatforms/1-Round-Color-FB.svg";
import socialPlatformsImg2 from "../../assets/socialPlatforms/2-Round-Color-IG.svg";
import socialPlatformsImg3 from "../../assets/socialPlatforms/3-Round-Color-X.svg";
import socialPlatformsImg4 from "../../assets/socialPlatforms/4-Round-Color-YT.svg";
import socialPlatformsImg5 from "../../assets/socialPlatforms/5-Round-Color-TT.svg";
import socialPlatformsImg6 from "../../assets/socialPlatforms/6-Round-Color-LI.svg";
import socialPlatformsImg7 from "../../assets/socialPlatforms/7-Round-BW-FB.svg";
import socialPlatformsImg8 from "../../assets/socialPlatforms/8-Round-BW-IG.svg";
import socialPlatformsImg9 from "../../assets/socialPlatforms/9-Round-BW-X.svg";
import socialPlatformsImg10 from "../../assets/socialPlatforms/10-Round-BW-YT.svg";
import socialPlatformsImg11 from "../../assets/socialPlatforms/11-Round-BW-TT.svg";
import socialPlatformsImg12 from "../../assets/socialPlatforms/12-Round-BW-LI.svg";
import socialPlatformsImg13 from "../../assets/socialPlatforms/13-Square-Color-FB.svg";
import socialPlatformsImg14 from "../../assets/socialPlatforms/14-Square-Color-IG.svg";
import socialPlatformsImg15 from "../../assets/socialPlatforms/15-Square-Color-X.svg";
import socialPlatformsImg16 from "../../assets/socialPlatforms/16-Square-Color-TT.svg";
import socialPlatformsImg17 from "../../assets/socialPlatforms/17-Square-Color-YT.svg";
import socialPlatformsImg18 from "../../assets/socialPlatforms/18-Square-Color-LI.svg";
import socialPlatformsImg19 from "../../assets/socialPlatforms/19-Square-BW-FB.svg";
import socialPlatformsImg20 from "../../assets/socialPlatforms/20-Square-BW-IG.svg";
import socialPlatformsImg21 from "../../assets/socialPlatforms/21-Square-BW-X.svg";
import socialPlatformsImg22 from "../../assets/socialPlatforms/22-Square-BW-YT.svg";
import socialPlatformsImg23 from "../../assets/socialPlatforms/23-Square-BW-TT.svg";
import socialPlatformsImg24 from "../../assets/socialPlatforms/24-Square-BW-LI.svg";

import arrowImg1 from "../../assets/arrows/Arrow-1.svg";
import arrowImg2 from "../../assets/arrows/Arrow-2.svg";
import arrowImg3 from "../../assets/arrows/Arrow-3.svg";
import arrowImg4 from "../../assets/arrows/Arrow-4.svg";

import dividers1 from "../../assets/dividers/Divider-1.svg";
import dividers2 from "../../assets/dividers/Divider-2.svg";
import dividers3 from "../../assets/dividers/Divider-3.svg";
import dividers4 from "../../assets/dividers/Divider-4.svg";
import dividers5 from "../../assets/dividers/Divider-5.svg";
import dividers6 from "../../assets/dividers/Divider-6.svg";
import tempJSON from "./temp.json";

import SwipeVerticalIcon from "@mui/icons-material/SwipeVertical";

import SwipeRightIcon from "@mui/icons-material/SwipeRight";

type TemplateJSON = any;
interface PaginationStateItem {
  page: number;
  template: string;
  templateJSON: TemplateJSON;
  backgroundImage: boolean;
  diptych: string | undefined;
  filePath: string;
  opacity: number; // Changed to number
  overlayImage: string;
  placeholderImage: string;
}
import toast from "react-hot-toast";

interface CanvasProps {
  template: PaginationStateItem | undefined;
  updatedSeedData: Record<string, any>;
}

interface FilterState {
  overlay: number;
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: number;
  charSpacing: number;
}

const toolbars = ["background", "title", "bubble", "element", "writePost"];
const filter =
  "brightness(0) saturate(100%) invert(80%) sepia(14%) saturate(1577%) hue-rotate(335deg) brightness(108%) contrast(88%)";

const Canvas: React.FC<CanvasProps> = React.memo(
  ({ updatedSeedData, template }) => {
    const { borders, elements, backgroundImages, logos, texts, bubbles } =
      updatedSeedData;
    const {
      canvas,
      activeTab,
      updateActiveTab,
      updateCanvasContext,
      getExistingObject,
    } = useCanvasContext();
    const [activeButton, setActiveButton] = useState("Overlay");
    const [show, setShow] = useState("font");
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const [selectedFilter] = useState<string>("");
    const [dropDown, setDropDown] = useState(true);
    const [filtersRange, setFiltersRange] = useState({
      brightness: 0,
      contrast: 0,
    });

    const { paginationState, selectedPage, setSelectedPage, addPage, update } =
      usePaginationContext();

    const {
      scrapURL,
      userMetaData,
      updateIsUserMetaExist,
      updateUserMetaData,
    } = useCanvasContext();

    const [canvasToolbox, setCanvasToolbox] = useState({
      activeObject: null,
      isDeselectDisabled: true,
    });
    const [initialData, setInitialData] = useState({
      backgroundImages,
      bubbles,
      elements: [elements, borders],
    });

    const [overlayTextFiltersState, setOverlayTextFiltersState] =
      useState<FilterState>({
        overlay: 0.6,
        text: updatedSeedData.texts[0],
        fontSize: 16,
        color: "#fff",
        fontFamily: "Fira Sans",
        fontWeight: 500,
        charSpacing: 1,
      });

    const [overlayTextFiltersState1, setOverlayTextFiltersState1] =
      useState<FilterState>({
        color: "#909AE9",
      });

    const [filterValues, setFilterValues] = useState({
      overlayText: {
        overlay: 0.6,
        text: "",
        fontSize: 16,
        color: "#fff",
        fontFamily: "Fira Sans",
      },
      overlay: {
        imgUrl: template?.overlayImage,
        opacity: template?.opacity,
      },
      bubble: {
        image: "",
        strokeWidth: 10,
        stroke: "#fff",
      },
      collage: {
        strokeWidth: 3,
        stroke: "#ffffff",
      },
    });

    const availableFilters: { name: string; filter: fabric.IBaseFilter }[] = [
      {
        name: "grayscale",
        filter: new fabric.Image.filters.Grayscale({ grayscale: 1 }),
      },
      { name: "sepia", filter: new fabric.Image.filters.Sepia({ sepia: 1 }) },
      {
        name: "invert",
        filter: new fabric.Image.filters.Invert({ invert: 1 }),
      },
      {
        name: "sharpen",
        filter: new fabric.Image.filters.Convolute({
          matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
        }),
      },

      // Add more filters as needed
    ];

    const classes = useStyles();
    const canvasInstanceRef = useRef(null);
    const [color, setColor] = useState("#909AE9");

    const [colorApplied, setColorApplied] = useState(false);
    const [bgColorApplied, setBgColorApplied] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("#909BEB");

    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [fontWeightApplied, setFontWeightApplied] = useState(false);

    //add another bubble
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setIsChecked(event.target.checked);
    };

    //--------------------

    useEffect(() => {
      const options = {
        width: canvasDimension.width,
        height: canvasDimension.height,
        renderOnAddRemove: false,
        preserveObjectStacking: true,
        selection: true,
      };

      const canvas = new fabric.Canvas(canvasEl.current, options);
      canvasInstanceRef.current = canvas;

      updateCanvasContext(canvas);

      // Attach the event listener with the separated function
      canvas.on("selection:created", handleSelectionUpdated);
      canvas.on("selection:updated", handleSelectionUpdated);

      // Register event listener
      // canvas.on('mouse:down', handleMouseDown);

      return () => {
        // Cleanup
        updateCanvasContext(null);
        canvas.dispose();
      };
    }, [canvasDimension, selectedPage, paginationState]);

    const handleSelectionUpdated = () => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        const selectedText = window.getSelection().toString();
        if (activeObject.text.includes(selectedText)) {
          const startPos = activeObject.text.indexOf(selectedText);
          const endPos = startPos + selectedText.length;
          activeObject.setSelectionStyles(
            { textBackgroundColor: backgroundColor },
            startPos,
            endPos
          );
          setBgColorApplied(true);
          canvasInstanceRef.current.renderAll(); // Render only the canvas instance
        }
      }
    };

    const removeBackgroundColor = () => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        const selectedText = window.getSelection().toString();
        if (activeObject.text.includes(selectedText)) {
          const startPos = activeObject.text.indexOf(selectedText);
          const endPos = startPos + selectedText.length;
          activeObject.setSelectionStyles(
            { textBackgroundColor: "transparent" },
            startPos,
            endPos
          );
          setBgColorApplied(true);
          canvasInstanceRef.current.renderAll(); // Render only the canvas instance
        }
      }
    };

    // Define handleMouseDown function
    const handleMouseDown = (event) => {
      const selectedObject = event.target;

      if (selectedObject && selectedObject.type === "textbox") {
        const selectionStart = selectedObject.selectionStart;
        const selectionEnd = selectedObject.selectionEnd;

        if (selectionStart !== selectionEnd) {
          selectedObject.setSelectionStyles(
            { fill: color },

            selectionStart,
            selectionEnd
          );
          canvasInstanceRef.current.renderAll(); // Render only the selected object
        }
      }
    };

    const applyBackgroundColor = () => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.setSelectionStyles({ backgroundColor: backgroundColor });
        canvasInstanceRef.current.renderAll(); // Render only the canvas instance
        setColorApplied(true);
      }
    };

    const applyColor = () => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (color.length > 0 && activeObject && activeObject.type === "textbox") {
        activeObject.setSelectionStyles({
          fill: color,
        });

        canvasInstanceRef.current.renderAll();
        setColorApplied(true);
      }
    };

    const removeColor = () => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.setSelectionStyles({ fill: "#ffffff" });
        canvasInstanceRef.current.renderAll();
        setColor(color);
        // setColor('#FD3232');
        // setColorApplied(false);
        // canvas.discardActiveObject().renderAll();
      }
    };

    const applyFontWeight = () => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.setSelectionStyles({
          fontWeight: fontWeightApplied ? "" : "bold",
        });
        canvasInstanceRef.current.renderAll(); // Render only the selected object
        setFontWeightApplied(!fontWeightApplied);
      }
    };

    const applyFontSize = (size) => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.setSelectionStyles({ fontSize: size });
        canvasInstanceRef.current.renderAll(); // Render only the selected object
        setFontSize(size);
      }
    };

    const applyFontFamily = (family) => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.setSelectionStyles({ fontFamily: family });
        canvasInstanceRef.current.renderAll(); // Render only the selected object
        setFontFamily(family);
      }
    };

    const handleButtonClick = (buttonType: string) =>
      setActiveButton(buttonType);

    const loadCanvas = useCallback(
      async (pageNumber?: string) => {
        const templateFound = paginationState?.find(
          (item) => item.page === selectedPage
        );

        await new Promise((resolve) => {
          canvas?.loadFromJSON(templateFound?.templateJSON, () => {
            resolve(null);
          });
        });
      },
      [canvas, template, paginationState, selectedPage]
    );

    // const loadCanvas = async (pageNumber?: number) => {

    //   const templateFound = paginationState?.find(
    //     (item) => item.page === pageNumber || item.page === selectedPage
    //   );
    //   console.log("templateFound", templateFound);

    //   if (canvas && templateFound) {
    //     await new Promise((resolve) => {
    //       canvas.loadFromJSON(templateFound.templateJSON, () => {
    //         resolve(null);
    //       });
    //     });
    //   }
    // };

    useEffect(() => {
      loadCanvas();
      const handleCanvasUpdate = () => {
        const activeObject = canvas?.getActiveObject();
        const isSelectionCleared = canvas?._activeObject === null;
        return setCanvasToolbox((prev) => ({
          ...prev,
          isDeselectDisabled: isSelectionCleared,
          activeObject,
        }));
      };

      const handleMouseDown = (options: IEvent<Event>) => {
        if (options.target) {
          const thisTarget = options.target as fabric.Object;
          const mousePos = canvas?.getPointer(options.e) || { x: 0, y: 0 };

          if (thisTarget.isType("group")) {
            thisTarget.forEachObject((object: any) => {
              if (object.type === "textbox") {
                const matrix = thisTarget.calcTransformMatrix();
                const newPoint = fabric.util.transformPoint(
                  { y: object.top, x: object.left },
                  matrix
                );
                const objectPos = {
                  xStart: newPoint.x - (object.width * object.scaleX) / 2,
                  xEnd: newPoint.x + (object.width * object.scaleX) / 2,
                  yStart: newPoint.y - (object.height * object.scaleY) / 2,
                  yEnd: newPoint.y + (object.height * object.scaleY) / 2,
                };

                if (
                  mousePos.x >= objectPos.xStart &&
                  mousePos.x <= objectPos.xEnd &&
                  mousePos.y >= objectPos.yStart &&
                  mousePos.y <= objectPos.yEnd
                ) {
                  handleGroupClick(thisTarget, object);
                }
              }
            });
          }
        }
      };

      const handleGroupClick = (group: any, textObject: any) => {
        let groupItems: any;

        const ungroup = () => {
          groupItems = group._objects;
          group._restoreObjectsState();
          canvas?.remove(group);

          groupItems.forEach((item: any) => {
            if (item !== textObject) {
              item.selectable = false;
            }
            canvas?.add(item);
          });

          canvas?.renderAll();
        };

        ungroup();

        canvas?.setActiveObject(textObject);
        textObject.enterEditing();
        textObject.selectAll();

        let exitEditing = true;

        textObject.on("editing:exited", () => {
          if (exitEditing) {
            const items: any[] = [];
            groupItems.forEach((obj: any) => {
              items.push(obj);
              canvas?.remove(obj);
            });

            const grp = new fabric.Group(items, {
              customType: "swipeGroup",
            });
            canvas?.add(grp);
            exitEditing = false;
          }
        });
      };
      canvas?.on("mouse:down", handleMouseDown);
      // Attach canvas update listeners
      // canvas?.on('mouse:down', handleMouseClick);
      canvas?.on("selection:created", handleCanvasUpdate);
      canvas?.on("selection:updated", handleCanvasUpdate);
      canvas?.on("selection:cleared", handleCanvasUpdate);

      // Cleanup the event listeners when the component unmounts
      return () => {
        // canvas?.on('mouse:down', handleMouseClick);
        canvas?.off("selection:created", handleCanvasUpdate);
        canvas?.off("selection:updated", handleCanvasUpdate);
        canvas?.off("selection:cleared", handleCanvasUpdate);
      };
    }, [loadCanvas]);

    // Define an array to store references to created bubbles
    const createdBubbles: fabric.Object[] = [];

    const updateBubbleImageContrast = () => {
      const activeObject = canvas?.getActiveObject();

      if (activeObject && activeObject.type === "image") {
        // Check if the active object is an image
        let contrast = bubbleFilter.contrast; // Get the contrast value

        // Ensure contrast is within valid range
        if (contrast < -1) {
          contrast = -1;
        } else if (contrast > 1) {
          contrast = 1;
        }

        // Modify the contrast of the image
        activeObject.filters = []; // Clear existing filters
        activeObject.filters.push(
          new fabric.Image.filters.Contrast({ contrast })
        );
        activeObject.applyFilters();

        canvas?.renderAll(); // Render the canvas to see the changes
      }
    };

    const updateBubbleImageBrightness = () => {
      const activeObject = canvas?.getActiveObject();

      if (activeObject && activeObject.type === "image") {
        // Check if the active object is an image
        let brightness = bubbleFilter.brightness; // Get the brightness value

        // Ensure brightness is within valid range
        if (brightness < -1) {
          brightness = -1;
        } else if (brightness > 1) {
          brightness = 1;
        }

        // Modify the brightness of the image
        activeObject.filters = []; // Clear existing filters
        activeObject.filters.push(
          new fabric.Image.filters.Brightness({ brightness })
        );
        activeObject.applyFilters();

        canvas?.renderAll(); // Render the canvas to see the changes
      }
    };

    const updateBubbleImage = (
      imgUrl: string | undefined,
      filter?: { strokeWidth: number; stroke: string },
      shadow?: {
        color: string;
        offsetX: number;
        offsetY: number;
        blur: number;
      },
      brightness?: number
    ) => {
      const existingBubbleStroke = getExistingObject("bubbleStroke");

      if (!canvas) {
        console.error("Canvas Not initialized");
        return;
      }
      if (shadow) {
        const newOptions: fabric.ICircleOptions = {
          shadow: {
            color: shadow.color || "rgba(0,0,0,0.5)",
            offsetX: shadow.offsetX || 10,
            offsetY: shadow.offsetY || 10,
            blur: shadow.blur || 1,
          },
        };
        updateBubbleElement(canvas, existingBubbleStroke, newOptions);
        canvas.renderAll();
      }
      if (!isChecked) {
        let options: fabric.ICircleOptions = {
          ...existingBubbleStroke,
          ...(!existingBubbleStroke &&
            template?.diptych === "horizontal" && { top: 150 }),
          ...(!existingBubbleStroke &&
            template?.diptych === "horizontal" && { left: 150, radius: 80 }),
        };
        // Shadow for newly created bubble with increased length

        options.shadow = {
          color: "rgba(0,0,0,0.5)",
          offsetX: 1,
          offsetY: 1,
          blur: 1,
          spread: 100,
        };
        requestAnimationFrame(() => {
          createBubbleElement1(canvas!, imgUrl!, options);
          canvas.renderAll();
        });
        return;
      }

      const activeBubble = canvas.getActiveObject();

      const obj = {
        left: activeBubble?.left,
        top: activeBubble?.top,
        scaleX: activeBubble?.scaleX,
        scaleY: activeBubble?.scaleY,
        angle: activeBubble?.angle,
        flipX: activeBubble?.flipX,
        flipY: activeBubble?.flipY,
        opacity: activeBubble?.opacity,
        selectable: activeBubble?.selectable,
        hoverCursor: activeBubble?.hoverCursor,
        customType: activeBubble?.customType,
        zoomX: activeBubble?.customType,
        zoomY: activeBubble?.customType,
      };

      if (activeBubble && activeBubble.customType === "bubble") {
        // Remove existing bubble element from canvas
        canvas.remove(activeBubble);

        // Create a new fabric.Image element with the updated image URL
        fabric.Image.fromURL(imgUrl, function (img) {
          // Set properties of the new image to match active bubble

          img.set({
            left: activeBubble.left,
            top: activeBubble.top,
            scaleX: activeBubble.scaleX,
            scaleY: activeBubble.scaleY,
            angle: activeBubble.angle,
            flipX: activeBubble.flipX,
            flipY: activeBubble.flipY,
            opacity: activeBubble.opacity,
            selectable: activeBubble.selectable,
            hoverCursor: activeBubble.hoverCursor,
            customType: activeBubble.customType,
          });

          // Set clip path of the new image to match the active bubble's clip path
          img.clipPath = activeBubble.clipPath;

          // Add the new image to the canvas
          canvas.add(img);

          // Set the new image as the active object
          canvas.setActiveObject(img);

          // Render the canvas
          canvas.renderAll();
        });
      }

      if (!activeBubble && isChecked) {
        // let options: fabric.ICircleOptions = {
        // 	...existingBubbleStroke,
        // 	...(!existingBubbleStroke &&
        // 		template.diptych === 'horizontal' && { top: 150 }),
        // 	...(!existingBubbleStroke &&
        // 		template.diptych === 'horizontal' && { left: 150, radius: 80 }),
        // };
        requestAnimationFrame(() => {
          createBubbleElement(canvas!, imgUrl!);
          canvas.renderAll();
        });
      }
    };

    //-----------------------------------------------
    // const [bubbleObjectState, setBubbleObjectState] = useState({});
    // console.log("bubbleObjectState", bubbleObjectState);
    // useEffect(() => {
    //   const handleSelectionChanged = () => {
    //     const activeObject = canvas?.getActiveObject();
    //     console.log(
    //       "🚀 ~ handleSelectionChanged ~ activeObject:",
    //       activeObject
    //     );
    //     if (activeObject?.customType === "bubble") {
    //       fabric.Image.fromURL("image_1713875134.007559.png", function (img) {
    //         img.set({
    //           left: activeObject.left,
    //           top: activeObject.top,
    //           scaleX: activeObject.scaleX,
    //           scaleY: activeObject.scaleY,
    //           angle: activeObject.angle,
    //           flipX: activeObject.flipX,
    //           flipY: activeObject.flipY,
    //           opacity: activeObject.opacity,
    //           selectable: activeObject.selectable,
    //           hoverCursor: activeObject.hoverCursor,
    //           customType: activeObject.customType,
    //         });
    //         canvas.remove(activeObject);
    //         canvas.add(img);
    //         canvas.setActiveObject(img);
    //         canvas.renderAll();
    //       });
    //     }
    //   };

    //   canvas?.on("selection:created", handleSelectionChanged);
    //   canvas?.on("selection:updated", handleSelectionChanged);
    //   canvas?.on("selection:cleared", handleSelectionChanged);

    //   return () => {
    //     canvas?.off("selection:created", handleSelectionChanged);
    //     canvas?.off("selection:updated", handleSelectionChanged);
    //     canvas?.off("selection:cleared", handleSelectionChanged);
    //   };
    // }, [canvas]);

    //---------------------------------------------
    /**
     * Updates the background filters of the canvas.
     * @param {IBaseFilter} filter - The filter to be applied to the background image.
     * @return {void} This function does not return anything.
     */

    const updateBackgroundFilters = debounce(
      (filter: fabric.IBaseFilter, type: string): void => {
        if (!canvas) return;

        const bgImages = ["bg-1"];

        if (!template?.backgroundImage) bgImages.push("bg-2");

        for (const customType of bgImages) {
          const existingObject: fabric.Image | undefined = getExistingObject(
            customType
          ) as fabric.Image;
          if (existingObject) {
            const hasBrightnessOrContrast =
              filter.hasOwnProperty("brightness") ||
              filter.hasOwnProperty("contrast");

            const index: number | undefined = existingObject.filters?.findIndex(
              (fil) => fil[type as any]
            );

            if (type === "sharpen") {
              // Check if sharpen filter is already applied
              const sharpenIndex = existingObject.filters?.findIndex(
                (fil) => fil instanceof fabric.Image.filters.Convolute
              );
              if (sharpenIndex !== -1) {
                // Remove sharpen filter
                existingObject.filters?.splice(sharpenIndex, 1);
              } else {
                // Add sharpen filter
                existingObject.filters?.push(filter);
              }
            } else if (index !== -1) {
              existingObject.filters?.splice(index as number, 1, filter);
              if (!hasBrightnessOrContrast)
                existingObject.filters?.splice(index as number, 1);
            } else {
              existingObject.filters?.push(filter);
            }
            existingObject.applyFilters();
            canvas.renderAll();
          }
        }
      },
      200
    );

    //vertical to horizontal line
    const [isSelected, setIsSelected] = useState(false);
    //---------------------------------Canvas---------------------------------------------

    function draw_grid(canvasRef, grid_size) {
      const canvas = canvasRef.current;
      if (!canvas) return; // Check if canvasRef is valid

      const ctx = canvas.getContext("2d");
      const currentCanvasWidth = canvas.width;
      const currentCanvasHeight = canvas.height;

      // Drawing vertical lines
      let x;
      for (x = 0; x <= currentCanvasWidth; x += grid_size) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, currentCanvasHeight);
      }

      // Drawing horizontal lines
      let y;
      for (y = 0; y <= currentCanvasHeight; y += grid_size) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(currentCanvasWidth, y + 0.5);
      }

      ctx.strokeStyle = "#ebebeb";
      ctx.stroke();
    }

    function hideGrid(canvasRef, originalImage) {
      const canvas = canvasRef.current;
      if (!canvas || !originalImage) return;

      const ctx = canvas.getContext("2d");
      const currentCanvasWidth = canvas.width;
      const currentCanvasHeight = canvas.height;

      // Clear the canvas by filling it with the background color or any content you want
      ctx.clearRect(0, 0, currentCanvasWidth, currentCanvasHeight);
    }

    const darw_Grid_btn = () => {
      if (canvasEl.current) {
        draw_grid(canvasEl, 15);
      }
    };

    const toggleSelection = () => {
      setIsSelected(!isSelected);
      if (isSelected) {
        const activeObject = canvas?.getActiveObject();
        if (activeObject) {
          if (activeObject && activeObject.type === "textbox") {
            const textbox = activeObject as fabric.Textbox;
            const newText = textbox.text.split("").join("\n");

            textbox.set({
              // ...options,
              text: newText,
              visible: true,
              width: 25,
              top: 10,
              left: 100,
              fontSize: 12,
            });
            // canvas?.add(textboxObj);

            canvas?.requestRenderAll();
            canvas?.discardActiveObject();
            canvas?.renderAll();
          } else {
            toast.error("Textbox not found or not active");
          }
        } else {
          toast.error("Not Selected Text");
        }
      } else {
        const activeObject = canvas?.getActiveObject();

        if (activeObject) {
          // Check if the active object exists and is of type "textbox"
          if (activeObject && activeObject.type === "textbox") {
            const textbox = activeObject as fabric.Textbox;

            // Split the text into an array of characters and join them with newline characters
            const newText = textbox.text.split("").join("\n");
            let characters = newText.split("\n");

            // Step 2: Join the characters together
            let originalText = characters.join("");

            // Update the textbox properties
            // textbox.set({
            //   // ...options,
            //   text: originalText,
            //   visible: true,
            //   width: 305,
            //   top: 50,
            //   left: 50,
            //   fontSize: 16,
            // });
            textbox.set({
              // ...other options,
              text: originalText,
              visible: true,
              width: 305,
              top: 500,
              left: 50,
              fontSize: 16,
              textAlign: "center",
              originY: "center",
            });

            // canvas?.add(textboxObj);
            // Render the canvas
            canvas?.requestRenderAll();
            canvas?.discardActiveObject();
            canvas?.renderAll();
          } else {
            toast.error("Textbox not found or not active");
          }
        } else {
          toast.error("Not Selected Text");
        }
      }
    };

    //-------------chose element color change
    const [selectedColor, setSelectedColor] = useState(
      userMetaData?.company?.color || "#ffffff"
    );

    //------------------------------------------------------------------------------------

    //old code
    const updateBackgroundImage = debounce((imageUrl: string) => {
      if (!canvas) return;

      let activeObject: fabric.Object | undefined | null =
        canvas.getActiveObject() || getExistingObject("bg-1");

      if (!template.backgroundImage && !canvas.getActiveObject()) {
        let currentImageIndex = initialData.backgroundImages?.findIndex(
          (bgImage: string) => bgImage === imageUrl
        );
        activeObject = getExistingObject(
          currentImageIndex % 2 === 0 ? "bg-1" : "bg-2"
        );
      }

      let currentImageIndex = initialData.backgroundImages?.findIndex(
        (bgImage: string) => bgImage === imageUrl
      );

      if (!activeObject) {
        if (template?.diptych === "horizontal") {
          // createHorizontalCollage(canvas, [imageUrl, imageUrl]);
          if (currentImageIndex !== undefined && currentImageIndex % 2 === 0) {
            createHorizontalCollage(canvas, [imageUrl, null]);
          } else if (
            currentImageIndex !== undefined &&
            currentImageIndex % 2 !== 0
          ) {
            createHorizontalCollage(canvas, [null, imageUrl]);
          }
        } else if (template?.diptych === "vertical") {
          // createVerticalCollage(canvas, [imageUrl, imageUrl]);
          if (currentImageIndex !== undefined && currentImageIndex % 2 === 0) {
            createVerticalCollage(canvas, [imageUrl, null]);
          } else if (
            currentImageIndex !== undefined &&
            currentImageIndex % 2 !== 0
          ) {
            createVerticalCollage(canvas, [null, imageUrl]);
          }
          return;
        }
      }

      if (!activeObject) return console.log("Still Object not found");

      if (template?.backgroundImage || !template?.diptych)
        updateImageSource(canvas, imageUrl, activeObject);
      else if (template?.diptych === "vertical")
        updateVerticalCollageImage(canvas, imageUrl, activeObject);
      else updateHorizontalCollageImage(canvas, imageUrl, activeObject);
    }, 100);

    const updateOverlayImage = debounce((image: string, opacity: number) => {
      if (!canvas) {
        console.log("Canvas not loaded yet");
        return;
      }
      const existingObject = getExistingObject("overlay");

      const canvasWidth: number | undefined = canvas.width;
      const canvasHeight: number | undefined = canvas.height;

      if (!canvasWidth || !canvasHeight) return;

      if (existingObject) {
        existingObject.animate(
          { opacity: opacity },
          {
            duration: 200,
            onChange: canvas.renderAll.bind(canvas),
          }
        );
        if (opacity === 0) {
          setTimeout(() => {
            canvas.remove(existingObject);
          }, 100);
        }

        return;
      } else {
        fabric.Image.fromURL(
          image,
          function (img) {
            img.scaleToWidth(canvas.width || 0);
            img.scaleToHeight(canvas.height || 0);

            img.set({
              opacity: +opacity || 1,
              selectable: false,
              perPixelTargetFind: false,
              evented: false,
            });

            img.customType = "overlay";

            canvas.insertAt(img, 3, false);
            requestAnimationFrame(() => {
              canvas.renderAll();
            });
          },
          {
            crossOrigin: "anonymous",
          }
        );
      }
    }, 100);

    const updateRectangle = (options: IRectOptions) => {
      if (!canvas) return;

      const existingObject = getExistingObject("photo-border");

      if (existingObject)
        updateRect(existingObject, {
          ...options,
          top: existingObject?.top,
          left: existingObject.left,
          customType: "photo-border",
        });
      canvas.requestRenderAll();
    };

    /**
     * Uploads an image and updates the initial data.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The event triggered by the input element.
     * @param {keyof typeof initialData} field - The field in the initialData object to update.
     * @return {void} This function does not return a value.
     */
    const uploadImage = (
      event: React.ChangeEvent<HTMLInputElement>,
      field: keyof typeof initialData
    ): void => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setInitialData((prev) => ({
        ...prev,
        [field]: [URL.createObjectURL(files[0]), ...prev[field]],
      }));
    };

    const deselectObj = () => {
      canvas?.discardActiveObject();
      canvas?.renderAll();

      requestAnimationFrame(() => {
        setCanvasToolbox((prev) => ({
          ...prev,
          activeObject: null,
          isDeselectDisabled: true,
        }));
      });
    };

    const deleteActiveSelection = () => {
      if (!canvas) return;
      canvas.remove(canvas._activeObject);
      canvas.requestRenderAll();
    };

    const [value, setValue] = React.useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) =>
      setValue(newValue);

    const flipImage = (flipAxis: "flipX" | "flipY" = "flipX") => {
      const activeObject = canvas?.getActiveObject();
      if (activeObject) {
        activeObject[flipAxis] = !activeObject[flipAxis];
        canvas?.renderAll();
      }
    };

    const debouncedUpdateRectangle = debounce((strokeWidth) => {
      if (!canvas) {
        console.log("Canvas not found");
        return;
      }
      const existingObject = getExistingObject("photo-border") as fabric.Rect;

      if (template?.diptych === "horizontal") {
        updateRectangle({
          selectable: true,
          lockMovementX: existingObject.lockMovementX,
          lockMovementY: existingObject.lockMovementY,
          strokeWidth,
          left: canvas?.getWidth() / 2 - strokeWidth / 2,
        });
      } else {
        updateRectangle({
          selectable: true,
          lockMovementX: existingObject.lockMovementX,
          lockMovementY: existingObject.lockMovementY,
          strokeWidth,
          top: canvas?.getHeight() / 2 - strokeWidth / 2,
        });
      }
    }, 100);

    //---------------------Sharpen --------------------------
    const [sharpenApplied, setSharpenApplied] = useState(false);

    const shapeData = [
      { imgShape: shape1 },
      { imgShape: shape2 },
      { imgShape: shape3 },
      { imgShape: shape4 },
      { imgShape: shape5 },
      { imgShape: shape6 },
      { imgShape: shape7 },
      { imgShape: shape8 },
      { imgShape: shape9 },
      { imgShape: shape10 },
    ];

    const borderColorChangeHandler = (imgShape) => {
      const color = userMetaData?.company?.color || "#909AE9";

      var filter = new fabric.Image.filters.BlendColor({
        color,
        mode: "tint",
        alpha: 1,
      });

      fabric.Image.fromURL(
        imgShape,
        function (img) {
          img.set({ left: 230, top: 250 }).scale(0.2);
          img.filters.push(filter);
          img.applyFilters();
          canvas.add(img);
          requestAnimationFrame(() => {
            canvas.renderAll();
          });
        },
        {
          crossOrigin: "anonymous",
        }
      );
    };

    const swipeData = [
      { swipeImg: swipe1, id: 1 },
      { swipeImg: swipe2, id: 2 },
      { swipeImg: swipe3, id: 3 },
      { swipeImg: arrowImg1, id: 4 },
      { swipeImg: arrowImg2, id: 5 },
      { swipeImg: arrowImg3, id: 6 },
      { swipeImg: arrowImg4, id: 7 },
    ];

    const swipeColorChangeHandler = (id, swipeImg) => {
      const color = userMetaData?.company?.color || "#909AE9";

      var filter = new fabric.Image.filters.BlendColor({
        color,
        mode: "tint",
        alpha: 1,
      });

      fabric.Image.fromURL(
        swipeImg,
        function (img) {
          img.set({ left: 230, top: 250 }).scale(0.2);
          img.filters.push(filter);
          img.applyFilters();
          canvas.add(img);
          requestAnimationFrame(() => {
            canvas.renderAll();
          });
        },
        {
          crossOrigin: "anonymous",
        }
      );
    };

    const socialPlatformsData1 = [
      { spImg: socialPlatformsImg1 },
      { spImg: socialPlatformsImg2 },
      { spImg: socialPlatformsImg3 },
      { spImg: socialPlatformsImg4 },
      { spImg: socialPlatformsImg5 },
      { spImg: socialPlatformsImg6 },
      { spImg: socialPlatformsImg7 },
      { spImg: socialPlatformsImg8 },
      { spImg: socialPlatformsImg9 },
      { spImg: socialPlatformsImg10 },
    ];
    const socialPlatformsData2 = [
      { spImg: socialPlatformsImg11 },
      { spImg: socialPlatformsImg12 },
      { spImg: socialPlatformsImg13 },
      { spImg: socialPlatformsImg14 },
      { spImg: socialPlatformsImg15 },
      { spImg: socialPlatformsImg16 },
      { spImg: socialPlatformsImg17 },
      { spImg: socialPlatformsImg18 },
      { spImg: socialPlatformsImg19 },
      { spImg: socialPlatformsImg20 },
    ];

    const socialPlatformsData3 = [
      { spImg: socialPlatformsImg21 },
      { spImg: socialPlatformsImg22 },
      { spImg: socialPlatformsImg23 },
      { spImg: socialPlatformsImg24 },
      { spImg: socialTag1 },
      { spImg: socialTag2 },
      { spImg: socialTag3 },
    ];

    const dividersData = [
      { dividerImg: dividers1 },
      { dividerImg: dividers2 },
      { dividerImg: dividers3 },
      { dividerImg: dividers4 },
      { dividerImg: dividers5 },
      { dividerImg: dividers6 },
    ];
    const dividerColorChangeHandler = (imgShape) => {
      const color = userMetaData?.company?.color || "#909AE9";

      var filter = new fabric.Image.filters.BlendColor({
        color,
        mode: "tint",
        alpha: 1,
      });

      fabric.Image.fromURL(
        imgShape,
        function (img) {
          img.set({ left: 230, top: 250 }).scale(0.2);
          img.filters.push(filter);
          img.applyFilters();
          canvas.add(img);
          requestAnimationFrame(() => {
            canvas.renderAll();
          });
        },
        {
          crossOrigin: "anonymous",
        }
      );
    };

    const findHighestPageNumber = (
      paginationState: PaginationStateItem[]
    ): number => {
      let highestPageNumber = 0;

      paginationState.forEach((item) => {
        if (item.page > highestPageNumber) {
          highestPageNumber = item.page;
        }
      });

      return highestPageNumber + 1;
    };

    const addTemplate = async () => {
      const currentTemplateJSON = await saveJSON(canvas, true);

      update(selectedPage, { templateJSON: currentTemplateJSON });

      const highestPageNumber = findHighestPageNumber(paginationState);

      const templateFound = templateData.templates?.find(
        (item) => item.filePath === paginationState[0].filePath
      );

      let templateJSON;

      try {
        templateJSON = await import(
          `../../constants/templates/${template.filePath}.json`
        );
      } catch (error) {
        console.error("Error importing JSON file:", error);
        return;
      }

      const obj = {
        page: highestPageNumber,
        filePath: templateFound.filePath,
        templateJSON: templateJSON,
        ...templateFound,
      };

      addPage(obj);
      setSelectedPage(highestPageNumber);
      setTimeout(() => {
        loadCanvas(highestPageNumber);
      }, 2000);
    };

    const exportMultiCanvases = async () => {
      const zip = new JSZip();

      // Loop through paginationState
      for (const page of paginationState) {
        // Load templateJSON into canvas
        await new Promise((resolve) => {
          canvas?.loadFromJSON(page.templateJSON, () => {
            resolve(null);
          });
        });

        // Extract image data from canvas
        const imageData = canvas?.toDataURL({ format: "png" });

        // Add image data to zip file
        zip.file(`page_${page.page}.png`, imageData.split("base64,")[1], {
          base64: true,
        });
      }

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Convert blob to URL
      const zipUrl = URL.createObjectURL(zipBlob);

      // Create a link element
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = "exported_images.zip";

      // Simulate click on the link to trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    };

    const [shadowValues, setShadowValues] = useState({
      opacity: 0.5, // Initial opacity value
      distance: 10, // Initial distance value
      blur: 5, // Initial blur radius value
    });
    const [elementShadowValues, setElementShadowValues] = useState({
      opacity: 0.5, // Initial opacity value
      distance: 10, // Initial distance value
      blur: 5, // Initial blur radius value
    });
    const [hexConversionForElement, setHexConversionForElement] = useState<
      string | null
    >(null);
    const [bubbleFilter, setBubbleFilter] = useState({
      contrast: "",
      brightness: "",
    });
    const [elementOpacity, setElementOpacity] = useState<number>(1);

    const updateElementOpacity = () => {
      const activeObject = canvas?.getActiveObject();

      if (activeObject && activeObject.type === "image") {
        let opacity = elementOpacity;

        // Ensure opacity is within valid range
        if (opacity < 0) {
          opacity = 0;
        } else if (opacity > 1) {
          opacity = 1;
        }

        // Modify the opacity of the image
        activeObject.set("opacity", opacity);
        canvas?.renderAll(); // Render the canvas to see the changes
      }
    };

    const updateElementShadow = (
      imgUrl: string | undefined,
      filter?: { strokeWidth: number; stroke: string },
      shadow?: {
        color: string;
        offsetX: number;
        offsetY: number;
        blur: number;
      },
      brightness?: number
    ) => {
      const activeObject = canvas?.getActiveObject();

      if (activeObject) {
        // Check if the active object exists
        const { offsetX, offsetY, blur } = shadowValues;

        // Modify the shadow properties of the active object
        // color: shadow.color || "rgba(0,0,0,0.5)",
        // offsetX: shadow.offsetX || 10,
        // offsetY: shadow.offsetY || 10,
        // blur: shadow.blur || 1,
        activeObject.set({
          shadow: {
            color: shadow.color || "rgba(0,0,0,0.5)",
            offsetX: shadow.offsetX || 10,
            offsetY: shadow.offsetY || 10,
            blur: shadow.blur || 1,
          },
        });
        canvas?.renderAll(); // Render the canvas to see the changes
      }
    };
    const [hexConvertion, setHexConversion] = useState<string | null>(null);
    // const [bubbleObjectState, setBubbleObjectState] = useState({});
    // console.log("bubbleObjectState", bubbleObjectState);

    // useEffect(() => {
    //   const handleSelectionChanged = () => {
    //     const activeObject = canvas?.getActiveObject();
    //     console.log("activeObject", activeObject);
    //     if (activeObject && activeObject.customType === "bubbleStroke") {
    //       const groupObjects = canvas
    //         ?.getObjects()
    //         .filter((obj) => obj.group && obj.group === activeObject.id);
    //       if (groupObjects && groupObjects.length > 0) {
    //         const bubbleObject = groupObjects.find(
    //           (obj) => obj.type === "image" && obj.customType === "bubble"
    //         );
    //         if (bubbleObject) {
    //           const outerCircle = activeObject;
    //           const relativePosition = {
    //             left: bubbleObject.left - outerCircle.left,
    //             top: bubbleObject.top - outerCircle.top,
    //           };
    //           setBubbleObjectState({
    //             position: relativePosition,
    //             id: bubbleObject.id,
    //             parent: outerCircle.id,
    //           });
    //         }
    //       }
    //     }
    //   };

    //   canvas?.on("selection:created", handleSelectionChanged);
    //   canvas?.on("selection:updated", handleSelectionChanged);
    //   canvas?.on("selection:cleared", handleSelectionChanged);

    //   return () => {
    //     canvas?.off("selection:created", handleSelectionChanged);
    //     canvas?.off("selection:updated", handleSelectionChanged);
    //     canvas?.off("selection:cleared", handleSelectionChanged);
    //   };
    // }, [canvas]);

    // ------------------------save all templates--------------------------------
    const [templateSaved, setTemplateSaved] = useState(false);

    const handleSaveTemplate = async (event) => {
      event.preventDefault();
      const currentTemplateJSON = await saveJSON(canvas, true);
      update(selectedPage, { templateJSON: currentTemplateJSON });
      loadCanvas(selectedPage);
      setTemplateSaved(true); // Mark template as saved
    };

    const handleExport = async () => {
      if (templateSaved) {
        await exportMultiCanvases();
      } else {
        // Show alert if template is not saved
        toast.error("Please save all templates before exporting.");
      }
    };

    const [summaryContent, setSummaryContent] = useState<{ content: string }>({
      content: "",
    });

    useEffect(() => {
      (async () => {
        const response = await getSummary(scrapURL);

        if (response?.success)
          setSummaryContent(response?.data?.data?.response);
      })();
    }, []);

    return (
      <div
        style={{
          display: "flex",
          columnGap: "50px",
          marginTop: 50,
          marginBottom: 50,
          // border: '1px solid red',
        }}
      >
        <div>
          <div
            style={{
              background:
                "repeating-linear-gradient(transparent, transparent 10px, rgba(0, 0, 0, 0.1) 11px), repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0, 0, 0, 0.1) 11px);",
            }}
          >
            <DeselectIcon
              color={canvasToolbox.isDeselectDisabled ? "disabled" : "inherit"}
              aria-disabled={canvasToolbox.isDeselectDisabled}
              onClick={deselectObj}
              sx={{
                cursor: "pointer",
              }}
            />

            <DeleteIcon
              color={canvasToolbox.isDeselectDisabled ? "disabled" : "inherit"}
              aria-disabled={canvasToolbox.isDeselectDisabled}
              onClick={deleteActiveSelection}
              sx={{
                cursor: "pointer",
                mx: 0.5,
              }}
            />
            <img
              src="/icons/flipX.svg"
              className={
                !canvasToolbox.isDeselectDisabled ? "filter-white" : ""
              }
              style={{
                width: 25,
                height: 25,
                margin: "0 0.3rem",
                cursor: "pointer",
              }}
              onClick={() => flipImage("flipX")}
            />

            <img
              src="/icons/flipY.svg"
              className={
                !canvasToolbox.isDeselectDisabled ? "filter-white" : ""
              }
              style={{
                width: 25,
                height: 25,
                cursor: "pointer",
                marginLeft: 1.5,
                marginRight: 1.5,
              }}
              onClick={() => flipImage("flipY")}
            />
            {/* <GridOnIcon
              color={isSelected ? "primary" : "disabled"}
              // onClick={darw_Grid_btn}
              onClick={toggleSelection}
              sx={{
                px: 1,
                color: "white",
                cursor: "pointer",
              }}
            /> */}
            <GridOnIcon
              color={canvasToolbox.isDeselectDisabled ? "disabled" : "inherit"}
              aria-disabled={canvasToolbox.isDeselectDisabled}
              onClick={darw_Grid_btn}
              sx={{
                cursor: "pointer",
                mx: 0.5,
              }}
            />

            {isSelected ? (
              <SwipeVerticalIcon
                color={
                  canvasToolbox.isDeselectDisabled ? "disabled" : "inherit"
                }
                aria-disabled={canvasToolbox.isDeselectDisabled}
                onClick={toggleSelection}
                sx={{
                  cursor: "pointer",
                  ml: 0.5,
                }}
              />
            ) : (
              <SwipeRightIcon
                color={
                  canvasToolbox.isDeselectDisabled ? "disabled" : "inherit"
                }
                aria-disabled={canvasToolbox.isDeselectDisabled}
                onClick={toggleSelection}
                sx={{
                  cursor: "pointer",
                }}
              />
            )}
          </div>

          <canvas width="1080" height="1350" ref={canvasEl} />

          {/* Footer Panel  Start*/}
          {activeTab == "background" && dropDown && (
            <div
              style={{
                width: "555px",
              }}
            >
              <Paper className={classes.root}>
                <div
                  className={classes.optionsContainer}
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <Button
                    className={`${classes.button} ${
                      activeButton === "Overlay" && classes.buttonActive
                    }`}
                    variant="text"
                    color="primary"
                    onClick={() => handleButtonClick("Overlay")}
                  >
                    Overlay
                  </Button>
                  <Button
                    className={`${classes.button} ${
                      activeButton === "Brightness" && classes.buttonActive
                    }`}
                    variant="text"
                    color="primary"
                    onClick={() => handleButtonClick("Brightness")}
                  >
                    Brightness
                  </Button>
                  <Button
                    className={`${classes.button} ${
                      activeButton === "Contrast" && classes.buttonActive
                    }`}
                    variant="text"
                    color="primary"
                    onClick={() => handleButtonClick("Contrast")}
                  >
                    Contrast
                  </Button>
                  <Button
                    className={`${classes.button} ${
                      activeButton === "Filters" && classes.buttonActive
                    }`}
                    variant="text"
                    color="primary"
                    onClick={() => handleButtonClick("Filters")}
                  >
                    Filter
                  </Button>

                  {template?.diptych && !template?.backgroundImage ? (
                    <Button
                      className={`${classes.button} ${
                        activeButton === "border" && classes.buttonActive
                      }`}
                      variant="text"
                      color="primary"
                      onClick={() => handleButtonClick("border")}
                    >
                      Border
                    </Button>
                  ) : null}
                </div>
                {activeButton === "Overlay" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="Overlay, Brightness, Contrast"
                      color="secondary"
                      value={filterValues.overlay.opacity}
                      min={0}
                      onChange={(e: any) => {
                        // if (val !== 0) {
                        const val = +(+e.target.value).toFixed(2);
                        setFilterValues((prev) => ({
                          ...prev,
                          overlay: {
                            ...prev.overlay,
                            opacity: +e.target.value,
                          },
                        }));

                        updateOverlayImage(filterValues.overlay.imgUrl, val);

                        // }
                      }}
                      max={1}
                      step={0.02}
                      valueLabelDisplay="auto"
                    />
                  </div>
                )}

                {activeButton === "Contrast" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="Overlay, Brightness, Contrast"
                      color="secondary"
                      defaultValue={0}
                      min={-1}
                      value={filtersRange.contrast}
                      max={1}
                      step={0.01}
                      valueLabelDisplay="auto"
                      //eslint-disable-next-line
                      onChange={(e: any) => {
                        let value = +e.target.value;
                        setFiltersRange({ ...filtersRange, contrast: value });
                        var filter = new fabric.Image.filters.Contrast({
                          contrast: value,
                        });
                        updateBackgroundFilters(filter, "contrast");
                      }}
                    />
                  </div>
                )}
                {activeButton === "Brightness" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="Overlay, Brightness, Contrast"
                      color="secondary"
                      defaultValue={0}
                      min={-1}
                      max={1}
                      step={0.01}
                      value={filtersRange.brightness}
                      valueLabelDisplay="auto"
                      onChange={(e: any) => {
                        let value = +e.target.value;
                        setFiltersRange({ ...filtersRange, brightness: value });
                        var filter = new fabric.Image.filters.Brightness({
                          brightness: value,
                        });

                        updateBackgroundFilters(filter, "brightness");
                      }}
                    />
                  </div>
                )}
                {activeButton === "Filters" && (
                  <div className={classes.sliderContainer}>
                    {availableFilters.map((filter) => (
                      <Button
                        key={filter.name}
                        className={`${classes.button} ${
                          selectedFilter === filter.name && classes.buttonActive
                        }`}
                        variant="text"
                        color="primary"
                        onClick={() =>
                          updateBackgroundFilters(filter.filter, filter.name)
                        }
                      >
                        {filter.name}
                      </Button>
                    ))}
                  </div>
                )}

                {activeButton === "border" && (
                  <Stack
                    width="inherit"
                    mx={10}
                    spacing={2}
                    direction="row"
                    sx={{ mb: 1 }}
                    alignItems="center"
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CustomColorPicker
                        value={overlayTextFiltersState.color}
                        changeHandler={(color: string) => {
                          updateRectangle({
                            ...filterValues.collage,
                            stroke: color,
                          });
                          setFilterValues((prev) => ({
                            ...prev,
                            collage: { ...prev.collage, stroke: color },
                          }));
                        }}
                      />
                    </Box>
                    <Slider
                      valueLabelDisplay="auto"
                      className={classes.slider}
                      min={0}
                      max={20}
                      aria-label="Volume"
                      // value={filterValues.collage.strokeWidth}
                      onChange={(_e: any, value) => {
                        // const value = +e.target.value;
                        setFilterValues((prev) => ({
                          ...prev,
                          collage: { ...prev.collage, strokeWidth: value },
                        }));

                        debouncedUpdateRectangle(value);
                      }}
                    />
                  </Stack>
                )}
              </Paper>
            </div>
          )}
          {(activeTab == "writePost" ||
            activeTab == "title" ||
            activeTab === "element") &&
            dropDown && (
              <div
                style={{
                  width: "555px",
                  // border:"1px solid red"
                }}
              >
                <Paper className={classes.root}>
                  <Box
                    className={classes.optionsContainer}
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      textTransform: "capitalize",
                      width: "100%",
                    }}
                  >
                    <Typography
                      className={classes.heading}
                      onClick={() => setShow("font")}
                      sx={{
                        ml: 1,
                      }}
                    >
                      FONT
                    </Typography>
                    <Typography
                      className={classes.heading}
                      onClick={() => setShow("fontWeight")}
                    >
                      FONTWEIGHT
                    </Typography>
                    <Typography
                      className={classes.heading}
                      onClick={() => setShow("charSpacing")}
                    >
                      SPACING
                    </Typography>
                    <Typography
                      className={classes.heading}
                      onClick={() => setShow("colors")}
                    >
                      COLORS
                    </Typography>
                    <Typography
                      className={classes.heading}
                      onClick={() => setShow("size")}
                    >
                      SIZE
                    </Typography>
                    {activeTab === "element" && (
                      <>
                        <Typography
                          className={classes.heading}
                          onClick={() => setShow("opacity")}
                        >
                          OPACITY
                        </Typography>
                        <Typography
                          className={classes.heading}
                          onClick={() => setShow("element-shadow")}
                        >
                          SHADOW
                        </Typography>
                      </>
                    )}
                  </Box>
                  {/* <Box
                  sx={{
                    display: "flex",
                    width: "81%",
                  }}
                >
                  {activeTab === "element" && (
                    <>
                      <Typography
                        className={classes.heading}
                        onClick={() => setShow("opacity")}
                      >
                        OPACITY
                      </Typography>
                      <Typography
                        className={classes.heading}
                        onClick={() => setShow("element-shadow")}
                      >
                        SHADOW
                      </Typography>
                    </>
                  )}
                </Box> */}
                  {show === "colors" && (
                    <Box
                      className={classes.optionsContainer}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CustomColorPicker
                        value={overlayTextFiltersState.color}
                        changeHandler={(color: string) => {
                          updateTextBox(canvas, { fill: color });
                          setOverlayTextFiltersState((prev) => ({
                            ...prev,
                            color,
                          }));
                        }}
                      />
                      <Typography
                        sx={{
                          color: "white",
                          px: 1,
                        }}
                      >
                        Text Color
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CustomColorPicker
                          type="color"
                          value={color}
                          changeHandler={(color: string) => {
                            setColor(color);
                            applyColor();
                          }}
                        />

                        <Button
                          onClick={applyColor}
                          sx={{
                            color: "white",
                            textTransform: "none",
                            backgroundColor: colorApplied ? "gray" : "",
                            mx: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "white",
                            }}
                          >
                            Text Highlight
                          </Typography>
                        </Button>
                        <Button
                          onClick={removeColor}
                          sx={{
                            textTransform: "none",
                            minWidth: "10px",
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                      <CustomColorPicker
                        type="color"
                        value={backgroundColor}
                        changeHandler={(color: string) => {
                          setBackgroundColor(color);
                          handleSelectionUpdated();
                        }}
                      />
                      <Button
                        onClick={handleSelectionUpdated}
                        sx={{
                          color: "white",
                          textTransform: "none",
                          backgroundColor: bgColorApplied ? "gray" : "",
                          mx: 1,
                        }}
                      >
                        Bg Color
                      </Button>
                      <Button
                        onClick={removeBackgroundColor}
                        sx={{
                          // color: 'white',
                          textTransform: "none",
                          minWidth: "10px",
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Box>
                  )}

                  {activeTab === "element" && show === "opacity" && (
                    <div className={classes.sliderContainer}>
                      <Slider
                        className={classes.slider}
                        aria-label="size"
                        color="secondary"
                        value={elementOpacity}
                        min={-1}
                        max={1}
                        onChange={(e: any) => {
                          const value = +e.target.value;
                          setElementOpacity(value);
                          updateElementOpacity();
                        }}
                        step={0.01}
                        valueLabelDisplay="auto"
                      />
                    </div>
                  )}
                  {show === "element-shadow" && (
                    <div>
                      {/* setHexConversionForElement */}

                      <Box className={classes.optionsContainer}>
                        <Typography id="opacity-slider" gutterBottom>
                          Color
                        </Typography>
                        <CustomColorPicker
                          value={
                            hexConversionForElement
                              ? overlayTextFiltersState.color
                              : "rgba(0,0,0,1)"
                          }
                          changeHandler={(color: string) => {
                            const rgbaColorCode = hexToRgbA(color);
                            setHexConversionForElement(rgbaColorCode);
                            const splitHexConvertion =
                              rgbaColorCode?.split(",");

                            updateElementShadow(undefined, undefined, {
                              color: `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${elementShadowValues.opacity})`,
                              offsetX: elementShadowValues.distance,
                              offsetY: elementShadowValues.distance,
                              blur: elementShadowValues.opacity,
                            });
                          }}
                        />
                      </Box>

                      <Typography id="opacity-slider" gutterBottom>
                        Opacity
                      </Typography>
                      <Slider
                        aria-labelledby="opacity-slider"
                        value={elementShadowValues.opacity}
                        onChange={(event, newValue) => {
                          setElementShadowValues((prev) => ({
                            ...prev,
                            opacity: newValue,
                          }));

                          const splitHexConvertion =
                            hexConversionForElement.split(",");

                          updateElementShadow(undefined, undefined, {
                            color: hexConversionForElement
                              ? `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${newValue})`
                              : `rgba(0,0,0,${newValue})`,
                            offsetX: elementShadowValues.distance,
                            offsetY: elementShadowValues.distance,
                            blur: elementShadowValues.blur,
                          });
                        }}
                        valueLabelDisplay="auto"
                        step={0.1}
                        min={0}
                        max={1}
                      />
                      <Typography id="distance-slider" gutterBottom>
                        Distance
                      </Typography>
                      <Slider
                        aria-labelledby="distance-slider"
                        value={elementShadowValues.distance}
                        onChange={(event, newValue) => {
                          setElementShadowValues((prev) => ({
                            ...prev,
                            distance: newValue,
                          }));
                          const splitHexConvertion =
                            hexConversionForElement.split(",");
                          updateElementShadow(undefined, undefined, {
                            color: hexConversionForElement
                              ? `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${elementShadowValues.opacity})`
                              : `rgba(0,0,0,${elementShadowValues.opacity}})`,
                            offsetX: newValue,
                            offsetY: newValue,
                            blur: elementShadowValues.blur,
                          });
                        }}
                        valueLabelDisplay="auto"
                        step={1}
                        min={-50}
                        max={50}
                      />
                      <Typography id="blur-slider" gutterBottom>
                        Blur
                      </Typography>
                      <Slider
                        aria-labelledby="blur-slider"
                        value={elementShadowValues.blur}
                        onChange={(event, newValue) => {
                          setElementShadowValues((prev) => ({
                            ...prev,
                            blur: newValue,
                          }));
                          const splitHexConvertion =
                            hexConversionForElement.split(",");
                          updateElementShadow(undefined, undefined, {
                            color: hexConversionForElement
                              ? `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${elementShadowValues.opacity})`
                              : `rgba(0,0,0,${elementShadowValues.opacity}})`,
                            offsetX: elementShadowValues.distance,
                            offsetY: elementShadowValues.distance,
                            blur: newValue,
                          });
                        }}
                        valueLabelDisplay="auto"
                        step={1}
                        min={0}
                        max={20}
                      />
                    </div>
                  )}
                  {show === "elementShadow" && (
                    <div className={classes.sliderContainer}>
                      <Slider
                        className={classes.slider}
                        aria-label="size"
                        color="secondary"
                        value={elementOpacity}
                        min={-1}
                        max={1}
                        onChange={(e: any) => {
                          const value = +e.target.value;
                          setElementOpacity(value);
                          updateElementOpacity();
                        }}
                        step={0.01}
                        valueLabelDisplay="auto"
                      />
                    </div>
                  )}

                  {show === "fontWeight" && (
                    <Box my={2} className={classes.sliderContainer}>
                      <Slider
                        className={classes.slider}
                        aria-label="size"
                        color="secondary"
                        defaultValue={400}
                        value={overlayTextFiltersState.fontWeight}
                        min={100}
                        max={900}
                        onChange={(e: any) => {
                          const value = +e.target.value;
                          updateTextBox(canvas, { fontWeight: value });
                          setOverlayTextFiltersState((prev) => ({
                            ...prev,
                            fontWeight: value,
                          }));
                        }}
                        step={100}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  )}

                  {show === "size" && (
                    <Box my={2} className={classes.sliderContainer}>
                      <Slider
                        className={classes.slider}
                        aria-label="size"
                        color="secondary"
                        defaultValue={overlayTextFiltersState.fontSize}
                        min={10}
                        max={48}
                        onChange={(e: any) => {
                          const value = +e.target.value;
                          updateTextBox(canvas, { fontSize: value });
                          setOverlayTextFiltersState((prev) => ({
                            ...prev,
                            fontSize: value,
                          }));
                        }}
                        step={1}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  )}
                  {show === "charSpacing" && (
                    <Box my={2} className={classes.sliderContainer}>
                      <Slider
                        className={classes.slider}
                        aria-label="size"
                        color="secondary"
                        value={overlayTextFiltersState.charSpacing}
                        min={-200}
                        max={800}
                        onChange={(e: any) => {
                          const charSpacing = +e.target.value;
                          updateTextBox(canvas, { charSpacing });
                          setOverlayTextFiltersState((prev) => ({
                            ...prev,
                            charSpacing,
                          }));
                        }}
                        step={1}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  )}
                  {show === "font" && (
                    <FontsTab value={value} handleChange={handleChange} />
                  )}
                </Paper>
              </div>
            )}
          {activeTab == "bubble" && dropDown && (
            <div
              style={{
                width: "555px",
              }}
            >
              <Paper className={classes.root}>
                <Box
                  className={classes.optionsContainer}
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    pb: 1.5,
                  }}
                >
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("colors")}
                  >
                    COLORS
                  </Typography>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("size")}
                  >
                    SIZE
                  </Typography>

                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("shadow")}
                  >
                    SHADOW
                  </Typography>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("contrast")}
                    // onClick={() => handleButtonClick("Contrast")}
                  >
                    CONTRAST
                  </Typography>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("brightness")}
                    // onClick={() => handleButtonClick("Contrast")}
                  >
                    BRIGHTNESS
                  </Typography>
                </Box>

                {show === "colors" && (
                  <Box className={classes.optionsContainer}>
                    <CustomColorPicker
                      value={overlayTextFiltersState.color}
                      changeHandler={(color: string) => {
                        updateBubbleImage(undefined, {
                          stroke: color,
                          strokeWidth: filterValues.bubble.strokeWidth,
                        });
                        setFilterValues((prev) => ({
                          ...prev,
                          bubble: { ...prev.bubble, stroke: color },
                        }));
                      }}
                    />
                  </Box>
                )}

                {show === "size" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="size"
                      color="secondary"
                      value={filterValues.bubble.strokeWidth}
                      min={1}
                      max={40}
                      onChange={(e: any) => {
                        const value = +e.target.value;
                        updateBubbleImage(undefined, {
                          stroke: filterValues.bubble.stroke,
                          strokeWidth: value,
                        });
                        setFilterValues((prev) => ({
                          ...prev,
                          bubble: { ...prev.bubble, strokeWidth: value },
                        }));
                      }}
                      step={1}
                      valueLabelDisplay="auto"
                    />
                  </div>
                )}

                {show === "shadow" && (
                  <div>
                    <div className={classes.colorPicker}>
                      <Box className={classes.optionsContainer}>
                        <Typography id="opacity-slider" gutterBottom>
                          Color
                        </Typography>
                        <CustomColorPicker
                          value={
                            hexConvertion
                              ? overlayTextFiltersState.color
                              : "rgba(0,0,0,1)"
                          }
                          changeHandler={(color: string) => {
                            const rgbaColorCode = hexToRgbA(color);
                            setHexConversion(rgbaColorCode);
                            const splitHexConvertion =
                              rgbaColorCode?.split(",");

                            updateBubbleImage(undefined, undefined, {
                              color: `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${shadowValues.opacity})`,
                              offsetX: shadowValues.distance,
                              offsetY: shadowValues.distance,
                              blur: shadowValues.opacity,
                            });
                          }}
                        />
                      </Box>
                    </div>

                    <Typography id="opacity-slider" gutterBottom>
                      Opacity
                    </Typography>
                    <Slider
                      aria-labelledby="opacity-slider"
                      value={shadowValues.opacity}
                      onChange={(event, newValue) => {
                        setShadowValues((prev) => ({
                          ...prev,
                          opacity: newValue,
                        }));

                        const splitHexConvertion = hexConvertion?.split(",");

                        updateBubbleImage(undefined, undefined, {
                          color: hexConvertion
                            ? `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${newValue})`
                            : `rgba(0,0,0,${newValue})`,
                          offsetX: shadowValues.distance,
                          offsetY: shadowValues.distance,
                          blur: shadowValues.blur,
                        });
                      }}
                      valueLabelDisplay="auto"
                      step={0.1}
                      min={0}
                      max={1}
                    />

                    <Typography id="distance-slider" gutterBottom>
                      Distance
                    </Typography>
                    <Slider
                      aria-labelledby="distance-slider"
                      value={shadowValues.distance}
                      onChange={(event, newValue) => {
                        setShadowValues((prev) => ({
                          ...prev,
                          distance: newValue,
                        }));
                        const splitHexConvertion = hexConvertion?.split(",");
                        updateBubbleImage(undefined, undefined, {
                          color: hexConvertion
                            ? `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${shadowValues.opacity})`
                            : `rgba(0,0,0,${shadowValues.opacity})`,
                          offsetX: newValue,
                          offsetY: newValue,
                          blur: shadowValues.blur,
                        });
                      }}
                      valueLabelDisplay="auto"
                      step={1}
                      min={-50}
                      max={50}
                    />
                    <Typography id="blur-slider" gutterBottom>
                      Blur
                    </Typography>
                    <Slider
                      aria-labelledby="blur-slider"
                      value={shadowValues.blur}
                      onChange={(event, newValue) => {
                        setShadowValues((prev) => ({
                          ...prev,
                          blur: newValue,
                        }));
                        const splitHexConvertion = hexConvertion?.split(",");

                        updateBubbleImage(undefined, undefined, {
                          color: hexConvertion
                            ? `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${shadowValues.opacity})`
                            : `rgba(0,0,0,${shadowValues.opacity})`,
                          offsetX: shadowValues.distance,
                          offsetY: shadowValues.distance,
                          blur: newValue,
                        });
                      }}
                      valueLabelDisplay="auto"
                      step={1}
                      min={0}
                      max={20}
                    />
                  </div>
                )}

                {show === "contrast" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="size"
                      color="secondary"
                      value={bubbleFilter.contrast}
                      min={-1}
                      max={1}
                      onChange={(e: any) => {
                        const value = +e.target.value;
                        setBubbleFilter((prev) => ({
                          ...prev,
                          contrast: value,
                        }));
                        updateBubbleImageContrast();
                      }}
                      step={0.01}
                      valueLabelDisplay="auto"
                    />
                  </div>
                )}

                {show === "brightness" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="size"
                      color="secondary"
                      value={bubbleFilter.brightness}
                      min={-1}
                      max={1}
                      onChange={(e: any) => {
                        const value = +e.target.value;
                        setBubbleFilter((prev) => ({
                          ...prev,
                          brightness: value,
                        }));
                        updateBubbleImageBrightness();
                      }}
                      step={0.01}
                      valueLabelDisplay="auto"
                    />
                  </div>
                )}
              </Paper>
            </div>
          )}
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 0,
              width: "96%",
            }}
            onClick={() => {
              dropDown ? setDropDown(false) : setDropDown(true);
            }}
          >
            {dropDown ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </Paper>
          <div
            style={{
              display: "flex",
              marginTop: "16px",
              justifyContent: "space-between",
            }}
          >
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
              }}
              onClick={() => updateActiveTab("background")}
            >
              <img
                src="/Tab-Icons/background.png"
                width="100"
                height="100"
                style={{
                  color: "white",
                  fontSize: "30px",
                  filter: activeTab === "background" ? filter : undefined,
                }}
              />
            </button>

            <button
              style={{ backgroundColor: "transparent", border: "none" }}
              onClick={() => updateActiveTab("title")}
            >
              <img
                src="/Tab-Icons/Edit-Text.png"
                width="100"
                height="100"
                style={{
                  color: "white",
                  fontSize: "30px",
                  filter: activeTab === "title" ? filter : undefined,
                }}
              />
            </button>

            <button
              onClick={() => updateActiveTab("bubble")}
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <img
                src="/Tab-Icons/Add-Bubble.png"
                width="100"
                height="100"
                style={{
                  color: "white",
                  fontSize: "30px",
                  filter: activeTab === "bubble" ? filter : undefined,
                }}
              />
            </button>

            <button
              onClick={() => updateActiveTab("element")}
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <img
                src="/Tab-Icons/Add-Elements.png"
                width="100"
                height="100"
                style={{
                  color: "white",
                  fontSize: "30px",
                  filter: activeTab === "element" ? filter : undefined,
                }}
              />
            </button>

            <button
              onClick={() => updateActiveTab("writePost")}
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <img
                src="/Tab-Icons/Write-Post.png"
                width="100"
                height="100"
                style={{
                  color: "white",
                  fontSize: "30px",
                  filter: activeTab === "writePost" ? filter : undefined,
                }}
              />
            </button>
          </div>
          {/* pagination */}
          <div className={classes.paginationContainer}>
            {paginationState.map((item) => {
              return (
                <div
                  onClick={async () => {
                    const currentTemplateJSON = await saveJSON(canvas, true);

                    update(selectedPage, { templateJSON: currentTemplateJSON });

                    setSelectedPage(item.page);
                    loadCanvas(item.page);
                  }}
                  key={item.page}
                  className={classes.paginationStyle}
                >
                  {item.page}
                </div>
              );
            })}
            <div
              className={classes.paginationStyle}
              onClick={() => addTemplate()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          </div>
        </div>

        {/* Footer Panel  End*/}
        {/* Sidebar Tools Panel */}
        {/* <Sidebar /> */}
        <div>
          <div style={{ width: "300px", height: "480px", padding: "10px" }}>
            {activeTab == "background" && (
              <div>
                <h4
                  style={{
                    margin: "0px",
                    padding: "0px",
                  }}
                >
                  From Article
                </h4>

                <ImageViewer
                  clickHandler={(img: string) => updateBackgroundImage(img)}
                  images={initialData.backgroundImages}
                >
                  {template?.diptych === "vertical" ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        py: 1,
                      }}
                    >
                      <div>Top Images</div>
                      <div>Bottom Images</div>
                    </Box>
                  ) : template?.diptych === "horizontal" ? (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-around",
                          py: 1,
                        }}
                      >
                        <div>Left Images</div>
                        <div>Right Images</div>
                      </Box>
                    </>
                  ) : null}
                </ImageViewer>

                {/* <h4 style={{ margin: '0px', padding: '0px' }}>AI Images</h4>  */}

                {/* <ImageViewer
									clickHandler={(img: string) => updateBackgroundImage(img)}
									images={initialData.backgroundImages}
								>
									{template.diptych === 'vertical' ? (
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'space-around',
												py: 1,
											}}
										>
											<div>Top Images</div>
											<div>Bottom Images</div>
										</Box>
									) : template.diptych === 'horizontal' ? (
										<>
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'space-around',
													py: 1,
												}}
											>
												<div>Left Images</div>
												<div>Right Images</div>
											</Box>
										</>
									) : null}
								</ImageViewer> */}

                <Box {...styles.uploadBox}>
                  <label style={styles.uploadLabel}>
                    <h4>IMAGE UPLOAD</h4>

                    <form method="post" encType="multipart/form-data">
                      <input
                        type="file"
                        onChange={(event) =>
                          uploadImage(event, "backgroundImages")
                        }
                        style={{ display: "none" }}
                      />
                    </form>
                    <IconButton color="primary" component="span">
                      <CloudUploadIcon style={{ fontSize: "40px" }} />
                    </IconButton>
                  </label>
                </Box>
              </div>
            )}

            {activeTab == "title" && (
              <div>
                <h4 style={{ margin: "0px", padding: "0px" }}>Titles</h4>
                <div style={{ marginTop: "20px" }}>
                  {texts.map((text: string) => {
                    return (
                      <h5
                        onClick={() => {
                          const existingObject = getExistingObject("title") as
                            | fabric.Textbox
                            | undefined;

                          if (!existingObject)
                            return createTextBox(canvas, {
                              text,
                              customType: "title",
                              fill: "#fff",
                              width: 303,
                              height: 39,
                              top: 504,
                              left: 34,
                              scaleX: 1.53,
                              scaleY: 1.53,
                              fontSize: 16,
                            });

                          updateTextBox(canvas, { text });
                          setOverlayTextFiltersState((prev) => ({
                            ...prev,
                            text,
                          }));
                        }}
                        style={{
                          margin: "0px",
                          marginBottom: "15px",
                          cursor: "pointer",
                          color: "#a19d9d",
                        }}
                      >
                        {text}
                      </h5>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab == "bubble" && (
              <div>
                <h4 style={{ margin: "0px", padding: "0px" }}>From Article</h4>

                <ImageViewer
                  clickHandler={(img: string) => updateBubbleImage(img)}
                  images={initialData.bubbles}
                />

                {/* <h4 style={{ margin: '0px', padding: '0px' }}>AI Images</h4>
								<ImageViewer
									clickHandler={(img: string) => updateBubbleImage(img)}
									images={initialData.bubbles}
								/> */}
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        sx={{
                          "& .MuiIconButton-root": {
                            color: "#fff",
                            border: "1px solid #fff",
                          },
                          "&.Mui-checked": {
                            color: "#fff",
                          },
                          "& .MuiSvgIcon-root ": {
                            fill: "#fff",
                          },
                        }}
                      />
                    }
                    label="Click for adding another bubble"
                    // label='Click checkbox to add another bubble.'
                  />
                </Box>

                <Box {...styles.uploadBox}>
                  <label style={styles.uploadLabel}>
                    <h4>IMAGE UPLOAD</h4>

                    <form method="post" encType="multipart/form-data">
                      <input
                        type="file"
                        onChange={(event) => uploadImage(event, "bubbles")}
                        style={{ display: "none" }}
                      />
                    </form>
                    <IconButton color="primary" component="span">
                      <CloudUploadIcon style={{ fontSize: "40px" }} />
                    </IconButton>
                  </label>
                </Box>
              </div>
            )}

            {activeTab == "element" && (
              <div>
                <>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        pb: 1.5,
                      }}
                    >
                      Choose Element
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      {swipeData?.map(({ swipeImg, id }, i) => {
                        return (
                          <Box
                            key={`swipe_${id}_${i}`}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={swipeImg}
                              onClick={() =>
                                swipeColorChangeHandler(id, swipeImg)
                              }
                              alt=""
                              style={{
                                cursor: "pointer",
                                paddingBottom: "0.5rem",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                          </Box>
                        );
                      })}

                      {/* <CustomColorPicker
                        value={userMetaData?.company?.color}
                        changeHandler={(color: string) => {
                          const type = "borders";
                          let existingObject = getExistingObject(type) as
                            | fabric.Image
                            | undefined;

                          if (
                            canvas?._activeObject &&
                            canvas?._activeObject?.type === "image"
                          )
                            existingObject =
                              canvas?._activeObject as fabric.Image;

                          if (!existingObject) {
                            console.log("existing Border object not founded");
                            return;
                          }
                          const blendColorFilter1 =
                            new fabric.Image.filters.BlendColor({
                              color,
                              mode: "tint",
                              alpha: 1,
                            });
                          //---------------
                          const swipeGroup = getExistingObject("swipeGroup");
                          const activeObj = canvas?.getActiveObject();
                          if (activeObj?.customType === "swipeGroup") {
                            if (swipeGroup) {
                              swipeGroup.visible = true;

                              swipeGroup?._objects?.forEach((obj) => {
                                if (obj.customType === "swipeText") {
                                  obj.fill = color;
                                } else {
                                  var filter =
                                    new fabric.Image.filters.BlendColor({
                                      color,
                                      mode: "tint",
                                      alpha: 1,
                                    });
                                  obj.filters.push(filter);
                                  obj.applyFilters();
                                }
                                //   canvas.renderAll();
                              });
                            }
                          }
                          //-------------------

                          existingObject.filters?.push(blendColorFilter1);
                          existingObject.applyFilters();
                          requestAnimationFrame(() => {
                            canvas?.renderAll();
                          });
                        }}
                      /> */}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      {elements?.map((element: string, i) => {
                        return (
                          <img
                            key={i}
                            src={element}
                            onClick={() => {
                              const iconSrc = "/icons/swipe.svg";
                              const color =
                                userMetaData?.company?.color || "#ffffff";
                              createSwipeGroup(canvas, {}, iconSrc, color);
                            }}
                            alt=""
                            width="90px"
                            style={{
                              cursor: "pointer",
                              paddingBottom: "0.5rem",
                            }}
                          />
                        );
                      })}

                      <CustomColorPicker
                        value={userMetaData?.company?.color || "#909AE9"}
                        changeHandler={(color: string) => {
                          const type = "swipeGroup";
                          let existingObject = getExistingObject(type) as
                            | fabric.Image
                            | undefined;

                          if (
                            canvas?._activeObject &&
                            canvas?._activeObject?.type === "image"
                          )
                            existingObject =
                              canvas?._activeObject as fabric.Image;

                          if (!existingObject) {
                            console.log("existing Border object not founded");
                            return;
                          }
                          const blendColorFilter1 =
                            new fabric.Image.filters.BlendColor({
                              color,
                              mode: "tint",
                              alpha: 1,
                            });
                          //---------------
                          const swipeGroup = getExistingObject("swipeGroup");
                          // console.log("🚀 ~ swipeGroup:", swipeGroup)
                          const activeObj = canvas?.getActiveObject();

                          if (activeObj?.customType === "swipeGroup") {
                            updateSwipeColor(canvas, color);
                          } else {
                            existingObject.filters?.push(blendColorFilter1);
                            existingObject.applyFilters();
                            requestAnimationFrame(() => {
                              canvas?.renderAll();
                            });
                          }
                          //-------------------
                        }}
                      />
                      {/* <CustomColorPicker
                        value={userMetaData?.company?.color}
                        // value={overlayTextFiltersState.color}
                        changeHandler={(color: string) => {
                          updateSwipeColor(canvas, color);
                        }}
                      /> */}

                      {/* //new */}
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        pt: 1,
                      }}
                    >
                      Borders
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        pt: 1.5,
                      }}
                    >
                      {shapeData?.map(({ imgShape }, i) => {
                        return (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={imgShape}
                              onClick={() => borderColorChangeHandler(imgShape)}
                              // onClick={() => {
                              // 	fabric.Image.fromURL(
                              // 		imgShape,
                              // 		function (img) {
                              // 			img.set({ left: 230, top: 250 }).scale(0.2);
                              // 			canvas.add(img);
                              // 			requestAnimationFrame(() => {
                              // 				canvas.renderAll();
                              // 			});
                              // 		},
                              // 		{
                              // 			crossOrigin: 'anonymous',
                              // 		}
                              // 	);
                              // }}
                              alt=""
                              // width='90px'
                              style={{
                                cursor: "pointer",
                                paddingBottom: "0.5rem",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        pt: 1.5,
                      }}
                    >
                      {dividersData?.map(({ dividerImg }, i) => {
                        return (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={dividerImg}
                              onClick={() =>
                                dividerColorChangeHandler(dividerImg)
                              }
                              // onClick={() => {
                              // 	fabric.Image.fromURL(
                              // 		dividerImg,
                              // 		function (img) {
                              // 			img.set({ left: 200, top: 250 }).scale(0.2);
                              // 			canvas.add(img);
                              // 			requestAnimationFrame(() => {
                              // 				canvas.renderAll();
                              // 			});
                              // 		},
                              // 		{
                              // 			crossOrigin: 'anonymous',
                              // 		}
                              // 	);
                              // }}
                              alt=""
                              // width='90px'
                              style={{
                                cursor: "pointer",
                                paddingBottom: "0.5rem",
                                width: "40px",
                                height: "20px",
                                // border: '1px solid red',
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {borders?.map((border: string, i) => {
                        return (
                          <img
                            key={i}
                            src={border}
                            onClick={() => {
                              const imageObject = getExistingObject(
                                "borders"
                              ) as fabric.Image | undefined;
                              if (!canvas) return;

                              if (imageObject && !imageObject.visible) {
                                imageObject.set({
                                  visible: true,
                                  // fill: userMetaData?.company?.color,
                                });
                                var filter =
                                  new fabric.Image.filters.BlendColor({
                                    color: userMetaData?.company?.color,
                                    mode: "tint",
                                    alpha: 1,
                                  });
                                imageObject.filters.push(filter);
                                imageObject.applyFilters();
                                return canvas?.renderAll();
                              } else
                                createImage(canvas, border, {
                                  customType: "borders",
                                });
                            }}
                            alt=""
                            width="90px"
                            style={{
                              cursor: "pointer",
                              paddingBottom: "0.5rem",
                            }}
                          />
                        );
                      })}
                      <CustomColorPicker
                        // value={overlayTextFiltersState.color}
                        value={userMetaData?.company?.color || "#909AE9"}
                        changeHandler={(color: string) => {
                          const type = "borders";
                          let existingObject = getExistingObject(type) as
                            | fabric.Image
                            | undefined;
                          if (
                            canvas?._activeObject &&
                            canvas?._activeObject?.type === "image"
                          )
                            existingObject =
                              canvas?._activeObject as fabric.Image;

                          if (!existingObject) {
                            console.log("existing Border object not founded");
                            return;
                          }
                          const blendColorFilter =
                            new fabric.Image.filters.BlendColor({
                              color,
                              mode: "tint",
                              alpha: 1,
                            });

                          existingObject.filters?.push(blendColorFilter);
                          existingObject.applyFilters();
                          requestAnimationFrame(() => {
                            canvas?.renderAll();
                          });
                        }}
                      />
                    </Box>
                  </Box>

                  <Box>
                    {/* <input
											type='text'
											style={{
												lineHeight: 1.5,
												marginTop: '0.5rem',
												fontSize: '16px',
												background: 'transparent',
												outline: 'none',
												color: '#fff',
												border: 'none',
											}}
											placeholder='Social Tags '
											defaultValue='Social Tags'
										/> */}

                    <h4>Social Tags</h4>
                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      {socialPlatformsData1?.map(({ spImg }, i) => {
                        return (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={spImg}
                              onClick={() => {
                                fabric.Image.fromURL(
                                  spImg,
                                  function (img) {
                                    img.set({ left: 230, top: 250 }).scale(0.2);
                                    canvas.add(img);
                                    requestAnimationFrame(() => {
                                      canvas.renderAll();
                                    });
                                  },
                                  {
                                    crossOrigin: "anonymous",
                                  }
                                );
                              }}
                              alt=""
                              // width='90px'
                              style={{
                                cursor: "pointer",
                                paddingBottom: "0.5rem",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      {socialPlatformsData2?.map(({ spImg }, i) => {
                        return (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={spImg}
                              onClick={() => {
                                fabric.Image.fromURL(
                                  spImg,
                                  function (img) {
                                    img.set({ left: 230, top: 250 }).scale(0.2);
                                    canvas.add(img);
                                    requestAnimationFrame(() => {
                                      canvas.renderAll();
                                    });
                                  },
                                  {
                                    crossOrigin: "anonymous",
                                  }
                                );
                              }}
                              alt=""
                              // width='90px'
                              style={{
                                cursor: "pointer",
                                paddingBottom: "0.5rem",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      {socialPlatformsData3?.map(({ spImg }, i) => {
                        return (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={spImg}
                              onClick={() => {
                                fabric.Image.fromURL(
                                  spImg,
                                  function (img) {
                                    img.set({ left: 230, top: 250 }).scale(0.2);
                                    canvas.add(img);
                                    requestAnimationFrame(() => {
                                      canvas.renderAll();
                                    });
                                  },
                                  {
                                    crossOrigin: "anonymous",
                                  }
                                );
                              }}
                              alt=""
                              // width='90px'
                              style={{
                                cursor: "pointer",
                                paddingBottom: "0.5rem",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      {logos?.map((logo: string, i) => {
                        const logoFillColor =
                          userMetaData?.company?.color || "black";
                        return (
                          <img
                            key={i}
                            src={logo}
                            alt="logo"
                            onClick={() => {
                              const existingTextObject = getExistingObject(
                                "hashtag"
                              ) as fabric.Textbox | undefined;

                              if (
                                existingTextObject &&
                                !existingTextObject?.visible
                              )
                                updateTextBox(
                                  canvas,
                                  {
                                    visible: !existingTextObject.visible,
                                    fill: userMetaData?.company?.color,
                                  },
                                  "hashtag"
                                );
                              else
                                createTextBox(canvas, {
                                  // fill: overlayTextFiltersState.color,
                                  fill: userMetaData?.company?.color,
                                  customType: "hashtag",
                                });
                            }}
                            style={{
                              cursor: "pointer",
                              paddingBottom: "0.5rem",
                            }}
                            width="90px"
                          />
                        );
                      })}
                      <CustomColorPicker
                        value={userMetaData?.company?.color || "#909AE9"}
                        // value={overlayTextFiltersState.color}
                        changeHandler={(color: string) => {
                          const type = "hashtag";

                          let existingTextObject = getExistingObject(type) as
                            | fabric.Textbox
                            | undefined;
                          if (
                            canvas?._activeObject &&
                            canvas?._activeObject?.type === "textbox"
                          )
                            existingTextObject =
                              canvas?._activeObject as fabric.Textbox;

                          if (!existingTextObject) return;
                          updateTextBox(canvas, { fill: color }, "hashtag");
                        }}
                      />
                    </Box>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 2,
                        }}
                      >
                        <img
                          src={userMetaData?.company?.logo}
                          onClick={() => {
                            fabric.Image.fromURL(
                              userMetaData?.company?.logo,
                              function (img) {
                                img.set({
                                  width: 400,
                                  height: 400,
                                });
                                canvas.add(img);
                                requestAnimationFrame(() => {
                                  canvas.renderAll();
                                });
                              },
                              {
                                crossOrigin: "anonymous",
                              }
                            );
                          }}
                          alt=""
                          // width='90px'
                          style={{
                            cursor: "pointer",
                            paddingBottom: "0.5rem",
                            width: "80px",
                            height: "60px",
                          }}
                        />
                        <img
                          src={userMetaData?.company?.logo2}
                          onClick={() => {
                            fabric.Image.fromURL(
                              userMetaData?.company?.logo2,
                              function (img) {
                                img.set({
                                  width: 400,
                                  height: 400,
                                });
                                canvas.add(img);
                                requestAnimationFrame(() => {
                                  canvas.renderAll();
                                });
                              },
                              {
                                crossOrigin: "anonymous",
                              }
                            );
                          }}
                          alt=""
                          // width='90px'
                          style={{
                            cursor: "pointer",
                            paddingBottom: "0.5rem",
                            width: "80px",
                            height: "60px",
                          }}
                        />

                        <img
                          src={userMetaData?.company?.logo3}
                          onClick={() => {
                            fabric.Image.fromURL(
                              userMetaData?.company?.logo3,
                              function (img) {
                                img.set({
                                  width: 400,
                                  height: 400,
                                });
                                canvas.add(img);
                                requestAnimationFrame(() => {
                                  canvas.renderAll();
                                });
                              },
                              {
                                crossOrigin: "anonymous",
                              }
                            );
                          }}
                          alt=""
                          // width='90px'
                          style={{
                            cursor: "pointer",
                            paddingBottom: "0.5rem",
                            width: "80px",
                            height: "60px",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </>
              </div>
            )}

            {activeTab == "writePost" && (
              <div>
                <h2>Write post</h2>
                {summaryContent && summaryContent.content && (
                  <p
                    onClick={() => {
                      const text = summaryContent.content;

                      createTextBox(canvas, {
                        text,
                        customType: "title",
                        fill: "#fff",
                        width: 303,
                        height: 39,
                        top: 504,
                        left: 34,
                        scaleX: 1.53,
                        scaleY: 1.53,
                        fontSize: 16,
                      });

                      updateTextBox(canvas, { text });

                      // canvas && canvas.add("text", summaryContent.content);
                      // canvas && canvas.renderAll();
                    }}
                  >
                    {summaryContent.content}
                  </p>
                )}
              </div>
            )}
          </div>
          <div style={{ marginTop: "40%", position: "relative" }}>
            <button
              onClick={handleSaveTemplate}
              style={{
                width: "100%",
                height: "42px",
                borderRadius: "25px",
                border: "none",
                backgroundColor: "#3b0e39",
                color: "white",
                marginBottom: "15px",
              }}
            >
              Save All Templates
            </button>

            <button
              onClick={handleExport}
              style={{
                width: "100%",
                height: "42px",
                borderRadius: "25px",
                border: "none",
                backgroundColor: "#3b0e39",
                color: "white",
              }}
            >
              Export
            </button>
          </div>
          {/* <div style={{ marginTop: "40%", position: "relative" }}>
            <button
              onClick={async () => {
                const currentTemplateJSON = await saveJSON(canvas, true);
                update(selectedPage, { templateJSON: currentTemplateJSON });
                loadCanvas(selectedPage);
              }}
              // onClick={() => saveImage(canvas)}
              style={{
                width: "100%",
                height: "42px",
                borderRadius: "25px",
                border: "none",
                backgroundColor: "#3b0e39",
                color: "white",
                marginBottom: "15px",
              }}
            >
              Save All Templates
            </button>

            <button
          
              onClick={ async() => exportMultiCanvases()}
              // onClick={() => saveImage(canvas)}

              style={{
                width: "100%",
                height: "42px",
                borderRadius: "25px",
                border: "none",
                backgroundColor: "#3b0e39",
                color: "white",
              }}
            >
              Export
            </button>
          </div> */}
          <div style={{ marginTop: "5%", position: "relative" }}>
            <button
              onClick={() => saveJSON(canvas)}
              style={{
                width: "100%",
                height: "42px",
                borderRadius: "25px",
                border: "none",
                backgroundColor: "#3b0e39",
                color: "white",
              }}
            >
              JSON
            </button>
          </div>
          {activeTab !== "writePost" && (
            <div
              style={{
                marginTop: "5%",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <button
                onClick={() => {
                  const index = toolbars.findIndex((itm) => itm === activeTab);
                  if (index === -1) return;
                  const nextItem = toolbars[index + 1] as activeTabs;
                  if (nextItem) updateActiveTab(nextItem);
                }}
                style={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "25px",
                  border: "none",
                  backgroundColor: "#3b0e39",
                  color: "white",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default Canvas;
