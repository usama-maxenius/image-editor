import { useOutletContext } from "react-router-dom";
import { useTitle } from "../../../context/TitleContext";

function Title() {
  const [tools] = useOutletContext() as any[];

  const { setTitle } = useTitle();

  const handleParagraphClick = (content: string) => {
    setTitle(content);
  };

  return (
    <>
      {!tools ? (
        <>
          <h3>Select Title</h3>
          <p
            onClick={() =>
              handleParagraphClick(
                "SEN. SCOTT TO SPEND $6M ON TV ADS IN IOWA, NH: 2024 GOP PRIMARY"
              )
            }
          >
            SEN. SCOTT TO SPEND $6M ON TV ADS IN IOWA, NH: 2024 GOP PRIMARY
          </p>
          <p
            onClick={() =>
              handleParagraphClick("ADIPIS ELIT, SED DO EIUSMOD TEMPOR")
            }
          >
            ADIPIS ELIT, SED DO EIUSMOD TEMPOR
          </p>
          <p onClick={() => handleParagraphClick("LOREM IPSUM DOLOR SIT AMET")}>
            LOREM IPSUM DOLOR SIT AMET,
          </p>{" "}
          <p
            onClick={() => handleParagraphClick("LOREM IPSUM  EIUSMOD TEMPOR")}
          >
            LOREM IPSUM EIUSMOD TEMPOR
          </p>
        </>
      ) : (
        <div>Title Tools</div>
      )}
    </>
  );
}

export default Title;
