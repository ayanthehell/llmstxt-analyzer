import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, Wrench } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-8">
        <div className="bg-slate-50 p-6 rounded-full border border-slate-200">
          <FileQuestion className="w-24 h-24 text-slate-400" />
        </div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 drop-shadow-sm">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>
      <p className="text-slate-600 max-w-xl mx-auto mb-10">
        Oops! We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps you mistyped the URL.
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Link to="/" className="w-full sm:w-auto glass-button-primary px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
          <Home className="w-5 h-5" /> Back to Home
        </Link>
        <Link to="/tools" className="w-full sm:w-auto glass-input bg-white px-8 py-3 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
          <Wrench className="w-5 h-5" /> Browse Tools
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
