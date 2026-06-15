import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useCMS } from './CMSContext';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-slate-300 rounded-2xl mb-4 bg-slate-100/50 backdrop-blur-md overflow-hidden shadow-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all">
      <button 
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
        onClick={onClick}
      >
        <span className="font-semibold text-slate-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-400 shrink-0 ml-4" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-9000 shrink-0 ml-4" />
        )}
      </button>
      <div 
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] pb-5 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}
      >
        <div className="text-slate-700 leading-relaxed prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: answer }} />
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { cmsData, loading } = useCMS();

  if (loading || !cmsData) {
    return <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500"/></div>;
  }

  const faqs = cmsData.faqs || [];

  if (faqs.length === 0) return null;
  return (
    <section className="w-full bg-transparent py-20 px-4 mt-12 border-t border-slate-200 relative">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600">Everything you need to know about llms.txt and AI Search Optimization.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
