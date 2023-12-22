// // @ts-nocheck
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
      {seedData?.templates?.map((template) => (
        <img key={template.url} onClick={() => {
          updateStep((prev) => prev + 1)
          const filePath = `../../constants/templates/${template.path}`
          setDefaultTemplate(filePath)
        }} style={{ width: 300, height: 400, objectFit: 'contain' }} src={template.url} />
      ))}
    </StyledContainer>
  );
}

export default EgBanner;
