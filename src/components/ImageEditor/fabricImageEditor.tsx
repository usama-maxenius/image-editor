import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import yourJsonFile from "../Templates/first.json"; // Update the path
import { Link, Outlet } from "react-router-dom";
import { useTitle } from "../../context/TitleContext";
import LandscapeIcon from '@mui/icons-material/Landscape';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PersonIcon from '@mui/icons-material/Person';
import WavesIcon from '@mui/icons-material/Waves';
import EditNoteIcon from '@mui/icons-material/EditNote';


const ImageEditor = () => {
  const { title } = useTitle();
  console.log("title", title);

  const canvasRef: React.MutableRefObject<fabric.Canvas | null> =
    useRef<fabric.Canvas | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hideLoading = () => {
      setLoading(false);
    };

    if (!canvasRef.current) return;

    //@ts-ignore
    const canvas: fabric.Canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 500,
    });

    // Set canvas background color to red
    canvas.setBackgroundColor("red", () => {
      canvas.renderAll();
    });

    const loadJsonFile = async (json: any) => {
      try {
        canvas.loadFromJSON(json, (o: any, object: any) => {
          hideLoading();

          const imageObject = canvas
            .getObjects()
            .find((object) => object.type === "image");
          if (imageObject) {
            //@ts-ignore
            imageObject.setSrc(imageObject.src);
          }
          if (title.trim() !== "") {
            // Find objects with "cs-type": "title" and update them
            canvas.getObjects().forEach((object) => {
              //@ts-ignore
              if (object["cs-type"] === "title") {
                //@ts-ignore
                object.set({ text: title });
              }
            });

            // Render canvas after updating objects
            canvas.renderAll();
          }

          canvas.renderAll();
        });
      } catch (error) {
        console.error("Error loading JSON file:", error);
        hideLoading();
      }
    };

    loadJsonFile(yourJsonFile);
  }, [title]);

  const handleButtonClick = (message: string) => {
    // Handle button click based on the message
    console.log(message);
  };

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#151433",
        }}
      >
        {loading && <div>Loading...</div>}
        <div >
          <div
            style={{
              width: "500px",
              height: "500px",
              border: "3px solid #9475bf",
              borderRadius: "3px",
            }}
          >
            <canvas
              ref={canvasRef as React.LegacyRef<HTMLCanvasElement>}
            ></canvas>
          </div>

          
        <div style={{ display: "flex", marginTop: "16px" , justifyContent : "space-between"}}>
              
          <Link to="/image-editor/background">
            {" "}
           
            <button onClick={() => handleButtonClick("It's Background")} style={{backgroundColor:'transparent',border: 'none'}}>
            <LandscapeIcon style={{color:'white',fontSize:'30px'}}/>
           <p style={{color:'white',margin:'0px',fontWeight:'600'}}> BACKGROUND </p> 
            </button>
          </Link>
          <Link to="/image-editor/title">
            {" "}
            <button onClick={() => handleButtonClick("It's Title")} style={{backgroundColor:'transparent',border: 'none'}}>
            <TextFieldsIcon style={{color:'white',fontSize:'30px'}}/>
            <p style={{color:'white',margin:'0px',fontWeight:'600'}}> TITLE </p>
            </button>
          </Link>
          <Link to="/image-editor/bubble ">
            {" "}
            <button onClick={() => handleButtonClick("Add Bubble")} style={{backgroundColor:'transparent',border: 'none'}}>
            <PersonIcon style={{color:'white',fontSize:'30px'}}/>
            <p style={{color:'white',margin:'0px',fontWeight:'600'}}> ADD BUBBLE </p>
            </button>
          </Link>
          <Link to="/image-editor/element">
            {" "}
            <button onClick={() => handleButtonClick("Add Bubble")} style={{backgroundColor:'transparent',border: 'none'}}>
            <WavesIcon style={{color:'white',fontSize:'30px'}}/>
            <p style={{color:'white',margin:'0px',fontWeight:'600'}}> Elements </p>
            </button>
          </Link>
          <Link to="/image-editor/write-post">
            {" "}
            <button onClick={() => handleButtonClick("Add Bubble")} style={{backgroundColor:'transparent',border: 'none'}}>
            <EditNoteIcon style={{color:'white',fontSize:'30px'}}/>
            <p style={{color:'white',margin:'0px',fontWeight:'600'}}> write post </p>
            </button>
          </Link>
        </div>

        </div>


        <div 
            style={{ color: "white", width: "150px", display: 'inline-block',position: 'relative',left: '7%',height: '450px',border: '1px #272525 solid' }}
          >
            {" "}
            <Outlet />{" "}
          </div>

      </div>
    </>
  );
};

export default ImageEditor;
