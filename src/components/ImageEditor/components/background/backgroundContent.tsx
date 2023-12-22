// @ts-nocheck

import { useOutletContext } from "react-router-dom";
import { useTitle } from "../../../../context/fabricContext";
import { useUrlData } from "../../../../context/url-context/urlState";
import React from "react";
import { Typography, Box, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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

function BackgroundContent() {
const { urlData } = useUrlData();
urlData.image_urls = [
    "https://res.cloudinary.com/dkh87tzrg/image/upload/v1665486789/hlfbvilioi8rlkrumq2g.jpg",
    "https://res.cloudinary.com/dkh87tzrg/image/upload/v1671791251/f86duowvpgzgrsz7rfou.jpg",
  ];

  const [tools] = useOutletContext() as any[];
  const { setBackground } = useTitle();

  const handleBackgroundChange = (newBackground: string) => {
    setBackground((prev) => ({ ...prev, background: newBackground }));
  };
  return (
    <>
      {!tools ? (
        <>
        <Box
      style={{
        color: "white",
        width: "200px",
        display: "inline-block",
        position: "relative",
        left: "7%",
        bottom: "1%",
        padding: "0px",
        height: "600px",
      }}
    >
      <Typography variant="h5">Articles Images</Typography>

      <Box {...styles.imageBox}>
        {urlData?.image_urls.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Article Image ${index + 1}`}
            style={styles.image}
            onClick={() => handleBackgroundChange(src)}
          />
        ))}
      </Box>

      <Typography variant="h5">AI Images</Typography>

      <Box {...styles.imageBox}>
        {urlData?.image_urls.map((item, index) => (
          <img
            key={index}
            src={item}
            alt={`AI Image ${index + 1}`}
            style={styles.image}
            onClick={() => handleBackgroundChange(item)}
          />
        ))}
      </Box>

      <Box {...styles.uploadBox}>
        <label style={styles.uploadLabel}>
          <Typography variant="h5" style={{ margin: "6px" }}>
            IMAGE UPLOAD
          </Typography>
          <form method="post" encType="multipart/form-data">
            <input
              onChange={(e) => {
                console.log("e.target.value", e.target.value);
                const fileInput = e.target;
                const files = fileInput.files;

                if (files?.length && files?.length > 0) {
                  const fileName = files[0].name;
                  handleBackgroundChange(`/images/sample/${fileName}`);
                }
              }}
              type="file"
              style={{ display: "none" }}
              accept=".jpg, .jpeg, .png"
            />
          </form>
          <IconButton color="primary" component="span">
            <CloudUploadIcon style={{ fontSize: "40px" }} />
          </IconButton>
        </label>
      </Box>
    </Box>
        </>
      ) : (
        <div> working</div>
      )}
    </>
  );
}

export default BackgroundContent;
