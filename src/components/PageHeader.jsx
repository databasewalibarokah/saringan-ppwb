import React from 'react';
import { ChevronLeft } from 'lucide-react';

const PageHeader = ({ title, onBack }) => (
  <div className="flex items-center gap-4 mb-6">
    <button 
      onClick={onBack} 
      className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-full shadow-sm"
      aria-label="Kembali"
    >
      <ChevronLeft size={24} className="text-slate-700 dark:text-slate-200" />
    </button>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
  </div>
);

export default React.memo(PageHeader);
