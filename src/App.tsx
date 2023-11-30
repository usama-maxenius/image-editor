import LandingPage from "./pages/landing page/landingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Templates from "./pages/templates/templates";
import ImageEditor from "./components/ImageEditor/fabricImageEditor";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/image-editor" element={<ImageEditor />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
