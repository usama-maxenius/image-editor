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
    filterToggle: boolean
  };
}
interface FabricContextProps {
  title: ITitle;
  background: IBackground;
  setTitle: Dispatch<SetStateAction<ITitle>>;
  setBackground: Dispatch<SetStateAction<IBackground>>;
  circleImage: string;
  setCircleImage: Dispatch<SetStateAction<string>>;
}

const FabricContext = createContext<FabricContextProps | undefined>(undefined);

interface TitleProviderProps {
  children: ReactNode;
}

export const TitleProvider: React.FC<TitleProviderProps> = ({ children }) => {
  const [circleImage, setCircleImage] = useState<string>("");
  const [title, setTitle] = useState<ITitle>({
    title: "",
    tools: {
      color: "yellow",
      fontSize: "12",
      fontFamily: "",
    },
  });

  const [background, setBackground] = useState<IBackground>({
    background: "",
    tools: {
      brightness: "0.9",
      overlay: "0.9",
      contrast: "0.2",
      filter: "",
      filterToggle: false
    },
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
