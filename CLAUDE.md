# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Palettify is a browser-based image converter that remaps image colors to predefined or custom color palettes. It's a React single-page application built with Vite that processes images entirely client-side using the Canvas API.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

### Core Components

The application is built as a single React component (`src/App.jsx`) that handles:

1. **Palette Management**: 9 preset color palettes (Gruvbox, Nord, Dracula, Tokyo Night, Solarized, Catppuccin Mocha, One Dark, Monokai, Gruvbox Material) stored in the `PRESET_PALETTES` object
2. **Image Processing**: Client-side pixel manipulation using Canvas API
3. **Color Matching**: Euclidean distance algorithm in RGB color space to find nearest palette color

### Image Conversion Flow

1. User uploads image → FileReader converts to data URL → Image object created
2. Image drawn to hidden canvas → `getImageData()` extracts pixel array
3. Each pixel converted using `findNearestColor()` which:
   - Calculates Euclidean distance in RGB space (`colorDistance()`)
   - Finds closest match from selected palette
   - Replaces pixel with matched color
4. Modified pixel data written back to canvas → exported as PNG

### State Management

All state managed via React useState hooks:
- `palette`: Current color palette (array of hex strings)
- `selectedPreset`: Active preset key
- `customMode`: Boolean flag when user modifies palette
- `image`: Original uploaded image object
- `convertedImage`: Data URL of processed image
- `processing`: Loading state during conversion

### Build Configuration

- **Base path**: `/palettify/` for GitHub Pages deployment (vite.config.js:7)
- **Vite plugins**: React with Fast Refresh enabled
- **Tailwind CSS**: Used for all styling via utility classes
- **ESLint**: Configured for React hooks and React Refresh

## Key Implementation Details

### Color Conversion Algorithm

The `findNearestColor()` function (App.jsx:92-107) implements a brute-force nearest neighbor search:
- Input: RGB pixel as `[r, g, b]` array
- Process: Calculates distance to every palette color
- Output: Returns RGB object of nearest color

Performance note: Conversion happens synchronously with a 100ms `setTimeout` to allow UI updates before blocking.

### Palette Modification

Users can add/remove colors from presets, which sets `customMode: true`. Custom palettes are lost on preset change - there's no persistence layer.

### Image Upload

File input is hidden (App.jsx:259-265), triggered by styled button. Only accepts `image/*` MIME types. No file size validation.

## Styling

Uses Tailwind CSS with custom animations defined inline:
- `@keyframes shimmer`: Shimmer effect for processing button
- `@keyframes fadeIn`: Fade-in for converted image display

Gradient background: `from-purple-50 to-blue-50`

## Dependencies

- **Runtime**: React 19, lucide-react (icons)
- **Build**: Vite 7, Tailwind CSS 3, PostCSS, Autoprefixer
- **Deployment**: gh-pages for GitHub Pages publishing
