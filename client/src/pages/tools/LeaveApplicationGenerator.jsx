import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Download, Copy, PenLine, Search, LayoutGrid, TrendingUp, Users, Building2, Code2, ShoppingBag } from 'lucide-react';
import ToolSEOContent from '../../components/ToolSEOContent';
import { useCMS } from '../../components/CMSContext';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

const LeaveApplicationGenerator = () => {
  const { cmsData } = useCMS();
  const toolData = cmsData?.leaveApplicationGenerator || {
    toolName: "Leave Application Generator",
    heroTitle: "Leave Application Generator",
    heroSubtitle: "Create formal leave letters for office or school with Smart Tone Selection and Live Rich Text Editing.",
    steps: [
      { icon: "Search", title: "Enter Details", description: "Input your name, manager's name, dates, and reason." },
      { icon: "LayoutGrid", title: "Choose Leave Type", description: "Select between Sick Leave, Casual Leave, Annual Leave." },
      { icon: "TrendingUp", title: "Copy or Download PDF", description: "Instantly copy the text for an email or download a PDF." }
    ],
    whatIs: {
      title: "What is a Formal Leave Application?",
      subtitle: "The professional way to request time off from work or school.",
      p1: "A <strong>Leave Application</strong> is a formal written request submitted by an employee or student asking for a temporary absence.",
      card1Title: "Professional Etiquette",
      card1Text: "A well-written leave application shows respect for company policies.",
      card2Title: "HR & Payroll Record",
      card2Text: "Official leave requests are legally required by HR departments.",
      howItWorksTitle: "Types of Leaves in India",
      howItWorksP1: "Most corporate policies categorize leaves into three main buckets:",
      points: [
        { title: "Sick Leave (SL)", desc: "Taken during sudden illness. Often requires a medical certificate." },
        { title: "Casual Leave (CL)", desc: "Taken for urgent personal matters or family events." },
        { title: "Privilege Leave (EL/PL)", desc: "Planned vacations. These leaves are 'earned' over time." }
      ]
    },
    useCases: [
      { icon: "Users", title: "Employees", desc: "Draft professional emails for sudden sick leaves or planned vacations." },
      { icon: "Building2", title: "Students", desc: "Generate perfectly formatted formal letters to submit to your school." },
      { icon: "Code2", title: "Parents", desc: "Draft absence excuse letters on behalf of your children." },
      { icon: "ShoppingBag", title: "HR Teams", desc: "Provide this tool to employees to standardize leave requests." }
    ],
    faqs: [
      { question: "How many days in advance should I apply?", answer: "For planned vacations, apply 15-30 days in advance. For sudden leaves, inform immediately." },
      { question: "Should I mention my specific illness?", answer: "You do not need to overshare medical details." },
      { question: "Can a manager reject my leave application?", answer: "Yes, managers can reject Earned/Privilege leaves due to project deadlines." }
    ]
  };

  const [appName, setAppName] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [recipient, setRecipient] = useState('');
  const [leaveType, setLeaveType] = useState('Medical Leave');
  const [tone, setTone] = useState('formal'); // formal, casual, urgent
  const [fromDateStr, setFromDateStr] = useState('');
  const [toDateStr, setToDateStr] = useState('');
  const [reason, setReason] = useState('');
  
  const [generatedText, setGeneratedText] = useState('');

  useEffect(() => {
    const name = appName || '[Your Name]';
    const desig = designation || '[Your Designation]';
    const comp = company || '[Company/School Name]';
    const recip = recipient || '[Recipient Name]';
    const from = formatDate(fromDateStr) || '[Start Date]';
    const to = formatDate(toDateStr) || '[End Date]';
    const rsn = reason || 'unavoidable circumstances';
    const today = formatDate(new Date().toISOString().split('T')[0]);

    let daysText = from === to ? `on ${from}` : `from ${from} to ${to}`;
    
    let salutation = "Respected Sir/Madam,";
    let opening = `I am writing to formally request a leave of absence ${daysText}. The reason for my leave is that ${rsn}.`;
    let closingContext = `I will ensure that all my pending tasks are updated before I leave. In my absence, I can be reached via phone for any urgent matters.\n\nI request you to kindly approve my leave for the mentioned dates.`;
    let closingSignoff = "Yours sincerely,";

    if (tone === 'casual') {
      salutation = "Hi,";
      opening = `I would like to request leave ${daysText} because ${rsn}.`;
      closingContext = `I will make sure my work is covered while I am away.\n\nPlease let me know if this is approved.`;
      closingSignoff = "Best regards,";
    } else if (tone === 'urgent') {
      salutation = "Dear Sir/Madam,";
      opening = `Please accept this as an urgent notification that I require immediate leave ${daysText} due to ${rsn}.`;
      closingContext = `I apologize for the short notice. I will try to catch up on any missed work as soon as I return.\n\nKindly grant me leave for these dates.`;
      closingSignoff = "Sincerely,";
    }

    const text = `Date: ${today}

To,
${recip},
${comp}

Subject: Application for ${leaveType}

${salutation}

${opening}

${closingContext}

Thank you for your time and consideration.

${closingSignoff}

${name}
${desig}`;

    setGeneratedText(text);

  }, [appName, designation, company, recipient, leaveType, tone, fromDateStr, toDateStr, reason]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText).then(() => {
      alert("Application text copied to clipboard!");
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const lines = doc.splitTextToSize(generatedText, 170); // 210mm width - 40mm margins
    
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(lines, margin, margin);
    
    doc.save("Leave_Application.pdf");
  };

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{toolData.heroTitle}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{toolData.heroSubtitle}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Applicant Name</label>
              <input type="text" value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="e.g. Rahul Sharma" className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Designation / Class</label>
              <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Software Engineer" className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Company / School Name</label>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. ABC Tech Solutions" className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Recipient Name/Title</label>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. The Manager" className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Leave Type</label>
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none appearance-none font-medium">
                <option value="Medical Leave">Medical Leave</option>
                <option value="Personal Leave">Personal/Casual Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
                <option value="Vacation Leave">Vacation/Annual Leave</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Tone Selector</label>
            <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-white/60 dark:bg-slate-800/50 backdrop-blur-md p-1 gap-1">
              <button onClick={() => setTone('formal')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tone === 'formal' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}>Formal</button>
              <button onClick={() => setTone('casual')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tone === 'casual' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}>Casual</button>
              <button onClick={() => setTone('urgent')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tone === 'urgent' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}>Urgent</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">From Date</label>
              <input type="date" value={fromDateStr} onChange={(e) => setFromDateStr(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">To Date</label>
              <input type="date" value={toDateStr} onChange={(e) => setToDateStr(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Specific Reason (Optional)</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows="4" placeholder="e.g. I am suffering from viral fever..." className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none resize-none"></textarea>
          </div>
        </div>

        {/* Live Preview */}
        <div className="sticky top-24 space-y-4">
          <div className="flex items-center gap-2 text-sm text-blue-600 font-bold mb-2">
            <PenLine className="w-4 h-4" /> 
            <span>You can edit the text directly in the preview below before downloading.</span>
          </div>
          
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-md border border-white/50 dark:border-slate-700/50 h-[550px] overflow-y-auto custom-scrollbar">
            <div 
              className="font-serif text-slate-800 whitespace-pre-wrap leading-relaxed outline-none min-h-full text-[15px]"
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => setGeneratedText(e.target.innerText)}
            >
              {generatedText}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button onClick={copyToClipboard} className="flex-1 flex justify-center items-center gap-2 glass-input bg-white text-slate-700 px-4 py-4 rounded-xl font-bold transition-colors">
              <Copy className="w-5 h-5" /> Copy Text
            </button>
            <button onClick={downloadPDF} className="flex-1 flex justify-center items-center gap-2 glass-button-primary px-4 py-4 rounded-xl font-bold transition-colors shadow-lg">
              <Download className="w-5 h-5" /> Download PDF
            </button>
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

export default LeaveApplicationGenerator;
