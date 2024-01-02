import { ReactNode, createContext, useContext, useState } from "react"
import { CanvasContextProps } from "../types/context"

const CanvasContext = createContext({} as CanvasContextProps)

export const CanvasContextProvider = ({ children }: { children: ReactNode }) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)


  const updateCanvasContext = (canvas: fabric.Canvas | null) => setCanvas(canvas)

  const getExistingObject = (type: string) => canvas?.getObjects()?.find((obj: any) => obj.customType === type)

  return (
    <CanvasContext.Provider
      value={{
        canvas,
        getExistingObject,
        updateCanvasContext
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}


// eslint-disable-next-line react-refresh/only-export-components
export const useCanvasContext = () => useContext(CanvasContext)