import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calculator, Percent, Zap, GraduationCap, Map, FileText, FileSignature, CalendarOff, IndianRupee } from 'lucide-react';

const tools = [
  {
    id: 'emi-calculator',
    title: 'EMI Calculator',
    description: 'Calculate your Equated Monthly Installment for home, car, or personal loans.',
    icon: <IndianRupee className="w-6 h-6 text-blue-500" />,
    path: '/tools/emi-calculator'
  },
  {
    id: 'sip-calculator',
    title: 'SIP Calculator',
    description: 'Estimate returns on your Systematic Investment Plan mutual fund investments.',
    icon: <Calculator className="w-6 h-6 text-emerald-500" />,
    path: '/tools/sip-calculator'
  },
  {
    id: 'gst-calculator',
    title: 'GST Calculator',
    description: 'Easily calculate Goods and Services Tax for inclusive and exclusive amounts.',
    icon: <Percent className="w-6 h-6 text-indigo-500" />,
    path: '/tools/gst-calculator'
  },
  {
    id: 'electricity-bill',
    title: 'Electricity Bill',
    description: 'Estimate your monthly electricity bill based on unit consumption.',
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    path: '/tools/electricity-bill-calculator'
  },
  {
    id: 'cgpa-converter',
    title: 'CGPA to Percentage',
    description: 'Convert your CGPA to percentage according to CBSE/university standards.',
    icon: <GraduationCap className="w-6 h-6 text-orange-500" />,
    path: '/tools/cgpa-percentage-converter'
  },
  {
    id: 'land-unit-converter',
    title: 'Land Unit Converter',
    description: 'Convert regional Indian land area units like Bigha, Katha, Decimal to Sq Ft.',
    icon: <Map className="w-6 h-6 text-teal-500" />,
    path: '/tools/land-unit-converter'
  },
  {
    id: 'salary-slip',
    title: 'Salary Slip Generator',
    description: 'Generate professional salary slips with automatic tax and allowance calculations.',
    icon: <FileText className="w-6 h-6 text-blue-400" />,
    path: '/tools/salary-slip-generator'
  },
  {
    id: 'rent-agreement',
    title: 'Rent Agreement',
    description: 'Draft and generate a standard rent agreement document quickly.',
    icon: <FileSignature className="w-6 h-6 text-purple-500" />,
    path: '/tools/rent-agreement-generator'
  },
  {
    id: 'leave-application',
    title: 'Leave Application',
    description: 'Generate formatted leave application letters for school, college, or office.',
    icon: <CalendarOff className="w-6 h-6 text-pink-500" />,
    path: '/tools/leave-application-generator'
  }
];

const ToolsIndex = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <Helmet>
        <title>Free Calculators & Tools | LLMS.TXT Analyzer</title>
        <meta name="description" content="Free online calculators and tools including EMI calculator, GST calculator, rent agreement generator, and more. Instant results, no signup." />
      </Helmet>
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Utility <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Tools</span>
        </h1>
        <p className="text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed">
          A collection of fast, free calculators and document generators.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <Link 
            key={tool.id} 
            to={tool.path}
            className="glass-panel p-6 rounded-2xl hover:bg-white/40 dark:bg-slate-800/40 backdrop-blur-md transition-all group border border-slate-200 hover:border-blue-500/30"
          >
            <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center mb-4 border border-slate-200 group-hover:scale-110 transition-transform">
              {tool.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ToolsIndex;
