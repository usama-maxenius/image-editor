import LandingPage from "./pages/landing page/landingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Templates from "./pages/templates/templates";
import ImageEditor from "./components/ImageEditor/fabricImageEditor";
import Background from "./components/ImageEditor/components/background/index";
import Title from "./components/ImageEditor/components/title/index";
import Element from "./components/ImageEditor/components/elements/index";
import WritePost from "./components/ImageEditor/components/writePost/index";
import Bubble from "./components/ImageEditor/components/bubble/index";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./components/theme/theme";
import Canvas from "./components/Canvas";
import firstTemplate from "./components/Templates/first.json"
import image from "./components/ImageEditor/br9.png"
import circleImage from "/images/sample/scott-circle-image.png"

function App() {
  const filePath="./components/Templates/first.json"
  return (
    <>
      <ThemeProvider theme={theme}>

<Canvas template={filePath} background="red" text="Hy"  image={circleImage} />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/image-editor" element={<ImageEditor />}>
            <Route path="background" element={<Background />} />
            <Route path="title" element={<Title />} />
            <Route path="element" element={<Element />} />
            <Route path="write-post" element={<WritePost />} />
            <Route path="bubble" element={<Bubble />} />
          </Route>
        </Routes>
      </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
