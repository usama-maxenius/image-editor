import React from "react";
import { Typography, Box, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const imageList = [
  "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2020_34/3405737/200819-putin-trump-mc-1257.JPG",
  "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2020_34/3405737/200819-putin-trump-mc-1257.JPG",
  "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2020_34/3405737/200819-putin-trump-mc-1257.JPG",
  "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2020_34/3405737/200819-putin-trump-mc-1257.JPG",
];

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

const BubbleContent = () => {
  return (
    <>
      <Typography variant="h5">Articles Images</Typography>

      <Box {...styles.imageBox}>
        {imageList.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Article Image ${index + 1}`}
            style={styles.image}
          />
        ))}
      </Box>

      <Typography variant="h5">AI Images</Typography>

      <Box {...styles.imageBox}>
        {[...Array(4)].map((_, index) => (
          <img
            key={index}
            src=""
            alt={`AI Image ${index + 1}`}
            style={styles.image}
          />
        ))}
      </Box>

      <Box {...styles.uploadBox}>
        <label style={styles.uploadLabel}>
          <Typography variant="h5" style={{ margin: "6px" }}>
            IMAGE UPLOAD
          </Typography>
          <input type="file" style={{ display: "none" }} />
          <IconButton color="primary" component="span">
            <CloudUploadIcon style={{ fontSize: "40px" }} />
          </IconButton>
        </label>
      </Box>
    </>
  );
};

export default BubbleContent;
