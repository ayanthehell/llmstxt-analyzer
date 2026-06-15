import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import { Download, Copy, Check, Calculator, ArrowRightLeft, Search, LayoutGrid, TrendingUp, Users, Building2, Code2, ShoppingBag } from 'lucide-react';
import ToolSEOContent from '../../components/ToolSEOContent';
import { useCMS } from '../../components/CMSContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const formatCurrency = (num) => {
  return parseFloat(num).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
};

const GstCalculator = () => {
  const { cmsData } = useCMS();
  const toolData = cmsData?.gstCalculator || {
    toolName: "GST Calculator",
    heroTitle: "GST Calculator",
    heroSubtitle: "Quickly calculate exclusive and inclusive GST amounts instantly as you type.",
    steps: [
      { icon: "Search", title: "Enter Amount", description: "Input the base amount or the total amount including GST." },
      { icon: "LayoutGrid", title: "Select Tax Slab", description: "Choose the applicable GST rate (5%, 12%, 18%, or 28%)." },
      { icon: "TrendingUp", title: "View Breakdown", description: "Instantly see the CGST, SGST, IGST, and the final total amount." }
    ],
    whatIs: {
      title: "What is Goods and Services Tax (GST)?",
      subtitle: "India's comprehensive indirect tax system.",
      p1: "<strong>Goods and Services Tax (GST)</strong> is an indirect tax used in India on the supply of goods and services.",
      card1Title: "Exclusive vs Inclusive GST",
      card1Text: "<strong>Exclusive GST</strong> means the tax is added to the base price. <strong>Inclusive GST</strong> means the tax is already included.",
      card2Title: "CGST, SGST, and IGST",
      card2Text: "Intra-state sales split GST equally into CGST and SGST.",
      howItWorksTitle: "How to Calculate GST?",
      howItWorksP1: "The mathematical formulas for GST calculation are:",
      points: [
        { title: "Add GST", desc: "GST Amount = (Original Cost × GST%) / 100" },
        { title: "Net Price", desc: "Original Cost + GST Amount" },
        { title: "Remove GST", desc: "GST Amount = Total Cost - [Total Cost × (100 / (100 + GST%))]" }
      ]
    },
    useCases: [
      { icon: "Users", title: "Consumers", desc: "Verify bills and understand how much tax you pay." },
      { icon: "Building2", title: "Business Owners", desc: "Calculate base price and tax components for generating invoices." },
      { icon: "Code2", title: "Accountants", desc: "Split inclusive amounts into CGST/SGST for bookkeeping." },
      { icon: "ShoppingBag", title: "Retailers", desc: "Determine final selling price of goods by adding GST." }
    ],
    faqs: [
      { question: "What are the different GST slabs in India?", answer: "The primary GST slabs are 5%, 12%, 18%, and 28%. Some goods are exempt (0%)." },
      { question: "When do I charge IGST instead of CGST/SGST?", answer: "Sell in the same state: CGST + SGST. Sell in a different state: full IGST." },
      { question: "Can I claim Input Tax Credit (ITC)?", answer: "Yes, registered businesses can claim ITC on GST paid on purchases." }
    ]
  };

  const [mode, setMode] = useState('add');
  const [amount, setAmount] = useState('');
  const [gstRate, setGstRate] = useState(18);

  const [baseAmount, setBaseAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [history, setHistory] = useState([]);
  const [copiedField, setCopiedField] = useState(null);

  const calculateGST = useCallback((inputAmount, inputRate, inputMode, addToHistory = false) => {
    const val = parseFloat(inputAmount);
    if (!val || isNaN(val)) {
      setBaseAmount(0);
      setGstAmount(0);
      setCgst(0);
      setSgst(0);
      setTotalAmount(0);
      return;
    }

    let bAmount, gAmount, tAmount;

    if (inputMode === 'add') {
      bAmount = val;
      gAmount = (val * inputRate) / 100;
      tAmount = val + gAmount;
    } else {
      tAmount = val;
      bAmount = val / (1 + (inputRate / 100));
      gAmount = tAmount - bAmount;
    }

    const halfGst = gAmount / 2;

    setBaseAmount(bAmount);
    setGstAmount(gAmount);
    setCgst(halfGst);
    setSgst(halfGst);
    setTotalAmount(tAmount);

    if (addToHistory) {
      setHistory(prev => {
        const newEntry = { amount: val, rate: inputRate, mode: inputMode, total: tAmount };
        const newHistory = [newEntry, ...prev];
        if (newHistory.length > 5) newHistory.pop();
        return newHistory;
      });
    }
  }, []);

  useEffect(() => {
    // We only trigger history save on explicit mode/rate change or debounced input, but for React it's easier to just calculate immediately
    const handler = setTimeout(() => {
      if (amount) calculateGST(amount, gstRate, mode, true);
    }, 1000);

    // Calculate immediately without history
    calculateGST(amount, gstRate, mode, false);

    return () => clearTimeout(handler);
  }, [amount, gstRate, mode, calculateGST]);

  const handleCopy = (value, fieldName) => {
    navigator.clipboard.writeText(value.toFixed(2));
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("GST Calculation Report", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Mode: ${mode === 'add' ? 'Added GST (Exclusive)' : 'Removed GST (Inclusive)'}`, 20, 35);
    doc.text(`GST Rate: ${gstRate}%`, 20, 45);
    
    doc.text(`Base Amount: Rs. ${formatCurrency(baseAmount)}`, 20, 60);
    doc.text(`Total GST Amount: Rs. ${formatCurrency(gstAmount)}`, 20, 70);
    doc.text(`CGST (50%): Rs. ${formatCurrency(cgst)}`, 20, 80);
    doc.text(`SGST (50%): Rs. ${formatCurrency(sgst)}`, 20, 90);
    doc.text(`Net Total Amount: Rs. ${formatCurrency(totalAmount)}`, 20, 105);
    
    doc.setFontSize(10);
    doc.text("Generated by LLMS.TXT Analyzer Tools", 20, 130);
    
    doc.save("GST_Calculation.pdf");
  };

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{toolData.heroTitle}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{toolData.heroSubtitle}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Input Section */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex rounded-lg overflow-hidden border border-slate-200 mb-6 bg-white/60 dark:bg-slate-800/50 backdrop-blur-md p-1 gap-1">
            <button 
              onClick={() => setMode('add')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'add' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}
            >
              Add GST (Exclusive)
            </button>
            <button 
              onClick={() => setMode('remove')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'remove' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}
            >
              Remove GST (Inclusive)
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Base Amount (₹)</label>
              <div className="flex items-center glass-input rounded-xl overflow-hidden transition-colors">
                <span className="px-4 text-slate-500 font-bold bg-transparent self-stretch flex items-center border-r border-slate-200">₹</span>
                <input 
                  type="number" 
                  placeholder="Enter amount" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="w-full bg-transparent text-slate-900 font-bold px-4 py-3 outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select GST Slab</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[5, 12, 18, 28].map(rate => (
                  <button
                    key={rate}
                    onClick={() => setGstRate(rate)}
                    className={`py-3 rounded-xl font-bold transition-all ${gstRate === rate ? 'bg-blue-600 text-white shadow-md' : 'glass-input text-slate-700 hover:bg-white/60 dark:bg-slate-800/50 backdrop-blur-md'}`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {totalAmount > 0 && (
              <div className="mt-8 h-48 w-full flex justify-center">
                <Doughnut 
                  data={{
                    labels: ['Base Amount', 'CGST', 'SGST'],
                    datasets: [{
                      data: [baseAmount, cgst, sgst],
                      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
                      borderWidth: 0,
                    }]
                  }}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#cbd5e1' } } } }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Visual Results & History */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Base Amount:</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 font-bold">₹{formatCurrency(baseAmount)}</span>
                  <button onClick={() => handleCopy(baseAmount, 'base')} className="text-slate-500 hover:text-blue-600 transition-colors">
                    {copiedField === 'base' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Total GST:</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 font-bold">₹{formatCurrency(gstAmount)}</span>
                  <button onClick={() => handleCopy(gstAmount, 'gst')} className="text-slate-500 hover:text-blue-600 transition-colors">
                    {copiedField === 'gst' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pl-4 border-l-2 border-slate-200 text-sm">
                <span className="text-slate-600">CGST (50%):</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">₹{formatCurrency(cgst)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pl-4 border-l-2 border-slate-200 text-sm pb-4 border-b border-slate-200">
                <span className="text-slate-600">SGST (50%):</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">₹{formatCurrency(sgst)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-800 font-bold text-lg">Net Total Amount:</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-blue-600">₹{formatCurrency(totalAmount)}</span>
                  <button onClick={() => handleCopy(totalAmount, 'total')} className="text-slate-500 hover:text-blue-600 transition-colors">
                    {copiedField === 'total' ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button onClick={downloadPDF} className="w-full flex justify-center items-center gap-2 glass-button-primary px-4 py-4 rounded-xl font-bold text-lg mt-6">
              <Download className="w-5 h-5" /> Download Invoice PDF
            </button>
          </div>

          {/* History */}
          <div className="glass-panel p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-slate-700 mb-4">Recent Calculations</h4>
            {history.length === 0 ? (
              <p className="text-center text-slate-9000 text-sm py-4">No history yet. Start typing to calculate.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="pb-2 font-medium">Input</th>
                      <th className="pb-2 font-medium text-center">Rate</th>
                      <th className="pb-2 font-medium text-center">Mode</th>
                      <th className="pb-2 font-medium">Net Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {history.map((h, i) => (
                      <tr key={i} className="text-slate-700">
                        <td className="py-3">₹{formatCurrency(h.amount)}</td>
                        <td className="py-3 text-center">{h.rate}%</td>
                        <td className="py-3 text-center text-xs">
                          <span className={`px-2 py-1 rounded-full font-bold ${h.mode === 'add' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {h.mode === 'add' ? 'Added' : 'Removed'}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-slate-900">₹{formatCurrency(h.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
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

export default GstCalculator;
