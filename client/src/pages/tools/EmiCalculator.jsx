import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, PiggyBank } from 'lucide-react';
import ToolSEOContent from '../../components/ToolSEOContent';
import { useCMS } from '../../components/CMSContext';

const formatCurrency = (num) => {
  return parseFloat(num).toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

const EmiCalculator = () => {
  const { cmsData } = useCMS();
  const toolData = cmsData?.emiCalculator || {
    toolName: "EMI Calculator",
    heroTitle: "EMI Calculator & Pre-payment Simulator",
    heroSubtitle: "Interactive loan calculator with real-time amortization, visual breakdowns, and a pre-payment savings simulator.",
    steps: [
      { icon: "Search", title: "Enter Loan Details", description: "Input your total loan amount, interest rate, and the tenure in years." },
      { icon: "LayoutGrid", title: "View Payment Schedule", description: "We instantly generate your monthly EMI, total interest, and a full amortization table." },
      { icon: "TrendingUp", title: "Simulate Savings", description: "Enter extra monthly or yearly payments to see how much interest and time you can save." }
    ],
    whatIs: {
      title: "What is an Equated Monthly Installment (EMI)?",
      subtitle: "Understand how your loan payments are calculated.",
      p1: "An <strong>Equated Monthly Installment (EMI)</strong> is a fixed payment made by a borrower to a lender on a specified date each calendar month. EMIs are applied to both interest and principal each month so that over a specified number of years, the loan is paid off in full.",
      card1Title: "Plan Your Finances",
      card1Text: "Knowing your exact monthly obligation helps you budget your expenses.",
      card2Title: "Save on Interest",
      card2Text: "By simulating prepayments, you can see how even small extra payments can save you lakhs in interest.",
      howItWorksTitle: "How is EMI Calculated?",
      howItWorksP1: "The mathematical formula for calculating EMI is: <strong>E = P x R x (1+R)^N / [(1+R)^N-1]</strong> where:",
      points: [
        { title: "P", desc: "Principal loan amount" },
        { title: "R", desc: "Rate of interest calculated on a monthly basis" },
        { title: "N", desc: "Loan tenure in months" }
      ]
    },
    useCases: [
      { icon: "Users", title: "Home Buyers", desc: "Calculate exact monthly payments before taking a mortgage." },
      { icon: "Building2", title: "Real Estate Agents", desc: "Help clients understand their financial commitments." },
      { icon: "Code2", title: "Auto Loan Borrowers", desc: "Compare car loan offers from different banks." },
      { icon: "ShoppingBag", title: "Personal Loans", desc: "Figure out how fast you can pay off high-interest debt." }
    ],
    faqs: [
      { question: "Does my EMI change if the interest rate changes?", answer: "If you have a fixed-rate loan, your EMI stays the same. Floating-rate loans may adjust your tenure or EMI." },
      { question: "Is it better to reduce EMI or tenure when making prepayments?", answer: "Mathematically, keeping your EMI the same and reducing your tenure saves you the most money on total interest." },
      { question: "What is an Amortization Schedule?", answer: "An amortization schedule is a complete table of periodic loan payments, showing principal and interest." }
    ]
  };

  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(5);

  const [extraEmi, setExtraEmi] = useState(0);
  const [yearlyLump, setYearlyLump] = useState(0);

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [amortization, setAmortization] = useState([]);

  const [simTotalInterest, setSimTotalInterest] = useState(0);
  const [monthsSaved, setMonthsSaved] = useState(0);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenureYears]);

  useEffect(() => {
    simulatePrepayment();
  }, [extraEmi, yearlyLump, emi, totalInterest, loanAmount, interestRate, tenureYears]);

  const calculateEMI = () => {
    const p = parseFloat(loanAmount) || 0;
    const rAnnual = parseFloat(interestRate) || 0;
    const years = parseInt(tenureYears) || 0;

    if (p === 0 || rAnnual === 0 || years === 0) {
      setEmi(0);
      setTotalInterest(0);
      setAmortization([]);
      return;
    }

    const n = years * 12;
    const r = rAnnual / 12 / 100;

    const monthlyEmi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyEmi * n;
    const tInterest = totalPayment - p;

    setEmi(monthlyEmi);
    setTotalInterest(tInterest);

    let balance = p;
    let newAmortization = [];
    for (let i = 1; i <= n; i++) {
      let interestForMonth = balance * r;
      let principalForMonth = monthlyEmi - interestForMonth;
      balance -= principalForMonth;
      if (balance < 0) balance = 0;

      newAmortization.push({
        month: i,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: balance
      });
    }
    setAmortization(newAmortization);
  };

  const simulatePrepayment = () => {
    const p = parseFloat(loanAmount) || 0;
    const rAnnual = parseFloat(interestRate) || 0;
    const r = rAnnual / 12 / 100;
    
    const extraM = parseFloat(extraEmi) || 0;
    const extraY = parseFloat(yearlyLump) || 0;

    if (extraM === 0 && extraY === 0) {
      setSimTotalInterest(totalInterest);
      setMonthsSaved(0);
      return;
    }

    let balance = p;
    let newTotalInterest = 0;
    let monthCount = 0;
    let maxMonths = 1200;

    while (balance > 0 && monthCount < maxMonths) {
      monthCount++;
      let interestForMonth = balance * r;
      newTotalInterest += interestForMonth;
      
      let payment = emi + extraM;
      if (monthCount % 12 === 0) payment += extraY;
      
      let principalForMonth = payment - interestForMonth;
      if (principalForMonth > balance) principalForMonth = balance;
      balance -= principalForMonth;
    }

    setSimTotalInterest(newTotalInterest);
    const originalMonths = parseInt(tenureYears) * 12;
    setMonthsSaved(Math.max(0, originalMonths - monthCount));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("EMI Calculation Report", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Loan Amount: Rs. ${formatCurrency(loanAmount)}`, 14, 35);
    doc.text(`Interest Rate: ${interestRate}% p.a.`, 14, 45);
    doc.text(`Tenure: ${tenureYears} Years`, 14, 55);
    
    doc.setFontSize(14);
    doc.text(`Monthly EMI: Rs. ${formatCurrency(emi)}`, 14, 75);
    doc.text(`Total Interest Payable: Rs. ${formatCurrency(totalInterest)}`, 14, 85);
    
    doc.setFontSize(10);
    doc.text("Amortization Table:", 14, 110);

    const tableData = amortization.map(row => [
      row.month,
      `Rs. ${formatCurrency(row.principal)}`,
      `Rs. ${formatCurrency(row.interest)}`,
      `Rs. ${formatCurrency(row.balance)}`
    ]);

    doc.autoTable({
      startY: 115,
      head: [['Month', 'Principal', 'Interest', 'Balance']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 102, 204] }
    });

    const finalY = doc.lastAutoTable.finalY || 115;
    doc.text("Generated by LLMS.TXT Analyzer Tools", 14, finalY + 10);
    doc.save("EMI_Calculation.pdf");
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
                <label className="text-sm font-semibold text-slate-700">Loan Amount</label>
                <div className="flex items-center glass-input rounded-xl px-4 py-2">
                  <span className="text-slate-500 font-medium mr-2">₹</span>
                  <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="bg-transparent text-slate-900 font-bold text-right outline-none w-24" />
                </div>
              </div>
              <input type="range" min="100000" max="50000000" step="50000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full accent-blue-500" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">Interest Rate</label>
                <div className="flex items-center glass-input rounded-xl px-4 py-2">
                  <input type="number" value={interestRate} step="0.1" onChange={(e) => setInterestRate(e.target.value)} className="bg-transparent text-slate-900 font-bold text-right outline-none w-16" />
                  <span className="text-slate-500 font-medium ml-2">%</span>
                </div>
              </div>
              <input type="range" min="1" max="30" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full accent-blue-500" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">Loan Tenure</label>
                <div className="flex items-center glass-input rounded-xl px-4 py-2">
                  <input type="number" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)} className="bg-transparent text-slate-900 font-bold text-right outline-none w-16" />
                  <span className="text-slate-500 font-medium ml-2">Yrs</span>
                </div>
              </div>
              <input type="range" min="1" max="30" step="1" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)} className="w-full accent-blue-500" />
            </div>
          </div>
        </div>

        {/* Visual Results */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
          <div className="text-center mb-6">
            <p className="text-slate-500 text-sm font-bold tracking-wide uppercase mb-1">Monthly EMI</p>
            <p className="text-5xl font-bold text-blue-600 drop-shadow-sm">₹{formatCurrency(emi)}</p>
          </div>
          
          <div className="w-full max-w-[250px] aspect-square relative mb-6">
            <Doughnut 
              data={{
                labels: ['Principal', 'Interest'],
                datasets: [{
                  data: [loanAmount, totalInterest],
                  backgroundColor: ['#3b82f6', '#ef4444'],
                  borderWidth: 0,
                }]
              }}
              options={{ cutout: '70%', plugins: { legend: { display: false } } }}
            />
          </div>

          <div className="w-full flex justify-between text-sm font-semibold">
            <div className="text-slate-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              Principal: ₹{formatCurrency(loanAmount)}
            </div>
            <div className="text-slate-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              Interest: ₹{formatCurrency(totalInterest)}
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Section */}
      <div className="glass-panel p-8 rounded-2xl mb-12 border border-emerald-200 bg-emerald-50">
        <h3 className="text-xl font-bold text-emerald-600 flex items-center gap-2 mb-2">
          <PiggyBank className="w-6 h-6" /> Pre-payment Savings Simulator
        </h3>
        <p className="text-slate-600 text-sm mb-6">See how much interest you can save by making extra payments.</p>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Extra EMI Per Month (₹)</label>
              <input type="number" value={extraEmi} onChange={(e) => setExtraEmi(e.target.value)} className="w-full glass-input rounded-lg px-4 py-2 text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Yearly Lump Sum Payment (₹)</label>
              <input type="number" value={yearlyLump} onChange={(e) => setYearlyLump(e.target.value)} className="w-full glass-input rounded-lg px-4 py-2 text-slate-900" />
            </div>

            {(extraEmi > 0 || yearlyLump > 0) && (
              <div className="bg-emerald-100 text-emerald-700 border border-emerald-200 p-4 rounded-lg font-semibold text-center mt-6">
                You save ₹{formatCurrency(totalInterest - simTotalInterest)} in interest and finish {monthsSaved} months earlier!
              </div>
            )}
          </div>
          
          <div className="h-48">
            <Bar 
              data={{
                labels: ['Total Interest'],
                datasets: [
                  { label: 'Standard', data: [totalInterest], backgroundColor: '#ef4444' },
                  { label: 'With Pre-payment', data: [simTotalInterest], backgroundColor: '#10b981' }
                ]
              }}
              options={{ responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' } }, x: { grid: { display: false }, ticks: { color: '#64748b' } } }, plugins: { legend: { labels: { color: '#475569' } } } }}
            />
          </div>
        </div>
      </div>

      {/* Amortization Table */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-bold text-slate-900">Amortization Table (Standard EMI)</h4>
          <button onClick={downloadPDF} className="flex items-center gap-2 glass-button-primary px-5 py-2.5 rounded-lg font-medium">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        <div className="overflow-x-auto max-h-[400px] border border-slate-200/50 rounded-lg custom-scrollbar">
          <table className="w-full text-right text-sm">
            <thead className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md sticky top-0 text-slate-700">
              <tr>
                <th className="p-3 text-center border-b border-slate-200 font-semibold">Month</th>
                <th className="p-3 border-b border-slate-200 font-semibold">Principal</th>
                <th className="p-3 border-b border-slate-200 font-semibold">Interest</th>
                <th className="p-3 border-b border-slate-200 font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {amortization.map((row) => (
                <tr key={row.month} className="hover:bg-white/60 dark:bg-slate-800/50 backdrop-blur-md/30 text-slate-600">
                  <td className="p-3 text-center border-r border-slate-200/50">{row.month}</td>
                  <td className="p-3 border-r border-slate-200/50">₹{formatCurrency(row.principal)}</td>
                  <td className="p-3 border-r border-slate-200/50">₹{formatCurrency(row.interest)}</td>
                  <td className="p-3 text-slate-700 font-medium">₹{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default EmiCalculator;
