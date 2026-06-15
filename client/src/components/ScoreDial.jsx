import React, { useEffect, useState } from 'react';

const ScoreDial = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const getColor = (s) => {
    if (s <= 40) return '#EF4444'; // Red
    if (s <= 70) return '#F59E0B'; // Amber
    return '#10B981'; // Green
  };

  const color = getColor(animatedScore);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-48 h-48 mx-auto my-8">
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-slate-800"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-5xl font-mono font-bold transition-colors duration-1000 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ color, textShadow: `0 0 20px ${color}` }}>
          {Math.round(animatedScore)}
        </span>
        <span className="text-sm text-slate-9000 mt-1 font-medium">/ 100</span>
      </div>
    </div>
  );
};

export default ScoreDial;
