# 🎨 Palettify

Convert any image to use only colors from your custom palette or choose from beautiful preset color schemes!

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://chavisr.github.io/palettify)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[**✨ Try it now →**](https://chavisr.github.io/palettify)

## ✨ Features

- 🎨 **9 Preset Palettes** - Gruvbox, Nord, Dracula, Tokyo Night, and more
- 🖼️ **Easy Upload** - Drag & drop or click to upload images
- 🎯 **Smart Conversion** - Nearest color matching algorithm
- ✏️ **Custom Palettes** - Create your own color schemes
- 💾 **Instant Download** - Save converted images as PNG
- ⚡ **Fast Processing** - All processing happens in your browser
- 🌐 **Privacy First** - Your images never leave your device

## 🚀 Quick Start

1. Visit [palettify](https://chavisr.github.io/palettify)
2. Choose a color palette
3. Upload your image
4. Click "Convert Image"
5. Download your result!

## 🎨 Available Palettes

| Palette | Description |
|---------|-------------|
| Gruvbox | Original vibrant retro colors |
| Gruvbox Material | Softer material design variant |
| Nord | Cool arctic-inspired theme |
| Dracula | Dark purple with vibrant accents |
| Tokyo Night | Deep blue programmer theme |
| Solarized | Precision colors for reduced eyestrain |
| Catppuccin Mocha | Soft pastel colors |
| One Dark | Atom's iconic theme |
| Monokai | Classic Sublime Text colors |

## 🛠️ Local Development

```bash
# Clone the repo
git clone https://github.com/chavisr/palettify.git
cd palettify

# Install dependencies
npm install

# Run dev server
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

## 🔧 How It Works

Palettify uses a modular React architecture with client-side image processing:

1. **Image Upload** - Uses FileReader API to load images without server upload
2. **Color Matching** - Euclidean distance algorithm finds nearest palette color for each pixel
3. **Canvas Processing** - HTML5 Canvas API manipulates pixels directly in browser
4. **Export** - Converted image saved as PNG data URL for instant download

### Architecture

```
src/
├── components/          # Modular UI components
│   ├── PaletteSelector.jsx
│   ├── PaletteGrid.jsx
│   ├── ImageUploader.jsx
│   └── ImageDisplay.jsx
├── utils/               # Pure functions
│   ├── colorUtils.js
│   └── imageProcessing.js
└── constants/
    └── palettes.js      # Preset configurations
```

All state management happens in `App.jsx` with props flowing down to components.

## 🏗️ Built With

- **React 19** - UI framework
- **Vite 7** - Build tool with Fast Refresh
- **Tailwind CSS 3** - Utility-first styling
- **Canvas API** - Client-side image processing
- **Lucide React** - Icon library
- **GitHub Pages** - Hosting

## 📝 License

MIT License - feel free to use this project however you'd like!
