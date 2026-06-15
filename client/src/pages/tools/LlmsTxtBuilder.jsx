import React, { useState, useEffect } from 'react';
import { Download, Copy, Search, LayoutGrid, TrendingUp, Users, Building2, Code2, FileJson, Plus, X } from 'lucide-react';
import ToolSEOContent from '../../components/ToolSEOContent';
import { useCMS } from '../../components/CMSContext';

const LlmsTxtBuilder = () => {
  const { cmsData } = useCMS();
  const toolData = cmsData?.llmsTxtBuilder || {
    toolName: "llms.txt Builder",
    heroTitle: "Visual llms.txt Builder",
    heroSubtitle: "Easily generate standard llms.txt files to optimize your website for AI models and LLMs.",
    steps: [
      { icon: "Search", title: "Project Details", description: "Enter your project name, description, and the base system prompt." },
      { icon: "LayoutGrid", title: "Add Modules & Links", description: "List the essential documentation, API references, or pricing pages." },
      { icon: "TrendingUp", title: "Export File", description: "Download your llms.txt file and place it in the root directory of your site." }
    ],
    whatIs: {
      title: "What is an llms.txt file?",
      subtitle: "The robots.txt equivalent for Large Language Models.",
      p1: "An <strong>llms.txt</strong> file is a new standard designed to provide a structured, semantic map of a website specifically for Large Language Models (LLMs) and AI agents.",
      card1Title: "Semantic Mapping",
      card1Text: "Unlike standard sitemaps, it categorizes links (e.g. docs, api, pricing) to help AI understand your site's structure.",
      card2Title: "Provide Context",
      card2Text: "It allows you to explicitly provide a 'system prompt' or contextual background to the AI about your project.",
      howItWorksTitle: "How to use it?",
      howItWorksP1: "Simply place the generated file at the root of your domain (e.g., https://yoursite.com/llms.txt).",
      points: [
        { title: "Standard Format", desc: "It uses a standardized Markdown syntax." },
        { title: "AI Overviews", desc: "Helps AI models cite your sources more accurately." },
        { title: "Agentic Crawling", desc: "Guides autonomous AI agents to the correct documentation." }
      ]
    },
    useCases: [
      { icon: "Code2", title: "SaaS Startups", desc: "Ensure ChatGPT cites your documentation correctly." },
      { icon: "FileJson", title: "API Providers", desc: "Direct AI agents to your API reference schemas." },
      { icon: "Building2", title: "Enterprises", desc: "Control the narrative and context LLMs have about your company." },
      { icon: "Users", title: "Open Source", desc: "Help developers use AI to navigate your codebase." }
    ],
    faqs: [
      { question: "Where do I put the llms.txt file?", answer: "It must be hosted at the root directory of your website, e.g., yourdomain.com/llms.txt" },
      { question: "Is this replacing robots.txt?", answer: "No. robots.txt controls access/permissions. llms.txt provides context and semantic structure." },
      { question: "What is the difference between llms.txt and llms-full.txt?", answer: "llms.txt is a concise directory of links. llms-full.txt contains the actual raw text content of those links." }
    ]
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  
  const [modules, setModules] = useState([
    { id: 1, name: 'Documentation', url: 'https://', description: 'Official documentation' }
  ]);
  
  const [generatedText, setGeneratedText] = useState('');

  useEffect(() => {
    let txt = `# ${title || '[Project Name]'}\n\n`;
    
    if (description) {
      txt += `> ${description}\n\n`;
    }
    
    if (systemPrompt) {
      txt += `## System Prompt\n\n`;
      txt += `${systemPrompt}\n\n`;
    }

    if (modules.length > 0 && modules.some(m => m.name || m.url)) {
      txt += `## Modules & Resources\n\n`;
      modules.forEach(m => {
        if (m.name || m.url) {
          txt += `- [${m.name || 'Link'}](${m.url || '#'})`;
          if (m.description) {
            txt += `: ${m.description}`;
          }
          txt += `\n`;
        }
      });
    }

    setGeneratedText(txt);
  }, [title, description, systemPrompt, modules]);

  const addModule = () => {
    setModules([...modules, { id: Date.now(), name: '', url: 'https://', description: '' }]);
  };

  const updateModule = (id, field, value) => {
    setModules(modules.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeModule = (id) => {
    setModules(modules.filter(m => m.id !== id));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText).then(() => {
      alert("llms.txt copied to clipboard!");
    });
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "llms.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{toolData.heroTitle}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{toolData.heroSubtitle}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Project Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. LLMS.TXT Analyzer" 
                className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Project Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows="2" 
                placeholder="A brief summary of what your project does..." 
                className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none resize-none"
              ></textarea>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl">
              <label className="block text-sm font-bold text-blue-900 mb-2">System Prompt / AI Context</label>
              <p className="text-xs text-blue-700 mb-3">Provide background instructions to the AI on how it should interpret your project or answer user questions about it.</p>
              <textarea 
                value={systemPrompt} 
                onChange={(e) => setSystemPrompt(e.target.value)} 
                rows="4" 
                placeholder="You are an expert on [Project]. Please prioritize referencing the documentation link when answering questions..." 
                className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 text-sm outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Modules & Important Links</h3>
            <p className="text-xs text-slate-500 mb-4">List the URLs the AI should crawl to gather more context (docs, pricing, API reference).</p>
            
            <div className="space-y-4 mb-4">
              {modules.map((m, index) => (
                <div key={m.id} className="p-4 border border-slate-200 bg-white/40 rounded-xl relative">
                  <button onClick={() => removeModule(m.id)} className="absolute top-2 right-2 text-rose-500 hover:bg-rose-100 p-1 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-3 mb-3 pr-6">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Link Title</label>
                      <input type="text" value={m.name} onChange={(e) => updateModule(m.id, 'name', e.target.value)} placeholder="API Reference" className="w-full glass-input rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">URL</label>
                      <input type="url" value={m.url} onChange={(e) => updateModule(m.id, 'url', e.target.value)} placeholder="https://" className="w-full glass-input rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Short Description</label>
                    <input type="text" value={m.description} onChange={(e) => updateModule(m.id, 'description', e.target.value)} placeholder="Detailed endpoints for the REST API." className="w-full glass-input rounded-lg px-3 py-2 text-sm text-slate-900 outline-none" />
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={addModule} className="w-full flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl text-sm font-bold transition-colors">
              <Plus className="w-4 h-4" /> Add Another Link
            </button>
          </div>

        </div>

        {/* Live Preview */}
        <div className="sticky top-24 space-y-4">
          <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden text-slate-300">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400">llms.txt</span>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
            </div>
            <div className="p-6 h-[500px] overflow-y-auto custom-scrollbar">
              <pre className="font-mono text-[13px] whitespace-pre-wrap leading-relaxed text-emerald-300">
                {generatedText}
              </pre>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button onClick={copyToClipboard} className="flex-1 flex justify-center items-center gap-2 glass-input bg-white text-slate-700 px-4 py-4 rounded-xl font-bold transition-colors">
              <Copy className="w-5 h-5" /> Copy Markdown
            </button>
            <button onClick={downloadTxt} className="flex-1 flex justify-center items-center gap-2 glass-button-primary px-4 py-4 rounded-xl font-bold transition-colors shadow-lg">
              <Download className="w-5 h-5" /> Download .txt
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <ToolSEOContent 
      toolName={toolData.toolName}
      steps={toolData.steps}
      whatIs={toolData.whatIs}
      useCases={toolData.useCases}
      faqs={toolData.faqs}
    />
    </>
  );
};

export default LlmsTxtBuilder;
