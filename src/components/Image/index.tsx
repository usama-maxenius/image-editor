// @ts-nocheck

import { ImageList, ImageListItem } from '@mui/material'
import { Diptych } from '../../types'

interface Props {
  images: { name: string, url: string }[]
  clickHandler: (url: string) => void
  children?: React.ReactNode
}
const ImageViewer = ({ images, clickHandler, children }: Props) => {
  return (
    <ImageList sx={{ width: '100%', height: 200 }} cols={2} rowHeight={160}>
      {children}
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