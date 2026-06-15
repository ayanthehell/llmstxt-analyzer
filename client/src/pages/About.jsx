import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SEO, { SITE_URL, SITE_NAME } from '../components/SEO';
import { CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { useCMS } from '../components/CMSContext';

const About = () => {
  const { cmsData } = useCMS();
  const aboutData = cmsData?.about || {
    title: "What is llms.txt?",
    p1: "As AI tools, search engines, and language models increasingly browse the web to answer user queries, they need a standardized way to understand your website's content.",
    p2: "Similar to how robots.txt tells web crawlers what pages they are allowed to index, and sitemap.xml tells them where those pages are, llms.txt tells LLMs how to read and interpret your site.",
    h2_1: "Why does it matter?",
    li1_1: "Better AI Search Visibility: If an LLM cannot easily find your documentation, it won't cite you.",
    li1_2: "Reduced Hallucinations: Control the narrative and ensure the AI has accurate context.",
    li1_3: "Standardization: Universal markdown-based format that all AI agents can parse.",
    h2_2: "Why GEO Matters in 2026",
    p3: "Generative Engine Optimization (GEO) is the practice of optimizing your website so that AI-powered search engines can accurately read, summarize, and cite your content. As traditional search evolves with AI Overviews, having a well-structured llms.txt file is no longer optional.",
    p4: "Studies show that websites providing clean, structured context through llms.txt files are significantly more likely to be cited in AI-generated answers.",
    h2_3: "How does this analyzer work?",
    p5: "Our tool fetches your website's /llms.txt file and evaluates it against 6 key dimensions:",
    li2_1: "Completeness: Does it have all the required fields?",
    li2_2: "Structure Quality: Is the markdown well-formed?",
    li2_3: "Link Coverage: Are you pointing to the most important parts of your site?",
    li2_4: "Description Richness: Do your links and sections have adequate context?",
    li2_5: "LLM Optimization: Are there references to deep-dive files like llms-full.txt?",
    li2_6: "Best Practices: Are the URLs formatted correctly?"
  };

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
        <h1 className="text-4xl font-bold mb-8 text-slate-900" dangerouslySetInnerHTML={{ __html: aboutData.title }}></h1>
        
        <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
          <p dangerouslySetInnerHTML={{ __html: aboutData.p1 }}></p>
          
          <p dangerouslySetInnerHTML={{ __html: aboutData.p2 }}></p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" dangerouslySetInnerHTML={{ __html: aboutData.h2_1 }}></h2>
          <ul className="list-disc pl-6 space-y-3">
            <li dangerouslySetInnerHTML={{ __html: aboutData.li1_1 }}></li>
            <li dangerouslySetInnerHTML={{ __html: aboutData.li1_2 }}></li>
            <li dangerouslySetInnerHTML={{ __html: aboutData.li1_3 }}></li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" dangerouslySetInnerHTML={{ __html: aboutData.h2_2 }}></h2>
          <p dangerouslySetInnerHTML={{ __html: aboutData.p3 }}></p>
          <p dangerouslySetInnerHTML={{ __html: aboutData.p4 }}></p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" dangerouslySetInnerHTML={{ __html: aboutData.h2_3 }}></h2>
          <p dangerouslySetInnerHTML={{ __html: aboutData.p5 }}></p>
          <ul className="list-disc pl-6 space-y-2">
            <li dangerouslySetInnerHTML={{ __html: aboutData.li2_1 }}></li>
            <li dangerouslySetInnerHTML={{ __html: aboutData.li2_2 }}></li>
            <li dangerouslySetInnerHTML={{ __html: aboutData.li2_3 }}></li>
            <li dangerouslySetInnerHTML={{ __html: aboutData.li2_4 }}></li>
            <li dangerouslySetInnerHTML={{ __html: aboutData.li2_5 }}></li>
            <li dangerouslySetInnerHTML={{ __html: aboutData.li2_6 }}></li>
          </ul>

          {/* CTA Section */}
          <div className="mt-12 grid md:grid-cols-1 gap-4 not-prose">
            <Link to="/" className="glass-panel p-6 rounded-2xl hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300 group flex flex-col">
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                Run a Free Audit <ArrowRight className="w-4 h-4" />
              </h3>
              <p className="text-sm text-slate-600">Analyze your website's llms.txt file and get an instant AI readiness score.</p>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 not-prose">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-blue-400 glass-panel px-4 py-2 rounded-lg transition-colors">
              Read our Blog <ArrowRight className="w-3 h-3" />
            </Link>
            <a href="https://llmstxt.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-blue-400 glass-panel px-4 py-2 rounded-lg transition-colors">
              Official Spec <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
