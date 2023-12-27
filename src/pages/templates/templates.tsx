 // @ts-nocheck
import { styled } from "@mui/system";
import { seedData } from "../../constants";
import { Dispatch, SetStateAction } from "react";

interface Props {
  updateStep: Dispatch<SetStateAction<number>>;
  setDefaultTemplate: Dispatch<SetStateAction<string>>;
}
function EgBanner({ updateStep, setDefaultTemplate }: Props) {
  const StyledContainer = styled("div")({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: '1rem',
    justifyContent: "space-evenly",
    height: "100vh",
    backgroundColor: "#151433",
    color: "white",
    maxWidth: "100%",
  });

  return (
    <StyledContainer>
      {seedData.placeholders?.map((placeholder) => {
        return (
          <img key={placeholder.url} onClick={() => {
            updateStep((prev) => prev + 1)
            setDefaultTemplate(placeholder)
          }} style={{ width: 300, height: 400, objectFit: 'contain' }} src={placeholder.url} />
        )
      })}
    </StyledContainer>
  );
}

export default EgBanner;
