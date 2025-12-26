import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

export default function ImageUploader({ image, processing, onImageUpload, onConvert }) {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      <h2 className="text-xl font-semibold mb-4">Upload Image</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
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
            onClick={onConvert}
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
  );
}
