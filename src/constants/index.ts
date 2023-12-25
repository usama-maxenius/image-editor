// @ts-nocheck

import { fabric } from 'fabric';

export const BaseURL = "http://127.0.0.1:5000";

export const canvasDimension = {
  width: 1080,
  height: 1350
}
export const seedData = {
  templates: [
    {
      path: "default.json",
    },
    {
      path: "second.json",
    }
  ],
  placeholders: [
    {
      url: "/Placeholder_Images/Placeholder-1.jpg",
      overlayImage: '/images/sample/br11.png',
      path: "default.json",
    },
    {
      url: "/Placeholder_Images/Placeholder-2.jpg",
      overlayImage: '/images/overlay/op2.png',
      path: "second.json",
    },
    {
      url: "/Placeholder_Images/Placeholder-3.jpg",
      overlayImage: '/images/overlay/op3.png',
      path: "third.json",
    },
  ],
  backgroundImages: ["/images/sample/scott-bg-imag.jpg", 'https://res.cloudinary.com/dkh87tzrg/image/upload/v1671791251/f86duowvpgzgrsz7rfou.jpg', 'https://res.cloudinary.com/dkh87tzrg/image/upload/v1665486789/hlfbvilioi8rlkrumq2g.jpg'
  ],
  bubbles: ["/images/sample/scott-circle-image.png", 'https://res.cloudinary.com/dkh87tzrg/image/upload/v1671791251/f86duowvpgzgrsz7rfou.jpg',
  ],
  texts: [
    "Dog Attack Claims 6-Year-Old's Life, Injures Woman",
    "Tragic Dog Attack Leaves Child Dead, Woman Injured",
    "Fatal Dog Attack Claims 6-Year-Old's Life, Woman Injured",
    "Dog Attack Claims 6-Year-Old's Life, Woman Injured",
    "6-Year-Old Killed, Woman Injured in Fatal Dog Attack",
    "Fatal Dog Attack Leaves 6-Year-Old Dead, Woman Injured"
  ],
  borders: [
    {
      id: "1",
      path: "/images/sample/borders.png",
    },
  ],
  logos: [
    {
      id: "1",
      path: "/images/sample/special-tag.png",
    },
  ],
  elements: [
    {
      id: "1",
      path: "/images/sample/swipe-left.png",
    },
  ],
};

export const loadTemplates = async () => {
  try {
    const loadedTemplates = await Promise.all(
      seedData?.templates?.map(async (template) => {
        const filePath = `./templates/${template.path}`;

        try {
          const templateModule = await import(filePath);
          const templateJSON = templateModule.default; // Assuming the JSON is the default export

          const canvas = new fabric.Canvas('canvas', {
            width: 500,
            height: 500
          });

          return new Promise((resolve) => {
            canvas.loadFromJSON(templateJSON, () => {
              const img = canvas.toDataURL({ format: 'webp', quality: 0.5 });
              canvas.dispose();

              resolve({
                url: img,
                path: template.path,
              });
            });
          });
        } catch (jsonError) {
          throw new Error(`Failed to parse JSON: ${jsonError.message}`);
        }
      })
    );
    return loadedTemplates;
  } catch (error) {
    console.error(error.message);
    // Handle the error, e.g., display an error message to the user.
  }
};
