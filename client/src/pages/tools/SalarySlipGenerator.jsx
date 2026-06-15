import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Building, IndianRupee, Search, LayoutGrid, TrendingUp, Users, Building2, Code2, ShoppingBag } from 'lucide-react';
import ToolSEOContent from '../../components/ToolSEOContent';
import { useCMS } from '../../components/CMSContext';

const formatVal = (val) => {
  const num = parseFloat(val) || 0;
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatMonthYear = (val) => {
  if (!val) return '';
  const d = new Date(val + '-01');
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

const SalarySlipGenerator = () => {
  const { cmsData } = useCMS();
  const toolData = cmsData?.salarySlipGenerator || {
    toolName: "Salary Slip Generator",
    heroTitle: "Salary Slip Generator",
    heroSubtitle: "Generate perfectly formatted payslips with Reverse CTC breakdown and auto-deductions.",
    steps: [
      { icon: "Search", title: "Enter Company & Employee Details", description: "Input the employer's name, employee ID, and designation." },
      { icon: "LayoutGrid", title: "Input Salary Components", description: "Add the Basic Pay, HRA, Allowances, and deductions." },
      { icon: "TrendingUp", title: "Generate & Download PDF", description: "Instantly create a professional, print-ready PDF salary slip." }
    ],
    whatIs: {
      title: "What is a Salary Slip (Payslip)?",
      subtitle: "The official proof of income and employment.",
      p1: "A <strong>Salary Slip</strong> (or Payslip) is a document issued by an employer to an employee every month. It contains a detailed breakdown of the employee's salary components.",
      card1Title: "Proof of Employment",
      card1Text: "It serves as the legal proof of your employment with a company.",
      card2Title: "Financial Documentation",
      card2Text: "Banks mandate the submission of salary slips for loans and credit cards.",
      howItWorksTitle: "Key Components of a Salary Slip",
      howItWorksP1: "A standard Indian salary slip consists of:",
      points: [
        { title: "Basic Pay", desc: "The core of your salary, usually 40-50% of the CTC." },
        { title: "HRA", desc: "House Rent Allowance, partially tax-exempt if you live in a rented home." },
        { title: "Deductions", desc: "Provident Fund (PF), Professional Tax (PT), and Tax Deducted at Source (TDS)." }
      ]
    },
    useCases: [
      { icon: "Users", title: "Small Business Owners", desc: "Generate professional payslips for your employees." },
      { icon: "Building2", title: "Freelancers / Consultants", desc: "Create income proofs for project-based work." },
      { icon: "Code2", title: "HR Professionals", desc: "Quickly draft ad-hoc salary slips." },
      { icon: "ShoppingBag", title: "Startup Founders", desc: "Provide standard documentation to your team." }
    ],
    faqs: [
      { question: "Is this generated salary slip legally valid?", answer: "Yes, if stamped/signed by the authorized employer." },
      { question: "What is CTC vs In-Hand Salary?", answer: "CTC is total cost to company. In-Hand is actual amount credited." },
      { question: "Is it mandatory to provide a salary slip?", answer: "Yes, under various labor laws in India." }
    ]
  };

  const [mode, setMode] = useState('standard'); // standard or ctc
  const [annualCtc, setAnnualCtc] = useState('');

  const [company, setCompany] = useState('ABC Pvt Ltd');
  const [logoBase64, setLogoBase64] = useState(null);
  const [payMonth, setPayMonth] = useState('2024-05');
  const [empName, setEmpName] = useState('John Doe');
  const [empDesig, setEmpDesig] = useState('Software Developer');

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [basic, setBasic] = useState(30000);
  const [hra, setHra] = useState(12000);
  const [ta, setTa] = useState(3000);
  const [otherEarning, setOtherEarning] = useState(5000);

  const [pf, setPf] = useState(1800);
  const [pt, setPt] = useState(200);
  const [tds, setTds] = useState(0);
  const [otherDeduct, setOtherDeduct] = useState(0);

  const gross = (parseFloat(basic) || 0) + (parseFloat(hra) || 0) + (parseFloat(ta) || 0) + (parseFloat(otherEarning) || 0);
  const totalD = (parseFloat(pf) || 0) + (parseFloat(pt) || 0) + (parseFloat(tds) || 0) + (parseFloat(otherDeduct) || 0);
  const net = gross - totalD;

  const calculateCTCBreakdown = () => {
    const ctc = parseFloat(annualCtc) || 0;
    if (ctc <= 0) return;

    const monthlyGross = ctc / 12;
    const calcBasic = Math.round(monthlyGross * 0.50);
    const calcHra = Math.round(calcBasic * 0.40);
    const calcPf = Math.min(Math.round(calcBasic * 0.12), 1800);

    let remainder = monthlyGross - calcBasic - calcHra;
    let calcTa = 0;
    let calcOther = 0;

    if (remainder > 3000) {
      calcTa = 3000;
      calcOther = remainder - 3000;
    } else {
      calcOther = remainder;
    }

    setBasic(calcBasic);
    setHra(calcHra);
    setTa(calcTa);
    setOtherEarning(calcOther);
    setPf(calcPf);
    setPt(200);
    setTds(0);
  };

  const applyAutoDeductions = () => {
    const b = parseFloat(basic) || 0;
    if (b > 0) {
      setPf(Math.min(Math.round(b * 0.12), 1800));
      setPt(200);
    }
  };

  const estimateTDS = (e) => {
    e.preventDefault();
    const annualIncome = gross * 12;
    let estimatedMonthlyTDS = 0;
    
    if (annualIncome > 700000) {
      let taxable = annualIncome - 700000;
      let annualTax = taxable * 0.1; // roughly 10% average
      estimatedMonthlyTDS = Math.round(annualTax / 12);
    }
    
    setTds(estimatedMonthlyTDS);
    alert(`Estimated Monthly TDS: ₹${estimatedMonthlyTDS}\n\n(Note: This is a highly simplified estimation assuming no deductions under the New Tax Regime. Actual TDS may vary.)`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    if (logoBase64) {
      // Add logo to the top left
      // Assume max width/height for logo is 40x20
      doc.addImage(logoBase64, 'PNG', 14, 15, 30, 15, undefined, 'FAST');
    }

    doc.setFontSize(20);
    doc.text(company, 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text(`Payslip for the month of ${formatMonthYear(payMonth)}`, 105, 30, null, null, "center");
    doc.line(14, 35, 196, 35);
    
    // Emp Details
    doc.setFontSize(11);
    doc.text(`Employee Name: ${empName}`, 14, 45);
    doc.text(`Designation: ${empDesig}`, 105, 45);
    
    // Table
    doc.autoTable({
        startY: 55,
        theme: 'grid',
        head: [['Earnings', 'Amount (Rs)', 'Deductions', 'Amount (Rs)']],
        body: [
            ['Basic Salary', formatVal(basic), 'Provident Fund (PF)', formatVal(pf)],
            ['House Rent Allowance', formatVal(hra), 'Professional Tax (PT)', formatVal(pt)],
            ['Transport Allowance', formatVal(ta), 'Income Tax (TDS)', formatVal(tds)],
            ['Other Allowances', formatVal(otherEarning), 'Other Deductions', formatVal(otherDeduct)],
            [{content: 'Gross Earnings', styles: {fontStyle: 'bold'}}, 
             {content: formatVal(gross), styles: {fontStyle: 'bold'}}, 
             {content: 'Total Deductions', styles: {fontStyle: 'bold'}}, 
             {content: formatVal(totalD), styles: {fontStyle: 'bold'}}]
        ],
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
    });
    
    // Net Amount
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Net Payable Amount: Rs. ${formatVal(net)}`, 14, finalY);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("This is a computer generated payslip and does not require a signature.", 14, finalY + 20);
    doc.text("Generated by LLMS.TXT Analyzer Tools", 14, finalY + 30);
    
    doc.save(`Payslip_${empName.replace(/\s/g, "_")}_${payMonth.replace(/\s/g, "_")}.pdf`);
  };

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{toolData.heroTitle}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{toolData.heroSubtitle}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12 items-start">
        {/* Input Section */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-white/60 dark:bg-slate-800/50 backdrop-blur-md p-1 gap-1">
            <button 
              onClick={() => setMode('standard')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'standard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}
            >
              Standard Input
            </button>
            <button 
              onClick={() => setMode('ctc')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'ctc' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}
            >
              CTC to In-Hand Reverse
            </button>
          </div>

          {mode === 'ctc' && (
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
              <label className="block text-sm font-bold text-blue-700 mb-2">Enter Annual CTC (₹)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={annualCtc} 
                  onChange={(e) => setAnnualCtc(e.target.value)}
                  placeholder="e.g. 1200000" 
                  className="flex-1 glass-input rounded-xl px-4 py-3 text-slate-900 outline-none"
                />
                <button onClick={calculateCTCBreakdown} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition-colors">
                  Breakdown
                </button>
              </div>
              <p className="text-xs text-blue-600 font-medium mt-3">Automatically fills Basic, HRA, Allowances, and PF based on standard Indian corporate structures.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Company Name</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Company Logo (Optional)</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Payslip Month</label>
              <input type="month" value={payMonth} onChange={(e) => setPayMonth(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Employee Name</label>
              <input type="text" value={empName} onChange={(e) => setEmpName(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Designation</label>
              <input type="text" value={empDesig} onChange={(e) => setEmpDesig(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
            </div>
          </div>

          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <div>
              <p className="text-sm font-bold text-emerald-700">Smart Deductions (India)</p>
              <p className="text-xs text-emerald-600 font-medium">Auto-calculates PF (12%) & Standard PT (₹200)</p>
            </div>
            <button onClick={applyAutoDeductions} className="bg-emerald-200 hover:bg-emerald-300 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors">Apply</button>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Earnings (₹)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-xs text-slate-600 mb-1">Basic Salary</label><input type="number" value={basic} onChange={(e) => setBasic(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold" /></div>
              <div><label className="block text-xs text-slate-600 mb-1">HRA</label><input type="number" value={hra} onChange={(e) => setHra(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold" /></div>
              <div><label className="block text-xs text-slate-600 mb-1">Transport Allowance</label><input type="number" value={ta} onChange={(e) => setTa(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold" /></div>
              <div><label className="block text-xs text-slate-600 mb-1">Other Allowances</label><input type="number" value={otherEarning} onChange={(e) => setOtherEarning(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold" /></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Deductions (₹)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-xs text-slate-600 mb-1">Provident Fund (PF)</label><input type="number" value={pf} onChange={(e) => setPf(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold text-rose-600" /></div>
              <div><label className="block text-xs text-slate-600 mb-1">Professional Tax (PT)</label><input type="number" value={pt} onChange={(e) => setPt(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold text-rose-600" /></div>
              <div>
                <div className="flex justify-between mb-1"><label className="block text-xs text-slate-600">Income Tax (TDS)</label><button onClick={estimateTDS} className="text-xs text-blue-600 hover:underline font-bold">Estimate</button></div>
                <input type="number" value={tds} onChange={(e) => setTds(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold text-rose-600" />
              </div>
              <div><label className="block text-xs text-slate-600 mb-1">Other Deductions</label><input type="number" value={otherDeduct} onChange={(e) => setOtherDeduct(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold text-rose-600" /></div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="sticky top-24">
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden text-slate-800">
            <div className="p-8">
              <div className="text-center border-b-2 border-slate-200 pb-4 mb-6 relative">
                {logoBase64 && (
                  <img src={logoBase64} alt="Company Logo" className="absolute left-0 top-0 h-12 object-contain" />
                )}
                <h2 className="text-2xl font-bold uppercase tracking-wide">{company || '-'}</h2>
                <p className="text-slate-600 mt-1">Payslip for the month of {formatMonthYear(payMonth) || '-'}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
                <div><span className="font-bold text-slate-600">Employee Name:</span> <br/>{empName || '-'}</div>
                <div><span className="font-bold text-slate-600">Designation:</span> <br/>{empDesig || '-'}</div>
              </div>

              <table className="w-full text-sm border-collapse border border-slate-300 mb-6">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="border border-slate-300 p-2 text-left">Earnings</th>
                    <th className="border border-slate-300 p-2 text-right">Amount (₹)</th>
                    <th className="border border-slate-300 p-2 text-left">Deductions</th>
                    <th className="border border-slate-300 p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2">Basic Salary</td>
                    <td className="border border-slate-300 p-2 text-right">{formatVal(basic)}</td>
                    <td className="border border-slate-300 p-2">Provident Fund (PF)</td>
                    <td className="border border-slate-300 p-2 text-right">{formatVal(pf)}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">House Rent Allowance</td>
                    <td className="border border-slate-300 p-2 text-right">{formatVal(hra)}</td>
                    <td className="border border-slate-300 p-2">Professional Tax (PT)</td>
                    <td className="border border-slate-300 p-2 text-right">{formatVal(pt)}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">Transport Allowance</td>
                    <td className="border border-slate-300 p-2 text-right">{formatVal(ta)}</td>
                    <td className="border border-slate-300 p-2">Income Tax (TDS)</td>
                    <td className="border border-slate-300 p-2 text-right">{formatVal(tds)}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">Other Allowances</td>
                    <td className="border border-slate-300 p-2 text-right">{formatVal(otherEarning)}</td>
                    <td className="border border-slate-300 p-2">Other Deductions</td>
                    <td className="border border-slate-300 p-2 text-right">{formatVal(otherDeduct)}</td>
                  </tr>
                  <tr className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md font-bold">
                    <td className="border border-slate-300 p-2">Gross Earnings</td>
                    <td className="border border-slate-300 p-2 text-right text-emerald-600">{formatVal(gross)}</td>
                    <td className="border border-slate-300 p-2">Total Deductions</td>
                    <td className="border border-slate-300 p-2 text-right text-rose-600">{formatVal(totalD)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border-2 border-slate-200 rounded-xl p-4 text-center mb-6">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-xs block mb-1">Net Payable Amount</span>
                <span className="text-4xl font-bold text-blue-600">₹{formatVal(net)}</span>
              </div>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md p-6 border-t border-slate-200">
              <button onClick={downloadPDF} className="w-full flex justify-center items-center gap-2 glass-button-primary px-4 py-4 rounded-xl font-bold transition-colors shadow-lg">
                <Download className="w-5 h-5" /> Download Professional PDF
              </button>
            </div>
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

export default SalarySlipGenerator;
