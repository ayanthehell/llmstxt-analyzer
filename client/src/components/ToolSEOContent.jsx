import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, LayoutGrid, TrendingUp, Code2, Building2, Users, ShoppingBag, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const ToolSEOContent = ({ toolName, steps, whatIs, useCases, faqs }) => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": toolName,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": whatIs?.subtitle || `Use the free ${toolName} online.`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="w-full">
      <Helmet>
        <title>{`${toolName} - Free Online Tool | LLMS.TXT Analyzer`}</title>
        <meta name="description" content={whatIs?.subtitle || `Use our free online ${toolName}. Instantly generate results, no signup required.`} />
        
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
        <script type="application/ld+json">
          {JSON.stringify(softwareSchema)}
        </script>
      </Helmet>
      
      {/* How It Works — 3 Step Visual Guide */}
      <section className="w-full bg-white border-t border-slate-200 py-24 px-4 mt-16" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">Use the {toolName} in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => {
               const bgColors = ["bg-blue-100", "bg-purple-100", "bg-emerald-100"];
               const borderColors = ["border-blue-200", "border-purple-200", "border-emerald-200"];
               const textColors = ["text-blue-600", "text-purple-600", "text-emerald-600"];
               const hoverBgs = ["group-hover:bg-blue-600", "group-hover:bg-purple-600", "group-hover:bg-emerald-600"];
               const Icon = step.icon || Search;

               return (
                 <div key={idx} className="glass-panel p-8 rounded-3xl text-center group hover:-translate-y-2 transition-transform duration-300">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${bgColors[idx]} ${borderColors[idx]} flex items-center justify-center ${hoverBgs[idx]} group-hover:text-white transition-all duration-300 ${textColors[idx]} shadow-sm group-hover:shadow-lg`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className={`text-sm font-bold ${textColors[idx]} mb-2 tracking-wider uppercase`}>Step {idx + 1}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600" dangerouslySetInnerHTML={{ __html: step.description }} />
                  </div>
               );
            })}
          </div>
        </div>
      </section>

      {/* What is it? */}
      <section className="w-full bg-slate-50 border-t border-slate-200 py-20 px-4" id="what-is">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{whatIs.title}</h2>
            <p className="text-lg text-slate-600">{whatIs.subtitle}</p>
          </div>

          <article className="prose prose-lg max-w-none text-slate-700">
            <div dangerouslySetInnerHTML={{ __html: whatIs.p1 }} />

            <div className="grid md:grid-cols-2 gap-8 my-12 not-prose">
              <div className="glass-panel p-8 rounded-3xl hover:shadow-lg transition-all duration-500 bg-white">
                <TrendingUp className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">{whatIs.card1Title}</h3>
                <div className="text-slate-600" dangerouslySetInnerHTML={{ __html: whatIs.card1Text }} />
              </div>
              
              <div className="glass-panel p-8 rounded-3xl hover:shadow-lg transition-all duration-500 bg-white">
                <CheckCircle2 className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">{whatIs.card2Title}</h3>
                <div className="text-slate-600" dangerouslySetInnerHTML={{ __html: whatIs.card2Text }} />
              </div>
            </div>

            {whatIs.howItWorksTitle && <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-4">{whatIs.howItWorksTitle}</h3>}
            {whatIs.howItWorksP1 && <div dangerouslySetInnerHTML={{ __html: whatIs.howItWorksP1 }} />}
            
            {whatIs.points && whatIs.points.length > 0 && (
              <ul className="space-y-4 mt-8 list-none pl-0">
                {whatIs.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                    <span><strong className="text-slate-900">{point.title}:</strong> {point.desc}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </section>

      {/* Use Cases */}
      {useCases && useCases.length > 0 && (
        <section className="w-full bg-white border-t border-slate-200 py-20 px-4" id="use-cases">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Who Uses the {toolName}?</h2>
              <p className="text-lg text-slate-600">Built for professionals, businesses, and everyday users.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((uc, idx) => {
                 const bgColors = ["bg-blue-100", "bg-purple-100", "bg-emerald-100", "bg-orange-100"];
                 const hoverBgs = ["group-hover:bg-blue-600", "group-hover:bg-purple-600", "group-hover:bg-emerald-600", "group-hover:bg-orange-600"];
                 const textColors = ["text-blue-600", "text-purple-600", "text-emerald-600", "text-orange-600"];
                 const Icon = uc.icon || Users;

                 return (
                  <div key={idx} className="glass-panel p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 group bg-white shadow-sm">
                    <div className={`w-12 h-12 rounded-xl ${bgColors[idx]} flex items-center justify-center mb-4 ${hoverBgs[idx]} transition-colors`}>
                      <Icon className={`w-6 h-6 ${textColors[idx]} group-hover:text-white transition-colors`} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{uc.title}</h3>
                    <p className="text-sm text-slate-600">{uc.desc}</p>
                  </div>
                 );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="w-full bg-slate-50 border-t border-slate-200 py-20 px-4" id="faq">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-slate-600">Common questions about the {toolName}.</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-panel bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  >
                    <span className="font-bold text-slate-900 pr-4">{faq.question}</span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaq === index ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                      {openFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-5 text-slate-600" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ToolSEOContent;
