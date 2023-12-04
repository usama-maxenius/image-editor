import { useState } from "react";
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useTitle } from "../../../../context/fabricContext";
import { Theme } from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    height: "100%",
    backgroundImage: "linear-gradient(to right, #4B1248, #F0C27B)",

    display: "flex",
    flexDirection: "column",
  },
  optionsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    gap: theme.spacing(2),
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
  sliderContainer: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "30px",
    marginBottom: "10px",
  },
}));

const colors = [
  { id: 1, color: "white" },
  { id: 2, color: "black" },
  { id: 3, color: "red" },
  { id: 4, color: "grey" },
];

const TitleTools = () => {
  const classes = useStyles();
  const [show, setShow] = useState("colors");
  const { setTitle } = useTitle();

  const handleColorChange = (color: string) => {
    setTitle((prev) => ({ ...prev, tools: { ...prev.tools, color: color } }));
  };

  function valuetext(value: number) {
    return `${value}`;
  }

  // const isActiveFont = (fontFamily: any) => {
  //   return fontFamily === title.tools.fontFamily;
  // };
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction: any) => {
    const container = document.getElementById("fontOptionContainer");
    const scrollWidth = container?.scrollWidth;
    const clientWidth = container?.clientWidth;
    let newPosition;

    if (direction === "left" && clientWidth && scrollWidth) {
      newPosition = Math.max(scrollPosition - clientWidth, 0);
    } else if (clientWidth && scrollWidth) {
      newPosition = Math.min(
        scrollPosition + clientWidth,
        scrollWidth - clientWidth
      );
    }

    if (newPosition !== undefined) {
      setScrollPosition(newPosition);
      container!.scrollLeft = newPosition; // Use non-null assertion operator (!)
    }
  };
  return (
    <Paper className={classes.root}>
      <Box className={classes.optionsContainer}>
        <Typography className={classes.heading} onClick={() => setShow("font")}>
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
              key={item.id}
              onClick={() => handleColorChange(item.color)}
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
        <Box className={classes.optionsContainer}>
          <Box className={classes.sliderContainer}>
            <Slider
              aria-label="Temperature"
              defaultValue={12}
              getAriaValueText={valuetext}
              color="secondary"
              min={12}
              max={72}
              //eslint-disable-next-line
              onChange={(event: Event, value: number | number[]) => {
                const e =
                  event as unknown as React.ChangeEvent<HTMLInputElement>;

                if (typeof value === "number") {
                  setTitle((prev) => ({
                    ...prev,
                    tools: {
                      ...prev.tools,
                      fontSize: e.target.value as unknown as string,
                    },
                  }));
                }
              }}
            />
          </Box>
        </Box>
      )}
      {show === "font" && (
        <Box className={classes.optionsContainer}>
          <IconButton
            className={classes.navigationButton}
            onClick={() => handleScroll("left")}
          >
            <ArrowLeftIcon />
          </IconButton>
          <Box id="fontOptionContainer" className={classes.fontOptionContainer}>
            {["Arial", "Times New Roman", "Courier New", "Georgia"].map(
              (fontFamily) => (
                <IconButton
                  key={fontFamily}
                  onClick={() =>
                    setTitle((prev) => ({
                      ...prev,
                      tools: { ...prev.tools, fontFamily: fontFamily },
                    }))
                  }
                  className={`${classes.fontOption} ${classes.fontOptionHover}`}
                >
                  <div className={classes.fontOptionDiv}>{fontFamily}</div>
                </IconButton>
              )
            )}
          </Box>
          <IconButton
            className={classes.navigationButton}
            onClick={() => handleScroll("right")}
          >
            <ArrowRightIcon />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
};

export default TitleTools;
