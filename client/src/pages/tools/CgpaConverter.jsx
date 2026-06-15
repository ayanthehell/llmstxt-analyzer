import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Download, Plus, X, GraduationCap, Search, LayoutGrid, TrendingUp, Users, Building2, Code2, ShoppingBag } from 'lucide-react';
import ToolSEOContent from '../../components/ToolSEOContent';
import { useCMS } from '../../components/CMSContext';

const uniSystems = {
  general: { name: 'General 10-Point / CBSE / AICTE', c2p: 'CGPA × 9.5', p2c: '% / 9.5' },
  anna: { name: 'Anna University (Multiplier 10)', c2p: 'CGPA × 10', p2c: '% / 10' },
  vtu: { name: 'VTU (Visvesvaraya Tech Uni)', c2p: '(CGPA - 0.75) × 10', p2c: '(% / 10) + 0.75' },
  mumbai: { name: 'Mumbai University (10-Point)', c2p: '(CGPA × 7.1) + 11', p2c: '(% - 11) / 7.1' },
  '7point': { name: 'General 7-Point Scale', c2p: '(CGPA / 7) × 100', p2c: '(% / 100) × 7' }
};

const getGrade = (percentage) => {
  if (percentage >= 90) return 'Outstanding (O)';
  if (percentage >= 80) return 'Excellent (A+)';
  if (percentage >= 70) return 'Very Good (A)';
  if (percentage >= 60) return 'Good (B+)';
  if (percentage >= 50) return 'Above Average (B)';
  if (percentage >= 40) return 'Average (C)';
  return 'Fail (F)';
};

const CgpaConverter = () => {
  const { cmsData } = useCMS();
  const toolData = cmsData?.cgpaConverter || {
    toolName: "CGPA to Percentage Converter",
    heroTitle: "CGPA ↔ Percentage Converter",
    heroSubtitle: "Real-time conversion with visual grade tracking and Semester-wise CGPA calculation.",
    steps: [
      { icon: "Search", title: "Enter CGPA", description: "Input your Cumulative Grade Point Average (CGPA) from your university or school." },
      { icon: "LayoutGrid", title: "Select Multiplier", description: "Choose the standard 9.5 multiplier (CBSE) or enter a custom university formula." },
      { icon: "TrendingUp", title: "Get Percentage", description: "Instantly convert your CGPA into a percentage required for resumes and applications." }
    ],
    whatIs: {
      title: "What is CGPA?",
      subtitle: "Cumulative Grade Point Average explained.",
      p1: "<strong>CGPA</strong> stands for Cumulative Grade Point Average. It is an educational grading system used in schools and universities.",
      card1Title: "Why Convert CGPA?",
      card1Text: "Many employers and foreign universities require academic scores to be submitted as a flat percentage.",
      card2Title: "The 9.5 Multiplier",
      card2Text: "CBSE officially recommends multiplying CGPA by 9.5 to calculate approximate percentage.",
      howItWorksTitle: "How to Calculate Percentage from CGPA?",
      howItWorksP1: "The standard formula used by most Indian institutions is:",
      points: [
        { title: "CBSE Formula", desc: "Percentage = CGPA × 9.5" },
        { title: "University Formula", desc: "Often Percentage = (CGPA × 10) - 7.5" },
        { title: "SGPA to CGPA", desc: "CGPA is the average of all your Semester Grade Point Averages (SGPAs)." }
      ]
    },
    useCases: [
      { icon: "Users", title: "Students", desc: "Convert school CGPA to percentage for college admission forms." },
      { icon: "Building2", title: "Job Seekers", desc: "Fill out standardized employment applications." },
      { icon: "Code2", title: "Study Abroad", desc: "Convert Indian CGPA formats for foreign evaluations." },
      { icon: "ShoppingBag", title: "Teachers", desc: "Quickly convert entire batch scorecards." }
    ],
    faqs: [
      { question: "Is the 9.5 multiplier accurate for all universities?", answer: "No. While CBSE strictly uses 9.5, universities have specific conversion formulas." },
      { question: "What is the maximum CGPA?", answer: "In India, the maximum CGPA is usually 10.0." },
      { question: "Can a 10 CGPA equal 100%?", answer: "Using standard CBSE formula, 10 CGPA = 95%." }
    ]
  };

  const [mode, setMode] = useState('c2p'); // c2p, p2c, sem
  const [system, setSystem] = useState('general');
  const [inputValue, setInputValue] = useState('');
  
  const [semesters, setSemesters] = useState([
    { id: 1, cr: '', sgpa: '' },
    { id: 2, cr: '', sgpa: '' }
  ]);

  const [resultVal, setResultVal] = useState('0');
  const [calculatedPercentage, setCalculatedPercentage] = useState(0);
  const [calculatedCgpa, setCalculatedCgpa] = useState(0);
  const [appliedFormula, setAppliedFormula] = useState('');

  useEffect(() => {
    let valToConvert = 0;
    
    if (mode === 'sem') {
      let totalCr = 0;
      let totalPoints = 0;
      semesters.forEach(s => {
        const cr = parseFloat(s.cr) || 0;
        const sgpa = parseFloat(s.sgpa) || 0;
        if (cr > 0 && sgpa > 0) {
          totalCr += cr;
          totalPoints += (cr * sgpa);
        }
      });
      if (totalCr > 0) valToConvert = totalPoints / totalCr;
      setCalculatedCgpa(valToConvert);
    } else {
      valToConvert = parseFloat(inputValue) || 0;
      if (mode === 'c2p') setCalculatedCgpa(valToConvert);
    }

    if (valToConvert <= 0) {
      setResultVal(mode === 'p2c' ? '0' : '0%');
      setCalculatedPercentage(0);
      setAppliedFormula(mode === 'p2c' ? uniSystems[system].p2c : uniSystems[system].c2p);
      return;
    }

    let result = 0;
    let pct = 0;

    if (mode === 'c2p' || mode === 'sem') {
      if (system === 'general') { result = valToConvert * 9.5; }
      else if (system === 'anna') { result = valToConvert * 10; }
      else if (system === 'vtu') { result = (valToConvert - 0.75) * 10; }
      else if (system === 'mumbai') { result = (valToConvert * 7.1) + 11; }
      else if (system === '7point') { result = (valToConvert / 7) * 100; }
      
      if (result > 100) result = 100;
      if (result < 0) result = 0;
      
      pct = result;
      setCalculatedPercentage(pct);
      setResultVal(`${result.toFixed(2)}%`);
      setAppliedFormula(`Percentage = ${uniSystems[system].c2p}`);
    } else {
      pct = valToConvert > 100 ? 100 : valToConvert;
      setCalculatedPercentage(pct);
      
      if (system === 'general') { result = valToConvert / 9.5; }
      else if (system === 'anna') { result = valToConvert / 10; }
      else if (system === 'vtu') { result = (valToConvert / 10) + 0.75; }
      else if (system === 'mumbai') { result = (valToConvert - 11) / 7.1; }
      else if (system === '7point') { result = (valToConvert / 100) * 7; }
      
      if (result < 0) result = 0;
      setCalculatedCgpa(result);
      setResultVal(result.toFixed(2));
      setAppliedFormula(`CGPA = ${uniSystems[system].p2c}`);
    }
  }, [mode, system, inputValue, semesters]);

  const handleAddSem = () => {
    setSemesters([...semesters, { id: Date.now(), cr: '', sgpa: '' }]);
  };

  const handleRemoveSem = (id) => {
    setSemesters(semesters.filter(s => s.id !== id));
  };

  const handleSemChange = (id, field, value) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Grade Conversion Report", 20, 20);
    
    doc.setFontSize(14);
    doc.text(`System: ${uniSystems[system].name}`, 20, 35);
    
    let modeName = mode === 'p2c' ? "Percentage to CGPA" : (mode === 'sem' ? "Semester-wise CGPA Calculation" : "CGPA to Percentage");
    doc.text(`Conversion Mode: ${modeName}`, 20, 45);
    
    doc.setFontSize(16);
    if (mode === 'sem') {
      doc.text(`Overall Calculated CGPA: ${calculatedCgpa.toFixed(2)}`, 20, 65);
      doc.text(`Equivalent Percentage: ${calculatedPercentage.toFixed(2)}%`, 20, 75);
      
      let y = 90;
      doc.setFontSize(12);
      doc.text("Semester Breakdown:", 20, y);
      y += 10;
      semesters.forEach((sem, idx) => {
        doc.text(`Sem ${idx + 1} -> Credits: ${sem.cr || 0}, SGPA: ${sem.sgpa || 0}`, 25, y);
        y += 7;
      });
    } else if (mode === 'c2p') {
      doc.text(`Input CGPA: ${parseFloat(inputValue) || 0}`, 20, 65);
      doc.text(`Equivalent Percentage: ${calculatedPercentage.toFixed(2)}%`, 20, 75);
    } else {
      doc.text(`Input Percentage: ${parseFloat(inputValue) || 0}%`, 20, 65);
      doc.text(`Equivalent CGPA: ${calculatedCgpa.toFixed(2)}`, 20, 75);
    }
    
    doc.setFontSize(12);
    doc.text(`Formula Used: ${appliedFormula}`, 20, mode === 'sem' ? 180 : 95);
    doc.text(`Estimated Grade: ${getGrade(calculatedPercentage)}`, 20, mode === 'sem' ? 190 : 105);
    
    doc.setFontSize(10);
    doc.text("Generated by LLMS.TXT Analyzer Tools", 20, mode === 'sem' ? 210 : 125);
    doc.save("Grade_Conversion.pdf");
  };

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{toolData.heroTitle}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{toolData.heroSubtitle}</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl mb-8">
        <div className="flex flex-wrap md:flex-nowrap rounded-lg overflow-hidden border border-slate-200 mb-8 bg-white/60 dark:bg-slate-800/50 backdrop-blur-md p-1 gap-1">
          <button onClick={() => setMode('c2p')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'c2p' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}>CGPA to %</button>
          <button onClick={() => setMode('p2c')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'p2c' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}>% to CGPA</button>
          <button onClick={() => setMode('sem')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'sem' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}>Sem-wise CGPA</button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select University / Board System</label>
          <select 
            value={system} 
            onChange={(e) => setSystem(e.target.value)}
            className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none appearance-none font-medium"
          >
            {Object.entries(uniSystems).map(([key, sys]) => (
              <option key={key} value={key}>{sys.name}</option>
            ))}
          </select>
        </div>

        {mode !== 'sem' ? (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {mode === 'c2p' ? 'Enter CGPA' : 'Enter Percentage (%)'}
            </label>
            <input 
              type="number" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder={mode === 'c2p' ? 'e.g. 8.5' : 'e.g. 85'}
              className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold"
              step="any"
              autoFocus
            />
            <p className="text-xs text-slate-600 mt-2 font-mono">Formula: {mode === 'p2c' ? uniSystems[system].p2c : uniSystems[system].c2p}</p>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-4">Enter Semester Credits & SGPA</label>
            <div className="space-y-3 mb-4">
              {semesters.map((sem, idx) => (
                <div key={sem.id} className="flex items-center gap-3 bg-white/60 dark:bg-slate-800/50 backdrop-blur-md p-2 rounded-xl border border-slate-200">
                  <span className="w-16 font-semibold text-sm text-slate-700 ml-2">Sem {idx + 1}</span>
                  <input 
                    type="number" 
                    value={sem.cr} 
                    onChange={(e) => handleSemChange(sem.id, 'cr', e.target.value)}
                    placeholder="Credits" 
                    className="flex-1 glass-input rounded-lg px-3 py-2 text-sm text-slate-900 outline-none font-medium"
                  />
                  <input 
                    type="number" 
                    value={sem.sgpa} 
                    onChange={(e) => handleSemChange(sem.id, 'sgpa', e.target.value)}
                    placeholder="SGPA" 
                    step="any"
                    className="flex-1 glass-input rounded-lg px-3 py-2 text-sm text-slate-900 outline-none font-medium"
                  />
                  <button onClick={() => handleRemoveSem(sem.id)} className="text-rose-500 hover:text-rose-400 p-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={handleAddSem}
              className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors bg-white"
            >
              <Plus className="w-4 h-4" /> Add Semester
            </button>
          </div>
        )}
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center">
        {mode === 'sem' && (
          <div className="mb-6 pb-6 border-b border-slate-200">
            <p className="text-slate-600 text-sm font-semibold mb-1">Overall Calculated CGPA</p>
            <p className="text-3xl font-bold text-slate-900">{calculatedCgpa.toFixed(2)}</p>
          </div>
        )}
        
        <p className="text-slate-600 text-sm font-semibold mb-1">
          {mode === 'c2p' || mode === 'sem' ? 'Equivalent Percentage' : 'Equivalent CGPA'}
        </p>
        <p className="text-5xl font-bold text-blue-600 drop-shadow-sm mb-8">{resultVal}</p>

        <div className="w-full h-8 bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-full overflow-hidden relative mb-4 shadow-inner border border-slate-200">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 transition-all duration-500 ease-out flex items-center justify-center relative"
            style={{ width: `${calculatedPercentage}%` }}
          >
            {calculatedPercentage > 15 && (
              <span className="text-xs font-bold text-slate-900 whitespace-nowrap px-2 drop-shadow-md">
                {getGrade(calculatedPercentage)}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-8">Formula used: <span className="font-mono text-slate-600 font-bold">{appliedFormula}</span></p>

        <button onClick={downloadPDF} className="w-full sm:w-auto mx-auto flex justify-center items-center gap-2 glass-button-primary px-8 py-3 rounded-xl font-bold transition-colors">
          <Download className="w-4 h-4" /> Download Report PDF
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

export default CgpaConverter;
