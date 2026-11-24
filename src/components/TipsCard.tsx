import React, { useState } from 'react';
import { Lightbulb, X, RefreshCw } from 'lucide-react';
import { motivationalQuotes } from '../data/initialData';

export const TipsCard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  if (!isVisible) return null;

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
  };

  return (
    <div className="mt-5 p-4 rounded-2xl bg-[#EDF5FF] border border-[#D0E2FF] flex items-start justify-between gap-3 relative transition-all">
      <div className="flex items-start gap-3">
        {/* Lightbulb Icon in circle */}
        <div className="w-8 h-8 rounded-full bg-blue-100/90 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-800">Tips Hari Ini</h4>
            <button
              onClick={handleNextQuote}
              title="Ganti tips"
              className="text-slate-400 hover:text-blue-600 transition p-0.5"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-1 italic font-medium leading-relaxed">
            "{motivationalQuotes[quoteIndex]}"
          </p>
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-blue-100/60 transition"
        aria-label="Tutup tips"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
