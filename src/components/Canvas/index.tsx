// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Typography, Box, IconButton, Stack } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import { ColorPickerHSBType, ColorPickerRGBType } from "primereact/colorpicker";
import { Nullable } from 'primereact/ts-helpers';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styles, useStyles } from './index.style';
import ImageViewer from '../Image';
import { IBaseFilter, IRectOptions } from 'fabric/fabric-impl';
import { canvasDimension } from '../../constants';
import CustomColorPicker from '../colorPicker';
import { Template } from '../../types';
import DeselectIcon from '@mui/icons-material/Deselect';

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
}

const toolbars = ['bg', 'title', 'bubble', 'element', 'writePost'];

const Canvas: React.FC<CanvasProps> = React.memo(({ updatedSeedData, template }) => {
  const { borders, elements, backgroundImages, logos, texts, bubbles } = updatedSeedData
  const [activeButton, setActiveButton] = useState("Overlay");
  const [show, setShow] = useState("colors");
  const canvasRef = useRef<fabric.Canvas | null>(null);
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
    fontFamily: 'Arial'
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
    }
  })

  const availableFilters: { name: string; filter: fabric.IBaseFilter }[] = [
    { name: 'Grayscale', filter: new fabric.Image.filters.Grayscale() },
    { name: 'Sepia', filter: new fabric.Image.filters.Sepia() },
    { name: 'Invert', filter: new fabric.Image.filters.Invert() },
    // Add more filters as needed
  ];

  const classes = useStyles();

  const handleButtonClick = (buttonType: string) =>
    setActiveButton(buttonType)

  useEffect(() => {
    const loadCanvas = async () => {
      if (!canvasRef.current) {
        canvasRef.current = new fabric.Canvas('canvas', {
          width: canvasDimension.width,
          height: canvasDimension.height
        });
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
          // updateOverlayImage(template.overlayImage, 1)
          updateText({
            overlay: 0.6,
            text: updatedSeedData.texts[0],
            fontSize: 16,
            color: '#fff',
            fontFamily: 'Arial'
          })
          // updateBackgroundImage(updatedSeedData.backgroundImages[0])
          const img1 = '/images/sample/toa-heftiba-FV3GConVSss-unsplash.jpg';
          const img2 = '/images/sample/scott-circle-image.png';

          // if (template.diptych === 'horizontal') createCollage([img1, img2]);
          resolve(null);
        });
      })
    };

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

  }, [template, updatedSeedData]);

  const getExistingObject = (type: string) => canvasRef.current?.getObjects()?.find((obj: any) => obj['custom-type'] === type)

  // useEffect(() => {

  //   if (!canvasToolbox.activeObject) return
  //   console.log("🚀 ~ file: index.tsx:172 ~ useEffect ~ canvasToolbox.activeObject:", canvasToolbox.activeObject)
  //   const customType = canvasToolbox.activeObject['custom-type'];

  //   if (customType) {
  //     customType=
  //   } else {
  //     if (canvasToolbox.activeObject?._objects) {
  //       const bgType = canvasToolbox.activeObject._objects[0]['custom-type']?.includes('bg')
  //       if (bgType) setToolstep('bg')
  //     }
  //   }
  // }, [canvasToolbox])


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
          obj.set({
            stroke,
            strokeWidth
          })
          canvas.renderAll()
        }
      })
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
        group['custom-type'] = 'bubble';
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
  const updateBackgroundFilters = (filter: IBaseFilter): void => {
    const canvas = canvasRef?.current;
    if (!canvas) return

    const backgroundImage: fabric.Image | undefined = canvas.backgroundImage as fabric.Image;
    if (!backgroundImage) return

    backgroundImage.filters = [];
    backgroundImage.filters.push(filter);
    backgroundImage.applyFilters();
    canvas.renderAll();
  }

  const handleFilterChange = (props: { filter: fabric.IBaseFilter, type: string }) => {

    const { filter, type } = props
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }
    const imageObject: fabric.Object | undefined | any = getExistingObject(type)

    if (!imageObject) return

    const filterObj = availableFilters.find((f) => f.filter === filter);
    // imageObject.selectable = false,
    imageObject.filters = [filter];
    imageObject.applyFilters();

    canvas.renderAll();
    if (filterObj) setSelectedFilter(filterObj.name);
  };

  const updateBackgroundImage = (imageUrl: string) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }
    const isBackgroundExist: string | fabric.Image | undefined = canvas.backgroundImage

    if (isBackgroundExist) {
      fabric.Image.fromURL(imageUrl, function (img) {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.getWidth() / img.width,
          scaleY: canvas.getHeight() / img.height
        });
        img.scaleToWidth(canvas.getWidth())
        img.scaleToHeight(canvas.getHeight())
        img.center()
        canvas.renderAll();
      }, {
        crossOrigin: 'anonymous'
      });
    } else {
      let currentImageIndex = backgroundImages?.findIndex((bgImage: string) => bgImage === imageUrl)

      if (currentImageIndex === -1) return
      if (!template.diptych) return

      if (template.diptych === 'vertical') {
        if ((currentImageIndex) % 2 === 0) loadImage(imageUrl, 1, { top: 0, ['custom-type']: 'bg-1' })
        if ((currentImageIndex) % 2 === 1) loadImage(imageUrl, 2, { top: canvas.getHeight() / 2, ['custom-type']: 'bg-2' })
      } else {
        if ((currentImageIndex) % 2 === 0) loadImage(imageUrl, 1, { left: 0, ['custom-type']: 'bg-1' })
        if ((currentImageIndex) % 2 === 1) loadImage(imageUrl, 2, { left: canvas.getWidth() / 2, ['custom-type']: 'bg-2' })
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
      console.log("🚀 ~ file: index.tsx:310 ~ updateOverlayImage ~ existingObject:", existingObject)

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

        img['custom-type'] = 'overlay';

        canvas.insertAt(img, 3, false);
        canvas.renderAll();
      }, {
        crossOrigin: 'anonymous',
      });
    }
  }

  interface ImageOptions extends fabric.IImageOptions {
    ["custom-type"]: string | undefined
  }

  const loadImage = (url: string, index: number | undefined, options: ImageOptions) => {
    const canvas = canvasRef.current;

    if (!canvas) return
    const findExistingImageObject = getExistingObject(options['custom-type'])

    fabric.Image.fromURL(url, function (img) {
      // Calculate the aspect ratio of the image
      const aspectRatio = img.width / img.height;

      let scaledWidth = canvas.width || 0;
      let scaledHeight = canvas.height || 0;

      if (template.diptych === 'vertical') {
        scaledHeight = canvas.height || 0;
        scaledWidth = scaledHeight * aspectRatio;
      } else if (template.diptych === 'horizontal') {
        scaledWidth = (canvas.getWidth() / 2) || 0;
        // scaledHeight = scaledWidth / aspectRatio;
      }

      img.set({
        ...options,
        // selectable: false,
      });

      img.scaleToWidth(scaledWidth);
      img.scaleToHeight(scaledHeight);
      // img.center()
      // canvas.centerObject(img)

      if (index) canvas.insertAt(img, index, false);
      if (!index) canvas.add(img);
      if (findExistingImageObject) canvas.remove(findExistingImageObject)
      canvas.renderAll();
    }, {
      crossOrigin: 'anonymous',
    });
  };




  const createOrUpdateRect = (options: IRectOptions, index?: number | undefined) => {
    const canvas = canvasRef.current;

    if (!canvas) return

    const existingObject = getExistingObject('photo-border')

    const defaultOptions: IRectOptions = {
      left: (canvas.getWidth() / 2),
      selectable: false,
      // width: 0,
      // top:-0,
      stroke: 'red',
      strokeWidth: 3,
      ...options
    }

    if (existingObject) {
      existingObject.set(options);
      canvas.renderAll();
    } else {
      var rect = new fabric.Rect(defaultOptions);
      rect['custom-type'] = 'photo-border'
      if (index) canvas.insertAt(rect, index, false)
      if (!index) canvas.add(rect)
    }
  }

  const createCollage = (images: string[]) => {
    const canvas = canvasRef.current;

    if (!canvas) return

    // const img1 = '/images/sample/scott-bg-imag.jpg';
    const img1 = images[0] || '/images/sample/toa-heftiba-FV3GConVSss-unsplash.jpg';
    const img2 = images[1] || '/images/sample/scott-circle-image.png';

    if (template.diptych === "vertical") {
      loadImage(img1, 1, { top: 0, ['custom-type']: 'bg-1' })
      loadImage(img2, 2, { top: canvas.getHeight() / 2, ['custom-type']: 'bg-2' });
      createOrUpdateRect({ width: canvas.getWidth(), top: (canvas.getHeight() / 2 - 5) }, 3)
    } else {
      loadImage(img1, 1, { left: 0, ['custom-type']: 'bg-1' })
      loadImage(img2, 2, { left: canvas.getWidth() / 2, ['custom-type']: 'bg-2' });
      createOrUpdateRect({ left: (canvas.getHeight() / 2) - 5 }, 3)
    }
  }

  // const createCollage = (images: string[], diptych: Diptych) => {
  //   const canvas = canvasRef.current;

  //   if (!canvas) return

  //   // const img1 = '/images/sample/scott-bg-imag.jpg';
  //   const img1 = images[0] || '/images/sample/toa-heftiba-FV3GConVSss-unsplash.jpg';
  //   const img2 = images[1] || '/images/sample/scott-circle-image.png';

  //   loadImage(img1, 1, { top: 0, ['custom-type']: 'bg-1' }, 'bg-1')
  //   var rect = new fabric.Rect({
  //     left: -1,
  //     top: (canvas.height / 2),
  //     selectable: false,
  //     width: canvas.width,
  //     stroke: 'red',
  //     strokeWidth: 3
  //   });
  //   loadImage(img2, 2, { top: canvas.height / 2, ['custom-type']: 'bg-2' }, 'bg-2');
  //   canvas.insertAt(rect, 3, false)
  // }

  const updateText = (textFilters: FilterState) => {
    const { color, fontFamily, fontSize, text: overlayText } = textFilters
    const canvas = canvasRef.current;

    if (!canvas) return;

    const existingTextObject: any = getExistingObject('title');

    // Use the existing text or modify this based on your specific text property
    const textString = overlayText || existingTextObject?.text;

    existingTextObject.set({
      text: textString,
      fill: color || existingTextObject?.fill,
      fontSize: fontSize || 16,
      selectable: true,
      fontFamily: fontFamily || 'Arial',
    })
    canvas.renderAll();
  }


  const updateHashTag = (color: string, type: string) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const existingTextObject: any = getExistingObject(type);

    existingTextObject.set({
      fill: color || existingTextObject?.fill,
      selectable: true,
      fontWeight: 'bold'
    })
    canvas.renderAll();
  }

  /**
  * Saves the image from a canvas element as a PNG file.
  *
  * @return {void} This function does not return a value.
  */
  function saveImage(): void {
    const canvas = canvasRef.current

    if (!canvas) return
    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: 2,
      quality: 1.0,
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "canvas-export.png";
    link.click();
  }

  /**
  * Saves the JSON representation of the canvas.
  *
  * @return {void} - Does not return anything.
  */
  const saveJSON = () => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('Canvas is undefined.');
      return;
    }
    var json = JSON.stringify(canvas.toObject(['custom-type', 'selectable']));
    // Create a Blob containing the JSON data
    var blob = new Blob([json], { type: 'application/json' });

    // Create a link element
    var link = document.createElement('a');

    // Set the link's attributes
    link.download = 'canvas.json';
    link.href = URL.createObjectURL(blob);

    // Append the link to the document body
    document.body.appendChild(link);

    // Click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);

    console.log(json);
  }

  /**
  * Updates the color of an element.
  *
  * @param {Nullable<string | ColorPickerRGBType | ColorPickerHSBType>} color - The color to update the element with.
  * @param {string} type - The type of element to update.
  */
  const updateElementColor = (color: Nullable<string | ColorPickerRGBType | ColorPickerHSBType>, type: string) => {

    const blendColor = color ?? "#ffffff";
    const blendColorFilter = new fabric.Image.filters.BlendColor({
      color: blendColor,
      mode: 'tint',
      alpha: 1,
    })

    if (type == 'borders') {
      handleFilterChange({
        filter: blendColorFilter,
        type
      })
    } else {
      updateHashTag(blendColor, type)
    }
  };

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

  return (
    <div style={{ display: 'flex', columnGap: '50px', marginTop: 50, marginBottom: 50 }}>
      <div>
        <DeselectIcon color={canvasToolbox.isDeselectDisabled ? "disabled" : 'inherit'} aria-disabled={canvasToolbox.isDeselectDisabled} onClick={deselectObj} />
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
              <Button
                className={`${classes.button} ${activeButton === "border" && classes.buttonActive
                  }`}
                variant="text"
                color="primary"
                onClick={() => handleButtonClick("border")}
              >
                Border
              </Button>
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
                    if (value !== 0) updateBackgroundFilters(filter)
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
                    if (value !== 0) updateBackgroundFilters(filter)
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
                    onClick={() => updateBackgroundFilters(filter.filter)}
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
                    createOrUpdateRect({ ...filterValues.collage, stroke: color })
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
                      createOrUpdateRect({ strokeWidth: value, left: (canvasRef.current?.getWidth() / 2) - (value / 2) })
                    } else {
                      createOrUpdateRect({ strokeWidth: value, top: (canvasRef.current?.getHeight() / 2) - (value / 2) })
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
            {show === "size" && (
              <div className={classes.sliderContainer}>
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
              </div>
            )}
            {show === "font" && (
              <Box className={classes.optionsContainer}>

                <Box id="fontOptionContainer" className={classes.fontOptionContainer}>
                  {["Fira Sans"].map(
                    (fontFamily) => (
                      <IconButton
                        key={fontFamily}
                        onClick={() => {
                          updateText({ ...overlayTextFiltersState, fontFamily })
                          setOverlayTextFiltersState((prev) => ({ ...prev, fontFamily }))
                        }}
                        className={`${classes.fontOption} ${classes.fontOptionHover}`}
                      >
                        <div className={classes.fontOptionDiv}>{fontFamily}</div>
                      </IconButton>
                    )
                  )}
                </Box>

              </Box>
            )}
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
                  max={30}
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
            onClick={() => { setToolstep('bg') }}
          >
            <img src="/Tab-Icons/background.png" width='100' height="100" style={{ color: "white", fontSize: "30px" }} />
          </button>

          <button
            style={{ backgroundColor: "transparent", border: "none" }}
            onClick={() => { setToolstep('title') }}

          >
            <img src="/Tab-Icons/Edit-Text.png" width='100' height="100" style={{ color: "white", fontSize: "30px" }} />

          </button>

          <button
            onClick={() => { setToolstep('bubble') }}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <img src="/Tab-Icons/Add-Bubble.png" width='100' height="100" style={{ color: "white", fontSize: "30px" }} />
          </button>

          <button
            onClick={() => { setToolstep('element') }}

            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <img src="/Tab-Icons/Add-Elements.png" width='100' height="100" style={{ color: "white", fontSize: "30px" }} />
          </button>

          <button
            onClick={() => { setToolstep('writePost') }}

            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <img src="/Tab-Icons/Write-Post.png" width='100' height="100" style={{ color: "white", fontSize: "30px" }} />
          </button>

        </div>
      </div>

      {/* Footer Panel  End*/}

      {/* Sidebar Tools Panel */}
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
                {texts.map((text) => {
                  return <h5 onClick={() => {
                    // updateOverlay({ ...overlayTextFiltersState, text })
                    updateText({ ...overlayTextFiltersState, text })
                    setOverlayTextFiltersState((prev) => ({ ...prev, text }))
                  }} style={{ margin: '0px', marginBottom: '15px', cursor: 'pointer', color: '#a19d9d' }}>{text}</h5>
                })}
              </div>
            </div>}

          {toolsStep == 'bubble' &&
            <div>
              <h4 style={{ margin: '0px', padding: '0px' }}>From Article</h4>
              <ImageViewer clickHandler={(img: string) => updateBubbleImage(img)} images={bubbles} />

              <h4 style={{ margin: '0px', padding: '0px' }}>AI Images</h4>
              <ImageViewer clickHandler={(img: string) => updateBubbleImage(img)} images={bubbles} />

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
                  {elements.map((item) => {
                    return (
                      <img
                        key={item.id}
                        src={item.path}
                        alt=""
                        width='90px'
                        style={{ cursor: 'pointer', paddingBottom: '0.5rem' }}
                      />
                    );
                  })}
                  <CustomColorPicker value={overlayTextFiltersState.color}
                    changeHandler={(color: string) =>
                      updateElementColor(color, "swipe")} />
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
                  {borders.map((item) => {
                    return (
                      <img
                        key={item.id}
                        src={item.path}
                        alt=""
                        width='90px'
                        style={{ cursor: 'pointer', paddingBottom: '0.5rem' }}
                      />
                    );
                  })}
                  <CustomColorPicker value={overlayTextFiltersState.color}
                    changeHandler={(color: string) =>
                      updateElementColor(color, "borders")} />

                  {/* <ColorPicker onChange={(e) => updateElementColor(e.value, "borders")} value='008000' inputStyle={{ width: '20px', marginLeft: '10px' }} /> */}

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
                  {logos?.map((item) => {
                    return (
                      <img
                        key={item.id}
                        src={item.path}
                        alt=""
                        style={{ cursor: 'pointer', paddingBottom: '0.5rem' }}
                        width='90px'
                      />
                    );
                  })}
                  <CustomColorPicker value={overlayTextFiltersState.color}
                    changeHandler={(color: string) => {
                      return updateElementColor(color, "hashtag")
                    }
                    } />
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
          <button onClick={saveImage} style={{ width: '100%', height: "42px", borderRadius: '25px', border: 'none', backgroundColor: '#3b0e39', color: 'white' }}>
            Export
          </button>
        </div>
        <div style={{ marginTop: '40%', position: 'relative' }}>
          <button onClick={saveJSON} style={{ width: '100%', height: "42px", borderRadius: '25px', border: 'none', backgroundColor: '#3b0e39', color: 'white' }}>
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
