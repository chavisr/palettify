import React from 'react';
import { PRESET_PALETTES } from '../constants/palettes';

export default function PaletteSelector({ selectedPreset, customMode, onPresetChange }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Select Palette</h2>

      <select
        value={customMode ? 'custom' : selectedPreset}
        onChange={(e) => e.target.value !== 'custom' && onPresetChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {Object.entries(PRESET_PALETTES).map(([key, preset]) => (
          <option key={key} value={key}>{preset.name}</option>
        ))}
        {customMode && <option value="custom">Custom (Modified)</option>}
      </select>
    </div>
  );
}
