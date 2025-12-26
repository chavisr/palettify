import { findNearestColor } from './colorUtils';

/**
 * Convert an image to use only colors from a given palette
 * @param {HTMLImageElement} image - Source image element
 * @param {HTMLCanvasElement} canvas - Canvas element for processing
 * @param {Array} palette - Array of hex color strings
 * @returns {Promise<string>} Data URL of converted image
 */
export const convertImageToPalette = (image, canvas, palette) => {
  return new Promise((resolve) => {
    // Use setTimeout to allow UI updates before blocking
    setTimeout(() => {
      const ctx = canvas.getContext('2d');

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Process each pixel
      for (let i = 0; i < data.length; i += 4) {
        const pixel = [data[i], data[i + 1], data[i + 2]];
        const nearest = findNearestColor(pixel, palette);
        data[i] = nearest.r;
        data[i + 1] = nearest.g;
        data[i + 2] = nearest.b;
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    }, 100);
  });
};

/**
 * Load an image file and convert to Image element
 * @param {File} file - Image file from file input
 * @returns {Promise<HTMLImageElement>} Loaded image element
 */
export const loadImageFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Download a data URL as a PNG file
 * @param {string} dataUrl - Image data URL
 * @param {string} filename - Name for downloaded file
 */
export const downloadImage = (dataUrl, filename = 'converted-image.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};
