import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Edit3, Play, Sparkles, Loader2 } from 'lucide-react';

const LiveEditor = ({ rawText, onRescore, isScoring, url }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState(rawText);
  const [isGenerating, setIsGenerating] = useState(false);

  // Update text if a new URL is fetched
  useEffect(() => {
    setText(rawText);
  }, [rawText]);

  const handleMagicFix = async () => {
    if (!text) return;
    setIsGenerating(true);
    try {
      const response = await axios.post('/api/generate-llmstxt/fix', {
        rawText: text,
        url: url
      });
      
      const mdContent = response.data.improvedText || text;
      
      setText(mdContent);
      onRescore(mdContent); // Automatically rescore with the new text
    } catch (err) {
      console.error('Failed to auto-generate fix', err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert('Failed to automatically fix the file. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel rounded-lg mt-8 overflow-hidden shadow-md">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white/40 hover:bg-white/60 transition-colors focus:outline-none backdrop-blur-md border-b border-white/50"
      >
        <div className="flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-lg text-gray-800">Interactive Live Editor (Playground)</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
      </button>
      
      {isExpanded && (
        <div className="p-4 bg-white/50 backdrop-blur-sm flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Edit the markdown below to fix your gaps, then hit "Re-Score" to see your updated AI readiness. Once perfect, copy this to your server.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-96 glass-input text-gray-800 font-mono text-sm p-4 rounded transition-colors"
            spellCheck="false"
          />
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={handleMagicFix}
                disabled={isGenerating || isScoring}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded shadow-sm hover:shadow transition-all disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? 'Upgrading Score...' : 'Magic Fix with AI'}
              </button>
              
              <div className="flex gap-4">
                <button
                  onClick={() => navigator.clipboard.writeText(text)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 border border-gray-300 bg-white/50 rounded hover:border-blue-400 transition-colors"
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
