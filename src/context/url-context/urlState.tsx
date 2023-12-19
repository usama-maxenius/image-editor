import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
  } from "react";
  
  // Replace with the correct IBackground interface
  interface IBackground {
    // Define the properties of IBackground
  }
  
  interface IUrl {
    data: string;
  }
  
  interface FabricContextProps {
    urlData: IUrl;
    setUrlData: Dispatch<SetStateAction<IUrl>>;
    background: IBackground; // Replace with the correct IBackground interface
    setBackground: Dispatch<SetStateAction<IBackground>>;
  }
  
  const FabricContext = createContext<FabricContextProps | undefined>(undefined);
  
  interface UrlProviderProps {
    children: ReactNode;
  }
  
  export const UrlProvider: React.FC<UrlProviderProps> = ({ children }) => {
    const [urlData, setUrlData] = useState<IUrl>({
      data: "ok",
    });
  
    // Replace with the correct IBackground interface
    const [background, setBackground] = useState<IBackground>({
      // Initialize with default values
    });
  
    return (
      <FabricContext.Provider value={{ urlData, setUrlData, background, setBackground }}>
        {children}
      </FabricContext.Provider>
    );
  };
  
  export const useUrlData = () => {
    const context = useContext(FabricContext);
    if (!context) {
      throw new Error("useUrlData must be used within a TitleProvider");
    }
    return context;
  };
  