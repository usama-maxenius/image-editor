// @ts-nocheck

import { ImageList, ImageListItem } from '@mui/material'

interface Props {
  images: { name: string, url: string }[]
  clickHandler: (url: string) => void
}
const ImageViewer = ({ images, clickHandler }: Props) => {
  return (
    <ImageList sx={{ width: '100%', height: 200 }} cols={2} rowHeight={160}>
      {images.map((img) => (
        <ImageListItem key={img}>
          <img
            style={{
              objectFit: 'contain',
              cursor: 'pointer'
            }}
            onClick={() => clickHandler(img)}
            srcSet={`${img}`}
            src={`${img}`}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  )
}

export default ImageViewer