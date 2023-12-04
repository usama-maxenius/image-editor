import { useOutletContext } from "react-router-dom";
import { useTitle } from "../../../../context/fabricContext";

function BackgroundContent() {
  const [tools] = useOutletContext() as any[];

  const imagePath = [
    {
      id: "1",
      path: "/images/sample/scott-circle-image.png",
    },
  ];

  const { setBackground } = useTitle();

  const handleBackgroundChange = (newBackground: string) => {
    setBackground((prev) => ({ ...prev, background: newBackground }));
  };
  return (
    <>
      {!tools ? (
        <>
          <h3>Articles Images</h3>
          {imagePath.map((item) => {
            return (
              <img
                key={item.id}
                width={100}
                height={100}
                src={item.path}
                alt=""
                onClick={() => handleBackgroundChange(item.path)}
              />
            );
          })}
        </>
      ) : (
        <div> working</div>
      )}
    </>
  );
}

export default BackgroundContent;
