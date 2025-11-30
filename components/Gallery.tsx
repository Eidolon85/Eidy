import React from 'react';
import { GenerationHistoryItem } from '../types';
import { Download } from 'lucide-react';

interface GalleryProps {
  history: GenerationHistoryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 z-40 transition-transform duration-300">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">历史记录</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {history.slice().reverse().map((item) => (
            <div key={item.id} className="relative flex-shrink-0 group w-24 h-32 rounded-lg overflow-hidden border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-all">
              <img src={item.resultUrl} alt="Result" className="w-full h-full object-cover" />
              <a 
                href={item.resultUrl} 
                download={`banana-fit-${item.id}.png`}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="text-white w-6 h-6" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
