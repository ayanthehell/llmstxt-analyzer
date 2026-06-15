import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Edit3, Play, Sparkles, Loader2 } from 'lucide-react';

const LiveEditor = ({ rawText, onRescore, isScoring, url }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState(rawText);
  // Magic fix functionality removed based on the removal of the generate feature

  return (
    <div className="glass-panel rounded-lg mt-8 overflow-hidden shadow-md">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-slate-50/40 hover:bg-slate-50/60 transition-colors focus:outline-none backdrop-blur-md border-b border-slate-300"
      >
        <div className="flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-lg text-slate-900">Interactive Live Editor (Playground)</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
      </button>
      
      {isExpanded && (
        <div className="p-4 bg-white/50 backdrop-blur-sm flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Edit the markdown below to fix your gaps, then hit "Re-Score" to see your updated AI readiness. Once perfect, copy this to your server.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-96 glass-input text-slate-800 font-mono text-sm p-4 rounded transition-colors"
            spellCheck="false"
          />
            <div className="flex justify-end items-center mt-2">
              <div className="flex gap-4">
                <button
                  onClick={() => navigator.clipboard.writeText(text)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-300 bg-slate-100/50 rounded hover:bg-white/10 transition-colors"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => onRescore(text)}
                  disabled={isScoring}
                  className="flex items-center gap-2 px-6 py-2 glass-button-primary disabled:opacity-50 font-bold rounded transition-colors"
                >
                  {isScoring ? 'Scoring...' : <><Play className="w-4 h-4 fill-current" /> Re-Score</>}
                </button>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default LiveEditor;
