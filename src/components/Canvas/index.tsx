// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Typography, Box, IconButton, Stack } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styles, useStyles } from './index.style';
import ImageViewer from '../Image';
import { IBaseFilter, IRectOptions } from 'fabric/fabric-impl';
import { canvasDimension } from '../../constants';
import CustomColorPicker from '../colorPicker';
import { Template } from '../../types';
import DeselectIcon from '@mui/icons-material/Deselect';
import { createTextBox, updateTextBox } from '../../utils/TextHandler';
import { updateRect } from '../../utils/RectHandler';
import { saveImage, saveJSON } from '../../utils/ExportHandler';
import DeleteIcon from '@mui/icons-material/Delete';
import { createImage, updateImageProperties } from '../../utils/ImageHandler';
import { useCanvasContext } from '../../context/CanvasContext';
import FontsTab from '../Tabs/EditText/FontsTab';

interface FabricCanvas extends fabric.Canvas {
  customType: string
}
interface CanvasProps {
  template: Template
  updatedSeedData: Record<string, any>
}

interface FilterState {
  overlay: number;
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: number;
}

const toolbars = ['bg', 'title', 'bubble', 'element', 'writePost'];
const filter = 'brightness(0) saturate(100%) invert(80%) sepia(14%) saturate(1577%) hue-rotate(335deg) brightness(108%) contrast(88%)'

const Canvas: React.FC<CanvasProps> = React.memo(({ updatedSeedData, template }) => {
  const { borders, elements, backgroundImages, logos, texts, bubbles } = updatedSeedData
  const { updateCanvasContext, getExistingObject } = useCanvasContext()
  const [activeButton, setActiveButton] = useState("Overlay");
  const [show, setShow] = useState("font");
  const canvasRef = useRef<FabricCanvas | null>(null);
  const [toolsStep, setToolstep] = useState('bg')
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [dropDown, setDropDown] = useState(true)
  const [filtersRange, setFiltersRange] = useState({ brightness: 0, contrast: 0 })
  const [canvasToolbox, setCanvasToolbox] = useState({
    activeObject: null,
    isDeselectDisabled: true
  })
  const [initialData, setInitialData] = useState({
    backgroundImages,
    bubbles
  })

  const [overlayTextFiltersState, setOverlayTextFiltersState] = useState<FilterState>({
    overlay: 0.6,
    text: updatedSeedData.texts[0],
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Arial',
    fontWeight: 500
  });

  const [filterValues, setFilterValues] = useState({
    overlayText: {
      overlay: 0.6,
      text: '',
      fontSize: 16,
      color: '#fff',
      fontFamily: 'Arial'
    },
    overlay: {
      imgUrl: template.overlayImage,
      opacity: template.opacity
    },
    bubble: {
      image: '',
      strokeWidth: 10,
      stroke: '#fff'
    },
    collage: {
      strokeWidth: 3,
      stroke: '#000'
    },
  })

  const availableFilters: { name: string; filter: fabric.IBaseFilter }[] = [
    { name: 'grayscale', filter: new fabric.Image.filters.Grayscale({ grayscale: 1 }) },
    { name: 'sepia', filter: new fabric.Image.filters.Sepia({ sepia: 1 }) },
    { name: 'invert', filter: new fabric.Image.filters.Invert({ invert: 1 }) },
    // Add more filters as needed
  ];

  const classes = useStyles();

  const handleButtonClick = (buttonType: string) =>
    setActiveButton(buttonType)

  const loadCanvas = useCallback(async () => {
    if (!canvasRef.current) {
      const canvas = new fabric.Canvas('canvas', {
        width: canvasDimension.width,
        height: canvasDimension.height
      });
      canvasRef.current = canvas as FabricCanvas
      updateCanvasContext(canvas)
    }

    // Clear the canvas
    canvasRef.current.clear();
    function importLocale(locale: string) {
      /* @vite-ignore */
      return import(`../../constants/templates/${locale}.json`);
    }
    // @vite-ignore
    const templateJSON = await importLocale(template.filePath)

    // Load canvas JSON template
    await new Promise((resolve) => {
      canvasRef.current?.loadFromJSON(templateJSON, () => {
        resolve(null);
      });
    })
  }, [template, updatedSeedData]);

  useEffect(() => {
    loadCanvas();
    const handleCanvasUpdate = () => {
      return setCanvasToolbox((prev) => ({ ...prev, isDeselectDisabled: canvasRef.current?._activeObject === null, activeObject: canvasRef.current?._activeObject }));
    }
    // Attach canvas update listener
    canvasRef.current?.on('selection:created', handleCanvasUpdate);
    canvasRef.current?.on('selection:updated', handleCanvasUpdate);
    canvasRef.current?.on('selection:cleared', handleCanvasUpdate);

    // Cleanup the event listeners when the component unmounts
    return () => {
      canvasRef.current?.off('selection:created', handleCanvasUpdate);
      canvasRef.current?.off('selection:updated', handleCanvasUpdate);
      canvasRef.current?.off('selection:cleared', handleCanvasUpdate);
    };

  }, [loadCanvas]);

  const updateBubbleImage = (imgUrl: string | undefined, filter?: { strokeWidth: number, stroke: string }) => {
    const strokeWidth = filter?.strokeWidth || 10;
    const stroke = filter?.stroke || "white";

    const existingGroup = getExistingObject('bubble')

    // Extract existing bubble position
    const existingBubblePosition = existingGroup ? { left: existingGroup.left, top: existingGroup.top } : { left: 20, top: 30 };

    const canvas = canvasRef.current

    if (!canvas) return

    if (!existingGroup) return

    setFilterValues((prev) => ({ ...prev, bubble: { ...prev.bubble, image: imgUrl } }))

    if (!imgUrl && filter) {
      existingGroup._objects?.forEach((obj) => {
        if (filter && obj.type === 'circle') {
          const strokeIncreased = strokeWidth > obj.strokeWidth
          const strokeChanged = strokeIncreased ? strokeWidth - obj.strokeWidth : obj.strokeWidth - strokeWidth;

          obj.set({
            stroke,
            strokeWidth,
            radius: strokeIncreased ? obj.radius + strokeChanged : obj.radius - strokeChanged
          })
          canvas.renderAll()
        }
      })
      existingGroup.visible = true;
      canvas.renderAll()
    } else if (imgUrl) {
      fabric.Image.fromURL(imgUrl, function (img: fabric.Image) {
        // Set the maximum radius for the circular clip mask
        var maxRadius = 80;
        let scale = +Math.min(270 / img.width, 270 / img.height).toFixed(2)

        img.scale(scale).set({
          angle: 0,
          originX: 'center',
          originY: 'center'
        });
        img.center()

        // Create a circular clip mask
        var clipMask = new fabric.Circle({
          radius: maxRadius,
          originX: 'center',
          originY: 'center',
          fill: 'transparent',
          strokeWidth, // Set border width
          stroke, // Set border color
        });

        // Group the image and the clip mask
        var group = new fabric.Group([img, clipMask], {
          ...existingBubblePosition,
          clipPath: clipMask,
        });
        group.customType = 'bubble';
        // Add the group to the canvas
        if (existingGroup) canvas.remove(existingGroup);
        canvas.add(group);

        // Render the canvas
        canvas.renderAll();
      }, {
        crossOrigin: 'anonymous'
      });
    }
  }

  /**
 * Updates the background filters of the canvas.
 * @param {IBaseFilter} filter - The filter to be applied to the background image.
 * @return {void} This function does not return anything.
 */
  const updateBackgroundFilters = (filter: fabric.IBaseFilter, type: string): void => {
    const canvas = canvasRef?.current;
    if (!canvas) return

    const bgImages = ['bg-1']

    if (!template.backgroundImage) bgImages.push('bg-2')

    for (const customType of bgImages) {
      const existingObject: fabric.Image | undefined = getExistingObject(customType) as fabric.Image
      if (existingObject) {
        const hasBrightnessOrContrast = filter.hasOwnProperty('brightness') || filter.hasOwnProperty('contrast');

        const index: number | undefined = existingObject.filters?.findIndex((fil) => fil[type as any])

        if (index !== -1) {
          existingObject.filters?.splice(index as number, 1, filter)
          if (!hasBrightnessOrContrast) existingObject.filters?.splice(index as number, 1)
        } else {
          existingObject.filters?.push(filter);
        }
        existingObject.applyFilters();
        canvas.renderAll();
      }
    }
  }

  const updateBackgroundImage = (imageUrl: string) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    // const activeObject = canvas.getActiveObject()
    // if (activeObject && activeObject.type === 'image') {
    //   activeObject.setSrc(imageUrl, () => {
    //     const customType = activeObject.customType;
    //     const { width, height } = canvas;

    //     if (!(width && height)) return

    //     let scaleToWidth = width;
    //     let scaleToHeight = height;
    //     if (template.diptych === 'vertical') scaleToHeight = height / 2
    //     else if (template.diptych === 'horizontal') scaleToWidth = width / 2

    //     const topOffset = template.diptych === 'vertical' && customType === 'bg-2' ? height / 2 : 0;
    //     const leftOffset = template.diptych === 'horizontal' && customType === 'bg-2' ? width / 2 : 0;
    //     console.log({ scaleToWidth, scaleToHeight })
    //     activeObject.scaleToWidth(scaleToWidth)
    //     activeObject.scaleToHeight(scaleToHeight)

    //     activeObject.set({
    //       top: topOffset,
    //       left: leftOffset,
    //     });

    //     if (template.backgroundImage) activeObject.center();
    //     canvas.renderAll();
    //   });
    // } else {
    //   if (template.diptych === 'vertical') loadImage(imageUrl, 1, { top: 0, customType: 'bg-1' })
    //   else if (template.diptych === 'horizontal') loadImage(imageUrl, 1, { left: 0, customType: 'bg-1' })
    //   else loadImage(imageUrl, 1, { customType: 'bg-1' })
    // }

    if (template.backgroundImage) {
      const activeObject = getExistingObject('bg-1')
      if (!activeObject) return

      activeObject.setSrc(imageUrl, () => {
        activeObject.scaleToWidth(canvas.getWidth())
        activeObject.scaleToHeight(canvas.getHeight())
        activeObject.center();
        canvas.renderAll();
      }, {
        crossOrigin: 'anonymous'
      })
    } else {
      let currentImageIndex = backgroundImages?.findIndex((bgImage: string) => bgImage === imageUrl)

      if (currentImageIndex === -1) return
      if (!template.diptych) return

      if (template.diptych === 'vertical') {
        if ((currentImageIndex) % 2 === 0) loadImage(imageUrl, 1, { top: 0, customType: 'bg-1' })
        if ((currentImageIndex) % 2 === 1) loadImage(imageUrl, 2, { top: canvas.getHeight() / 2, customType: 'bg-2' })
      } else {
        if ((currentImageIndex) % 2 === 0) loadImage(imageUrl, 1, { left: 0, customType: 'bg-1' })
        if ((currentImageIndex) % 2 === 1) loadImage(imageUrl, 2, { left: canvas.getWidth() / 2, customType: 'bg-2' })
      }
    }
  };

  const updateOverlayImage = (image: string, opacity: number) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.log("Canvas not loaded yet");
      return
    }
    const existingObject = getExistingObject('overlay')

    const canvasWidth: number | undefined = canvas.width
    const canvasHeight: number | undefined = canvas.height

    if (!canvasWidth || !canvasHeight) return


    if (existingObject) {
      existingObject.animate({ opacity: opacity }, {
        duration: 200, // Adjust the duration as needed
        onChange: canvas.renderAll.bind(canvas),
      });
      if (opacity === 0) {
        // Remove the object after the animation completes
        setTimeout(() => {
          canvas.remove(existingObject);
        }, 200); // Adjust the duration to match the animation duration
      }

      return;
    } else {
      fabric.Image.fromURL(image, function (img) {
        img.scaleToWidth(canvas.width || 0);
        img.scaleToHeight(canvas.height || 0);

        img.set({
          opacity: +opacity || 1,
          selectable: false,
        });

        img.customType = 'overlay';

        canvas.insertAt(img, 3, false);
        canvas.renderAll();
      }, {
        crossOrigin: 'anonymous',
      });
    }
  }

  interface ImageOptions extends fabric.IImageOptions {
    customType: string
  }

  const loadImage = (url: string, index: number | undefined, options: ImageOptions) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const findExistingImageObject = getExistingObject(options.customType);

    fabric.Image.fromURL(url, function (img) {
      // Calculate the aspect ratio of the image
      const aspectRatio = img.width / img.height;

      let scaledWidth = canvas.width || 0;
      let scaledHeight = canvas.height || 0;

      const maxHeight = 700;

      // Ensure the image height does not exceed the maximum height
      const scaleFactor = maxHeight / img.height;
      if (scaleFactor < 1) {
        img.scale(scaleFactor);
      }

      if (template.diptych === 'vertical') {
        // Set width equal to canvas width
        scaledWidth = canvas.width + 100 || 0;
        scaledHeight = scaledWidth / aspectRatio;
      } else if (template.diptych === 'horizontal') {
        // Calculate height based on aspect ratio
        scaledWidth = (canvas.getWidth() / 2) || 0;
        scaledHeight = canvas.getHeight() || 0;
      }

      img.set({
        ...options,
      });

      img.scaleToWidth(scaledWidth);
      img.scaleToHeight(scaledHeight);
      img.center()
      if (index) canvas.insertAt(img, index, false);
      if (!index) canvas.add(img);

      if (findExistingImageObject) canvas.remove(findExistingImageObject);

      canvas.renderAll();
    }, {
      crossOrigin: 'anonymous',
    });
  };


  const updateRectangle = (options: IRectOptions) => {
    const canvas = canvasRef.current;

    if (!canvas) return

    const existingObject = getExistingObject('photo-border')

    if (existingObject) updateRect(existingObject, { ...options, customType: 'photo-border' })
  }

  const updateText = (textFilters: FilterState) => {
    const { color, fontFamily, fontSize, text: overlayText } = textFilters
    const canvas = canvasRef.current;

    if (!canvas) return;

    const existingTextObject: any = getExistingObject('title');

    const options = {
      text: overlayText || existingTextObject?.text,
      visible: true,
      fill: color || existingTextObject?.fill,
      fontSize: fontSize || 16,
      selectable: true,
      fontFamily: fontFamily || 'Arial',
    }

    updateTextBox(canvas, existingTextObject, options)
    return
  }

  /**
  * Uploads an image and updates the initial data.
  * @param {React.ChangeEvent<HTMLInputElement>} event - The event triggered by the input element.
  * @param {keyof typeof initialData} field - The field in the initialData object to update.
  * @return {void} This function does not return a value.
  */
  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>, field: keyof typeof initialData): void => {
    const files = event.target.files
    if (!files || files.length === 0) return;

    setInitialData((prev) => ({
      ...prev, [field]: [URL.createObjectURL(files[0]), ...prev[field]]
    }))
  }

  const deselectObj = () => {
    canvasRef.current?.discardActiveObject();
    canvasRef.current?.requestRenderAll();
  };

  const deleteActiveSelection = () => {
    const canvas = canvasRef.current;

    if (!canvas) return
    canvas.remove(canvas._activeObject);
    canvas.requestRenderAll();
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => setValue(newValue)

  return (
    <div style={{ display: 'flex', columnGap: '50px', marginTop: 50, marginBottom: 50 }}>
      <div>
        <DeselectIcon color={canvasToolbox.isDeselectDisabled ? "disabled" : 'inherit'} aria-disabled={canvasToolbox.isDeselectDisabled} onClick={deselectObj} />
        <DeleteIcon color={canvasToolbox.isDeselectDisabled ? "disabled" : 'inherit'} aria-disabled={canvasToolbox.isDeselectDisabled} onClick={deleteActiveSelection} />
        <canvas width="1080" height="1350" id="canvas"></canvas>
        {/* Footer Panel  Start*/}
        {toolsStep == 'bg' && dropDown && <div>

          <Paper className={classes.root}>
            <div className={classes.optionsContainer}>
              <Button
                className={`${classes.button} ${activeButton === "Overlay" && classes.buttonActive
                  }`}
                variant="text"
                color="primary"
                onClick={() => handleButtonClick("Overlay")}
              >
                Overlay
              </Button>
              <Button
                className={`${classes.button} ${activeButton === "Brightness" && classes.buttonActive
                  }`}
                variant="text"
                color="primary"
                onClick={() => handleButtonClick("Brightness")}
              >
                Brightness
              </Button>
              <Button
                className={`${classes.button} ${activeButton === "Contrast" && classes.buttonActive
                  }`}
                variant="text"
                color="primary"
                onClick={() => handleButtonClick("Contrast")}
              >
                Contrast
              </Button>
              <Button
                className={`${classes.button} ${activeButton === "Filters" && classes.buttonActive
                  }`}
                variant="text"
                color="primary"
                onClick={() => handleButtonClick("Filters")}
              >
                Filter
              </Button>
              {template.diptych && !template.backgroundImage ? (
                <Button
                  className={`${classes.button} ${activeButton === "border" && classes.buttonActive
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
                    updateOverlayImage(filterValues.overlay.imgUrl, val)
                    setFilterValues((prev) => ({ ...prev, overlay: { ...prev.overlay, opacity: +e.target.value } }))

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
                  step={0.1}
                  valueLabelDisplay="auto"
                  //eslint-disable-next-line
                  onChange={(e: any) => {
                    let value = +e.target.value
                    setFiltersRange({ ...filtersRange, contrast: value })
                    var filter = new fabric.Image.filters.Contrast({
                      contrast: value
                    });
                    updateBackgroundFilters(filter, 'contrast')
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
                  step={0.1}
                  value={filtersRange.brightness}
                  valueLabelDisplay="auto"
                  onChange={(e: any) => {
                    let value = +e.target.value
                    setFiltersRange({ ...filtersRange, brightness: value })
                    var filter = new fabric.Image.filters.Brightness({
                      brightness: value
                    });

                    updateBackgroundFilters(filter, 'brightness')
                  }}
                />
              </div>
            )}
            {activeButton === "Filters" && (
              <div className={classes.sliderContainer}>
                {availableFilters.map((filter) => (
                  <Button
                    key={filter.name}
                    className={`${classes.button} ${selectedFilter === "greyscale" &&
                      classes.buttonActive
                      }`}
                    variant="text"
                    color="primary"
                    onClick={() => updateBackgroundFilters(filter.filter, filter.name)}
                  >
                    {filter.name}
                  </Button>

                ))}
              </div>
            )}

            {activeButton === "border" && (
              <Stack width='inherit' mx={10} spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomColorPicker value={overlayTextFiltersState.color} changeHandler={(color: string) => {
                    updateRectangle({ ...filterValues.collage, stroke: color })
                    setFilterValues((prev) => ({ ...prev, collage: { ...prev.collage, stroke: color } }))
                  }} />
                </Box>
                <Slider valueLabelDisplay="auto"
                  className={classes.slider}
                  min={0}
                  max={20}
                  aria-label="Volume"
                  value={filterValues.collage.strokeWidth} onChange={(e: any) => {
                    const value = +e.target.value;
                    if (template.diptych === 'horizontal') {
                      updateRectangle({ strokeWidth: value, left: (canvasRef.current?.getWidth() / 2) - (value / 2) })
                    } else {
                      updateRectangle({ strokeWidth: value, top: (canvasRef.current?.getHeight() / 2) - (value / 2) })
                    }
                    setFilterValues((prev) => ({ ...prev, collage: { ...prev.collage, strokeWidth: value } }))
                  }} />
              </Stack>
            )}

          </Paper>

        </div>}

        {toolsStep == 'title' && dropDown && <div>
          <Paper className={classes.root}>
            <Box className={classes.optionsContainer}>
              <Typography className={classes.heading}
                onClick={() => setShow("font")}
              >
                Font
              </Typography>
              <Typography className={classes.heading}
                onClick={() => setShow("fontWeight")}
              >
                FontWeight
              </Typography>
              <Typography
                className={classes.heading}
                onClick={() => setShow("colors")}
              >
                Colors
              </Typography>
              <Typography className={classes.heading} onClick={() => setShow("size")}>
                Size
              </Typography>
            </Box>

            {show === "colors" && (
              <Box className={classes.optionsContainer}>
                <CustomColorPicker value={overlayTextFiltersState.color} changeHandler={(color: string) => {
                  updateText({ ...overlayTextFiltersState, color })
                  setOverlayTextFiltersState((prev) => ({ ...prev, color }))
                }} />
              </Box>
            )}

            {show === 'fontWeight' && (
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
                    const existingObject = getExistingObject('title')
                    updateTextBox(canvasRef.current, existingObject, { ...overlayTextFiltersState, fontWeight: value })
                    setOverlayTextFiltersState((prev) => ({ ...prev, fontWeight: value }))
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
                    updateText({ ...overlayTextFiltersState, fontSize: value })
                    setOverlayTextFiltersState((prev) => ({ ...prev, fontSize: value }))
                  }}
                  step={2}
                  valueLabelDisplay="auto"
                />
              </Box>
            )}
            {show === "font" && <FontsTab value={value} handleChange={handleChange} />}
          </Paper>
        </div>}

        {toolsStep == 'bubble' && dropDown && <div>
          <Paper className={classes.root}>
            <Box className={classes.optionsContainer}>
              <Typography
                className={classes.heading}
                onClick={() => setShow("colors")}
              >
                Colors
              </Typography>
              <Typography className={classes.heading} onClick={() => setShow("size")}>
                Size
              </Typography>
            </Box>

            {show === "colors" && (
              <Box className={classes.optionsContainer}>
                <CustomColorPicker value={overlayTextFiltersState.color}
                  changeHandler={(color: string) => {
                    updateBubbleImage(undefined, { stroke: color, strokeWidth: filterValues.bubble.strokeWidth })
                    setFilterValues((prev) => ({ ...prev, bubble: { ...prev.bubble, stroke: color } }))
                  }} />
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
                  max={20}
                  onChange={(e: any) => {
                    const value = +e.target.value;
                    updateBubbleImage(undefined, { stroke: filterValues.bubble.stroke, strokeWidth: filterValues.bubble.strokeWidth })
                    setFilterValues((prev) => ({ ...prev, bubble: { ...prev.bubble, strokeWidth: value } }))
                  }}
                  step={1}
                  valueLabelDisplay="auto"
                />
              </div>
            )}

          </Paper>
        </div>
        }

        <Paper sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 0, width: '97%' }} onClick={() => { dropDown ? setDropDown(false) : setDropDown(true) }}>

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
            style={{ backgroundColor: "transparent", border: "none" }}
            onClick={() => setToolstep('bg')}
          >
            <img src="/Tab-Icons/background.png" width='100' height="100" style={{ color: "white", fontSize: "30px", filter: toolsStep === 'bg' ? filter : undefined }} />
          </button>

          <button
            style={{ backgroundColor: "transparent", border: "none" }}
            onClick={() => setToolstep('title')}

          >
            <img src="/Tab-Icons/Edit-Text.png" width='100' height="100" style={{ color: "white", fontSize: "30px", filter: toolsStep === 'title' ? filter : undefined }} />
          </button>

          <button
            onClick={() => setToolstep('bubble')}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <img src="/Tab-Icons/Add-Bubble.png" width='100' height="100" style={{ color: "white", fontSize: "30px", filter: toolsStep === 'bubble' ? filter : undefined }} />
          </button>

          <button
            onClick={() => setToolstep('element')}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <img src="/Tab-Icons/Add-Elements.png" width='100' height="100" style={{ color: "white", fontSize: "30px", filter: toolsStep === 'element' ? filter : undefined }} />
          </button>

          <button
            onClick={() => { setToolstep('writePost') }}

            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <img src="/Tab-Icons/Write-Post.png" width='100' height="100" style={{ color: "white", fontSize: "30px", filter: toolsStep === 'writePost' ? filter : undefined }} />
          </button>

        </div>
      </div>

      {/* Footer Panel  End*/}

      {/* Sidebar Tools Panel */}
      {/* <Sidebar /> */}
      <div>
        <div style={{ width: '300px', height: '480px', padding: '10px' }}>
          {toolsStep == 'bg' &&
            <div>
              <h4 style={{ margin: '0px', padding: '0px' }}>From Article</h4>

              <ImageViewer clickHandler={(img: string) => updateBackgroundImage(img)} images={initialData.backgroundImages} />

              <h4 style={{ margin: '0px', padding: '0px' }}>AI Images</h4>

              <ImageViewer clickHandler={(img: string) => updateBackgroundImage(img)} images={initialData.backgroundImages} />

              <Box {...styles.uploadBox}>
                <label style={styles.uploadLabel}>

                  <h4>IMAGE UPLOAD</h4>

                  <form method="post" encType="multipart/form-data">
                    <input type="file"
                      onChange={(event) => uploadImage(event, "backgroundImages")} style={{ display: "none" }} />
                  </form>
                  <IconButton color="primary" component="span">
                    <CloudUploadIcon style={{ fontSize: "40px" }} />
                  </IconButton>
                </label>
              </Box>

            </div>
          }

          {toolsStep == 'title' &&
            <div>
              <h4 style={{ margin: '0px', padding: '0px' }}>Titles</h4>
              <div style={{ marginTop: '20px' }}>
                {texts.map((text: string) => {
                  return <h5 onClick={() => {
                    const existingObject = getExistingObject('title') as fabric.Textbox | undefined

                    if (!existingObject) return createTextBox(canvasRef.current, { text, customType: 'title', fill: "#fff", width: 303, height: 39, top: 504, left: 34, scaleX: 1.53, scaleY: 1.53, fontSize: 16 })
                    updateText({ ...overlayTextFiltersState, text })
                    setOverlayTextFiltersState((prev) => ({ ...prev, text }))
                  }} style={{ margin: '0px', marginBottom: '15px', cursor: 'pointer', color: '#a19d9d' }}>{text}</h5>
                })}
              </div>
            </div>}

          {toolsStep == 'bubble' &&
            <div>
              <h4 style={{ margin: '0px', padding: '0px' }}>From Article</h4>
              <ImageViewer clickHandler={(img: string) => updateBubbleImage(img)} images={initialData.bubbles} />

              <h4 style={{ margin: '0px', padding: '0px' }}>AI Images</h4>
              <ImageViewer clickHandler={(img: string) => updateBubbleImage(img)} images={initialData.bubbles} />

              <Box {...styles.uploadBox}>
                <label style={styles.uploadLabel}>

                  <h4>IMAGE UPLOAD</h4>

                  <form method="post" encType="multipart/form-data">
                    <input type="file"
                      onChange={(event) => uploadImage(event, "bubbles")}
                      style={{ display: "none" }} />
                  </form>
                  <IconButton color="primary" component="span">
                    <CloudUploadIcon style={{ fontSize: "40px" }} />
                  </IconButton>
                </label>
              </Box>

            </div>
          }

          {toolsStep == 'element' && <div>
            <>
              <Box>
                <h4 >Choose Element</h4>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                >
                  {elements.map((element: string) => {
                    return (
                      <img
                        key={element}
                        src={element}
                        onClick={() => {
                          const existingTextObject = getExistingObject('swipe') as fabric.Textbox | undefined;

                          if (existingTextObject && !existingTextObject?.visible) updateTextBox(canvasRef.current, existingTextObject, { visible: !existingTextObject.visible });
                          else createTextBox(canvasRef.current, { fill: overlayTextFiltersState.color, customType: 'swipe' });
                        }}
                        alt=""
                        width='90px'
                        style={{ cursor: 'pointer', paddingBottom: '0.5rem' }}
                      />
                    );
                  })}
                  <CustomColorPicker value={overlayTextFiltersState.color}
                    changeHandler={(color: string) => {
                      const canvas = canvasRef.current;
                      const type = 'swipe';

                      let existingTextObject = getExistingObject(type) as fabric.Textbox | undefined;
                      console.log(canvas?._activeObject)
                      if (canvas?._activeObject && canvas?._activeObject?.type === "textbox") existingTextObject = canvas?._activeObject as fabric.Textbox

                      if (!existingTextObject) return
                      updateTextBox(canvas, existingTextObject, { fill: color });
                    }} />
                </Box>
              </Box>
              <Box>
                <h4>Borders</h4>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {borders.map((border: string) => {
                    return (
                      <img
                        key={border}
                        src={border}
                        onClick={() => {
                          const imageObject = getExistingObject('borders') as fabric.Image | undefined;

                          const canvas = canvasRef.current
                          if (!canvas) return

                          if (imageObject && !imageObject.visible) {
                            imageObject.set({ visible: true });
                            return canvasRef.current?.renderAll();
                          } else createImage(canvasRef.current, border, {})
                        }}
                        alt=""
                        width='90px'
                        style={{ cursor: 'pointer', paddingBottom: '0.5rem' }}
                      />
                    );
                  })}
                  <CustomColorPicker value={overlayTextFiltersState.color}
                    changeHandler={(color: string) => {
                      const canvas = canvasRef.current;
                      const type = 'borders';

                      let existingObject = getExistingObject(type) as fabric.Image | undefined;
                      if (canvas?._activeObject && canvas?._activeObject?.type === "image") existingObject = canvas?._activeObject as fabric.Image

                      if (!existingObject) return
                      const blendColorFilter = new fabric.Image.filters.BlendColor({
                        color,
                        mode: 'tint',
                        alpha: 1,
                      })
                      updateImageProperties(canvas, existingObject, { filters: [blendColorFilter] })
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <h4>Social Tags</h4>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {logos?.map((logo: string) => {
                    return (
                      <img
                        key={logo}
                        src={logo}
                        alt=""
                        onClick={() => {
                          const existingTextObject = getExistingObject('hashtag') as fabric.Textbox | undefined;

                          if (existingTextObject && !existingTextObject?.visible) updateTextBox(canvasRef.current, existingTextObject, { visible: !existingTextObject.visible });
                          else createTextBox(canvasRef.current, { fill: overlayTextFiltersState.color, customType: 'hashtag' });
                        }}
                        style={{ cursor: 'pointer', paddingBottom: '0.5rem' }}
                        width='90px'
                      />
                    );
                  })}
                  <CustomColorPicker value={overlayTextFiltersState.color}
                    changeHandler={(color: string) => {
                      const canvas = canvasRef.current;
                      const type = 'hashtag';

                      let existingTextObject = getExistingObject(type) as fabric.Textbox | undefined;
                      if (canvas?._activeObject && canvas?._activeObject?.type === "textbox") existingTextObject = canvas?._activeObject as fabric.Textbox

                      if (!existingTextObject) return
                      updateTextBox(canvas, existingTextObject, { fill: color });
                    }} />
                </Box>
              </Box>
            </>

          </div>}

          {toolsStep == 'writePost' &&
            <div>
              <h2>Write post</h2>
            </div>}

        </div>
        <div style={{ marginTop: '40%', position: 'relative' }}>
          <button onClick={() => saveImage(canvasRef.current)} style={{ width: '100%', height: "42px", borderRadius: '25px', border: 'none', backgroundColor: '#3b0e39', color: 'white' }}>
            Export
          </button>
        </div>
        <div style={{ marginTop: '40%', position: 'relative' }}>
          <button onClick={() => saveJSON(canvasRef.current)} style={{ width: '100%', height: "42px", borderRadius: '25px', border: 'none', backgroundColor: '#3b0e39', color: 'white' }}>
            JSON
          </button>
        </div>
        <div style={{ marginTop: '10%', position: 'relative', cursor: 'pointer' }}>
          <button onClick={() => {
            const index = toolbars.findIndex((itm) => itm === toolsStep)
            if (index === -1) return
            const nextItem = toolbars[index + 1]
            if (nextItem) setToolstep(nextItem)

          }} style={{ width: '100%', height: "42px", borderRadius: '25px', border: 'none', backgroundColor: '#3b0e39', color: 'white' }}>
            Next
          </button>
        </div>
      </div>

    </div>
  );
});

export default Canvas;
