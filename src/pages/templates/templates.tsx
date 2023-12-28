// // @ts-nocheck
import { styled } from "@mui/system";
import { templateData } from "../../constants";
import { Dispatch, SetStateAction } from "react";
import { Template } from "../../types";

interface Props {
  updateStep: Dispatch<SetStateAction<number>>;
  setDefaultTemplate: Dispatch<SetStateAction<Template>>;
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
      {templateData.templates?.map((template) => {
        return (
          <img key={template.placeholderImage} onClick={() => {
            updateStep((prev) => prev + 1)
            setDefaultTemplate(template)
          }} style={{ width: 300, height: 400, objectFit: 'contain' }} src={template.placeholderImage} />
        )
      })}
    </StyledContainer>
  );
}

export default EgBanner;
