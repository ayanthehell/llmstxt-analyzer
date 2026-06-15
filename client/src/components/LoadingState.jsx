import React, { useEffect, useState } from 'react';

const steps = [
  'Fetching file…',
  'Parsing structure…',
  'Running analysis…',
  'Generating report…'
];

const LoadingState = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="space-y-4 w-64">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${idx <= currentStep ? 'bg-cyan-500' : 'bg-gray-800'}`}></div>
            <span className={`text-sm font-mono transition-opacity duration-500 ${idx <= currentStep ? 'text-cyan-400 opacity-100' : 'text-gray-600 opacity-50'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
