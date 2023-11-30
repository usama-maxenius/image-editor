import { useState } from "react";
import "./App.css"; // Import the CSS file
import ImageEditor from "./components/ImageEditor/fabricImageEditor";

function App() {
  const [showCanvas, setShowCanvas] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>('');


  const selectedHandler = (fileName: string) => {
    setShowCanvas(true);
    setFilePath('fileName')
    console.log("filename", fileName);
  };
  return (
    <div className="app-container">
      {/* <ImageEditor /> */}

      {!showCanvas ? (
        <div>
          <div onClick={() => selectedHandler("first")} className="boxes">
            1
          </div>
          <div onClick={() => selectedHandler("second")} className="boxes">
            2
          </div>
          <div onClick={() => selectedHandler("third")} className="boxes">
            3
          </div>
        </div>
      ) : (
        <ImageEditor selectedCard={filePath} />
      )}
    </div>
  );
}

export default App;
