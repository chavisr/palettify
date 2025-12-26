import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function PaletteGrid({ palette, onAddColor, onRemoveColor }) {
  const [newColor, setNewColor] = useState('#000000');

  const handleAddColor = () => {
    if (!palette.includes(newColor)) {
      onAddColor(newColor);
      setNewColor('#000000');
    }
  };

  return (
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
          onClick={handleAddColor}
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
              onClick={() => onRemoveColor(color)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
            <p className="text-xs text-center mt-1 text-gray-600 truncate" style={{ fontSize: '10px' }}>{color}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
