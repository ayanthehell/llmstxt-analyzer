import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Zap, Search, LayoutGrid, TrendingUp, Users, Building2, Code2, ShoppingBag, Sun, Plus, X } from 'lucide-react';
import ToolSEOContent from '../../components/ToolSEOContent';
import { useCMS } from '../../components/CMSContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const stateSlabs = {
  'dl': [{ limit: 200, rate: 3.00 }, { limit: 200, rate: 4.50 }, { limit: Infinity, rate: 6.50 }],
  'mh': [{ limit: 100, rate: 5.36 }, { limit: 200, rate: 9.80 }, { limit: Infinity, rate: 13.50 }],
  'up': [{ limit: 150, rate: 5.50 }, { limit: 150, rate: 6.00 }, { limit: Infinity, rate: 6.50 }],
  'tn': [{ limit: 100, rate: 0 }, { limit: 100, rate: 2.25 }, { limit: 200, rate: 4.50 }, { limit: Infinity, rate: 6.00 }],
  'ka': [{ limit: 100, rate: 4.75 }, { limit: Infinity, rate: 7.00 }],
  'gj': [{ limit: 50, rate: 3.05 }, { limit: 150, rate: 3.50 }, { limit: Infinity, rate: 4.60 }],
  'wb': [{ limit: 102, rate: 5.30 }, { limit: 78, rate: 5.90 }, { limit: Infinity, rate: 7.00 }],
  'rj': [{ limit: 50, rate: 4.75 }, { limit: 100, rate: 6.50 }, { limit: Infinity, rate: 7.35 }],
  'mp': [{ limit: 50, rate: 4.20 }, { limit: 100, rate: 5.10 }, { limit: Infinity, rate: 6.50 }],
  'ap': [{ limit: 50, rate: 1.45 }, { limit: 50, rate: 2.60 }, { limit: 100, rate: 3.60 }, { limit: Infinity, rate: 6.90 }],
};

const stateNames = {
  'dl': 'Delhi (0-200 Free)',
  'mh': 'Maharashtra',
  'up': 'Uttar Pradesh',
  'tn': 'Tamil Nadu (First 100 Free)',
  'ka': 'Karnataka',
  'gj': 'Gujarat',
  'wb': 'West Bengal',
  'rj': 'Rajasthan',
  'mp': 'Madhya Pradesh',
  'ap': 'Andhra Pradesh'
};

const applianceOptions = [
  { w: 1200, name: '1.5 Ton AC (~1200W)' },
  { w: 75, name: 'Ceiling Fan (~75W)' },
  { w: 150, name: 'Refrigerator (~150W)' },
  { w: 100, name: 'Television (~100W)' },
  { w: 15, name: 'LED Light (~15W)' },
  { w: 2000, name: 'Geyser/Heater (~2000W)' }
];

const ElectricityBillCalculator = () => {
  const { cmsData } = useCMS();
  const toolData = cmsData?.electricityBillCalculator || {
    toolName: "Electricity Bill Calculator",
    heroTitle: "Electricity Bill Estimator",
    heroSubtitle: "Estimate monthly units (kWh) and bill based on your state's tariff slabs. Includes Energy Hog analysis and Solar ROI.",
    steps: [
      { icon: "Search", title: "Enter Previous & Current Reading", description: "Input meter readings from your bill to calculate units consumed." },
      { icon: "LayoutGrid", title: "Set Rate & Charges", description: "Enter your per-unit rate, fixed charges, and any additional taxes." },
      { icon: "TrendingUp", title: "Generate Final Bill", description: "Instantly see the exact breakdown and download a PDF." }
    ],
    whatIs: {
      title: "How is an Electricity Bill Calculated?",
      subtitle: "Understand the hidden charges and taxes.",
      p1: "Your monthly electricity bill is a composite charge made up of <strong>Energy Charges</strong> (based on consumption), <strong>Fixed Charges</strong> (meter rental/infrastructure), and various state <strong>taxes and duties</strong>.",
      card1Title: "Units Consumed",
      card1Text: "Calculated by subtracting previous reading from current. 1 Unit = 1 Kilowatt-Hour (kWh).",
      card2Title: "Fixed vs Energy Charges",
      card2Text: "Energy charges fluctuate based on use. Fixed charges are a mandatory monthly fee.",
      howItWorksTitle: "The Billing Formula",
      howItWorksP1: "The final bill amount is calculated using:",
      points: [
        { title: "Energy Charge", desc: "Units Consumed × Rate per Unit" },
        { title: "Subtotal", desc: "Energy Charge + Fixed Monthly Charge" },
        { title: "Final Amount", desc: "Subtotal + (Subtotal × Tax Rate %)" }
      ]
    },
    useCases: [
      { icon: "Users", title: "Homeowners", desc: "Verify if your local electricity board sent an accurate bill." },
      { icon: "Building2", title: "Landlords", desc: "Generate accurate sub-meter invoices for your tenants." },
      { icon: "Code2", title: "Tenants", desc: "Cross-check charges levied by your landlord." },
      { icon: "ShoppingBag", title: "Small Businesses", desc: "Forecast monthly operational expenses based on projected usage." }
    ],
    faqs: [
      { question: "What does '1 Unit' of electricity mean?", answer: "1 unit = 1 Kilowatt-Hour (kWh). Running a 1000W appliance for 1 hour consumes 1 unit." },
      { question: "Why is my electricity bill higher in summer?", answer: "ACs consume more power, and many boards use slab systems where higher consumption triggers higher rates." },
      { question: "Can I use this calculator for any state?", answer: "Yes, it uses a universal formula. Enter your state's rate and charges." }
    ]
  };

  const [selectedState, setSelectedState] = useState('dl');
  const [appliances, setAppliances] = useState([
    { id: 1, type: 75, name: 'Ceiling Fan (~75W)', qty: 2, hrs: 8 },
    { id: 2, type: 150, name: 'Refrigerator (~150W)', qty: 1, hrs: 24 },
    { id: 3, type: 15, name: 'LED Light (~15W)', qty: 4, hrs: 6 }
  ]);
  const [solarKw, setSolarKw] = useState(3);

  const [globalMonthlyUnits, setGlobalMonthlyUnits] = useState(0);
  const [globalBill, setGlobalBill] = useState(0);
  const [currentBreakdown, setCurrentBreakdown] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const calculateBillForUnits = (unitsToCalculate, stateCode) => {
    const slabs = stateSlabs[stateCode];
    let bill = 0;
    let unitsLeft = unitsToCalculate;
    let bd = [];

    if (stateCode === 'dl' && unitsToCalculate <= 200) {
      return { bill: 0, bd: [{ range: `0 - ${unitsToCalculate.toFixed(1)} (100% Subsidy)`, units: unitsToCalculate, rate: 0, cost: 0 }] };
    }

    let startUnit = 1;
    for (let i = 0; i < slabs.length; i++) {
      if (unitsLeft <= 0) break;
      let unitsInSlab = Math.min(unitsLeft, slabs[i].limit);
      let cost = unitsInSlab * slabs[i].rate;
      bill += cost;

      let rangeStr = slabs[i].limit === Infinity ? `Above ${startUnit - 1}` : `${startUnit} - ${startUnit - 1 + slabs[i].limit}`;
      bd.push({ range: rangeStr, units: unitsInSlab, rate: slabs[i].rate, cost: cost });

      unitsLeft -= unitsInSlab;
      startUnit += slabs[i].limit;
    }
    return { bill, bd };
  };

  useEffect(() => {
    let totalDailyWh = 0;
    const categoryWh = {};

    appliances.forEach(app => {
      const dailyWh = (app.type * app.qty * app.hrs);
      totalDailyWh += dailyWh;
      categoryWh[app.name] = (categoryWh[app.name] || 0) + dailyWh;
    });

    const monthlyUnits = (totalDailyWh * 30) / 1000;
    setGlobalMonthlyUnits(monthlyUnits);

    const result = calculateBillForUnits(monthlyUnits, selectedState);
    setGlobalBill(result.bill);
    setCurrentBreakdown(result.bd);

    const labels = Object.keys(categoryWh);
    const data = Object.values(categoryWh).map(wh => ((wh * 30) / 1000).toFixed(2));
    
    setChartData({
      labels,
      datasets: [{
        label: 'Monthly Units (kWh)',
        data,
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'],
        borderWidth: 0
      }]
    });
  }, [appliances, selectedState]);

  const handleAddAppliance = () => {
    setAppliances([
      ...appliances, 
      { id: Date.now(), type: 15, name: 'LED Light (~15W)', qty: 1, hrs: 4 }
    ]);
  };

  const handleRemoveAppliance = (id) => {
    setAppliances(appliances.filter(app => app.id !== id));
  };

  const handleApplianceChange = (id, field, value) => {
    setAppliances(appliances.map(app => {
      if (app.id === id) {
        let newApp = { ...app, [field]: value };
        if (field === 'type') {
          const option = applianceOptions.find(o => o.w === parseInt(value));
          if (option) newApp.name = option.name;
        }
        return newApp;
      }
      return app;
    }));
  };

  // Solar Calculations
  const solarGenMonthly = solarKw * 120;
  let netUnits = globalMonthlyUnits - solarGenMonthly;
  if (netUnits < 0) netUnits = 0;
  const netResult = calculateBillForUnits(netUnits, selectedState);
  const solarSavings = globalBill - netResult.bill;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Electricity Bill Estimation Report", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`State: ${stateNames[selectedState]}`, 14, 35);
    doc.text(`Estimated Monthly Consumption: ${globalMonthlyUnits.toFixed(2)} kWh`, 14, 45);
    doc.text(`Estimated Energy Bill: Rs. ${globalBill.toFixed(2)}`, 14, 55);
    
    doc.setFontSize(14);
    doc.text("Cost Breakdown:", 14, 75);
    
    const tableData = currentBreakdown.map(b => [
      b.range,
      b.units.toFixed(2),
      `Rs. ${b.rate.toFixed(2)}`,
      `Rs. ${b.cost.toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 80,
      head: [['Slab Range', 'Units Used', 'Rate', 'Cost']],
      body: tableData,
      styles: { fontSize: 9 }
    });

    const finalY = doc.lastAutoTable.finalY || 80;
    doc.setFontSize(10);
    doc.text("*This is an estimate based on energy charges. Fixed charges & taxes not included.", 14, finalY + 10);
    doc.text("Generated by LLMS.TXT Analyzer Tools", 14, finalY + 20);
    
    doc.save("Electricity_Estimation.pdf");
  };

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{toolData.heroTitle}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{toolData.heroSubtitle}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Your State</label>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-3 text-slate-900 outline-none appearance-none font-medium"
            >
              {Object.entries(stateNames).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>

            <div className="mt-6 bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Current Tariff Slabs</h4>
              <table className="w-full text-sm text-left text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200/50">
                    <th className="pb-2 font-semibold text-slate-600">Units Range</th>
                    <th className="pb-2 font-semibold text-slate-600">Rate (₹/Unit)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedState === 'dl' && (
                    <tr><td colSpan="2" className="py-2 text-blue-600 font-semibold text-xs">Note: 0-200 Units are 100% Free in Delhi</td></tr>
                  )}
                  {stateSlabs[selectedState].map((slab, i, arr) => {
                    const startUnit = i === 0 ? 1 : arr.slice(0, i).reduce((sum, s) => sum + s.limit, 0) + 1;
                    const rangeStr = slab.limit === Infinity ? `Above ${startUnit - 1}` : `${startUnit} - ${startUnit - 1 + slab.limit}`;
                    return (
                      <tr key={i} className="border-b border-slate-200/30">
                        <td className="py-2">{rangeStr}</td>
                        <td className="py-2 font-medium">₹{slab.rate.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-slate-700 mb-4">Appliances Usage</h4>
            <div className="space-y-3 mb-4">
              {appliances.map(app => (
                <div key={app.id} className="flex flex-wrap sm:flex-nowrap gap-2 items-center bg-white/60 dark:bg-slate-800/50 backdrop-blur-md p-2 rounded-xl border border-slate-200">
                  <select 
                    value={app.type} 
                    onChange={(e) => handleApplianceChange(app.id, 'type', Number(e.target.value))}
                    className="flex-1 min-w-[140px] glass-input rounded-lg px-3 py-2 text-sm font-medium outline-none"
                  >
                    {applianceOptions.map(opt => (
                      <option key={opt.name} value={opt.w}>{opt.name}</option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    value={app.qty} 
                    onChange={(e) => handleApplianceChange(app.id, 'qty', Number(e.target.value))}
                    className="w-20 glass-input rounded-lg px-3 py-2 text-sm font-medium outline-none text-center"
                    placeholder="Qty" min="1"
                  />
                  <input 
                    type="number" 
                    value={app.hrs} 
                    onChange={(e) => handleApplianceChange(app.id, 'hrs', Number(e.target.value))}
                    className="w-24 glass-input rounded-lg px-3 py-2 text-sm font-medium outline-none text-center"
                    placeholder="Hrs/Day" min="0" max="24"
                  />
                  <button onClick={() => handleRemoveAppliance(app.id)} className="text-rose-500 hover:text-rose-400 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={handleAddAppliance}
              className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors bg-white"
            >
              <Plus className="w-4 h-4" /> Add Appliance
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex justify-between items-end mb-6 pb-6 border-b border-slate-200">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Monthly Consumption</p>
                <p className="text-3xl font-bold text-slate-900">{globalMonthlyUnits.toFixed(2)} <span className="text-xl text-slate-500">kWh</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Estimated Bill</p>
                <p className="text-4xl font-bold text-blue-600 drop-shadow-sm">₹{globalBill.toFixed(2)}</p>
              </div>
            </div>

            {globalMonthlyUnits > 0 && (
              <div className="mb-6 h-48">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Energy Hogs Breakdown</h4>
                <Doughnut 
                  data={chartData} 
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#475569', font: { size: 11, weight: 'bold' } } } } }} 
                />
              </div>
            )}

            {currentBreakdown.length > 0 && (
              <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-200">
                <table className="w-full text-sm text-right">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-200">
                      <th className="pb-2 text-left font-bold uppercase tracking-wide text-xs">Slab</th>
                      <th className="pb-2 font-bold uppercase tracking-wide text-xs">Units</th>
                      <th className="pb-2 font-bold uppercase tracking-wide text-xs">Rate</th>
                      <th className="pb-2 font-bold uppercase tracking-wide text-xs">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentBreakdown.map((b, i) => (
                      <tr key={i} className="text-slate-700 font-medium">
                        <td className="py-3 text-left">{b.range}</td>
                        <td className="py-3">{b.units.toFixed(1)}</td>
                        <td className="py-3">₹{b.rate.toFixed(2)}</td>
                        <td className="py-3 font-bold text-slate-900">₹{b.cost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button onClick={downloadPDF} className="w-full flex justify-center items-center gap-2 glass-button-primary px-4 py-4 rounded-xl font-bold text-lg mt-6">
              <Download className="w-5 h-5" /> Download PDF Report
            </button>
            <p className="text-xs text-slate-500 font-medium text-center mt-4">*Excludes fixed charges & taxes.</p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-orange-200 bg-orange-50">
            <h3 className="text-xl font-bold text-orange-600 flex items-center gap-2 mb-6">
              <Sun className="w-6 h-6" /> Solar ROI Estimator
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-700 font-bold">Proposed Solar System</span>
                  <span className="text-orange-600 font-bold text-lg">{solarKw.toFixed(1)} kW</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="0.5" 
                  value={solarKw} onChange={(e) => setSolarKw(Number(e.target.value))} 
                  className="w-full accent-orange-500"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-orange-200">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Monthly Generation</p>
                  <p className="text-2xl font-bold text-emerald-600">~{solarGenMonthly.toFixed(0)} <span className="text-sm">kWh</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Potential Savings</p>
                  <p className="text-2xl font-bold text-emerald-600">₹{solarSavings.toFixed(0)} <span className="text-sm">/mo</span></p>
                </div>
              </div>
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

export default ElectricityBillCalculator;
