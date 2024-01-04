export type activeTabs = 'background' | 'title' | 'bubble' | 'element' | 'writePost'

export interface CanvasContextProps {
  canvas: fabric.Canvas | null
  activeTab: activeTabs
  updateActiveTab: (tab: activeTabs) => void
  updateCanvasContext: (canvas: fabric.Canvas | null) => void
  getExistingObject: (type: string) => fabric.Object | undefined
}