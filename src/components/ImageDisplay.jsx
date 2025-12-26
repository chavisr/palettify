import React from 'react';
import { Download } from 'lucide-react';

export default function ImageDisplay({ image, convertedImage, onDownload }) {
  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

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
              onClick={onDownload}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Download size={20} /> Download
            </button>
          </div>
          <img src={convertedImage} alt="Converted" className="w-full rounded border" />
        </div>
      )}
    </div>
  );
}
