import React from 'react';
import { Filter } from 'lucide-react';

const StudentFilter = ({ options, activeFilter, onFilterChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* Optional: Filter Icon button acting as a visual anchor */}
      <div className="flex items-center justify-center pl-2 pr-3 text-slate-400">
        <Filter size={20} />
      </div>
      
      {options.map((filter, i) => {
        const isActive = activeFilter === filter;
        return (
          <button 
            key={i} 
            onClick={() => onFilterChange(filter)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors 
              ${isActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' 
                : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-white/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80'
              }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
};

export default React.memo(StudentFilter);
