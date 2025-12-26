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

The codebase follows a modular architecture with clear separation of concerns:

```
src/
├── components/          # UI Components
│   ├── PaletteSelector.jsx    # Preset palette dropdown
│   ├── PaletteGrid.jsx        # Color grid with add/remove
│   ├── ImageUploader.jsx      # File upload and convert button
│   └── ImageDisplay.jsx       # Original & converted image display
├── utils/               # Pure functions
│   ├── colorUtils.js          # hexToRgb, colorDistance, findNearestColor
│   └── imageProcessing.js     # convertImageToPalette, loadImageFromFile
├── constants/
│   └── palettes.js            # PRESET_PALETTES configuration
├── App.jsx              # Main orchestrator component
└── main.jsx             # React entry point
```

### Core Functionality

1. **Palette Management**: 9 preset color palettes (Gruvbox, Nord, Dracula, Tokyo Night, Solarized, Catppuccin Mocha, One Dark, Monokai, Gruvbox Material) defined in `src/constants/palettes.js`
2. **Image Processing**: Client-side pixel manipulation using Canvas API (see `src/utils/imageProcessing.js`)
3. **Color Matching**: Euclidean distance algorithm in RGB color space (`src/utils/colorUtils.js:findNearestColor`)

### Image Conversion Flow

1. User uploads image → `loadImageFromFile()` (imageProcessing.js:38) converts file to Image element via FileReader
2. User clicks Convert → `convertImageToPalette()` (imageProcessing.js:13) processes image:
   - Image drawn to hidden canvas → `getImageData()` extracts pixel array
   - Each pixel converted using `findNearestColor()` (colorUtils.js:30)
   - Calculates Euclidean distance in RGB space via `colorDistance()` (colorUtils.js:18)
   - Replaces pixel with matched color from palette
   - Modified pixel data written back to canvas
3. Result exported as PNG data URL → displayed in ImageDisplay component
4. User downloads via `downloadImage()` (imageProcessing.js:61)

### State Management

All state lives in App.jsx and flows down to components via props:
- `palette`: Current color palette (array of hex strings)
- `selectedPreset`: Active preset key
- `customMode`: Boolean flag when user modifies palette
- `image`: Original uploaded image object
- `convertedImage`: Data URL of processed image
- `processing`: Loading state during conversion

Event handlers in App.jsx (`handlePresetChange`, `handleAddColor`, `handleRemoveColor`, `handleImageUpload`, `handleConvert`, `handleDownload`) coordinate state updates across components.

### Build Configuration

- **Base path**: `/palettify/` for GitHub Pages deployment (vite.config.js:7)
- **Vite plugins**: React with Fast Refresh enabled
- **Tailwind CSS**: Used for all styling via utility classes
- **ESLint**: Configured for React hooks and React Refresh

## Key Implementation Details

### Color Conversion Algorithm

The `findNearestColor()` function (colorUtils.js:30-47) implements a brute-force nearest neighbor search:
- Input: RGB pixel as `[r, g, b]` array, palette as array of hex strings
- Process: Calculates Euclidean distance to every palette color using `colorDistance()`
- Output: Returns RGB object of nearest color

Performance note: Conversion uses Promise with 100ms `setTimeout` to allow UI updates before blocking operations (imageProcessing.js:15).

### Component Architecture

- **Separation of Concerns**: UI components (components/), business logic (utils/), configuration (constants/)
- **Props Down, Events Up**: App.jsx manages all state, components receive props and emit events via callbacks
- **Pure Functions**: All utilities in `utils/` are pure functions with no side effects
- **Reusability**: Each component handles a single responsibility and can be tested/modified independently

### Palette Modification

Users can add/remove colors from presets via PaletteGrid, which triggers `customMode: true` in App.jsx. Custom palettes are lost on preset change - there's no persistence layer.

### Image Upload

File input is hidden in ImageUploader component, triggered by styled button. Only accepts `image/*` MIME types. No file size validation. Uses `loadImageFromFile()` Promise-based API for async loading.

## Styling

Uses Tailwind CSS exclusively with custom animations defined inline in respective components:
- `@keyframes shimmer`: Shimmer effect for processing button (ImageUploader.jsx)
- `@keyframes fadeIn`: Fade-in for converted image display (ImageDisplay.jsx)

Gradient background: `from-purple-50 to-blue-50` (App.jsx)

No CSS modules or separate stylesheets - all styling via Tailwind utilities and inline styles.

## Dependencies

- **Runtime**: React 19, lucide-react (icons)
- **Build**: Vite 7, Tailwind CSS 3, PostCSS, Autoprefixer
- **Deployment**: gh-pages for GitHub Pages publishing
