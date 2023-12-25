 // @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import LandscapeIcon from "@mui/icons-material/Landscape";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PersonIcon from "@mui/icons-material/Person";
import WavesIcon from "@mui/icons-material/Waves";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Typography, Box, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import { ColorPicker, ColorPickerChangeEvent, ColorPickerHSBType, ColorPickerRGBType } from "primereact/colorpicker";
import { Nullable } from 'primereact/ts-helpers';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styles, useStyles } from './index.style';
import ImageViewer from '../Image';
import { IBaseFilter } from 'fabric/fabric-impl';
import { canvasDimension } from '../../constants';

interface CanvasProps {
  template: string
}

interface FilterState {
  overlay: number;
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
}


const Canvas: React.FC<CanvasProps> = React.memo(({ updatedSeedData, template }) => {
  const { borders, elements, backgroundImages, logos, texts, bubbles } = updatedSeedData
  const [activeButton, setActiveButton] = useState("Overlay");
  const [show, setShow] = useState("colors");
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [toolsStep, setToolstep] = useState('bg')
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [dropDown, setDropDown] = useState(true)
  const [filtersRange, setFiltersRange] = useState({ brightness: 0, contrast: 0 })
  const [colorValue, setColorValue] = useState('red')
  const [, setSelectedImage] = useState<string>('');

  const [initialData, setInitialData] = useState({
    backgroundImages,
    bubbles
  })
  const [overlayTextFiltersState, setOverlayTextFiltersState] = useState<FilterState>({
    overlay: 0.6,
    text: '',
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
      opacity: 1
    },
    bubble: {
      image: '',
      strokeWidth: 10,
      stroke: '#fff'
    },
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

      // @vite-ignore
      const templateJSON = await import(template.path);

      // Load canvas JSON template
      await new Promise((resolve) => {
        canvasRef.current?.loadFromJSON(templateJSON, () => {
          updateOverlayImage(template.overlayImage, 1)
          resolve(null);
        });
      });
    };

    loadCanvas();

  }, [template]);

  const updateBubbleImage = (imgUrl: string | undefined, filter?: { strokeWidth: number, stroke: string }) => {
    const strokeWidth = filter?.strokeWidth || 10;
    const stroke = filter?.stroke || "white";

    const existingGroup = canvasRef.current?.getObjects().find(obj => obj['custom-type'] === 'bubble');

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
 *
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
    const imageObject: fabric.Object | undefined | any = canvasRef.current?.getObjects().find(
      (object) => object["custom-type"] === type
    );

    if (!imageObject) return

    const filterObj = availableFilters.find((f) => f.filter === filter);
    imageObject.selectable = false,
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

    fabric.Image.fromURL(imageUrl, function (img) {
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        // Optional properties
        width: canvas.width,
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
        selectable: false,
        crossOrigin: 'anonymous',
      });

      canvas.renderAll();
      setSelectedImage(imageUrl);
    }, {
      crossOrigin: 'anonymous'
    })
  };

  const updateOverlayImage = (image: string, opacity: number) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.log("Canvas not loaded yet");
      return
    }
    const existingObject = canvas.getObjects().find((object) => object["custom-type"] === "overlay");

    if (existingObject) canvas.remove(existingObject)


    fabric.Image.fromURL(image, function (img) {

      // canvas.setOverlayImage(img, canvas.renderAll.bind(canvas));

      var oImg = img.set({
        width: canvas.width, height: canvasDimension.height, left: 0, top: 0, selectable: false,
        opacity: +opacity.toFixed(2) || 1,
        // backgroundColor: 'gray'
      })
      oImg['custom-type'] = 'overlay'

      canvas.insertAt(oImg, 1, false);
      canvas?.renderAll();
    }, {
      crossOrigin: 'anonymous'
    });
    canvas?.renderAll();
  }

  const updateText = (textFilters: FilterState) => {
    const { color, fontFamily, fontSize, text: overlayText } = textFilters
    const canvas = canvasRef.current;

    if (!canvas) return;

    const existingTextObject: any = canvas.getObjects().find((object) => object["custom-type"] === "title");

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

    const existingTextObject: any = canvas.getObjects().find((object) => object["custom-type"] === type);

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
    var json = JSON.stringify(canvas.toObject(['custom-type']));
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

    const blendColor = color ? `#${color}` : "#ffffff";
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
      ...prev, [field]: [{
        name: 'uploadedImage',
        url: URL.createObjectURL(files[0])
      }, ...prev[field]]
    }))
  }

  return (
    <div style={{ display: 'flex', columnGap: '50px', marginTop: 50, marginBottom: 50 }}>
      <div>
        <canvas height={canvasDimension.height} id="canvas"></canvas>
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
            </div>
            {activeButton === "Overlay" && (
              <div className={classes.sliderContainer}>
                <Slider
                  className={classes.slider}
                  aria-label="Overlay, Brightness, Contrast"
                  color="secondary"
                  value={filterValues.overlay.opacity}
                  // min={0}
                  onChange={(e: any) => {
                    const val = +e.target.value;
                    if (val !== 0) {
                      updateOverlayImage(filterValues.overlay.imgUrl, val)
                      setFilterValues((prev) => ({ ...prev, overlay: { ...prev.overlay, opacity: val } }))
                    }
                  }}
                  max={1}
                  step={0.1}
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
                <ColorPicker format="hex" value={overlayTextFiltersState.color} inputStyle={{ width: '25px' }}
                  onChange={(e) => {
                    const color = `#${e.target.value}`
                    updateText({ ...overlayTextFiltersState, color })
                    setOverlayTextFiltersState((prev) => ({ ...prev, color }))
                  }}
                /> <input type="text" value={colorValue} onChange={(e) => { setColorValue(e.target.value) }} />
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
                <ColorPicker format="hex" value={filterValues.bubble.stroke} inputStyle={{ width: '25px' }}
                  onChange={(e) => {
                    const color = `#${e.target.value}`
                    updateBubbleImage(undefined, { stroke: color, strokeWidth: filterValues.bubble.strokeWidth })
                    setFilterValues((prev) => ({ ...prev, bubble: { ...prev.bubble, stroke: color } }))
                  }}
                /> <input type="text" value={filterValues.bubble.stroke} onChange={(e) => setFilterValues((prev) => ({ ...prev, bubble: { ...prev.bubble, stroke: e.target.value } }))} />
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

        <Paper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { dropDown ? setDropDown(false) : setDropDown(true) }}>{dropDown ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</Paper>

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
            <LandscapeIcon style={{ color: "white", fontSize: "30px" }} />
            <p style={{ color: "white", margin: "0px", fontWeight: "600" }}>
              BACKGROUND
            </p>
          </button>

          <button
            style={{ backgroundColor: "transparent", border: "none" }}
            onClick={() => { setToolstep('title') }}

          >
            <TextFieldsIcon style={{ color: "white", fontSize: "30px" }} />
            <p style={{ color: "white", margin: "0px", fontWeight: "600" }}>
              {" "}
              TITLE{" "}
            </p>
          </button>

          <button
            onClick={() => { setToolstep('bubble') }}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <PersonIcon style={{ color: "white", fontSize: "30px" }} />
            <p style={{ color: "white", margin: "0px", fontWeight: "600" }}>
              {" "}
              ADD BUBBLE
            </p>
          </button>

          <button
            onClick={() => { setToolstep('element') }}

            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <WavesIcon style={{ color: "white", fontSize: "30px" }} />
            <p style={{ color: "white", margin: "0px", fontWeight: "600" }}>
              Elements
            </p>
          </button>

          <button
            onClick={() => { setToolstep('writePost') }}

            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <EditNoteIcon style={{ color: "white", fontSize: "30px" }} />
            <p style={{ color: "white", margin: "0px", fontWeight: "600" }}>
              write post
            </p>
          </button>
        </div>
      </div>

      <div>
        <div style={{ width: '250px', height: '480px', padding: '10px' }}>
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
                    updateText({ ...overlayTextFiltersState, text: text.title })
                    setOverlayTextFiltersState((prev) => ({ ...prev, text: text.title }))
                  }} style={{ margin: '0px', marginBottom: '15px', cursor: 'pointer', color: '#a19d9d' }}>{text.title}</h5>
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
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {elements.map((item) => {
                    return (
                      <img
                        key={item.id}
                        src={item.path}
                        alt=""
                        width='90px'
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  })}
                  <ColorPicker onChange={(e: ColorPickerChangeEvent) => updateElementColor(e.value, "swipe")} value='008000' inputStyle={{ width: '20px', marginLeft: '10px' }} />
                </Box>
              </Box>
              <Box>
                <h4>Borders</h4>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {borders.map((item) => {
                    return (
                      <img
                        key={item.id}
                        src={item.path}
                        alt=""
                        width='90px'
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  })}
                  <ColorPicker onChange={(e) => updateElementColor(e.value, "borders")} value='008000' inputStyle={{ width: '20px', marginLeft: '10px' }} />

                </Box>
              </Box>

              <Box>
                <h4>Social Tags</h4>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {logos?.map((item) => {
                    return (
                      <img
                        key={item.id}
                        src={item.path}
                        alt=""
                        style={{ cursor: 'pointer' }}
                        width='90px'
                      />
                    );
                  })}
                  <ColorPicker value='008000' onChange={(e) => updateElementColor(e.value, "hashtag")} inputStyle={{ width: '20px', marginLeft: '10px' }} />
                </Box>
              </Box>
            </>


          </div>}

          {toolsStep == 'writePost' &&
            <div>
              <h2>write post</h2>
            </div>}


        </div>
        <div style={{ marginTop: '40%', position: 'relative' }}>
          <button onClick={saveImage} style={{ width: '100%', height: "42px", borderRadius: '25px', border: 'none', backgroundColor: '#3b0e39', color: 'white' }}>
            Export
          </button>
        </div>
      </div>

    </div>
  );
});

export default Canvas;
