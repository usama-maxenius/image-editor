 // @ts-nocheck
import LandingPage from "./pages/landing page/landingPage";
import Templates from "./pages/templates/templates";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./components/theme/theme";
import Canvas from "./components/Canvas";
import { useEffect, useState } from "react";
import { styled } from "@mui/styles";
import { BaseURL, templateData } from "./constants";
import { APIResponse, Template, TemplateData } from "./types";

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

function App() {
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templateData.templates[0])

  const [scrappedData, setScrappedData] = useState<APIResponse>()
  const [updatedSeedData, setUpdatedSeedData] = useState<TemplateData>(templateData)

  useEffect(() => {
    if (!scrappedData) return;
  
    setUpdatedSeedData((prev) => ({
      ...prev,
      backgroundImages: scrappedData.image_urls.length > 0 ? scrappedData.image_urls?.map((scrapeImg) => BaseURL + scrapeImg) : prev.backgroundImages,
      bubbles: scrappedData.image_urls.length > 0 ? scrappedData.image_urls?.map((scrapeImg) => BaseURL + scrapeImg) : prev.bubbles,
      texts: scrappedData.generated_titles.length > 0 ? scrappedData.generated_titles?.map((scrapeTitles) => scrapeTitles.title.toUpperCase()) : prev.texts
    }));
  }, [scrappedData]);
  

  return (
    <>
      <ThemeProvider theme={theme}>
        {step == 1 ? <LandingPage setScrappedData={setScrappedData} updateStep={setStep} /> :
          step == 2 ?
            <Templates
              updateStep={setStep}
              setDefaultTemplate={setSelectedTemplate} /> :
            step == 3 ? <StyledContainer>
              <Canvas updatedSeedData={updatedSeedData} template={selectedTemplate} />
            </StyledContainer> : ''}
      </ThemeProvider>
    </>
  );
}

export default App;
