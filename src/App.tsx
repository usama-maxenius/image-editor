import LandingPage from "./pages/landing page/landingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Templates from "./pages/templates/templates";
import ImageEditor from "./components/ImageEditor/fabricImageEditor";
import Background from "./components/ImageEditor/component/background";
import Title from "./components/ImageEditor/component/title";
import Element from "./components/ImageEditor/component/element";
import WritePost from "./components/ImageEditor/component/write-post";
import Bubble from "./components/ImageEditor/component/add-bubble";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/image-editor" element={<ImageEditor />} >
            <Route path="background" element={<Background />} />
            <Route path="title" element={<Title />} />
            <Route path="element" element={<Element />} />
            <Route path="write-post" element={<WritePost />} />
            <Route path="bubble" element={<Bubble />} />



          </Route>
                
          

        </Routes>
      </Router>
    </>
  );
}

export default App;
