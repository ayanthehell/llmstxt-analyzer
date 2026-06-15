import React from 'react';
import { AlertTriangle, AlertCircle, Info, Copy } from 'lucide-react';

const getSeverityIcon = (severity) => {
  switch (severity) {
    case 'Critical': return <AlertCircle className="w-5 h-5 text-red-400" />;
    case 'Warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    case 'Suggestion': return <Info className="w-5 h-5 text-blue-400" />;
    default: return <Info className="w-5 h-5 text-gray-400" />;
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'Critical': return 'text-red-400';
    case 'Warning': return 'text-yellow-400';
    case 'Suggestion': return 'text-blue-400';
    default: return 'text-gray-400';
  }
};

const GapTable = ({ gaps }) => {
  return (
    <div className="glass-panel rounded-xl overflow-hidden shadow-sm">
      <div className="divide-y divide-white/5">
        {gaps.map((gap, idx) => (
          <div key={idx} className="p-6 hover:bg-white/5 transition-colors">
            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">{getSeverityIcon(gap.severity)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-semibold ${getSeverityColor(gap.severity)}`}>
                    {gap.severity}
                  </span>
                  <span className="text-slate-600 text-sm">•</span>
                  <span className="text-slate-600 text-sm font-medium">{gap.dimension}</span>
                </div>
                <p className="text-slate-800 mb-2 font-medium">{gap.text}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-input rounded-lg p-3">
                  <p className="text-sm text-blue-300">
                    <span className="font-semibold text-blue-400">Fix:</span> {gap.recommendation}
                  </p>
                  {gap.snippet && (
                    <button
                      onClick={() => navigator.clipboard.writeText(gap.snippet)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/50 border border-slate-300 hover:bg-white/10 text-slate-700 text-xs font-medium rounded transition-colors shadow-sm"
                      title="Copy snippet"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GapTable;
