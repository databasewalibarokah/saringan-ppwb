import React from 'react';

const SliderInput = ({ label, value, onChange }) => (
  <div className="mb-6">
    <div className="flex justify-between items-end mb-2">
      <label className="text-slate-700 dark:text-slate-200 font-medium text-lg">{label}</label>
      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">{value}</span>
    </div>
    <input 
      type="range" 
      min="0" max="100" 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
    />
    <div className="flex justify-between text-xs text-slate-400 mt-1">
      <span>Kurang</span>
      <span>Cukup</span>
      <span>Sangat Baik</span>
    </div>
  </div>
);

export default React.memo(SliderInput);
