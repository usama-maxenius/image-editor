import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
  } from "react";

  
  interface IUrl {
    top: number,
    right:number
  }
  
  interface FabricContextProps {
    circleData: IUrl;
    setCircleData: Dispatch<SetStateAction<IUrl>>;

  }
  
  const FabricContext = createContext<FabricContextProps | undefined>(undefined);
  
  interface CircleProviderProps {
    children: ReactNode;
  }
  
  export const CircleProvider: React.FC<CircleProviderProps> = ({ children }) => {
    const [circleData, setCircleData] = useState<IUrl>({
        top: 120,
        right:10
    });
  
    
  
    return (
      <FabricContext.Provider value={{ circleData, setCircleData }}>
        {children}
      </FabricContext.Provider>
    );
  };
  
  export const useCircleData = () => {
    const context = useContext(FabricContext);
    if (!context) {
      throw new Error("useCircleData must be used within a CircleProvider");
    }
    return context;
  };
  