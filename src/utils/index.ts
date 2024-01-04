
export const getExistingObject = (canvas: fabric.Canvas, type: string) => {
  return canvas?.getObjects()?.find((obj: any) => obj['customType'] === type)
}