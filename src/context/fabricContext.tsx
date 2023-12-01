import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface FabricContextProps {
  title: string;
  background: string;
  setTitle: Dispatch<SetStateAction<string>>;
  setBackground: Dispatch<SetStateAction<string>>;
}

const FabricContext = createContext<FabricContextProps | undefined>(undefined);

interface TitleProviderProps {
  children: ReactNode;
}

export const TitleProvider: React.FC<TitleProviderProps> = ({ children }) => {
  const [title, setTitle] = useState<string>("");
  const [background, setBackground] = useState<string>("");

  return (
    <FabricContext.Provider
      value={{ title, background, setTitle, setBackground }}
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
