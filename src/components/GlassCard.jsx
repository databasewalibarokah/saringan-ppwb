import React from 'react';

const GlassCard = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-2xl transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-[0.98] hover:bg-white/70 dark:hover:bg-slate-800/70' : ''} ${className}`}
  >
    {children}
  </div>
);

export default React.memo(GlassCard);
