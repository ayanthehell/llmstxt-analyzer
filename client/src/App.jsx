import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Activity, ExternalLink } from 'lucide-react';

import Home from './pages/Home';
import Results from './pages/Results';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import { CMSProvider } from './components/CMSContext';

const Navbar = () => (
  <nav className="glass-panel sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <Activity className="w-6 h-6 text-blue-500 group-hover:text-blue-600 transition-colors" />
        <span className="font-bold text-xl tracking-tight text-gray-800">
          LLMS<span className="text-blue-500">.TXT</span> Analyzer
        </span>
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link>
        <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
        <a href="https://llmstxt.org/" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">Spec</a>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-gray-900 mt-12 py-16">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4 group">
            <Activity className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
            <span className="font-bold text-lg text-white">
              LLMS<span className="text-blue-400">.TXT</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Free tools for Generative Engine Optimization (GEO). Analyze, validate, and generate llms.txt files for AI search readiness.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">Analyzer</Link></li>
            <li><Link to="/blog" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors">About GEO</Link></li>
            <li>
              <a href="https://llmstxt.org/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                llms.txt Spec <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="https://blog.google/products/search/generative-ai-google-search-may-2024/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                Google AI Overviews <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <p>© {new Date().getFullYear()} LLMS.TXT Analyzer. A free tool for the AI web.</p>
        <p className="mt-4 md:mt-0">
          Built for <a href="https://llmstxt.org/" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Generative Engine Optimization</a>
        </p>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <CMSProvider>
      <Router>
        <div className="min-h-screen bg-[#fbfbfd] font-sans selection:bg-blue-100 selection:text-blue-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/results" element={<Results />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CMSProvider>
  );
}

export default App;
