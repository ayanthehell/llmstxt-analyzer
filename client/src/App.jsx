import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ExternalLink, Moon, Sun } from 'lucide-react';
import Logo from './components/Logo';
import { ThemeProvider, useTheme } from './components/ThemeContext';

import Home from './pages/Home';
import Results from './pages/Results';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import { CMSProvider } from './components/CMSContext';

import ToolsIndex from './pages/tools/ToolsIndex';
import EmiCalculator from './pages/tools/EmiCalculator';
import SipCalculator from './pages/tools/SipCalculator';
import GstCalculator from './pages/tools/GstCalculator';
import ElectricityBillCalculator from './pages/tools/ElectricityBillCalculator';
import CgpaConverter from './pages/tools/CgpaConverter';
import LandUnitConverter from './pages/tools/LandUnitConverter';
import SalarySlipGenerator from './pages/tools/SalarySlipGenerator';
import RentAgreementGenerator from './pages/tools/RentAgreementGenerator';
import LeaveApplicationGenerator from './pages/tools/LeaveApplicationGenerator';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <nav className="glass-panel sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors" />
          <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            LLMS<span className="text-blue-500 dark:text-blue-400">.TXT</span><span className="hidden sm:inline"> Analyzer</span>
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
          <Link to="/blog" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Blog</Link>
          <Link to="/tools" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Tools</Link>
          <Link to="/about" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
          <a href="https://llmstxt.org/" target="_blank" rel="noreferrer" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Spec</a>
          
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 mt-12 py-16 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4 group">
            <Logo className="w-5 h-5 text-blue-400 dark:text-blue-500 group-hover:text-blue-300 dark:group-hover:text-blue-400 transition-colors" />
            <span className="font-bold text-lg text-slate-900 dark:text-white transition-colors duration-300">
              LLMS<span className="text-blue-400 dark:text-blue-500">.TXT</span>
            </span>
          </Link>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
            Free tools for Generative Engine Optimization (GEO). Analyze, validate, and generate llms.txt files for AI search readiness.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 transition-colors duration-300">Product</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">Analyzer</Link></li>
            <li><Link to="/blog" className="text-slate-600 dark:text-slate-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">Blog</Link></li>
            <li><Link to="/tools" className="text-slate-600 dark:text-slate-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">Calculators & Tools</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 transition-colors duration-300">Resources</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">About GEO</Link></li>
            <li>
              <a href="https://llmstxt.org/" target="_blank" rel="noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1">
                llms.txt Spec <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="https://blog.google/products/search/generative-ai-google-search-may-2024/" target="_blank" rel="noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1">
                Google AI Overviews <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 transition-colors duration-300">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-slate-600 dark:text-slate-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 dark:text-slate-500 transition-colors duration-300">
        <p>© {new Date().getFullYear()} LLMS.TXT Analyzer. A free tool for the AI web.</p>
        <p className="mt-4 md:mt-0">
          Built for <a href="https://llmstxt.org/" target="_blank" rel="noreferrer" className="text-blue-400 dark:text-blue-500 hover:text-blue-300 dark:hover:text-blue-400 transition-colors">Generative Engine Optimization</a>
        </p>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <ThemeProvider>
      <CMSProvider>
        <Router>
          <div className="min-h-screen bg-transparent font-sans selection:bg-blue-500/30 selection:text-blue-200 transition-colors duration-300">
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
              
              {/* Tools Routes */}
              <Route path="/tools" element={<ToolsIndex />} />
              <Route path="/tools/emi-calculator" element={<EmiCalculator />} />
              <Route path="/tools/sip-calculator" element={<SipCalculator />} />
              <Route path="/tools/gst-calculator" element={<GstCalculator />} />
              <Route path="/tools/electricity-bill-calculator" element={<ElectricityBillCalculator />} />
              <Route path="/tools/cgpa-percentage-converter" element={<CgpaConverter />} />
              <Route path="/tools/land-unit-converter" element={<LandUnitConverter />} />
              <Route path="/tools/salary-slip-generator" element={<SalarySlipGenerator />} />
              <Route path="/tools/rent-agreement-generator" element={<RentAgreementGenerator />} />
              <Route path="/tools/leave-application-generator" element={<LeaveApplicationGenerator />} />
              
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      </CMSProvider>
    </ThemeProvider>
  );
}

export default App;
