import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface ITitle {
  title: string;
  tools: {
    color: string;
    fontSize: string;
    fontFamily: string;
  };
}
interface IBackground {
  background: string;
  tools: {
    brightness: string;
    overlay: string;
    contrast: string;
    filter: string;
    filterToggle: boolean;
  };
}
interface SpecialTag {
  color: string;
}
interface FabricContextProps {
  title: ITitle;
  background: IBackground;
  setTitle: Dispatch<SetStateAction<ITitle>>;
  setBackground: Dispatch<SetStateAction<IBackground>>;
  circleImage: string;
  setCircleImage: Dispatch<SetStateAction<string>>;
  exportCanvas: boolean;
  setExportCanvas: Dispatch<SetStateAction<boolean>>;
  specialTag: SpecialTag;
  setSpecialTag: Dispatch<SetStateAction<SpecialTag>>;
  elementBorder: SpecialTag;
  setElementBorder: Dispatch<SetStateAction<SpecialTag>>;
  swipeLeft: SpecialTag;
  setSwipeLeft: Dispatch<SetStateAction<SpecialTag>>;
}

const FabricContext = createContext<FabricContextProps | undefined>(undefined);

interface TitleProviderProps {
  children: ReactNode;
}

export const TitleProvider: React.FC<TitleProviderProps> = ({ children }) => {
  const [circleImage, setCircleImage] = useState<string>("");
  const [exportCanvas, setExportCanvas] = useState<boolean>(false);

  //title
  const [title, setTitle] = useState<ITitle>({
    title: "",
    tools: {
      color: "yellow",
      fontSize: "12",
      fontFamily: "",
    },
  });
  //background
  const [background, setBackground] = useState<IBackground>({
    background: "",
    tools: {
      brightness: "0.5",
      overlay: "0",
      contrast: "0",
      filter: "",
      filterToggle: false,
    },
  });
  
  //element special tag
  const [specialTag, setSpecialTag] = useState<SpecialTag>({
    color: "#ff0000",
  });
  //element special tag
  const [elementBorder, setElementBorder] = useState<SpecialTag>({
    color: "#ff0000",
  });
  const [swipeLeft, setSwipeLeft] = useState<SpecialTag>({
    color: "#ff0000",
  });

  return (
    <FabricContext.Provider
      value={{
        title,
        background,
        setTitle,
        setBackground,
        circleImage,
        setCircleImage,
        setExportCanvas,
        exportCanvas,
        specialTag,
        setSpecialTag,
        setElementBorder,
        elementBorder,
        swipeLeft,
        setSwipeLeft,
      }}
    >
      {children}
    </FabricContext.Provider>
  );
};

export const useTitle = () => {
  const context = useContext(FabricContext);
  if (!context) {
    throw new Error("useTitle must be used within a TitleProvider");
  }
  return context;
};
