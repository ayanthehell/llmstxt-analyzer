import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import { Download, TrendingUp, Search, LayoutGrid, Users, Building2, Code2, ShoppingBag, Settings } from 'lucide-react';
import ToolSEOContent from '../../components/ToolSEOContent';
import { useCMS } from '../../components/CMSContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const formatCurrency = (num) => {
  return parseFloat(num).toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

const SipCalculator = () => {
  const { cmsData } = useCMS();
  const toolData = cmsData?.sipCalculator || {
    toolName: "SIP Calculator",
    heroTitle: "SIP Calculator",
    heroSubtitle: "Estimate mutual fund SIP returns dynamically with Step-up and Inflation adjustments.",
    steps: [
      { icon: "Search", title: "Enter Investment Details", description: "Input your monthly SIP amount, expected return rate, and investment duration." },
      { icon: "LayoutGrid", title: "View Projected Wealth", description: "See a clear breakdown of your total invested amount versus your estimated wealth gain." },
      { icon: "TrendingUp", title: "Analyze the Graph", description: "Use the interactive chart to visualize the power of compounding over time." }
    ],
    whatIs: {
      title: "What is a Systematic Investment Plan (SIP)?",
      subtitle: "The smartest way to build long-term wealth through mutual funds.",
      p1: "A <strong>Systematic Investment Plan (SIP)</strong> allows you to invest a fixed amount regularly (e.g., monthly) into a mutual fund or index fund. It leverages the power of compounding and rupee-cost averaging.",
      card1Title: "Power of Compounding",
      card1Text: "Because your returns generate their own returns over time, starting early multiplies wealth.",
      card2Title: "Rupee Cost Averaging",
      card2Text: "Investing regularly averages out your purchase cost regardless of market highs and lows.",
      howItWorksTitle: "How are SIP Returns Calculated?",
      howItWorksP1: "SIP returns use the future value of an annuity formula: <strong>M = P × ({[1 + i]^n – 1} / i) × (1 + i)</strong> where:",
      points: [
        { title: "M", desc: "Maturity amount or estimated returns" },
        { title: "P", desc: "Amount you invest at regular intervals (monthly)" },
        { title: "i", desc: "Periodic rate of interest (annual rate / 12)" },
        { title: "n", desc: "Total number of payments (months)" }
      ]
    },
    useCases: [
      { icon: "Users", title: "Retail Investors", desc: "Calculate potential future wealth to set realistic retirement goals." },
      { icon: "Building2", title: "Financial Advisors", desc: "Show clients the long-term benefits of disciplined investing." },
      { icon: "Code2", title: "Young Professionals", desc: "Understand how starting early creates a massive difference." },
      { icon: "ShoppingBag", title: "Goal Planners", desc: "Determine how much to invest monthly for a house or education." }
    ],
    faqs: [
      { question: "Are SIP returns guaranteed?", answer: "No, SIPs in mutual funds are subject to market risks. Equity funds typically offer 10-15% long-term returns." },
      { question: "Can I stop or pause my SIP?", answer: "Yes, SIPs are flexible. You can pause, stop, or increase your amount anytime without penalties." },
      { question: "What is the best date for SIP deduction?", answer: "The date has negligible impact on long-term returns. Best is 2-3 days after salary credit." }
    ]
  };

  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [durationYears, setDurationYears] = useState(10);

  const [stepUp, setStepUp] = useState(0);
  const [inflationRate, setInflationRate] = useState(6);
  const [adjustInflation, setAdjustInflation] = useState(false);

  const [totalInvested, setTotalInvested] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [totalWealth, setTotalWealth] = useState(0);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, returnRate, durationYears, stepUp, inflationRate, adjustInflation]);

  const calculateSIP = () => {
    const p = parseFloat(monthlyInvestment) || 0;
    const rAnnual = parseFloat(returnRate) || 0;
    const years = parseInt(durationYears) || 0;
    const stepUpRate = parseFloat(stepUp) || 0;
    const infRate = parseFloat(inflationRate) || 0;

    if (p === 0 || rAnnual === 0 || years === 0) {
      setTotalInvested(0);
      setEstimatedReturns(0);
      setTotalWealth(0);
      setChartData({ labels: [], datasets: [] });
      return;
    }

    const i = rAnnual / 12 / 100;
    const infFactor = 1 + (infRate / 100);

    let currentP = p;
    let accumulatedInvested = 0;
    let currentWealth = 0;

    let labels = [];
    let investedData = [];
    let totalData = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        accumulatedInvested += currentP;
        currentWealth = (currentWealth + currentP) * (1 + i);
      }

      let adjustedWealth = currentWealth;
      let adjustedInvested = accumulatedInvested;
      if (adjustInflation) {
        adjustedWealth = currentWealth / Math.pow(infFactor, y);
        adjustedInvested = accumulatedInvested / Math.pow(infFactor, y);
      }

      labels.push(`Year ${y}`);
      investedData.push(adjustedInvested);
      totalData.push(adjustedWealth);

      if (stepUpRate > 0) {
        currentP = currentP * (1 + (stepUpRate / 100));
      }
    }

    const finalInvested = investedData[years - 1];
    const finalWealth = totalData[years - 1];
    const estReturns = finalWealth - finalInvested;

    setTotalInvested(finalInvested);
    setEstimatedReturns(estReturns);
    setTotalWealth(finalWealth);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Total Value',
          data: totalData,
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Amount Invested',
          data: investedData,
          borderColor: '#3b82f6',
          borderWidth: 2,
          fill: false,
          tension: 0.3
        }
      ]
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("SIP Returns Estimation Report", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Initial Monthly Investment: Rs. ${formatCurrency(monthlyInvestment)}`, 20, 35);
    doc.text(`Expected Return Rate: ${returnRate}% p.a.`, 20, 45);
    doc.text(`Time Period: ${durationYears} Years`, 20, 55);
    doc.text(`Step-up Annual Increase: ${stepUp}%`, 20, 65);
    
    if(adjustInflation) {
        doc.setTextColor(133, 100, 4);
        doc.text(`*Values adjusted for ${inflationRate}% inflation`, 20, 75);
        doc.setTextColor(0, 0, 0);
    }
    
    doc.setFontSize(14);
    doc.text(`Total Invested Amount: Rs. ${formatCurrency(totalInvested)}`, 20, 95);
    doc.text(`Estimated Returns: Rs. ${formatCurrency(estimatedReturns)}`, 20, 105);
    doc.text(`Total Value at Maturity: Rs. ${formatCurrency(totalWealth)}`, 20, 115);
    
    doc.setFontSize(10);
    doc.text("Note: Mutual fund investments are subject to market risks. These are estimated returns.", 20, 135);
    doc.text("Generated by LLMS.TXT Analyzer Tools", 20, 145);
    
    doc.save("SIP_Estimation.pdf");
  };

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{toolData.heroTitle}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{toolData.heroSubtitle}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Input Section */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">Monthly Investment</label>
                <div className="flex items-center glass-input rounded-xl px-4 py-2">
                  <span className="text-slate-500 font-medium mr-2">₹</span>
                  <input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} className="bg-transparent text-slate-900 font-bold text-right outline-none w-24" />
                </div>
              </div>
              <input type="range" min="500" max="1000000" step="500" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} className="w-full accent-blue-500" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">Expected Return</label>
                <div className="flex items-center glass-input rounded-xl px-4 py-2">
                  <input type="number" value={returnRate} step="0.5" onChange={(e) => setReturnRate(e.target.value)} className="bg-transparent text-slate-900 font-bold text-right outline-none w-16" />
                  <span className="text-slate-500 font-medium ml-2">%</span>
                </div>
              </div>
              <input type="range" min="1" max="30" step="0.5" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} className="w-full accent-blue-500" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">Time Period</label>
                <div className="flex items-center glass-input rounded-xl px-4 py-2">
                  <input type="number" value={durationYears} onChange={(e) => setDurationYears(e.target.value)} className="bg-transparent text-slate-900 font-bold text-right outline-none w-16" />
                  <span className="text-slate-500 font-medium ml-2">Yrs</span>
                </div>
              </div>
              <input type="range" min="1" max="40" step="1" value={durationYears} onChange={(e) => setDurationYears(e.target.value)} className="w-full accent-blue-500" />
            </div>
            
            {/* Advanced Settings */}
            <div className="mt-8 p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" /> Advanced Settings
              </h4>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Step-up Annual Increase (%)</label>
                  <input type="number" value={stepUp} onChange={(e) => setStepUp(e.target.value)} className="w-full glass-input rounded-lg px-3 py-2 text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Expected Inflation (%)</label>
                  <input type="number" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} className="w-full glass-input rounded-lg px-3 py-2 text-slate-900" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" checked={adjustInflation} onChange={(e) => setAdjustInflation(e.target.checked)} className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-white" />
                Show Inflation Adjusted Returns
              </label>
            </div>

          </div>
        </div>

        {/* Visual Results */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
          <div className="text-center mb-8 w-full">
            <p className="text-slate-500 text-sm font-bold tracking-wide uppercase mb-2">Total Wealth Generated</p>
            <p className="text-5xl font-bold text-emerald-500 mb-8 drop-shadow-sm">₹{formatCurrency(totalWealth)}</p>
            
            <div className="flex justify-between text-sm font-semibold mb-4 px-4 py-3 bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-200">
              <div className="text-slate-600 flex flex-col items-start">
                <span className="text-xs uppercase tracking-wide text-slate-400 mb-1">Invested</span>
                <span className="text-slate-900 text-base">₹{formatCurrency(totalInvested)}</span>
              </div>
              <div className="text-slate-600 flex flex-col items-end">
                <span className="text-xs uppercase tracking-wide text-slate-400 mb-1">Est. Returns</span>
                <span className="text-emerald-600 text-base">₹{formatCurrency(estimatedReturns)}</span>
              </div>
            </div>

            {adjustInflation && (
              <div className="bg-yellow-900/20 text-yellow-500 border border-yellow-700/50 p-2 rounded text-xs font-medium mb-6">
                Values shown are adjusted for inflation (Purchasing Power in today's terms).
              </div>
            )}
          </div>
          
          <div className="w-full h-64 relative mb-6">
            <Line 
              data={chartData}
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#475569', font: { weight: 'bold' } } },
                  tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                  y: { 
                    grid: { color: '#e2e8f0' }, 
                    ticks: { 
                      color: '#64748b',
                      callback: (value) => '₹' + (value / 1000).toFixed(0) + 'k'
                    } 
                  },
                  x: { grid: { display: false }, ticks: { color: '#64748b' } }
                }
              }}
            />
          </div>

          <button onClick={downloadPDF} className="w-full flex justify-center items-center gap-2 glass-button-primary px-4 py-4 rounded-xl font-bold text-lg mt-4">
            <Download className="w-4 h-4" /> Download Report as PDF
          </button>
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

export default SipCalculator;
