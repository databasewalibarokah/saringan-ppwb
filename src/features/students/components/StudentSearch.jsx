import React from 'react';
import { Search } from 'lucide-react';

const StudentSearch = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      <input 
        type="text" 
        placeholder="Cari nama atau no. cocard..." 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-lg transition-shadow"
      />
    </div>
  );
};

export default React.memo(StudentSearch);
