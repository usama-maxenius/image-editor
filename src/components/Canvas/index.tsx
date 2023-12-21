import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import yourCanvasJson from "../Templates/first.json";
import LandscapeIcon from "@mui/icons-material/Landscape";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PersonIcon from "@mui/icons-material/Person";
import WavesIcon from "@mui/icons-material/Waves";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Typography, Box, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import { ColorPicker } from "primereact/colorpicker";




interface CanvasProps {
  text: string;
  image: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    height: "100%",
    backgroundImage: "linear-gradient(to right, #4B1248, #F0C27B)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  colorPicker: {
    width: "20px",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: "12px",
  },
  slider: {
    width: "100%",
    // margin: theme.spacing(2),
    marginBottom: "20px",
  },
  button: {
    height: "36px",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    minWidth: 0,
    color: "white",
    transition: "color 0.3s",
    "&:hover": {
      color: "white",
    },
  },

  sliderContainer: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "30px !important",
    marginBottom: "10px !important",
  },
  buttonActive: {
    color: "yellow !important",
  },
  colorOption: {
    width: "20px",
    height: "15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  heading: {
    color: "white",
    cursor: "pointer",
    paddingRight: '30px'
  },
  fontOptionContainer: {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },
  fontOption: {
    width: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    paddingTop: "0",
    marginTop: "10px",
    marginRight: "10px",
  },
  fontOptionDiv: {
    width: "100px",
    height: "20px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    fontSize: "14px",
    color: "black",
    padding: "4px 4px 8px 4px",
    fontFamily: "'Arial', sans-serif",
    textAlign: "center",
    lineHeight: "30px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  fontOptionHover: {
    "&:hover $fontOptionDiv": {
      borderColor: "#4B1248",
    },
  },
  fontOptionActive: {
    "&$fontOptionDiv": {
      borderColor: "#F0C27B",
    },
  },
  navigationButton: {
    cursor: "pointer",
    marginLeft: "10px",
    padding: 0,
    margin: 0,
  },
}));

const styles = {
  imageBox: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap" as "wrap", // Correct type for flexWrap
    rowGap: "10px",
  },
  image: {
    width: "90px",
    height: "90px",
    border: "2px #9575bf solid",
  },
  uploadBox: {
    display: "flex",
    justifyContent: "center",
    marginTop: "16px",
  },
  uploadLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  } as React.CSSProperties, // Explicitly specify the style type
};

const images = [
  { name: 'Nature', url: 'https://res.cloudinary.com/dkh87tzrg/image/upload/v1665486789/hlfbvilioi8rlkrumq2g.jpg' },
  { name: 'City', url: 'https://res.cloudinary.com/dkh87tzrg/image/upload/v1671791251/f86duowvpgzgrsz7rfou.jpg' },
  { name: 'City', url: 'https://res.cloudinary.com/dkh87tzrg/image/upload/v1671791251/f86duowvpgzgrsz7rfou.jpg' },
  { name: 'Nature', url: 'https://res.cloudinary.com/dkh87tzrg/image/upload/v1665486789/hlfbvilioi8rlkrumq2g.jpg' },
  { name: 'City', url: 'https://res.cloudinary.com/dkh87tzrg/image/upload/v1671791251/f86duowvpgzgrsz7rfou.jpg' },

  // { name: 'Mountains', url: 'https://example.com/mountains.jpg' },
  // Add more images as needed
];

const testText = [
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio pariatur, excepturi nihil aliquid libero deserunt neque esse expedita rem ipsum.',
  'Lorem esse expedita rem ipsum.',
  'consectetur adipisicing elit. Distinctio pariatur, excepturi nihil edita rem ipsum'
];
const colors = [
  { id: 1, color: "white" },
  { id: 2, color: "black" },
  { id: 3, color: "red" },
  { id: 4, color: "grey" },
];

const elements = [
  {
    id: "1",
    path: "/images/sample/swipe-left.png",
  },
];
const borders = [
  {
    id: "1",
    path: "/images/sample/borders.png",
  },
];
const specialTags = [
  {
    id: "1",
    path: "/images/sample/special-tag.png",
  },
];

interface FilterState {
  overlay: number;
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
}

const Canvas: React.FC<CanvasProps> = React.memo(({ text, image, ref }) => {
  const [appliedFilters, setAppliedFilters] = useState<fabric.IBaseFilter[]>([]);
  const [activeButton, setActiveButton] = useState("");
  const [show, setShow] = useState("colors");
  const canvasRef = useRef<fabric.Canvas | null>(ref || null);
  const [toolsStep, setToolstep] = useState('bg')
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [overlayTextFiltersState, setOverlayTextFiltersState] = useState<FilterState>({
    overlay: 0.6,
    text: '',
    fontSize: 16,
    color: 'white',
    fontFamily: 'Arial'
  });

  const availableFilters: { name: string; filter: fabric.IBaseFilter }[] = [
    { name: 'Grayscale', filter: new fabric.Image.filters.Grayscale() },
    { name: 'Sepia', filter: new fabric.Image.filters.Sepia() },
    { name: 'Invert', filter: new fabric.Image.filters.Invert() },
    // Add more filters as needed
  ];
  const classes = useStyles();


  console.log(canvasRef);

  const handleButtonClick = (buttonType: string) =>
    setActiveButton(buttonType)

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

      updateBubbleImage(image)
    };

    loadCanvas();

    return () => {
      // Cleanup code if needed
    };
  }, [text, image]);

  const updateBubbleImage = (imgUrl: string) => {
    // Check if a bubble with the custom type already exists
    const existingBubble = canvasRef.current?.getObjects().find(obj => obj['custom-type'] === 'bubble');

    // Create a new bubble if it doesn't exist
    fabric.Image.fromURL(
      imgUrl,
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
            hasControls: false,
            evented: true, // Set evented to true to enable events
          })
          .center()
          .setCoords();

        const clipPath = new fabric.Circle({
          radius: 350,
          originX: "center",
          originY: "center",
        });

        img['custom-type'] = 'bubble';
        img.clipPath = clipPath;
        fabric.Object.prototype.objectCaching = false;
        if (existingBubble) canvasRef.current?.remove(existingBubble)
        canvasRef.current?.add(img);
        canvasRef.current?.renderAll();
      }, {
      crossOrigin: 'anonymous'
    }
    );

  };

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

  const handleFilterChange = (props: { filter: fabric.IBaseFilter, type: string }) => {

    const { filter, type } = props
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }
    const imageObject: fabric.Object | undefined = canvasRef.current?.getObjects().find(
      (object) => object["custom-type"] === type
    );

    if (!imageObject) return

    const filterObj = availableFilters.find((f) => f.filter === filter);
    imageObject.filters = [filter];
    imageObject.applyFilters();

    canvas.renderAll();
    if (filterObj) setSelectedFilter(filterObj.name);
  };

  const handleImageChange = (imageUrl: string, filter?: string) => {

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

  useEffect(() => {
    // Listen for object:selected event to trigger re-rendering after selecting an object
    canvasRef.current?.on('object:selected', applyImageFilters);
    return () => {
      canvasRef.current?.off('object:selected', applyImageFilters);
    };
  }, []);

  const updateOverlay = (overlayTextFilters: FilterState) => {

    const { color, fontFamily, fontSize, overlay: val, text: overlayText } = overlayTextFilters;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const existingObject = canvas.getObjects().find((object) => object["custom-type"] === "rect");

    if (!existingObject) return;

    if (val === 0) return;

    var shadow = new fabric.Shadow({
      color: `rgba(0, 0, 0, 0.8)`, // Increase opacity
      blur: 20, // Increase blur value
      offsetX: 0,
      offsetY: -30,
    });

    // Create a new fabric.Rect with updated properties
    const rect = new fabric.Rect({
      ...existingObject,
      fill: new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 200,
        },
        colorStops: [
          { offset: 0, color: `rgba(0, 0, 0, ${val})` },
          { offset: 0.2, color: `rgba(0, 0, 0, ${Math.min(val + 0.2, 1).toFixed(2)})` },
          { offset: 0.5, color: `rgba(0, 0, 0, ${Math.min(val + 0.4, 1).toFixed(2)})` },
          { offset: 1, color: `rgba(0, 0, 0, ${Math.min(val + 0.6, 1).toFixed(2)})` },
        ],
      }),
      shadow,
    });

    // Add the rectangle to the canvas
    // canvas.add(rect);
    canvas.insertAt(rect, 1, false)
    canvas.remove(existingObject);

    const existingTextObject = canvas.getObjects().find((object) => object["custom-type"] === "title");

    // Use the existing text or modify this based on your specific text property
    const textString = overlayText || existingTextObject?.text;

    // Create a new fabric.Text with updated properties
    const text = new fabric.Textbox(textString, {
      ...existingTextObject,
      text: textString,
      fill: color || existingTextObject?.fill,
      fontSize: fontSize || 16,
      selectable: true,
      fontFamily: fontFamily || 'Arial', // Use 'Arial' as a default if fontFamily is not provided
    });

    // Add the text to the canvas

    if (existingTextObject) {
      canvas.remove(existingTextObject);
    }

    // Add the text to the canvas
    canvas.add(text);

    // canvas.on("object:moving", objectMoving);
    // Render the canvas
    canvas.renderAll();
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

  const updateSwipeLeft = (color: string, type: string) => {

    const blendColor = color ? `#${color}` : "#ffffff";
    const blendColorFilter = new fabric.Image.filters.BlendColor({
      color: blendColor,
      mode: 'tint',
      alpha: 1,

    })
    handleFilterChange({
      filter: blendColorFilter,
      type
    })
  };


  const updateBorders = (color: string) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const existingObject = canvas.getObjects().find((object) => object["custom-type"] === "borders");

    if (!existingObject) return;
    const blendColor = color ? `#${color}` : "#ffffff";
    const blendColorFilter = new fabric.Image.filters.BlendColor({
      color: blendColor,
      mode: 'tint',
      alpha: 1,

    })
    handleFilterChange({
      filter: blendColorFilter,
      type: "borders"
    })

  }

  return (
    <div style={{ display: 'flex', columnGap: '50px' }}>

      <div>
        <canvas id="canvas" width={800} height={600}></canvas>
        {toolsStep == 'bg' && <div>

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
                  defaultValue={overlayTextFiltersState.overlay}
                  min={0}
                  onChange={(e: any) => {
                    const val = +e.target.value;
                    if (val !== 0) {
                      updateOverlay({ ...overlayTextFiltersState, overlay: val })
                      setOverlayTextFiltersState((prev) => ({ ...prev, overlay: val }))
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
                  max={1}
                  step={0.1}
                  valueLabelDisplay="auto"
                  //eslint-disable-next-line
                  onChange={(e) => {
                    let value = +e.target.value
                    var filter = new fabric.Image.filters.Contrast({
                      contrast: value
                    });
                    if (value !== 0) handleFilterChange({
                      filter,
                      type: 'background'
                    })
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
                  valueLabelDisplay="auto"
                  onChange={(e) => {
                    let value = e.target.value
                    var filter = new fabric.Image.filters.Brightness({
                      brightness: value
                    });
                    if (value !== 0) handleFilterChange({
                      filter,
                      type: 'background'
                    })
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
                    onClick={() => {
                      handleFilterChange({
                        filter: filter.filter,
                        type: 'background'
                      })
                    }}
                  >
                    {filter.name}
                  </Button>

                ))}

              </div>
            )}
          </Paper>

        </div>}

        {
          toolsStep == 'title' && <div>
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
                  {colors.map((item) => (
                    <IconButton
                      onClick={() => {
                        updateOverlay({ ...overlayTextFiltersState, color: item.color })
                        setOverlayTextFiltersState((prev) => ({ ...prev, color: item.color }))
                      }}
                      key={item.id}
                    >
                      <div
                        className={classes.colorOption}
                        style={{ background: item.color }}
                      />
                    </IconButton>
                  ))}
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
                    onChange={(e) => {
                      const value = +e.target.value;
                      updateOverlay({ ...overlayTextFiltersState, fontSize: value })
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
                    {["Arial", "Times New Roman", "Courier New", "Georgia"].map(
                      (fontFamily) => (
                        <IconButton
                          key={fontFamily}
                          onClick={() => {
                            updateOverlay({ ...overlayTextFiltersState, fontFamily })
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
          </div>
        }

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
        <div style={{ width: '130px', height: '480px', padding: '10px' }}>

          {toolsStep == 'bg' &&
            <div>
              <h4 style={{ margin: '0px', padding: '0px' }}>From Article</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: '10px', margin: '10px 0px', height: '152px', overflow: 'scroll' }}>

                {images.map((item) => {
                  return <img src={item.url} alt="" width='60px' onClick={() => { handleImageChange(item.url) }} />
                })}
              </div>
              <h4 style={{ margin: '0px', padding: '0px' }}>AI Images</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: '10px', margin: '10px 0px', height: '152px', overflow: 'scroll' }}>

                {images.map((item) => {
                  return <img src={item.url} alt="" width='60px' onClick={() => { handleImageChange(item.url) }} />
                })}
              </div>

              <Box {...styles.uploadBox}>
                <label style={styles.uploadLabel}>

                  <h4>IMAGE UPLOAD</h4>

                  <form method="post" encType="multipart/form-data">
                    <input type="file" style={{ display: "none" }} />
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
                {testText.map((text) => {
                  return <h5 onClick={() => {
                    updateOverlay({ ...overlayTextFiltersState, text })
                    setOverlayTextFiltersState((prev) => ({ ...prev, text }))
                  }} style={{ margin: '0px', marginBottom: '15px', cursor: 'pointer', color: '#a19d9d' }}>{text}</h5>
                })}

              </div>

            </div>}

          {toolsStep == 'bubble' &&
            <div>
              <h4 style={{ margin: '0px', padding: '0px' }}>From Article</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: '10px', margin: '10px 0px', height: '152px', overflow: 'scroll' }}>

                {images.map((item) => {
                  return <img src={item.url} alt="" width='60px' onClick={() => { updateBubbleImage(item.url) }} />
                })}
              </div>
              <h4 style={{ margin: '0px', padding: '0px' }}>AI Images</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: '10px', margin: '10px 0px', height: '152px', overflow: 'scroll' }}>

                {images.map((item) => {
                  return <img src={item.url} alt="" width='60px' onClick={() => { updateBubbleImage(item.url) }} />
                })}
              </div>

              <Box {...styles.uploadBox}>
                <label style={styles.uploadLabel}>

                  <h4>IMAGE UPLOAD</h4>

                  <form method="post" encType="multipart/form-data">
                    <input type="file" style={{ display: "none" }} />
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
                  <ColorPicker onChange={(e) => updateSwipeLeft(e.value, "swipe-left")} value='008000' inputStyle={{ width: '20px', marginLeft: '10px' }} />
                </Box>
              </Box>
              <Box>
                <h4 >Borders</h4>
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
                  <ColorPicker onChange={(e) => updateSwipeLeft(e.value, "borders")} value='008000' inputStyle={{ width: '20px', marginLeft: '10px' }} />

                </Box>
              </Box>

              <Box>
                <h4>Special Tags</h4>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {specialTags.map((item) => {
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
                  <ColorPicker value='008000' onChange={(e) => updateSwipeLeft(e.value, "special-tag")} inputStyle={{ width: '20px', marginLeft: '10px' }} />
                </Box>
              </Box>
            </>


          </div>}

          {toolsStep == 'writePost' &&
            <div>
              <h2>write post</h2>
            </div>}


        </div>
        <div style={{ marginTop: '15%' }}>
          <button onClick={saveImage} style={{ width: '100%', height: "42px", borderRadius: '25px', border: 'none', backgroundColor: '#3b0e39', color: 'white' }}>
            Export
          </button></div>
      </div>

    </div>
  );
});

export default Canvas;
