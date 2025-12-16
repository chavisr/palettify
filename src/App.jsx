import React, { useState, useRef } from 'react';
import { Upload, Plus, X, Download } from 'lucide-react';

const PRESET_PALETTES = {
  'gruvbox': {
    name: 'Gruvbox',
    colors: ['#282828', '#cc241d', '#98971a', '#d79921', '#458588', '#b16286', '#689d6a', '#a89984', '#928374', '#fb4934', '#b8bb26', '#fabd2f', '#83a598', '#d3869b', '#8ec07c', '#ebdbb2']
  },
  'gruvbox-material': {
    name: 'Gruvbox Material',
    colors: ['#282828', '#3c3836', '#504945', '#665c54', '#7c6f64', '#928374', '#a89984', '#d4be98', '#ddc7a1', '#d8a657', '#e78a4e', '#ea6962', '#a9b665', '#89b482', '#7daea3', '#d3869b']
  },
  'nord': {
    name: 'Nord',
    colors: ['#2e3440', '#3b4252', '#434c5e', '#4c566a', '#d8dee9', '#e5e9f0', '#eceff4', '#8fbcbb', '#88c0d0', '#81a1c1', '#5e81ac', '#bf616a', '#d08770', '#ebcb8b', '#a3be8c', '#b48ead']
  },
  'dracula': {
    name: 'Dracula',
    colors: ['#282a36', '#44475a', '#f8f8f2', '#6272a4', '#8be9fd', '#50fa7b', '#ffb86c', '#ff79c6', '#bd93f9', '#ff5555', '#f1fa8c']
  },
  'catppuccin-mocha': {
    name: 'Catppuccin Mocha',
    colors: ['#1e1e2e', '#181825', '#313244', '#45475a', '#585b70', '#cdd6f4', '#f5e0dc', '#f2cdcd', '#f5c2e7', '#cba6f7', '#f38ba8', '#eba0ac', '#fab387', '#f9e2af', '#a6e3a1', '#94e2d5', '#89dceb', '#74c7ec', '#89b4fa', '#b4befe']
  },
  'tokyo-night': {
    name: 'Tokyo Night',
    colors: ['#1a1b26', '#24283b', '#414868', '#565f89', '#a9b1d6', '#c0caf5', '#7aa2f7', '#bb9af7', '#9ece6a', '#73daca', '#b4f9f8', '#2ac3de', '#7dcfff', '#f7768e', '#ff9e64', '#e0af68']
  },
  'solarized': {
    name: 'Solarized',
    colors: ['#002b36', '#073642', '#586e75', '#657b83', '#839496', '#93a1a1', '#eee8d5', '#fdf6e3', '#b58900', '#cb4b16', '#dc322f', '#d33682', '#6c71c4', '#268bd2', '#2aa198', '#859900']
  },
  'one-dark': {
    name: 'One Dark',
    colors: ['#282c34', '#353b45', '#3e4451', '#545862', '#565c64', '#abb2bf', '#b6bdca', '#c8ccd4', '#e06c75', '#d19a66', '#e5c07b', '#98c379', '#56b6c2', '#61afef', '#c678dd']
  },
  'monokai': {
    name: 'Monokai',
    colors: ['#272822', '#383830', '#49483e', '#75715e', '#a59f85', '#f8f8f2', '#f92672', '#fd971f', '#f4bf75', '#a6e22e', '#66d9ef', '#ae81ff']
  }
};

export default function PaletteConverter() {
  const [selectedPreset, setSelectedPreset] = useState('gruvbox');
  const [palette, setPalette] = useState(PRESET_PALETTES['gruvbox'].colors);
  const [customMode, setCustomMode] = useState(false);
  const [newColor, setNewColor] = useState('#000000');
  const [image, setImage] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handlePresetChange = (presetKey) => {
    setSelectedPreset(presetKey);
    setPalette(PRESET_PALETTES[presetKey].colors);
    setCustomMode(false);
    setConvertedImage(null);
  };

  const addColor = () => {
    if (!palette.includes(newColor)) {
      setPalette([...palette, newColor]);
      setCustomMode(true);
    }
  };

  const removeColor = (color) => {
    if (palette.length > 1) {
      setPalette(palette.filter(c => c !== color));
      setCustomMode(true);
    }
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const colorDistance = (c1, c2) => {
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
  };

  const findNearestColor = (pixel) => {
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setConvertedImage(null);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImage = () => {
    if (!image) return;

    setProcessing(true);
    
    // Use setTimeout to allow the UI to update and show the loading state
    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const pixel = [data[i], data[i + 1], data[i + 2]];
        const nearest = findNearestColor(pixel);
        data[i] = nearest.r;
        data[i + 1] = nearest.g;
        data[i + 2] = nearest.b;
      }

      ctx.putImageData(imageData, 0, 0);
      setConvertedImage(canvas.toDataURL());
      setProcessing(false);
    }, 100);
  };

  const downloadImage = () => {
    if (!convertedImage) return;
    const link = document.createElement('a');
    link.download = 'converted-image.png';
    link.href = convertedImage;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Image Palette Converter</h1>
        <p className="text-gray-600 mb-8">Convert any image to use only your custom color palette</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Preset Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Select Palette</h2>
              
              <select
                value={customMode ? 'custom' : selectedPreset}
                onChange={(e) => e.target.value !== 'custom' && handlePresetChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(PRESET_PALETTES).map(([key, preset]) => (
                  <option key={key} value={key}>{preset.name}</option>
                ))}
                {customMode && <option value="custom">Custom (Modified)</option>}
              </select>
            </div>

            {/* Palette Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="#000000"
                />
                <button
                  onClick={addColor}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                >
                  <Plus size={20} /> Add
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3 max-h-64 overflow-y-auto p-1">
                {palette.map((color, idx) => (
                  <div key={idx} className="relative group">
                    <div
                      className="w-full rounded border-2 border-gray-300 cursor-pointer"
                      style={{ 
                        backgroundColor: color,
                        height: '60px',
                        minHeight: '60px'
                      }}
                      title={color}
                    />
                    <button
                      onClick={() => removeColor(color)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <p className="text-xs text-center mt-1 text-gray-600 truncate" style={{ fontSize: '10px' }}>{color}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-500"
              >
                <Upload size={24} />
                <span>Click to upload image</span>
              </button>

              {image && (
                <div className="mt-4">
                  <button
                    onClick={convertImage}
                    disabled={processing}
                    className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 font-semibold transition-all relative overflow-hidden"
                  >
                    {processing && (
                      <span className="absolute inset-0 bg-green-600">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></span>
                      </span>
                    )}
                    <span className="relative flex items-center justify-center gap-2">
                      {processing && (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {processing ? 'Processing...' : 'Convert Image'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Images */}
          <div className="space-y-6">
            {image && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Original Image</h2>
                <img src={image.src} alt="Original" className="w-full rounded border" />
              </div>
            )}

            {convertedImage && (
              <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Converted Image</h2>
                  <button
                    onClick={downloadImage}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Download size={20} /> Download
                  </button>
                </div>
                <img src={convertedImage} alt="Converted" className="w-full rounded border" />
              </div>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
