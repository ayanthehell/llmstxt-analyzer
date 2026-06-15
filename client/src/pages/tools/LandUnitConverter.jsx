import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Download, Car, Target, ArrowRightLeft, Search, LayoutGrid, TrendingUp, Users, Building2, Code2, ShoppingBag } from 'lucide-react';
import ToolSEOContent from '../../components/ToolSEOContent';
import { useCMS } from '../../components/CMSContext';

const unitToSqFt = {
  'sqft': 1,
  'sqm': 10.7639,
  'sqyd': 9,
  'acre': 43560,
  'hectare': 107639.1,
  'bigha': 27225, // Standard UP Pucca
  'katha': 720,
  'guntha': 1089,
  'cent': 435.6,
  'dismil': 435.6
};

const unitLabels = {
  'sqft': 'Square Feet',
  'sqm': 'Square Meters',
  'sqyd': 'Square Yards',
  'acre': 'Acres',
  'hectare': 'Hectares',
  'bigha': 'Bigha (Standard/UP)',
  'katha': 'Katha (WB/Bihar)',
  'guntha': 'Guntha (MH/GJ)',
  'cent': 'Cents (South)',
  'dismil': 'Dismil (East)'
};

const formatNumber = (num) => {
  if (!num || num === 0) return '';
  if (num < 0.0001 && num > 0) return num.toExponential(4);
  return parseFloat(num.toFixed(4)).toString();
};

const LandUnitConverter = () => {
  const { cmsData } = useCMS();
  const toolData = cmsData?.landUnitConverter || {
    toolName: "Land Unit Converter",
    heroTitle: "Land Unit Converter",
    heroSubtitle: "Enter a value in any box below. All other units and visual scales will update instantly in this bi-directional matrix.",
    steps: [
      { icon: "Search", title: "Select Source Unit", description: "Choose the regional or international unit you currently have." },
      { icon: "LayoutGrid", title: "Enter Value", description: "Input the exact area value to be converted." },
      { icon: "TrendingUp", title: "Get Instant Conversion", description: "Instantly see the value converted across all other standard regional units." }
    ],
    whatIs: {
      title: "Why are there so many Land Measurement Units?",
      subtitle: "Understanding regional land records in India.",
      p1: "In India, land measurement units vary drastically from state to state.",
      card1Title: "Northern Units",
      card1Text: "In Northern India, units like Bigha, Biswa, and Killa are standard.",
      card2Title: "Southern Units",
      card2Text: "In Southern India, units like Cent, Guntha, and Ankanam are widely used.",
      howItWorksTitle: "Common Conversion Metrics",
      howItWorksP1: "Here are standard conversions you should know:",
      points: [
        { title: "1 Acre", desc: "43,560 Square Feet (sq ft) or 4,840 Square Yards" },
        { title: "1 Hectare", desc: "10,000 Square Meters (sq m) or 2.47 Acres" },
        { title: "1 Bigha", desc: "Varies wildly! (e.g., UP ~27,000 sq ft, Bengal ~14,400 sq ft)" }
      ]
    },
    useCases: [
      { icon: "Users", title: "Farmers", desc: "Convert traditional local measurements into metric units." },
      { icon: "Building2", title: "Real Estate Brokers", desc: "Easily communicate land sizes to urban buyers." },
      { icon: "Code2", title: "Lawyers", desc: "Draft accurate sale deeds by converting regional units." },
      { icon: "ShoppingBag", title: "Investors", desc: "Compare land prices accurately across different states." }
    ],
    faqs: [
      { question: "Is a Bigha the same everywhere in India?", answer: "No. A 'Bigha' changes depending on the state." },
      { question: "What is the globally accepted standard for measuring large land?", answer: "The Hectare (ha) is universally accepted." },
      { question: "How many cents make an Acre?", answer: "1 Acre is exactly equal to 100 Cents." }
    ]
  };

  const [values, setValues] = useState({});
  const [baseSqft, setBaseSqft] = useState(0);

  // Initialize with 1 Acre
  useEffect(() => {
    handleInput('acre', 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = (unit, valStr) => {
    const val = parseFloat(valStr);
    
    if (isNaN(val) || val < 0) {
      setValues({ [unit]: valStr });
      setBaseSqft(0);
      return;
    }

    const sqft = val * unitToSqFt[unit];
    setBaseSqft(sqft);

    const newValues = {};
    Object.keys(unitToSqFt).forEach((k) => {
      if (k === unit) {
        newValues[k] = valStr; // keep raw input for the active field
      } else {
        newValues[k] = formatNumber(sqft / unitToSqFt[k]);
      }
    });
    setValues(newValues);
  };

  const getVisual = (sqft, divisor) => {
    const v = sqft / divisor;
    if (v === 0) return '0';
    if (v > 0 && v < 0.1) return v.toFixed(2);
    return Math.round(v).toLocaleString('en-IN');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Land Area Conversion Matrix", 20, 20);
    
    doc.setFontSize(12);
    doc.text("Current Conversion State:", 20, 35);
    
    let y = 45;
    Object.keys(unitToSqFt).forEach(key => {
      let val = values[key] || "0";
      doc.text(`${unitLabels[key]}: ${val}`, 25, y);
      y += 8;
    });
    
    y += 10;
    doc.setFontSize(10);
    doc.text("Disclaimer: Regional units like Bigha vary greatly by state. Please verify local", 20, y);
    doc.text("standards before conducting any legal transactions.", 20, y + 5);
    doc.text("Generated by LLMS.TXT Analyzer Tools", 20, y + 20);
    
    doc.save("Land_Conversion.pdf");
  };

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{toolData.heroTitle}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{toolData.heroSubtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {Object.keys(unitToSqFt).map(unit => (
          <div key={unit} className="glass-panel p-4 rounded-xl transition-all">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{unitLabels[unit]}</label>
            <input 
              type="number"
              step="any"
              min="0"
              value={values[unit] || ''}
              onChange={(e) => handleInput(unit, e.target.value)}
              placeholder="0"
              className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 font-bold text-center outline-none"
            />
          </div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-2xl mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Visual Area Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-xl border border-slate-200 flex flex-col items-center text-center gap-3">
            <div className="p-4 bg-blue-100 rounded-full text-blue-600 shadow-sm">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <span className="block text-4xl font-bold text-blue-600 drop-shadow-sm">{getVisual(baseSqft, 160)}</span>
              <span className="text-sm font-medium text-slate-500 mt-1 block">Car Parking Spaces<br/>(~160 sq ft)</span>
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-xl border border-slate-200 flex flex-col items-center text-center gap-3">
            <div className="p-4 bg-emerald-100 rounded-full text-emerald-600 shadow-sm">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <span className="block text-4xl font-bold text-emerald-600 drop-shadow-sm">{getVisual(baseSqft, 2800)}</span>
              <span className="text-sm font-medium text-slate-500 mt-1 block">Tennis Courts<br/>(~2,800 sq ft)</span>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-xl border border-slate-200 flex flex-col items-center text-center gap-3">
            <div className="p-4 bg-amber-100 rounded-full text-amber-600 shadow-sm">
              <LayoutGrid className="w-8 h-8" />
            </div>
            <div>
              <span className="block text-4xl font-bold text-amber-600 drop-shadow-sm">{getVisual(baseSqft, 57600)}</span>
              <span className="text-sm font-medium text-slate-500 mt-1 block">Football Fields<br/>(~57,600 sq ft)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl mb-8">
        <h4 className="text-amber-600 font-bold mb-2">Note on State-Specific Bigha:</h4>
        <p className="text-slate-700 text-sm mb-3">The Bigha calculation uses the Standard/UP Pucca Bigha (27,225 sq ft). Bigha sizes vary wildly across India:</p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-2">
          <li><strong className="text-slate-700">UP/Punjab/Haryana (Pucca Bigha):</strong> 27,225 sq ft</li>
          <li><strong className="text-slate-700">UP (Kaccha Bigha):</strong> 9,075 sq ft (1/3 of Pucca Bigha)</li>
          <li><strong className="text-slate-700">Rajasthan:</strong> Approx 17,424 sq ft or 27,225 sq ft depending on district</li>
          <li><strong className="text-slate-700">West Bengal:</strong> 14,400 sq ft (1/3 Acre)</li>
          <li><strong className="text-slate-700">Bihar/Assam:</strong> Approx 14,400 to 27,225 sq ft depending on local standard</li>
        </ul>
        <p className="text-slate-700 text-sm mt-3 italic">Always verify the local standard before finalizing legal transactions.</p>
      </div>

      <div className="flex justify-center">
        <button onClick={downloadPDF} className="flex justify-center items-center gap-2 glass-button-primary px-8 py-4 rounded-xl font-bold text-lg transition-colors">
          <Download className="w-5 h-5" /> Download PDF Report
        </button>
      </div>
    </div>
    
    <ToolSEOContent 
      toolName={toolData.toolName}
      steps={toolData.steps}
      whatIs={toolData.whatIs}
      useCases={toolData.useCases}
      faqs={toolData.faqs}
    />
    </>
  );
};

export default LandUnitConverter;
