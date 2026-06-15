import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 min-h-[calc(100vh-140px)]">
      <SEO 
        title="Privacy Policy | LLMS.TXT Analyzer"
        description="Learn how LLMS.TXT Analyzer handles your data. We do not store or track the URLs you submit for analysis."
        canonical="/privacy"
      />
      <div className="glass-panel p-8 rounded-2xl shadow-md">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            At LLMS.TXT Analyzer, we take your privacy seriously. This policy outlines how we handle data when you use our service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Data Collection</h2>
          <p>
            We do not store, log, or track the URLs you submit for analysis. All parsing and scoring are done in real-time, per-request, without persisting the data to any database.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Third-Party Services</h2>
          <p>
            We use Google AdSense to serve advertisements. Google AdSense may use cookies to serve ads based on your prior visits to this or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your browsing history. 
          </p>
          <p>
            You may opt out of personalized advertising by visiting Google's <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline">Ads Settings</a>.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Contact</h2>
          <p>
            If you have any questions about this privacy policy, feel free to reach out to the developer or open an issue in our repository.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
