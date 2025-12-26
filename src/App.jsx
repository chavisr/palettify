import React, { useState, useRef } from 'react';
import { PRESET_PALETTES } from './constants/palettes';
import { loadImageFromFile, convertImageToPalette, downloadImage } from './utils/imageProcessing';
import PaletteSelector from './components/PaletteSelector';
import PaletteGrid from './components/PaletteGrid';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';

export default function PaletteConverter() {
  const [selectedPreset, setSelectedPreset] = useState('gruvbox');
  const [palette, setPalette] = useState(PRESET_PALETTES['gruvbox'].colors);
  const [customMode, setCustomMode] = useState(false);
  const [image, setImage] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef(null);

  const handlePresetChange = (presetKey) => {
    setSelectedPreset(presetKey);
    setPalette(PRESET_PALETTES[presetKey].colors);
    setCustomMode(false);
    setConvertedImage(null);
  };

  const handleAddColor = (color) => {
    setPalette([...palette, color]);
    setCustomMode(true);
  };

  const handleRemoveColor = (color) => {
    if (palette.length > 1) {
      setPalette(palette.filter(c => c !== color));
      setCustomMode(true);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const img = await loadImageFromFile(file);
        setImage(img);
        setConvertedImage(null);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    }
  };

  const handleConvert = async () => {
    if (!image) return;

    setProcessing(true);
    try {
      const dataUrl = await convertImageToPalette(image, canvasRef.current, palette);
      setConvertedImage(dataUrl);
    } catch (error) {
      console.error('Error converting image:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (convertedImage) {
      downloadImage(convertedImage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Image Palette Converter</h1>
        <p className="text-gray-600 mb-8">Convert any image to use only your custom color palette</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <PaletteSelector
              selectedPreset={selectedPreset}
              customMode={customMode}
              onPresetChange={handlePresetChange}
            />

            <PaletteGrid
              palette={palette}
              onAddColor={handleAddColor}
              onRemoveColor={handleRemoveColor}
            />

            <ImageUploader
              image={image}
              processing={processing}
              onImageUpload={handleImageUpload}
              onConvert={handleConvert}
            />
          </div>

          {/* Right Panel - Images */}
          <ImageDisplay
            image={image}
            convertedImage={convertedImage}
            onDownload={handleDownload}
          />
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
