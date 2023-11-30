import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface TitleContextProps {
  title: string;
  background: string;
  setTitle: Dispatch<SetStateAction<string>>;
  setBackground: Dispatch<SetStateAction<string>>;
}

const TitleContext = createContext<TitleContextProps | undefined>(undefined);

interface TitleProviderProps {
  children: ReactNode;
}

export const TitleProvider: React.FC<TitleProviderProps> = ({ children }) => {
  const [title, setTitle] = useState<string>("");
  const [background, setBackground] = useState<string>("");


  return (
    <TitleContext.Provider value={{ title, background, setTitle, setBackground }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitle = () => {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error("useTitle must be used within a TitleProvider");
  }
  return context;
};
