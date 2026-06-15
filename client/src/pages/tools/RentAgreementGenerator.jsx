import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import { Download, FileSignature, Copy, Plus, X, FileText, IndianRupee, Search, LayoutGrid, TrendingUp, Users, Building2, Code2, ShoppingBag } from 'lucide-react';
import ToolSEOContent from '../../components/ToolSEOContent';
import { useCMS } from '../../components/CMSContext';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

const addMonths = (dateString, months) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  d.setMonth(d.getMonth() + parseInt(months));
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-IN', options);
};

const SignaturePad = ({ id, label, onClear }) => {
  const canvasRef = useRef(null);
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const draw = (e) => {
      if (!isDrawing) return;
      ctx.strokeStyle = '#2563eb'; // blue ink
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      
      let rect = canvas.getBoundingClientRect();
      let x = e.clientX ? e.clientX - rect.left : e.touches?.[0]?.clientX - rect.left;
      let y = e.clientY ? e.clientY - rect.top : e.touches?.[0]?.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      lastX = x;
      lastY = y;
    };

    const startDraw = (e) => {
      isDrawing = true;
      let rect = canvas.getBoundingClientRect();
      lastX = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
      lastY = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;
    };

    const endDraw = () => { isDrawing = false; };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseout', endDraw);

    canvas.addEventListener('touchstart', (e) => { startDraw(e); e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { draw(e); e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    return () => {
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', endDraw);
      canvas.removeEventListener('mouseout', endDraw);
    };
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (onClear) onClear();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Calculate aspect ratio to fit image into canvas
          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.min(hRatio, vRatio);
          const centerShift_x = (canvas.width - img.width * ratio) / 2;
          const centerShift_y = (canvas.height - img.height * ratio) / 2;
          ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 p-4 rounded-xl text-center">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <canvas 
        id={id}
        ref={canvasRef} 
        width="300" 
        height="120" 
        className="bg-white border border-slate-200 shadow-sm rounded-lg w-full max-w-full cursor-crosshair mb-3 touch-none"
      />
      <div className="flex gap-2 justify-center">
        <button onClick={clearCanvas} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs px-3 py-2 rounded-lg transition-colors">
          Clear
        </button>
        <label className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer border border-blue-200">
          Upload Image
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>
    </div>
  );
};

const RentAgreementGenerator = () => {
  const { cmsData } = useCMS();
  const toolData = cmsData?.rentAgreementGenerator || {
    toolName: "Rent Agreement Generator",
    heroTitle: "Rent Agreement Generator",
    heroSubtitle: "Create legally sound 11-month rental agreements with live preview, stamp duty estimates, and digital signatures.",
    steps: [
      { icon: "Search", title: "Enter Party Details", description: "Input legal names and addresses." },
      { icon: "LayoutGrid", title: "Define Terms", description: "Set monthly rent, security deposit, and lease duration." },
      { icon: "TrendingUp", title: "Generate Legal Draft", description: "Download a PDF ready to be printed on stamp paper." }
    ],
    whatIs: {
      title: "What is a Rent Agreement?",
      subtitle: "The legal contract between a landlord and a tenant.",
      p1: "A <strong>Rent Agreement</strong> (or Lease Agreement) is a legally binding contract detailing the terms under which a tenant agrees to rent property.",
      card1Title: "Protects Both Parties",
      card1Text: "A written agreement prevents future disputes by clearly defining terms.",
      card2Title: "Legal Proof of Address",
      card2Text: "A registered rent agreement serves as valid address proof.",
      howItWorksTitle: "Why an 11-Month Agreement?",
      howItWorksP1: "In India, most standard rent agreements are made for exactly <strong>11 months</strong>. Here is why:",
      points: [
        { title: "Registration Laws", desc: "Leases exceeding 12 months must be mandatorily registered." },
        { title: "Cost Savings", desc: "Skipping the 12th month avoids hefty stamp duty." },
        { title: "Easy Renewal", desc: "After 11 months, both parties can sign a new agreement." }
      ]
    },
    useCases: [
      { icon: "Users", title: "Landlords", desc: "Draft a secure contract to protect your property." },
      { icon: "Building2", title: "Tenants", desc: "Generate a standard draft to propose fair terms." },
      { icon: "Code2", title: "Brokers", desc: "Quickly create draft agreements for clients." },
      { icon: "ShoppingBag", title: "PG Owners", desc: "Create standardized rental agreements." }
    ],
    faqs: [
      { question: "Is this generated PDF legally valid?", answer: "To become legally binding, it must be printed on non-judicial stamp paper." },
      { question: "Do I need to notarize an 11-month agreement?", answer: "While not strictly mandatory, notarizing adds a layer of legal authenticity." },
      { question: "What is a standard lock-in period?", answer: "A lock-in period is the minimum duration neither party can terminate the agreement." }
    ]
  };

  const [landlord, setLandlord] = useState('');
  const [tenant, setTenant] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [startDateStr, setStartDateStr] = useState('');
  const [duration, setDuration] = useState('11');
  const [state, setState] = useState('none');
  const [customClauses, setCustomClauses] = useState([]);
  
  const [generatedText, setGeneratedText] = useState('');
  const [stampDutyInfo, setStampDutyInfo] = useState({ duty: 0, explanation: '' });

  useEffect(() => {
    // Calculate Stamp Duty
    let r = parseFloat(rent) || 0;
    let d = parseFloat(deposit) || 0;
    let dur = parseInt(duration) || 11;
    let duty = 0;
    let explanation = '';

    if (state !== 'none' && r > 0) {
      if (state === 'delhi') {
        duty = (r * 12) * 0.02;
        explanation = `2% of Annual Rent (₹${r * 12})`;
      } else if (state === 'maharashtra') {
        duty = ((r * dur) + d) * 0.0025;
        explanation = `0.25% of (Total Rent ₹${r * dur} + Deposit ₹${d})`;
      } else if (state === 'karnataka') {
        duty = ((r * 12) + d) * 0.01;
        explanation = `1% of (Annual Rent ₹${r * 12} + Deposit ₹${d})`;
      } else if (state === 'up') {
        duty = (r * 12) * 0.04;
        explanation = `4% of Annual Rent (₹${r * 12})`;
      } else {
        duty = (r * 12) * 0.015;
        explanation = "Approx 1.5% of Annual Rent (Check local laws)";
      }
      if (duty < 100) duty = 100;
      setStampDutyInfo({ duty: Math.ceil(duty), explanation });
    } else {
      setStampDutyInfo({ duty: 0, explanation: '' });
    }

    // Generate Document
    const lName = landlord || '[Landlord Name]';
    const tName = tenant || '[Tenant Name]';
    const addr = address || '[Property Address]';
    const rAmt = rent || '[Rent Amount]';
    const dAmt = deposit || '[Deposit Amount]';
    const sDate = formatDate(startDateStr) || '[Start Date]';
    const eDate = startDateStr ? addMonths(startDateStr, dur) : '[End Date]';
    const today = formatDate(new Date().toISOString().split('T')[0]);

    let clausesText = '';
    let idx = 9;
    customClauses.forEach(c => {
      if (c.text.trim()) {
        clausesText += `\n${idx}. ${c.text.trim()}\n`;
        idx++;
      }
    });

    const text = `RENTAL AGREEMENT

This Rent Agreement is made on this ${today} by and between:

${lName}, hereinafter referred to as the "Landlord" (which expression shall include his/her heirs, legal representatives, and assigns) of the ONE PART.

AND

${tName}, hereinafter referred to as the "Tenant" (which expression shall include his/her heirs, legal representatives, and assigns) of the OTHER PART.

WHEREAS the Landlord is the absolute owner of the residential property situated at:
${addr} (hereinafter referred to as the "Demised Premises").

WHEREAS the Tenant has requested the Landlord to grant a lease of the Demised Premises for residential purposes, and the Landlord has agreed to lease out the same on the following terms and conditions:

1. DURATION: This tenancy shall be valid for a period of ${dur} months commencing from ${sDate} and ending on ${eDate}.

2. RENT: The Tenant shall pay a monthly rent of Rs. ${rAmt}/- (Rupees ${rAmt} only). The rent shall be paid on or before the 5th of every English calendar month in advance.

3. SECURITY DEPOSIT: The Tenant has paid a sum of Rs. ${dAmt}/- (Rupees ${dAmt} only) as an interest-free Security Deposit. This deposit will be refunded to the Tenant at the time of vacating the premises after deducting any arrears of rent or damages to the property.

4. USAGE: The Tenant shall use the premises exclusively for residential purposes for his/her family members and shall not use it for any commercial or illegal activities.

5. ELECTRICITY AND WATER CHARGES: The Tenant shall be liable to pay the electricity and water charges as per actual consumption during the tenancy period directly to the concerned authorities.

6. MAINTENANCE: The Tenant shall keep the premises in good and tenantable condition. Minor repairs shall be borne by the Tenant, while major structural repairs shall be the responsibility of the Landlord.

7. TERMINATION: Either party can terminate this agreement by giving one month's written notice to the other party.

8. SUB-LETTING: The Tenant shall not sublet, assign, or part with the possession of the Demised Premises in whole or in part without the prior written consent of the Landlord.
${clausesText}
IN WITNESS WHEREOF, both the Landlord and the Tenant have set their hands to this Agreement on the day, month, and year first above written in the presence of the following witnesses.

Landlord's Signature: 
Name: ${lName}


Tenant's Signature: 
Name: ${tName}


WITNESS 1:
Signature: _______________________
Name: 
Address: 


WITNESS 2:
Signature: _______________________
Name: 
Address: `;

    setGeneratedText(text);

  }, [landlord, tenant, address, rent, deposit, startDateStr, duration, state, customClauses]);

  const addCustomClause = () => {
    setCustomClauses([...customClauses, { id: Date.now(), text: '' }]);
  };

  const updateCustomClause = (id, text) => {
    setCustomClauses(customClauses.map(c => c.id === id ? { ...c, text } : c));
  };

  const removeCustomClause = (id) => {
    setCustomClauses(customClauses.filter(c => c.id !== id));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText).then(() => {
      alert("Agreement text copied to clipboard!");
    });
  };

  const isCanvasBlank = (canvas) => {
    if (!canvas) return true;
    const context = canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(context.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
    return !pixelBuffer.some(color => color !== 0);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const lines = doc.splitTextToSize(generatedText, 180);
    
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    
    let y = margin;
    for (let i = 0; i < lines.length; i++) {
        if (y > 280) {
            doc.addPage();
            y = margin;
        }
        
        if (i === 0) {
            doc.setFont("times", "bold");
            doc.setFontSize(14);
            doc.text(lines[i], 105, y, null, null, "center");
            doc.setFont("times", "normal");
            doc.setFontSize(11);
        } else {
            doc.text(lines[i], margin, y);
        }
        
        // Check for signatures
        if (lines[i].includes("Landlord's Signature:")) {
            const canvas = document.getElementById('canvas-landlord');
            if (!isCanvasBlank(canvas)) {
                const imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', margin + 40, y - 10, 40, 20);
            }
            y += 15;
        }
        
        if (lines[i].includes("Tenant's Signature:")) {
            const canvas = document.getElementById('canvas-tenant');
            if (!isCanvasBlank(canvas)) {
                const imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', margin + 40, y - 10, 40, 20);
            }
            y += 15;
        }
        
        y += 5.5; 
    }
    
    doc.save("Rent_Agreement.pdf");
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
              <label className="block text-xs font-semibold text-slate-600 mb-1">Landlord Name</label>
              <input type="text" value={landlord} onChange={(e) => setLandlord(e.target.value)} placeholder="e.g. Ramesh Kumar" className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tenant Name</label>
              <input type="text" value={tenant} onChange={(e) => setTenant(e.target.value)} placeholder="e.g. Suresh Singh" className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Property Full Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="2" placeholder="e.g. Flat No 102, ABC Apartments..." className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none resize-none"></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Monthly Rent (₹)</label>
              <input type="number" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="15000" className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Security Deposit (₹)</label>
              <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="30000" className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
              <input type="date" value={startDateStr} onChange={(e) => setStartDateStr(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Duration (Months)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min="1" max="60" className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none font-bold" />
            </div>
          </div>

          {/* Stamp Duty */}
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl">
            <label className="block text-sm font-bold text-blue-700 mb-3">State (For Stamp Duty Estimate)</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none mb-4 appearance-none font-medium">
                <option value="none">Select State</option>
                <option value="delhi">Delhi (2% of avg annual rent)</option>
                <option value="maharashtra">Maharashtra (0.25% of total rent + deposit)</option>
                <option value="karnataka">Karnataka (1% of annual rent + deposit)</option>
                <option value="up">Uttar Pradesh (4% of annual rent)</option>
                <option value="other">Other States (Generally 1-2%)</option>
            </select>
            {stampDutyInfo.duty > 0 && (
              <div className="bg-blue-100 border border-blue-300 p-4 rounded-xl text-blue-800">
                <strong className="block text-blue-700 mb-1 text-lg">Estimated Stamp Duty: ₹{stampDutyInfo.duty}</strong>
                <span className="text-sm font-medium">{stampDutyInfo.explanation}</span>
              </div>
            )}
          </div>

          {/* Custom Clauses */}
          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Custom Clauses (Optional)</h3>
            <div className="space-y-3 mb-4">
              {customClauses.map(c => (
                <div key={c.id} className="flex gap-2">
                  <input type="text" value={c.text} onChange={(e) => updateCustomClause(c.id, e.target.value)} placeholder="e.g. Pets are not allowed." className="flex-1 glass-input rounded-xl px-4 py-3 text-sm text-slate-900 outline-none" />
                  <button onClick={() => removeCustomClause(c.id)} className="bg-rose-100 hover:bg-rose-200 text-rose-600 p-3 rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addCustomClause} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold transition-colors">
              <Plus className="w-4 h-4" /> Add Custom Clause
            </button>
          </div>

          {/* Signatures */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Digital Signatures</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <SignaturePad id="canvas-landlord" label="Landlord Signature" />
              <SignaturePad id="canvas-tenant" label="Tenant Signature" />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="sticky top-24 space-y-4">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-md border border-white/50 dark:border-slate-700/50 h-[600px] overflow-y-auto custom-scrollbar">
            <pre className="font-serif text-slate-800 whitespace-pre-wrap leading-relaxed text-[15px]">
              {generatedText}
            </pre>
          </div>
          
          <div className="flex gap-4">
            <button onClick={copyToClipboard} className="flex-1 flex justify-center items-center gap-2 glass-input bg-white text-slate-700 px-4 py-4 rounded-xl font-bold transition-colors">
              <Copy className="w-5 h-5" /> Copy Text
            </button>
            <button onClick={downloadPDF} className="flex-1 flex justify-center items-center gap-2 glass-button-primary px-4 py-4 rounded-xl font-bold transition-colors shadow-lg">
              <FileSignature className="w-5 h-5" /> Download PDF
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

export default RentAgreementGenerator;
