import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "97%",
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

export const styles = {
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
