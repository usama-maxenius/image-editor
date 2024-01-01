export interface CanvasContextProps {
  canvas: fabric.Canvas | null
  updateCanvasContext: (canvas: fabric.Canvas | null) => void
  getExistingObject: (type: string) => fabric.Object | undefined
}