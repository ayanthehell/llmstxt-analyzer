import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, AlertCircle, Download, Code2, Sparkles, ArrowRight } from 'lucide-react';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ScoreDial from '../components/ScoreDial';
import ScoreCard from '../components/ScoreCard';
import GapTable from '../components/GapTable';
import LiveEditor from '../components/LiveEditor';
import LoadingState from '../components/LoadingState';
import AdUnit from '../components/AdUnit';
import ModelCompatibility from '../components/ModelCompatibility';
import SEO, { SITE_URL, SITE_NAME } from '../components/SEO';

const Results = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');
  
  const [loading, setLoading] = useState(true);
  const [isScoring, setIsScoring] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!url) {
      setError('No URL provided.');
      setLoading(false);
      return;
    }
    fetchData(url);
  }, [url]);

  const fetchData = async (targetUrl, rawText = null) => {
    try {
      if (!rawText) setLoading(true);
      else setIsScoring(true);
      
      setError(null);
      const apiUrl = '/api/analyze';
      const payload = rawText ? { rawText } : { url: targetUrl, deepScan: true };
      
      const response = await axios.post(apiUrl, payload);
      setData(response.data);
      
      if (response.data.scores.overall >= 90) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
      setIsScoring(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: '#f3f4f6' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('llms-txt-audit.pdf');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4 text-slate-900">Analysis Failed</h2>
        <p className="text-slate-600 mb-8 max-w-md">{error}</p>
        <div className="flex gap-4">
          <Link to="/" className="glass-panel text-slate-800 hover:text-blue-400 font-semibold rounded-full px-6 py-2.5 transition-colors">
            Try another URL
          </Link>
          <a href="https://llmstxt.org/" target="_blank" rel="noreferrer" className="glass-button-primary font-semibold rounded-full px-6 py-2.5 transition-colors">
            Read llms.txt Spec
          </a>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <SEO 
        title={data ? `Analysis Results: ${data.url} | LLMS.TXT Analyzer` : "Analyzing | LLMS.TXT Analyzer"} 
        description={`View the llms.txt audit results for ${data?.url || 'your website'}. Check formatting, model compatibility scores, and AI search readiness.`}
        canonical={data ? `/results?url=${encodeURIComponent(data.url)}` : '/results'}
        schema={data ? {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": SITE_NAME,
          "url": SITE_URL,
          "applicationCategory": "SEO Tool",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": String(Math.min(5, (data.scores.overall / 20)).toFixed(1)),
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "1"
          }
        } : undefined}
      />
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} width={window.innerWidth} height={window.document.body.scrollHeight} />}
      <AdUnit slotId="3333333333" format="horizontal" className="mb-6" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-500 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" />
          <span>Analyze another URL</span>
        </Link>
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 px-4 py-2 glass-panel text-slate-700 hover:text-blue-400 hover:border-blue-500/50 rounded transition-colors text-sm font-medium w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      <div id="report-content" className="pb-8">
        <div className="glass-panel rounded-xl p-8 mb-8 flex flex-col md:flex-row items-center gap-12 shadow-md">
          <ScoreDial score={data.scores.overall} />
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-slate-900">Audit Results</h1>
            <p className="text-slate-600 text-lg flex items-center gap-2">
              For: <a href={data.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{data.url}</a>
            </p>
            {data.deepScanCompleted && (
              <p className="text-xs text-green-600 mt-2 font-medium">✓ Deep Scan Completed (Links Verified)</p>
            )}
          </div>
        </div>

        <ModelCompatibility rawText={data.rawText} />

        {data.scores.overall >= 90 && (
          <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="bg-blue-500 text-slate-900 px-4 py-2 rounded-full font-bold text-sm tracking-wide shrink-0 shadow-md">
              🤖 VERIFIED AI READY
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 font-bold mb-1">Excellent Score! Show it off.</h3>
              <p className="text-sm text-slate-600 mb-3">Add this badge to your website to let others know your documentation is optimized for LLMs.</p>
              <div className="flex items-center gap-2 glass-input p-2 rounded">
                <Code2 className="w-5 h-5 text-slate-9000 shrink-0" />
                <input 
                  type="text" 
                  readOnly 
                  value={`<a href="https://llmstxt-analyzer.com/results?url=${encodeURIComponent(data.url)}"><img src="https://llmstxt-analyzer.com/badge.svg" alt="AI Ready" /></a>`}
                  className="w-full bg-transparent text-slate-700 text-xs font-mono focus:outline-none" 
                />
                <button 
                  onClick={(e) => navigator.clipboard.writeText(e.target.previousSibling.value)}
                  className="px-3 py-1 bg-white/5 border border-slate-300 hover:bg-white/10 rounded text-xs text-slate-800 shadow-sm transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ScoreCard title="Completeness" score={data.scores.completeness} weight={25} />
              <ScoreCard title="Structure Quality" score={data.scores.structure} weight={20} />
              <ScoreCard title="Link Coverage" score={data.scores.linkCoverage} weight={20} />
              <ScoreCard title="Description Richness" score={data.scores.descriptionRichness} weight={15} />
              <ScoreCard title="LLM Optimization" score={data.scores.llmOptimization} weight={10} />
              <ScoreCard title="Best Practices" score={data.scores.bestPractices} weight={10} />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">Gap Analysis</h2>
              <GapTable gaps={data.gaps} />
            </div>
          </div>
          
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-panel p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-slate-900 text-lg mb-4">Quick Stats</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-slate-600">Sections Found:</span>
                  <span className="font-mono font-medium text-slate-900">{data.parsedData.sections.length}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Total Links:</span>
                  <span className="font-mono font-medium text-slate-900">
                    {data.parsedData.sections.reduce((acc, sec) => acc + sec.links.length, 0)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Title Configured:</span>
                  <span className="font-mono font-medium text-slate-900">{data.parsedData.title ? 'Yes' : 'No'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Summary Configured:</span>
                  <span className="font-mono font-medium text-slate-900">{data.parsedData.summary ? 'Yes' : 'No'}</span>
                </li>
              </ul>
            </div>
            <div className="sticky top-8">
              <AdUnit slotId="3333333333" format="auto" />
            </div>
          </div>
        </div>
      </div>

      <LiveEditor rawText={data.rawText} onRescore={(text) => fetchData(url, text)} isScoring={isScoring} url={url} />

    </div>
  );
};

export default Results;
