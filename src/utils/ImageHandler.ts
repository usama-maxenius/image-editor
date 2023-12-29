import { fabric } from 'fabric';

export const createImage = (canvas: fabric.Canvas | null, imageUrl: string, options: fabric.IImageOptions): Promise<fabric.Image | undefined> => {
  return new Promise((resolve) => {
    if (!canvas) {
      resolve(undefined);
      return;
    }

    fabric.Image.fromURL(imageUrl, (img) => {
      const imgWidth = img.width || 0
      const defaultOptions: fabric.IImageOptions = {
        left: canvas.getWidth() / 2 - imgWidth / 2,
        top: canvas.getHeight() / 2
      };

      img.set({ ...defaultOptions, ...options });
      img.applyFilters();
      canvas.add(img);
      canvas.renderAll();

      resolve(img);
    }, {
      crossOrigin: 'anonymous'
    });
  });
};



export const updateImageProperties = (canvas: fabric.Canvas | null, imageObject: fabric.Image, options: fabric.IImageOptions) => {
  if (!canvas) return

  if (imageObject && imageObject.isType('image')) {
    // Check if the object is an image
    imageObject.set({
      ...options
    })
    imageObject.applyFilters();
    return canvas.renderAll();
  }
};


// const updateImageFilters = (props: { filter: fabric.IBaseFilter, type: string }) => {

//   const { filter, type } = props
//   const canvas = canvasRef.current;

//   if (!canvas) {
//     return;
//   }
//   const imageObject: fabric.Object | undefined | any = getExistingObject(type)

//   if (!imageObject) return

//   const filterObj = availableFilters.find((f) => f.filter === filter);
//   // imageObject.selectable = false,
//   imageObject.filters = [filter];
//   imageObject.visible = true,
//     imageObject.applyFilters();

//   canvas.renderAll();
//   if (filterObj) setSelectedFilter(filterObj.name);
// };