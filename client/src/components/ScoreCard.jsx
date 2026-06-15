import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

const exampleMap = {
  'Completeness': 'Example:\n# Site Title\n> Brief site summary paragraph.\n\n## Section 1\n- [Docs](url)\n- [API](url)',
  'Structure Quality': 'Example:\n# Only One H1\n\n## H2 Section\n- [Link](url)\n\n## Another H2\n- [Link](url)',
  'Link Coverage': 'Example:\nEnsure links to: docs, api, about, pricing, and contact pages exist if applicable to your site.',
  'Description Richness': 'Example:\n- [API Reference](https://api.site.com): Comprehensive endpoint documentation, including schemas and examples.',
  'LLM Optimization': 'Example:\n[Optional full site context](https://example.com/llms-full.txt)\n\n(Ensure no broken markdown links)',
  'Best Practices': 'Example:\nAlways use absolute URLs (https://...) or valid root-relative paths (/docs).\nEnsure all links return a 200 OK status.'
};

const ScoreCard = ({ title, score, weight }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const getColor = (s) => {
    if (s <= 40) return 'bg-red-500';
    if (s <= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getTextColor = (s) => {
    if (s <= 40) return 'text-red-500';
    if (s <= 70) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const colorClass = getColor(animatedScore);
  const textColorClass = getTextColor(animatedScore);

  return (
    <div className="glass-panel p-5 rounded-lg flex flex-col justify-between group relative shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <div className="relative cursor-help">
            <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-white/90 backdrop-blur-md text-xs text-gray-800 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-pre-wrap border border-gray-200">
              <span className="font-bold text-blue-600 mb-1 block">Perfect Example:</span>
              {exampleMap[title]}
            </div>
          </div>
        </div>
        <span className={`font-mono font-bold ${textColorClass}`}>
          {Math.round(animatedScore)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
        <div
          className={`${colorClass} h-2 rounded-full transition-all duration-1000 ease-out shadow-sm`}
          style={{ width: `${animatedScore}%` }}
        ></div>
      </div>
      <div className="mt-2 text-xs text-gray-500 text-right">
        Weight: {weight}%
      </div>
    </div>
  );
};

export default ScoreCard;
