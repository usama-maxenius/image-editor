import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Theme } from "@mui/material/styles";
import { useCircleData } from "../../../../context/circle-context/circleContext";
import { useState } from "react";


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



const BubbleTools = () => {
  const classes = useStyles();
  const [top,setTop] = useState(120)
  const [right,setRight] = useState(10)
  const { circleData,setCircleData } = useCircleData();
 
  

  const topButton = ()=>{
    setTop(top-4)
    setCircleData({top,right})
  }
  const rightButton = ()=>{
    setRight(right+4)
    setCircleData({top,right})
  }
  const downButton = ()=>{
    setTop(top+4)
    setCircleData({top,right})
  }
  const leftButton = ()=>{
    setRight(right-4)
    setCircleData({top,right})
  }

console.log(circleData);


  return (
    <Paper className={classes.root}>

  <Box className={classes.optionsContainer}>
    <Typography className={classes.heading} >
    <button onClick={topButton}>top</button>
    </Typography>
    <Typography
      className={classes.heading}>
        <button onClick={leftButton}>left</button>
      
    </Typography>
    <Typography className={classes.heading} >
    <button onClick={downButton}>down</button>
    </Typography>
    <Typography className={classes.heading} >
    <button onClick={rightButton}>right</button>
    </Typography>
  </Box>
  
    </Paper>
  );
};

export default BubbleTools;


