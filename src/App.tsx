import LandingPage from "./pages/landing page/landingPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EgBanner from "./pages/egBannar/egBanner";


function App() {
 
  return (
    <>
    
    <Router>
        <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/next" element={<EgBanner/>} />

        </Routes>
    </Router>
    
   
    </>
  ); 
}

export default App;
