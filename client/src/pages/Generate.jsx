import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SEO, { SITE_URL, SITE_NAME } from '../components/SEO';
import AdUnit from '../components/AdUnit';
import { Copy, Download, FileText, CheckCircle2, Sparkles, Loader2, Send, Bot, User, MessageSquare, Search, ArrowRightLeft, FileCode2 } from 'lucide-react';
import { useCMS } from '../components/CMSContext';
import FAQ from '../components/FAQ';

const Generate = () => {
  const { cmsData, loading: cmsLoading } = useCMS();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    systemPrompt: '',
    urls: [{ name: '', url: '' }],
    notes: '',
    llmsFullContent: ''
  });
  const [proOptions, setProOptions] = useState({
    restrictedAccess: false,
    crawlRate: 0,
    attribution: false
  });
  const [activeTab, setActiveTab] = useState('llms.txt');
  const [copied, setCopied] = useState(false);
  const [autoUrl, setAutoUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  
  // Chat UI state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Simulator state
  const [simulation, setSimulation] = useState({
    isRunning: false,
    hasRun: false,
    withoutLLMS: '',
    withLLMS: '',
    error: ''
  });

  React.useEffect(() => {
    let newNotes = '';
    if (proOptions.restrictedAccess) newNotes += 'Model-access: restricted\nAllow-prompts: none\n';
    if (proOptions.crawlRate > 0) newNotes += `Crawl-rate: ${proOptions.crawlRate}s\n`;
    if (proOptions.attribution) newNotes += 'Attribution: Required for all generated snippets.\n';
    
    setFormData(prev => ({ ...prev, notes: newNotes.trim() }));
  }, [proOptions]);

  const handleAutoGenerate = async () => {
    if (!autoUrl) return;
    setIsGenerating(true);
    setGenerateError('');
    try {
      const response = await axios.post('/api/generate-llmstxt', { url: autoUrl });
      const data = response.data;
      
      setFormData(prev => ({
        ...prev,
        title: data.title || '',
        summary: data.summary || '',
        systemPrompt: data.systemPrompt || '',
        urls: data.urls && data.urls.length > 0 ? data.urls : [{ name: '', url: '' }],
        llmsFullContent: data.llmsFullContent || ''
      }));
    } catch (err) {
      setGenerateError(err.response?.data?.error || 'Failed to auto-generate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUrlChange = (index, field, value) => {
    const newUrls = [...formData.urls];
    newUrls[index][field] = value;
    setFormData({ ...formData, urls: newUrls });
  };

  const addUrl = () => {
    setFormData({ ...formData, urls: [...formData.urls, { name: '', url: '' }] });
  };

  const removeUrl = (index) => {
    const newUrls = formData.urls.filter((_, i) => i !== index);
    setFormData({ ...formData, urls: newUrls });
  };

  const generateMarkdown = () => {
    let md = '';
    
    if (formData.title) {
      md += `# ${formData.title}\n\n`;
    } else {
      md += `# Your Project Title\n\n`;
    }

    if (formData.summary) {
      md += `> ${formData.summary}\n\n`;
    } else {
      md += `> Your project summary.\n\n`;
    }

    if (formData.systemPrompt) {
      md += `${formData.systemPrompt}\n\n`;
    }

    const validUrls = formData.urls.filter(u => u.name && u.url);
    if (validUrls.length > 0) {
      md += `## Resources\n\n`;
      validUrls.forEach(u => {
        md += `- [${u.name}](${u.url})\n`;
      });
      md += '\n';
    }

    if (formData.notes) {
      md += `## Notes\n\n${formData.notes}\n`;
    }

    return md.trim();
  };

  const getActiveContent = () => {
    if (activeTab === 'llms-full.txt') {
      return formData.llmsFullContent || '# No deep content generated yet.\n\nRun Magic Auto-Generate to scrape sub-pages.';
    }
    return generateMarkdown();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = { role: 'user', content: chatInput.trim() };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const context = formData.llmsFullContent || generateMarkdown();

      const response = await axios.post('/api/chat', { 
        context, 
        message: newMessage.content 
      });
      
      setChatMessages(prev => [...prev, { role: 'ai', content: response.data.text }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'error', content: 'Failed to connect to AI. Please try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSimulate = async () => {
    if (!autoUrl && !formData.urls[0].url) {
      setSimulation(prev => ({ ...prev, error: 'Please provide a URL to simulate.' }));
      return;
    }

    const urlToUse = autoUrl || formData.urls[0].url;

    setSimulation({
      isRunning: true,
      hasRun: false,
      withoutLLMS: '',
      withLLMS: '',
      error: ''
    });

    try {
      const llmsContent = formData.llmsFullContent || generateMarkdown();

      const response = await axios.post('/api/simulate', { 
        url: urlToUse, 
        llmsContent 
      });
      
      setSimulation({
        isRunning: false,
        hasRun: true,
        withoutLLMS: response.data.withoutLLMS,
        withLLMS: response.data.withLLMS,
        error: ''
      });
    } catch (err) {
      setSimulation(prev => ({
        ...prev,
        isRunning: false,
        error: 'Failed to run simulation. Check backend connection.'
      }));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([getActiveContent()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (cmsLoading || !cmsData) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500"/></div>;
  }

  const seo = cmsData.seo || {};
  const generate = cmsData.generate || {};
  const faqs = cmsData.faqs || [];

  // HowTo Schema for "How to Create an llms.txt File"
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Create an llms.txt File for Your Website",
    "description": "Step-by-step guide to creating an optimized llms.txt file that helps AI search engines like ChatGPT, Perplexity, and Google AI Overviews understand your website.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter your website URL",
        "text": "Paste your website URL into the Magic Auto-Generate tool. Our AI will crawl your site and extract the most important content.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Review and customize the generated content",
        "text": "Review the auto-generated llms.txt and llms-full.txt files. Customize the project title, summary, system prompt, and resource URLs.",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Configure pro options",
        "text": "Set pro options like restricted access, attribution requirements, and crawl rate limits to control how AI models interact with your content.",
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": "Download and deploy",
        "text": "Download your llms.txt and llms-full.txt files, then host them at the root of your domain (e.g., yoursite.com/llms.txt).",
        "position": 4
      }
    ],
    "tool": {
      "@type": "HowToTool",
      "name": "LLMS.TXT Generator"
    }
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>/g, '')
      }
    }))
  } : null;

  const schemas = [howToSchema, faqSchema].filter(Boolean);

  return (
    <div className="flex flex-col items-center w-full">
      <SEO 
        title={seo.generateTitle || "Free LLMS.TXT Generator | Build AI-Ready Documentation"} 
        description={seo.generateDescription || "Automatically generate an optimized llms.txt and llms-full.txt file for your website. Instruct ChatGPT, Claude, and Perplexity on how to read your content."}
        canonical="/generate"
        schema={schemas}
      />
      <AdUnit slotId="2222222222" format="horizontal" className="mt-8 mb-4 max-w-4xl w-full" />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-200px)]">
      {/* Form Section */}
      <div className="flex-1 w-full">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{generate.heroTitle || "Free LLMS.TXT Generator"}</h1>
        <p className="text-gray-600 mb-8">
          {generate.heroSubtitle || "Easily create a standard llms.txt file for your website to help AI agents read your documentation."}
        </p>

        {/* Magic Generate Section */}
        <div className="glass-panel rounded-xl p-6 mb-10 shadow-sm border-blue-200/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-gray-800">Magic Auto-Generate</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Paste your website URL and our AI will scrape it to draft the perfect llms.txt for your business vertical.</p>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com"
              className="flex-1 glass-input rounded-lg p-3 transition-colors"
              value={autoUrl}
              onChange={(e) => setAutoUrl(e.target.value)}
              disabled={isGenerating}
            />
            <button
              onClick={handleAutoGenerate}
              disabled={isGenerating || !autoUrl}
              className="flex items-center gap-2 glass-button-primary disabled:opacity-50 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isGenerating ? 'Generating...' : 'Auto-Generate'}
            </button>
          </div>
          {generateError && <p className="text-red-500 text-sm mt-3">{generateError}</p>}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pro Options</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="glass-panel rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-gray-800 font-medium">Restricted Access</p>
              <p className="text-xs text-gray-500">Block public LLM scraping</p>
            </div>
            <button 
              onClick={() => setProOptions({...proOptions, restrictedAccess: !proOptions.restrictedAccess})}
              className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${proOptions.restrictedAccess ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${proOptions.restrictedAccess ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
          
          <div className="glass-panel rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-gray-800 font-medium">Require Attribution</p>
              <p className="text-xs text-gray-500">Inject copyright rules</p>
            </div>
            <button 
              onClick={() => setProOptions({...proOptions, attribution: !proOptions.attribution})}
              className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${proOptions.attribution ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${proOptions.attribution ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="glass-panel rounded-lg p-4 md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-800 font-medium">Crawl Rate Limiter</p>
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">{proOptions.crawlRate > 0 ? `${proOptions.crawlRate}s` : 'Off'}</span>
            </div>
            <input 
              type="range" 
              min="0" max="10" step="1"
              value={proOptions.crawlRate}
              onChange={(e) => setProOptions({...proOptions, crawlRate: parseInt(e.target.value)})}
              className="w-full accent-blue-500 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Unlimited</span>
              <span>10s Delay</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Or Edit Manually</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
            <input
              type="text"
              placeholder="e.g., My Awesome API"
              className="w-full glass-input rounded-lg p-3 transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
            <textarea
              placeholder="A brief description of what this project is about..."
              className="w-full h-24 glass-input rounded-lg p-3 transition-colors"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Instructions / Description</label>
            <textarea
              placeholder="Detailed instructions for the LLM on how to interact with your site or API..."
              className="w-full h-32 glass-input rounded-lg p-3 transition-colors"
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Important URLs (Resources)</label>
            {formData.urls.map((urlObj, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Link Name (e.g., Docs)"
                  className="w-1/3 glass-input rounded-lg p-3 transition-colors"
                  value={urlObj.name}
                  onChange={(e) => handleUrlChange(i, 'name', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="URL (e.g., https://example.com/docs)"
                  className="flex-1 glass-input rounded-lg p-3 transition-colors"
                  value={urlObj.url}
                  onChange={(e) => handleUrlChange(i, 'url', e.target.value)}
                />
                {formData.urls.length > 1 && (
                  <button 
                    onClick={() => removeUrl(i)}
                    className="p-3 bg-red-100 text-red-500 hover:bg-red-200 rounded-lg transition-colors"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button 
              onClick={addUrl}
              className="text-sm text-blue-600 hover:text-blue-500 mt-2 font-medium"
            >
              + Add another URL
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
            <textarea
              placeholder="Any other details..."
              className="w-full h-24 glass-input rounded-lg p-3 transition-colors"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="lg:w-[40%] w-full">
        <div className="sticky top-6">
          <div className="glass-panel rounded-xl overflow-hidden shadow-lg border-white/60">
            {/* Tabs */}
            <div className="flex bg-white/40 border-b border-white/50 backdrop-blur-md">
              <button 
                onClick={() => setActiveTab('llms.txt')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'llms.txt' ? 'text-blue-600 border-b-2 border-blue-500 bg-white/60' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
              >
                llms.txt
              </button>
              <button 
                onClick={() => setActiveTab('llms-full.txt')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'llms-full.txt' ? 'text-blue-600 border-b-2 border-blue-500 bg-white/60' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
              >
                llms-full.txt <span className="ml-1 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">PRO</span>
              </button>
              <button 
                onClick={() => setActiveTab('test-ai')}
                className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'test-ai' ? 'text-blue-600 border-b-2 border-blue-500 bg-white/60' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
              >
                <MessageSquare className="w-4 h-4" /> Test AI
              </button>
              <button 
                onClick={() => setActiveTab('simulate')}
                className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'simulate' ? 'text-purple-600 border-b-2 border-purple-500 bg-white/60' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
              >
                <Search className="w-4 h-4" /> Preview
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border-b border-white/50 bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-2 text-gray-800 font-medium">
                {activeTab === 'test-ai' && <Sparkles className="w-4 h-4 text-blue-500" />}
                {activeTab === 'simulate' && <ArrowRightLeft className="w-4 h-4 text-purple-500" />}
                {activeTab !== 'test-ai' && activeTab !== 'simulate' && <FileText className="w-4 h-4" />}
                <span>
                  {activeTab === 'test-ai' ? 'AI Playground' : activeTab === 'simulate' ? 'AI Search Simulator' : 'Preview'}
                </span>
              </div>
              <div className="flex gap-2">
                {activeTab !== 'test-ai' && activeTab !== 'simulate' && (
                  <>
                    <button 
                      onClick={handleCopy}
                      className="p-2 hover:bg-white/60 rounded-md text-gray-600 hover:text-blue-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="p-2 hover:bg-white/60 rounded-md text-gray-600 hover:text-blue-600 transition-colors"
                      title={`Download ${activeTab}`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </>
                )}
                {activeTab === 'simulate' && (
                  <button
                    onClick={handleSimulate}
                    disabled={simulation.isRunning}
                    className="flex items-center gap-2 glass-button-primary px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {simulation.isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    {simulation.isRunning ? 'Running...' : 'Run Simulation'}
                  </button>
                )}
              </div>
            </div>
            
            {activeTab === 'test-ai' ? (
              <div className="flex flex-col bg-white/70 backdrop-blur-md h-[600px]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium text-gray-700">Test your generated context!</p>
                      <p className="text-sm">Ask a question to see how an AI interprets your project based ONLY on the generated llms.txt.</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, i) => (
                      <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role !== 'user' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                        <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                          msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 
                          msg.role === 'error' ? 'bg-red-100 text-red-600' :
                          'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm whitespace-pre-wrap'
                        }`}>
                          {msg.content}
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {isChatLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      </div>
                      <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none p-3 shadow-sm">
                        <span className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white/50 border-t border-white/50">
                  <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about this project..."
                      className="w-full glass-input rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none"
                      disabled={isChatLoading}
                    />
                    <button 
                      type="submit" 
                      disabled={!chatInput.trim() || isChatLoading}
                      className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ) : activeTab === 'simulate' ? (
              <div className="flex flex-col bg-white/70 backdrop-blur-md h-[600px] overflow-hidden">
                {!simulation.hasRun && !simulation.isRunning && !simulation.error && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                    <Search className="w-12 h-12 mb-4 text-purple-300" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Simulate AI Search</h3>
                    <p className="text-sm">Click "Run Simulation" to see how Perplexity/ChatGPT reads your site <br/> <b>Without llms.txt</b> vs <b>With llms.txt</b>.</p>
                  </div>
                )}
                {simulation.error && (
                  <div className="flex items-center justify-center h-full text-red-500 p-8 text-center font-medium">
                    {simulation.error}
                  </div>
                )}
                {simulation.isRunning && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                    <Loader2 className="w-12 h-12 mb-4 text-purple-500 animate-spin" />
                    <p className="text-sm animate-pulse">Crawling website & running AI models...</p>
                  </div>
                )}
                {simulation.hasRun && (
                  <div className="flex h-full w-full divide-x divide-gray-200">
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50">
                      <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                        <Bot className="w-4 h-4" /> Raw HTML Scrape
                      </div>
                      <div className="prose prose-sm text-gray-700 whitespace-pre-wrap">
                        {simulation.withoutLLMS}
                      </div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto bg-purple-50/30">
                      <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-4 border-b border-purple-200 pb-2">
                        <Sparkles className="w-4 h-4" /> With llms.txt
                      </div>
                      <div className="prose prose-sm text-gray-800 whitespace-pre-wrap font-medium">
                        {simulation.withLLMS}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-white/70 backdrop-blur-md overflow-auto max-h-[600px] min-h-[400px]">
                <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-words">
                  {getActiveContent()}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* SEO & Educational Content Section */}
      <section className="w-full bg-white border-t border-gray-100 py-20 px-4 mt-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{generate.seoSectionTitle || "How to write an llms.txt file"}</h2>
            <p className="text-lg text-gray-600">{generate.seoSectionSubtitle || "Best practices for Generative Engine Optimization (GEO)."}</p>
          </div>

          <article className="prose prose-lg max-w-none text-gray-600">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{generate.coreStructureTitle || "The core structure"}</h3>
            <div dangerouslySetInnerHTML={{ __html: generate.coreStructureP1 || "An llms.txt file should be placed at the root of your domain (e.g., https://example.com/llms.txt). It serves as a brief directory that helps LLMs understand what your project is about and where to find more detailed information." }} />
            <p>
              A standard file includes three main sections:
            </p>
            <ul>
              <li><strong>Project Title:</strong> An H1 header with the name of your project.</li>
              <li><strong>Summary:</strong> A brief blockquote (using <code>&gt;</code>) that explains what the project does.</li>
              <li><strong>Resources:</strong> A list of markdown links to other documentation pages or a single <code>llms-full.txt</code> file containing all concatenated context.</li>
            </ul>

            <div className="glass-panel p-8 rounded-2xl my-12 bg-gray-50 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileCode2 className="w-6 h-6 text-blue-500" />
                Example llms.txt format
              </h3>
              <pre className="text-sm font-mono text-gray-800 bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto">
{`# My Project

> A revolutionary open-source platform for building AI agents.

## System Prompt
Please keep responses concise and always reference the official documentation.

## Resources
- [Full Documentation](https://example.com/llms-full.txt)
- [API Reference](https://example.com/docs/api.md)`}
              </pre>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">{generate.whatIsFullTitle || "What is llms-full.txt?"}</h3>
            <div dangerouslySetInnerHTML={{ __html: generate.whatIsFullP1 || "While llms.txt is a brief index, llms-full.txt is where the magic happens. It is a massive, concatenated markdown file containing your entire documentation. When you use our Magic Auto-Generate tool above, we automatically crawl your site, extract the most important content, and compile it into a structured llms-full.txt file. This ensures that when ChatGPT or Perplexity reads your site, they have all the context they need without having to guess which links to click." }} />
          </article>
        </div>
      </section>

      {/* Comparison Table: llms.txt vs robots.txt vs sitemap.xml */}
      <section className="w-full bg-white border-t border-gray-100 py-20 px-4" id="comparison">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">llms.txt vs robots.txt vs sitemap.xml</h2>
            <p className="text-lg text-gray-600">Understanding the three essential files for modern web discoverability.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 font-bold text-gray-900">Feature</th>
                  <th className="px-6 py-4 font-bold text-blue-600">llms.txt</th>
                  <th className="px-6 py-4 font-bold text-gray-700">robots.txt</th>
                  <th className="px-6 py-4 font-bold text-gray-700">sitemap.xml</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Purpose</td>
                  <td className="px-6 py-4 text-gray-600">Provides context &amp; documentation for AI models</td>
                  <td className="px-6 py-4 text-gray-600">Controls crawler access permissions</td>
                  <td className="px-6 py-4 text-gray-600">Lists all indexable page URLs</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Target Audience</td>
                  <td className="px-6 py-4 text-gray-600">LLMs (ChatGPT, Claude, <a href="https://www.perplexity.ai/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Perplexity</a>)</td>
                  <td className="px-6 py-4 text-gray-600">Web crawlers (Googlebot, Bingbot)</td>
                  <td className="px-6 py-4 text-gray-600">Search engine indexers</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Format</td>
                  <td className="px-6 py-4 text-gray-600">Markdown (.txt / .md)</td>
                  <td className="px-6 py-4 text-gray-600">Plain text with directives</td>
                  <td className="px-6 py-4 text-gray-600">XML</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Contains Content?</td>
                  <td className="px-6 py-4"><span className="text-green-600 font-semibold">Yes</span> — summaries, docs, context</td>
                  <td className="px-6 py-4"><span className="text-red-500 font-semibold">No</span> — only rules</td>
                  <td className="px-6 py-4"><span className="text-red-500 font-semibold">No</span> — only URLs</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Helps AI Search?</td>
                  <td className="px-6 py-4"><span className="text-green-600 font-semibold">✓ Directly</span></td>
                  <td className="px-6 py-4"><span className="text-yellow-600 font-semibold">~ Indirectly</span></td>
                  <td className="px-6 py-4"><span className="text-yellow-600 font-semibold">~ Indirectly</span></td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Official Spec</td>
                  <td className="px-6 py-4"><a href="https://llmstxt.org/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">llmstxt.org</a></td>
                  <td className="px-6 py-4"><a href="https://www.robotstxt.org/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">robotstxt.org</a></td>
                  <td className="px-6 py-4"><a href="https://www.sitemaps.org/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">sitemaps.org</a></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-600 mt-8">
            All three files work together. Use <Link to="/" className="text-blue-600 hover:underline font-medium">our analyzer</Link> to validate your llms.txt, and pair it with a solid robots.txt and sitemap.xml for complete discoverability.
          </p>
        </div>
      </section>

      <FAQ />
    </div>
  );
};

export default Generate;
