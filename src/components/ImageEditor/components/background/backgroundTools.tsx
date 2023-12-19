import { useState } from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { useTitle } from "../../../../context/fabricContext";

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
}));

const BackgroundTools = () => {
  const classes = useStyles();

  const [activeButton, setActiveButton] = useState("");

  const valuetext = (value: number) => `${value}`;
  const { background, setBackground } = useTitle();

  const handleButtonClick = (buttonType: string) => {
    setActiveButton(buttonType);
  };

  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const filterHanlder = async (value: string) => {
    setSelectedFilter(value);
    setBackground((prev) => ({
      ...prev,
      tools: {
        ...prev.tools,
        filter: value as unknown as string,
        filterToggle:
          value === background.tools.filter && background.tools.filterToggle
            ? false
            : true,
      },
    }));
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.optionsContainer}>
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
      </div>
      {activeButton === "Overlay" && (
        <div className={classes.sliderContainer}>
          <Slider
            className={classes.slider}
            aria-label="Overlay, Brightness, Contrast"
            getAriaValueText={valuetext}
            color="secondary"
            defaultValue={0}
            min={0}
            max={1}
            step={0.1}
            valueLabelDisplay="auto"
            onChange={(event: Event, value: number | number[]) => {
              const e = event as unknown as React.ChangeEvent<HTMLInputElement>;

              if (typeof value === "number") {
                setBackground((prev) => ({
                  ...prev,
                  tools: {
                    ...prev.tools,
                    overlay: e.target.value as unknown as string,
                  },
                }));
              }
            }}
          />
        </div>
      )}

      {activeButton === "Contrast" && (
        <div className={classes.sliderContainer}>
          <Slider
            className={classes.slider}
            aria-label="Overlay, Brightness, Contrast"
            getAriaValueText={valuetext}
            color="secondary"
            defaultValue={0}
            min={-1}
            max={1}
            step={0.1}
            valueLabelDisplay="auto"
            //eslint-disable-next-line
            onChange={(event: Event, value: number | number[]) => {
              const e = event as unknown as React.ChangeEvent<HTMLInputElement>;

              if (typeof value === "number") {
                setBackground((prev) => ({
                  ...prev,
                  tools: {
                    ...prev.tools,
                    contrast: e.target.value as unknown as string,
                  },
                }));
              }
            }}
          />
        </div>
      )}
      {activeButton === "Brightness" && (
        <div className={classes.sliderContainer}>
          <Slider
            className={classes.slider}
            aria-label="Overlay, Brightness, Contrast"
            getAriaValueText={valuetext}
            color="secondary"
            defaultValue={0}
            min={-1}
            max={1}
            step={0.1}
            valueLabelDisplay="auto"
            onChange={(event: Event, value: number | number[]) => {
              const e = event as unknown as React.ChangeEvent<HTMLInputElement>;

              if (typeof value === "number") {
                setBackground((prev) => ({
                  ...prev,
                  tools: {
                    ...prev.tools,
                    brightness: e.target.value as unknown as string,
                  },
                }));
              }
            }}
          />
        </div>
      )}
      {activeButton === "Filters" && (
        <div className={classes.sliderContainer}>
          <Button
            className={`${classes.button} ${
              selectedFilter === "greyscale" &&
              background.tools.filterToggle &&
              classes.buttonActive
            }`}
            variant="text"
            color="primary"
            onClick={() => filterHanlder("greyscale")}
          >
            Greyscale
          </Button>
          <Button
            className={`${classes.button} ${
              selectedFilter === "invert" &&
              background.tools.filterToggle &&
              classes.buttonActive
            }`}
            variant="text"
            color="primary"
            onClick={() => filterHanlder("invert")}
          >
            Invert
          </Button>
          <Button
            className={`${classes.button} ${
              selectedFilter === "sepia" &&
              background.tools.filterToggle &&
              classes.buttonActive
            }`}
            variant="text"
            color="primary"
            onClick={() => filterHanlder("sepia")}
          >
            Sepia
          </Button>
          <Button
            className={`${classes.button} ${
              selectedFilter === "brownie" &&
              background.tools.filterToggle &&
              classes.buttonActive
            }`}
            variant="text"
            color="primary"
            onClick={() => filterHanlder("brownie")}
          >
            Brownie
          </Button>
          <Button
            className={`${classes.button} ${
              selectedFilter === "vintage" &&
              background.tools.filterToggle &&
              classes.buttonActive
            }`}
            variant="text"
            color="primary"
            onClick={() => filterHanlder("vintage")}
          >
            vintage
          </Button>

          {/* <Button
            className={`${classes.button} ${
              selectedFilter === "kodachrome" && classes.buttonActive
            }`}
            variant="text"
            color="primary"
            onClick={() => filterHanlder("kodachrome")}
          >
            kodachrome
          </Button>

          <Button
            className={`${classes.button} ${
              selectedFilter === "technicolor" && classes.buttonActive
            }`}
            variant="text"
            color="primary"
            onClick={() => filterHanlder("technicolor")}
          >
            technicolor
          </Button>

          <Button
            className={`${classes.button} ${
              selectedFilter === "polaroid" && classes.buttonActive
            }`}
            variant="text"
            color="primary"
            onClick={() => filterHanlder("polaroid")}
          >
            polaroid
          </Button> */}
        </div>
      )}
    </Paper>
  );
};

export default BackgroundTools;
