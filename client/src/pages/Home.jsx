import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Sparkles, Clock, LayoutGrid, SplitSquareHorizontal, FileText, CheckCircle2, TrendingUp, Loader2, Users, Building2, Code2, ShoppingBag, ArrowRight } from 'lucide-react';
import AdUnit from '../components/AdUnit';
import SEO, { SITE_URL, SITE_NAME } from '../components/SEO';
import { useCMS } from '../components/CMSContext';
import FAQ from '../components/FAQ';

const Home = () => {
  const [url, setUrl] = useState('');
  const [recentScans, setRecentScans] = useState([]);
  const navigate = useNavigate();
  const { cmsData, loading: cmsLoading } = useCMS();

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await axios.get('/api/scans');
        if (res.data && res.data.scans) {
          setRecentScans(res.data.scans);
        }
      } catch (err) {
        console.error('Failed to fetch recent scans', err);
      }
    };
    fetchScans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (url.trim()) {
      const cleanUrl = url.trim();
      
      // Optimistically update UI
      setRecentScans(prev => [cleanUrl, ...prev.filter(u => u !== cleanUrl)].slice(0, 5));

      try {
        await axios.post('/api/scans', { url: cleanUrl });
      } catch (err) {
        console.error('Failed to save recent scan', err);
      }

      navigate(`/results?url=${encodeURIComponent(cleanUrl)}`);
    }
  };

  if (cmsLoading || !cmsData) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500"/></div>;
  }

  const seo = cmsData.seo || {};
  const home = cmsData.home || {};
  const faqs = cmsData.faqs || [];

  // Build JSON-LD schemas
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": seo.homeDescription || "Audit your llms.txt file to ensure your website is optimized for ChatGPT, Perplexity, and Generative Engine Optimization (GEO).",
    "applicationCategory": "SEO Tool",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "llms.txt file validation",
      "AI search readiness scoring",
      "Model compatibility analysis",
      "Gap analysis and recommendations",
      "AI search simulation"
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": "Free tools for Generative Engine Optimization (GEO) and AI search readiness.",
    "sameAs": [
      "https://llmstxt.org/"
    ]
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>/g, '') // Strip HTML for schema
      }
    }))
  } : null;

  const schemas = [webAppSchema, organizationSchema, faqSchema].filter(Boolean);

  return (
    <div className="flex flex-col items-center">
      <SEO 
        title={seo.homeTitle || "LLMS.TXT Analyzer & Validator | Optimize for AI Search (GEO)"} 
        description={seo.homeDescription || "Audit your llms.txt file to ensure your website is optimized for ChatGPT, Perplexity, and Generative Engine Optimization (GEO). Run a free readiness audit today."} 
        canonical="/"
        schema={schemas}
      />
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center px-4 py-12 w-full max-w-7xl">
        <AdUnit slotId="1111111111" format="horizontal" className="mb-8 max-w-4xl w-full" />
      
      <div className="text-center max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 backdrop-blur-md text-blue-700 font-medium text-sm mb-6 shadow-sm border border-blue-100/50">
          <Sparkles className="w-4 h-4" />
          <span>{home.heroTag || "Free AI Search Readiness Audit"}</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900">
          {home.heroTitle || "Audit your llms.txt for AI search readiness"}
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          {home.heroSubtitle || "Check if your website is optimized for ChatGPT, Perplexity, and Google AI Overviews. Ensure LLMs can understand your content correctly."}
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto mb-10" id="analyzer-form">
          <div className="relative flex items-center group">
            <Search className="absolute left-4 w-6 h-6 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full glass-input rounded-full py-4 pl-14 pr-32 transition-colors text-lg placeholder-gray-500"
              required
              id="url-input"
            />
            <button
              type="submit"
              className="absolute right-2 glass-button-primary rounded-full px-6 py-2.5 font-medium"
              id="analyze-button"
            >
              Analyze
            </button>
          </div>
        </form>
      </div>

      {recentScans.length > 0 && (
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-2 text-gray-600 mb-4 px-2">
            <Clock className="w-4 h-4" />
            <h3 className="font-semibold">Recent Scans</h3>
          </div>
          <div className="space-y-2">
            {recentScans.map((scan, idx) => (
              <Link 
                key={idx} 
                to={`/results?url=${encodeURIComponent(scan)}`}
                className="block glass-panel rounded-lg p-4 hover:border-blue-300 transition-colors flex items-center justify-between group"
              >
                <span className="font-mono text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{scan}</span>
                <span className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">Re-analyze &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* How It Works — 3 Step Visual Guide */}
      <section className="w-full bg-gradient-to-b from-white to-gray-50/50 border-t border-gray-100 py-20 px-4" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Get your AI search readiness score in three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 text-blue-600">
                <Search className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold text-blue-600 mb-2">Step 1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enter Your URL</h3>
              <p className="text-gray-600">Paste your website URL into the analyzer. We'll automatically locate and fetch your <code className="text-blue-600 bg-blue-50 px-1 rounded">llms.txt</code> file.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 text-purple-600">
                <LayoutGrid className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold text-purple-600 mb-2">Step 2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Your AI Audit</h3>
              <p className="text-gray-600">Our engine scores your file across 6 dimensions — completeness, structure, link coverage, description richness, <a href="/about" className="text-blue-600 hover:underline">LLM optimization</a>, and best practices.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-100 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all duration-300 text-green-600">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold text-green-600 mb-2">Step 3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fix &amp; Optimize</h3>
              <p className="text-gray-600">Use our gap analysis to fix issues and maximize your score for AI search engines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is llms.txt? — SEO Content */}
      <section className="w-full bg-white border-t border-gray-100 py-20 px-4" id="what-is-llmstxt">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{home.seoSectionTitle || "What is an llms.txt file?"}</h2>
            <p className="text-lg text-gray-600">{home.seoSectionSubtitle || "The new web standard for Generative Engine Optimization (GEO)."}</p>
          </div>

          <article className="prose prose-lg max-w-none text-gray-600">
            <div dangerouslySetInnerHTML={{ __html: home.seoContentP1 || "Just like robots.txt tells traditional search engines how to crawl your website, an llms.txt file provides clean, structured data specifically designed for Large Language Models (LLMs) like ChatGPT, Claude, and Perplexity AI. By providing an optimized markdown file, you ensure that AI engines can accurately summarize, cite, and recommend your content to users." }} />

            <div className="grid md:grid-cols-2 gap-8 my-12 not-prose">
              <div className="glass-panel p-8 rounded-3xl bg-blue-50/30 border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{home.card1Title || "Boost AI Search Rankings"}</h3>
                <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: home.card1Text || "Generative Engine Optimization (GEO) relies on clear, structured context. Websites with llms.txt files are far more likely to be accurately cited by Perplexity AI and Google AI Overviews." }} />
              </div>
              
              <div className="glass-panel p-8 rounded-3xl bg-purple-50/30 border border-purple-100/50 hover:shadow-xl transition-all duration-300">
                <CheckCircle2 className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{home.card2Title || "Control Your Brand Narrative"}</h3>
                <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: home.card2Text || "Don't let an AI guess what your website is about. By providing an llms-full.txt file with system prompts and context, you directly instruct the AI on how to represent your brand." }} />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">{home.howItWorksTitle || "How does the LLMS.TXT Analyzer work?"}</h3>
            <div dangerouslySetInnerHTML={{ __html: home.howItWorksP1 || "Our free validation tool runs your website through a comprehensive audit to check for AI-readiness. We parse your markdown formatting, validate your links, and calculate a Compatibility Score for major AI models." }} />
            <ul className="space-y-3 mt-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Markdown Structure:</strong> Checks if your file uses proper H1/H2 tags and blockquotes for easy AI parsing.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Model Compatibility:</strong> Simulates how <a href="https://openai.com/chatgpt" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">ChatGPT</a>, <a href="https://www.anthropic.com/claude" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Claude</a>, and <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Gemini</a> read your data using heuristic scoring.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Link Resolution:</strong> Verifies that all URLs referenced in your document are active and accessible by crawlers.</span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* Who Uses llms.txt? — Use Cases */}
      <section className="w-full bg-gray-50/50 border-t border-gray-100 py-20 px-4" id="use-cases">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Who Uses llms.txt?</h2>
            <p className="text-lg text-gray-600">Teams and organizations across every industry are adopting llms.txt to control their AI presence.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                <Code2 className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">SaaS & API Companies</h3>
              <p className="text-sm text-gray-600">Ensure AI assistants accurately describe your product, pricing, and API documentation to potential customers.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                <Building2 className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Digital Agencies</h3>
              <p className="text-sm text-gray-600">Offer GEO optimization services to your clients alongside traditional SEO.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                <Users className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Open-Source Projects</h3>
              <p className="text-sm text-gray-600">Help developers find your project when asking AI coding assistants. Structure your docs for LLM consumption.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                <ShoppingBag className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">E-Commerce Brands</h3>
              <p className="text-sm text-gray-600">Control how AI shopping assistants describe your products, return policies, and brand values to consumers.</p>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
    </div>
  );
};

export default Home;
