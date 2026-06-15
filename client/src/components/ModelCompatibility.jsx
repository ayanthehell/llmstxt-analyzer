import React, { useState } from 'react';
import { Bot, Sparkles, Search, MessageSquareCode, Globe, LayoutTemplate } from 'lucide-react';

const ModelCompatibility = ({ rawText }) => {
  if (!rawText) return null;

  const calculateScores = (text) => {
    // 1. ChatGPT
    const headers = (text.match(/^#{1,6}\s+/gm) || []).length;
    const lists = (text.match(/^[-*]\s+/gm) || []).length;
    let chatgptScore = Math.min(100, (headers * 5) + (lists * 2) + 30);
    
    // 2. Claude
    const xmlTags = (text.match(/<[a-zA-Z0-9-]+>/g) || []).length;
    let claudeScore = Math.min(100, (xmlTags * 15) + 40);
    
    // 3. Perplexity AI
    const links = (text.match(/\[.*?\]\(.*?\)/g) || []).length;
    let perplexityScore = Math.min(100, (links * 10) + 20);

    // 4. Gemini
    const lengthScore = Math.min(100, (text.length / 10000) * 100); 
    let geminiScore = Math.min(100, Math.max(50, lengthScore));

    // 5. Google AI Overview
    const hasSummary = /summary:/i.test(text) || /#\s*summary/i.test(text);
    let overviewScore = hasSummary ? 100 : 60;

    // 6. Google AI
    const hasUrls = text.includes('urls:');
    let googleAiScore = hasUrls ? 95 : 65;

    return {
      chatgpt: {
        score: Math.round(chatgptScore),
        justification: `Detected ${headers} headers and ${lists} lists. ChatGPT excels at parsing rigid Markdown structure.`
      },
      claude: {
        score: Math.round(claudeScore),
        justification: `Found ${xmlTags} XML tags. Claude relies heavily on XML block formatting to map context accurately.`
      },
      perplexity: {
        score: Math.round(perplexityScore),
        justification: `Found ${links} absolute links. Perplexity heavily weights documents with dense internal and external citations.`
      },
      gemini: {
        score: Math.round(geminiScore),
        justification: `File length is ${(text.length / 1024).toFixed(1)} KB. Gemini's massive context window prefers deep, exhaustive content.`
      },
      googleAiOverview: {
        score: Math.round(overviewScore),
        justification: hasSummary ? "Clear summary detected. AI Overviews can easily generate search snippets." : "Missing explicit summary section. AI Overviews struggle to generate quick snippets without it."
      },
      googleAi: {
        score: Math.round(googleAiScore),
        justification: hasUrls ? "Structured 'urls:' array found. Google AI uses this to ground answers in reality." : "Missing standard 'urls' list. Google AI cannot easily verify source links without it."
      }
    };
  };

  const scores = calculateScores(rawText);

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const platforms = [
    {
      id: 'googleAiOverview',
      name: 'Google AI Overview',
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      ...scores.googleAiOverview
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      icon: <MessageSquareCode className="w-5 h-5 text-emerald-500" />,
      ...scores.chatgpt
    },
    {
      id: 'claude',
      name: 'Claude',
      icon: <Sparkles className="w-5 h-5 text-orange-500" />,
      ...scores.claude
    },
    {
      id: 'perplexity',
      name: 'Perplexity AI',
      icon: <Search className="w-5 h-5 text-cyan-500" />,
      ...scores.perplexity
    },
    {
      id: 'gemini',
      name: 'Gemini',
      icon: <Bot className="w-5 h-5 text-blue-600" />,
      ...scores.gemini
    },
    {
      id: 'googleAi',
      name: 'Google AI',
      icon: <LayoutTemplate className="w-5 h-5 text-red-500" />,
      ...scores.googleAi
    }
  ];

  return (
    <div className="mt-8 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
        <Bot className="w-6 h-6 text-indigo-600" />
        AI Platform Compatibility
      </h2>
      <p className="text-gray-600 mb-6">
        Different AI platforms parse data differently. This section simulates how compatible your <code className="bg-gray-100 px-1 rounded">llms.txt</code> file is with the unique parsing strengths of major search and chat platforms.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map(platform => (
          <div key={platform.id} className="glass-panel p-5 rounded-xl shadow-sm border border-white border-opacity-60 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {platform.icon}
                <h3 className="font-bold text-gray-800">{platform.name}</h3>
              </div>
              <span className={`font-mono font-bold text-lg ${platform.score >= 90 ? 'text-green-600' : platform.score >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {platform.score}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
              <div 
                className={`h-2 rounded-full ${getScoreColor(platform.score)} transition-all duration-1000 ease-out`}
                style={{ width: `${platform.score}%` }}
              ></div>
            </div>

            <div className="mt-auto bg-white/50 rounded p-3 text-xs text-gray-700 leading-relaxed border border-gray-100">
              <span className="font-semibold text-indigo-600">Justification: </span>
              {platform.justification}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelCompatibility;
