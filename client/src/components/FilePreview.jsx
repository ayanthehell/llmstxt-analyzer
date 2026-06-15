import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

const FilePreview = ({ rawText }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#1A1D24] rounded-lg border border-gray-800 mt-8 overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-[#15171C] hover:bg-[#1a1c22] transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-500" />
          <h3 className="font-semibold text-lg">Parsed llms.txt File Preview</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      {isExpanded && (
        <div className="p-4 bg-[#0D0F12] overflow-x-auto">
          <pre className="text-sm font-mono text-gray-300">
            <code>{rawText}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
