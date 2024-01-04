import { Box, Tab, Tabs, tabsClasses } from "@mui/material";
import WebFont from "webfontloader";
import { updateTextBox } from "../../../utils/TextHandler";
import { useCanvasContext } from "../../../context/CanvasContext";
import { fonts } from "../../../constants/fonts";
import { useEffect, useState } from "react";

interface Props {
  value: number
  handleChange: (event: React.SyntheticEvent, newValue: number) => void
}
const FontsTab = ({ value, handleChange }: Props) => {
  const { canvas } = useCanvasContext()
  const [loadedFonts, setLoadedFonts] = useState<string[]>([]);

  const loadWebFont = (font: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      WebFont.load({
        google: {
          families: [font],
        },
        active: () => {
          resolve();
        },
        inactive: () => {
          reject(new Error('Font loading failed'));
        },
      });
    });
  };

  useEffect(() => {
    const loadAllFonts = async () => {
      for (const font of fonts) {
        try {
          await loadWebFont(font);
          setLoadedFonts((prevFonts) => [...prevFonts, font]);
        } catch (error) {
          console.error(`Font "${font}" loading failed:`, error);
        }
      }
    };

    loadAllFonts();
  }, []);

  const handleTabClick = (font: string) => {
    if (loadedFonts.includes(font)) updateTextBox(canvas, { fontFamily: font });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: { xs: 320, sm: 540 },
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {fonts?.map(
          (font) => (
            <Tab key={font} onClick={() => handleTabClick(font)}
              sx={{ fontFamily: loadedFonts.includes(font) ? font : 'initial' }}
              label={font} />
          )
        )}
      </Tabs>
    </Box>
  )
}

export default FontsTab