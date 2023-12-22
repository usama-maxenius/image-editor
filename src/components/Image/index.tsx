import { ImageList, ImageListItem } from '@mui/material'

interface Props {
  images: { name: string, url: string }[]
  clickHandler: (url: string) => void
}
const ImageViewer = ({ images, clickHandler }: Props) => {
  return (
    <ImageList sx={{ width: 200, height: 160 }} cols={2} rowHeight={160}>
      {images.map((img) => (
        <ImageListItem key={img.name}>
          <img
            onClick={() => clickHandler(img.url)}
            srcSet={`${img.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${img.url}?w=164&h=164&fit=crop&auto=format`}
            alt={img.name}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  )
}

export default ImageViewer