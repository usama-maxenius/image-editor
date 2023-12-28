export interface APIResponse {
  generated_titles: {
    length: number
    title: string
  }[]
  image_urls: string[]
  message: string
}

export type Diptych = "vertical" | "horizontal" | undefined

export interface Template {
  placeholderImage: string,
  overlayImage: string
  filePath: string
  opacity: number,
  backgroundImage: boolean,
  diptych: Diptych
}

export interface TemplateData {
  templates: Template[]
  backgroundImages: string[]
  bubbles: string[]
  texts: string[]
  borders: string[]
  logos: string[]
  elements: string[]

}