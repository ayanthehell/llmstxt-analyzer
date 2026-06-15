import React from 'react';
import { Link } from 'react-router-dom';
import SEO, { SITE_URL, SITE_NAME } from '../components/SEO';
import { CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

const About = () => {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About LLMS.TXT Analyzer",
    "url": `${SITE_URL}/about`,
    "description": "Learn about llms.txt, the new web standard for Generative Engine Optimization (GEO), and how the LLMS.TXT Analyzer helps optimize your site for AI search engines.",
    "mainEntity": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "description": "Free tools for Generative Engine Optimization (GEO) and AI search readiness.",
      "sameAs": [
        "https://llmstxt.org/"
      ]
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 min-h-[calc(100vh-140px)]">
      <SEO 
        title="What is llms.txt? — AI Search Optimization Guide | LLMS.TXT Analyzer"
        description="Learn how llms.txt files help AI search engines like ChatGPT, Perplexity, and Google AI Overviews understand your website. Discover Generative Engine Optimization (GEO) and why it matters in 2026."
        canonical="/about"
        schema={aboutSchema}
      />
      <div className="glass-panel p-8 rounded-2xl shadow-md">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">What is llms.txt?</h1>
        
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            As AI tools, search engines, and language models (like <a href="https://openai.com/chatgpt" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">ChatGPT</a>, <a href="https://www.perplexity.ai/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Perplexity</a>, and <a href="https://blog.google/products/search/generative-ai-google-search-may-2024/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google's AI Overviews</a>) increasingly browse the web to answer user queries, they need a standardized way to understand your website's content.
          </p>
          
          <p>
            Similar to how <code className="text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">robots.txt</code> tells web crawlers what pages they are allowed to index, and <code className="text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">sitemap.xml</code> tells them where those pages are, <code className="text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">llms.txt</code> tells LLMs how to read and interpret your site. Learn more about the differences in our <Link to="/generate#comparison" className="text-blue-600 hover:underline">comparison table</Link>.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why does it matter?</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Better AI Search Visibility:</strong> If an LLM cannot easily find your documentation, API references, or core concepts, it won't cite you in its answers. Use our <Link to="/" className="text-blue-600 hover:underline">free analyzer</Link> to check your readiness.</li>
            <li><strong>Reduced Hallucinations:</strong> By providing a clear, concise summary and structured links, you control the narrative and ensure the AI has accurate context about your business.</li>
            <li><strong>Standardization:</strong> The <a href="https://llmstxt.org/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">llms.txt standard</a> provides a universal markdown-based format that all AI agents can natively parse.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why GEO Matters in 2026</h2>
          <p>
            Generative Engine Optimization (GEO) is the practice of optimizing your website so that AI-powered search engines can accurately read, summarize, and cite your content. As traditional search evolves with AI Overviews, Featured Snippets powered by LLMs, and conversational search platforms like Perplexity, having a well-structured <code className="text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">llms.txt</code> file is no longer optional — it's the foundation of modern discoverability.
          </p>
          <p>
            Studies show that websites providing clean, structured context through llms.txt files are significantly more likely to be cited in AI-generated answers. This isn't just about traditional SEO anymore — it's about ensuring your brand appears when users ask AI assistants questions about your industry.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How does this analyzer work?</h2>
          <p>
            Our tool fetches your website's <code className="text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">/llms.txt</code> file and evaluates it against 6 key dimensions:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Completeness:</strong> Does it have all the required fields?</li>
            <li><strong>Structure Quality:</strong> Is the markdown well-formed?</li>
            <li><strong>Link Coverage:</strong> Are you pointing to the most important parts of your site?</li>
            <li><strong>Description Richness:</strong> Do your links and sections have adequate context?</li>
            <li><strong>LLM Optimization:</strong> Are there references to deep-dive files like <code className="text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">llms-full.txt</code>?</li>
            <li><strong>Best Practices:</strong> Are the URLs formatted correctly?</li>
          </ul>

          {/* CTA Section */}
          <div className="mt-12 grid md:grid-cols-2 gap-4 not-prose">
            <Link to="/" className="glass-panel p-6 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 group flex flex-col">
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                Run a Free Audit <ArrowRight className="w-4 h-4" />
              </h3>
              <p className="text-sm text-gray-600">Analyze your website's llms.txt file and get an instant AI readiness score.</p>
            </Link>
            <Link to="/generate" className="glass-panel p-6 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 group flex flex-col">
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                Generate llms.txt <ArrowRight className="w-4 h-4" />
              </h3>
              <p className="text-sm text-gray-600">Auto-generate optimized llms.txt and llms-full.txt files for your website.</p>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 not-prose">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 glass-panel px-4 py-2 rounded-lg transition-colors">
              Read our Blog <ArrowRight className="w-3 h-3" />
            </Link>
            <a href="https://llmstxt.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 glass-panel px-4 py-2 rounded-lg transition-colors">
              Official Spec <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
