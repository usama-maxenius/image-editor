// // @ts-nocheck
import LandingPage from "./pages/landing page/landingPage";
import Templates from "./pages/templates/templates";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./components/theme/theme";
import Canvas from "./components/Canvas";
import { useState } from "react";
import { styled } from "@mui/styles";

function App() {
  const [step, setStep] = useState(1)
  const [defaultTemplate, setDefaultTemplate] = useState('')


  const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#151433',
    color: 'white',
    width: '100%',
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        {step == 1 ? <LandingPage updateStep={setStep} /> : step == 2 ? <Templates
          updateStep={setStep}
          setDefaultTemplate={setDefaultTemplate} /> : step == 3 ? <StyledContainer>
            <Canvas template={defaultTemplate} />
          </StyledContainer> : ''}
      </ThemeProvider>
    </>
  );
}

export default App;
