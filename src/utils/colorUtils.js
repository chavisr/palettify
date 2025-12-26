/**
 * Convert hex color to RGB object
 * @param {string} hex - Hex color code (e.g., '#ffffff')
 * @returns {Object|null} RGB object {r, g, b} or null if invalid
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calculate Euclidean distance between two RGB colors
 * @param {Object} c1 - First color {r, g, b}
 * @param {Object} c2 - Second color {r, g, b}
 * @returns {number} Distance value
 */
export const colorDistance = (c1, c2) => {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
};

/**
 * Find the nearest color from palette to a given pixel
 * @param {Array} pixel - RGB pixel array [r, g, b]
 * @param {Array} palette - Array of hex color strings
 * @returns {Object} RGB object of nearest color
 */
export const findNearestColor = (pixel, palette) => {
  const rgb = { r: pixel[0], g: pixel[1], b: pixel[2] };
  let nearest = palette[0];
  let minDist = Infinity;

  palette.forEach(hex => {
    const paletteRgb = hexToRgb(hex);
    const dist = colorDistance(rgb, paletteRgb);
    if (dist < minDist) {
      minDist = dist;
      nearest = hex;
    }
  });

  return hexToRgb(nearest);
};
