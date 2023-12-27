// @ts-nocheck
import LandingPage from "./pages/landing page/landingPage";
import Templates from "./pages/templates/templates";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./components/theme/theme";
import Canvas from "./components/Canvas";
import { useEffect, useState } from "react";
import { styled } from "@mui/styles";
import { loadTemplates, seedData } from "./constants";

const StyledContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  // height: '100vh',
  backgroundColor: '#151433',
  color: 'white',
  width: '100%',
});

function App() {
  const [step, setStep] = useState(1)
  const [defaultTemplate, setDefaultTemplate] = useState({
  })
  const [templates, setTemplates] = useState([])
  const [scrappedData, setScrappedData] = useState({
    image_urls: [],
    generated_titles: []
  })
  const [updatedSeedData, setUpdatedSeedData] = useState(seedData)

  useEffect(() => {
    loadTemplates().then((lisTemplates) => setTemplates(lisTemplates))
  }, [])

  useEffect(() => {
    setUpdatedSeedData({
      ...seedData,
      backgroundImages: scrappedData.image_urls.length > 0 ? scrappedData.image_urls?.map((scrapeImg) => scrapeImg) : seedData.backgroundImages,
      bubbles: scrappedData.image_urls.length > 0 ? scrappedData.image_urls?.map((scrapeImg) => scrapeImg) : seedData.bubbles,
      texts: scrappedData.generated_titles.length > 0 ? scrappedData.generated_titles?.map((scrapeTitles) => scrapeTitles.title) : seedData.texts
    })
  }, [scrappedData])

  return (
    <>
      <ThemeProvider theme={theme}>
        {step == 1 ? <LandingPage setScrappedData={setScrappedData} updateStep={setStep} /> :
          step == 2 && templates ?
            <Templates
              templates={templates}
              updateStep={setStep}
              setDefaultTemplate={setDefaultTemplate} /> :
            step == 3 ? <StyledContainer>
              <Canvas updatedSeedData={updatedSeedData} template={defaultTemplate} />
            </StyledContainer> : ''}
      </ThemeProvider>
    </>
  );
}

export default App;
