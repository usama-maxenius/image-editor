import WebFont from "webfontloader";

export const defaultFont = 'Fira Sans';

export const loadWebFont = (font: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    WebFont.load({
      google: {
        families: [font],
      },
      active: () => {
        resolve();
      },
      inactive: () => {
        reject(new Error('Font loading failed'));
      },
    });
  });
};